export function calculateForecasts(inventory, orders, settings, days = 30) {
  // Helper to get date range
  const getDateRange = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  // Calculate trends and forecasts
  return inventory?.data?.map(item => {
    const itemOrders = orders?.data?.filter(order => 
      order.items.some(orderItem => orderItem.partNumber === item.partNumber)
    ) || [];

    // Get historical usage patterns
    const usageHistory = new Array(6).fill(0).map((_, index) => {
      const startDate = getDateRange(new Date(), (index + 1) * 30);
      const endDate = getDateRange(new Date(), index * 30);
      
      const periodOrders = itemOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });

      const usage = periodOrders.reduce((sum, order) => {
        const orderItem = order.items.find(i => i.partNumber === item.partNumber);
        return sum + (orderItem?.quantity || 0);
      }, 0);

      return { month: index + 1, usage };
    }).reverse();

    // Calculate moving average and trend
    const movingAverage = usageHistory.reduce((sum, period) => sum + period.usage, 0) / 6;
    const trend = (usageHistory[5].usage - usageHistory[0].usage) / 5;

    // Forecast next month's usage
    const forecastUsage = Math.max(0, Math.round(movingAverage + trend));

    // Calculate optimal reorder point
    const leadTime = item.supplier?.leadTime || 7; // Default to 7 days if not specified
    const safetyStock = Math.ceil(movingAverage * 0.2); // 20% safety stock
    const reorderPoint = Math.ceil((forecastUsage / 30) * leadTime) + safetyStock;

    // Use settings from database instead of hardcoded values
    const orderingCost = settings?.orderingCost || 0;
    const holdingCostPercentage = settings?.holdingCostPercentage || 0;
    const holdingCost = item.costPrice * (holdingCostPercentage / 100);

    // Calculate optimal order quantity (EOQ)
    const annualDemand = forecastUsage * 12;
    const eoq = orderingCost && holdingCost 
      ? Math.ceil(Math.sqrt((2 * annualDemand * orderingCost) / holdingCost))
      : 0;

    return {
      ...item,
      forecast: {
        nextMonthUsage: forecastUsage,
        reorderPoint,
        optimalOrderQuantity: eoq,
        trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
        trendValue: Math.abs(Math.round(trend)),
        safetyStock,
        historicalUsage: usageHistory,
        // Add cost information for transparency
        costs: {
          orderingCost,
          holdingCostPercentage,
          holdingCost
        }
      }
    };
  }) || [];
} 