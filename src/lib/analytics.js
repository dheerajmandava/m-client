export function calculateInventoryMetrics(inventoryData = { data: [] }, ordersData = { data: [] }) {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
  
  // Extract data arrays and ensure they exist
  const inventory = Array.isArray(inventoryData?.data) ? inventoryData.data : [];
  const orders = Array.isArray(ordersData?.data) ? ordersData.data : [];

  if (!inventory.length || !orders.length) return [];

  return inventory.map(item => {
    // Get all orders containing this item
    const itemOrders = orders.filter(order => 
      order.items?.some(orderItem => orderItem.partNumber === item.partNumber)
    ) || [];

    // Calculate daily usage
    const thirtyDayOrders = itemOrders.filter(order => 
      new Date(order.createdAt) >= thirtyDaysAgo
    );
    
    const totalQuantity = thirtyDayOrders.reduce((sum, order) => {
      const orderItem = order.items?.find(i => i.partNumber === item.partNumber);
      return sum + (orderItem?.quantity || 0);
    }, 0);

    const dailyUsage = totalQuantity / 30;
    const turnoverRate = dailyUsage > 0 ? item.quantity / dailyUsage : 0;
    const daysUntilReorder = item.quantity > item.minQuantity 
      ? (item.quantity - item.minQuantity) / dailyUsage 
      : 0;

    return {
      ...item,
      dailyUsage,
      turnoverRate,
      daysUntilReorder,
      shouldReorder: item.quantity <= item.minQuantity
    };
  });
}

export function calculateForecasts(inventory = [], orders = [], settings = {}) {
  if (!inventory || !orders) return [];

  return (inventory || []).map(item => {
    // Calculate forecast metrics
    const forecast = calculateItemForecast(item, orders, settings);
    
    return {
      ...item,
      forecast
    };
  });
}

function calculateItemForecast(item, orders = [], settings = {}) {
  // Add default settings
  const defaultSettings = {
    leadTime: 7,
    safetyStock: 5,
    reviewPeriod: 30
  };

  const config = { ...defaultSettings, ...settings };
  
  // Rest of the forecast calculation
  return {
    reorderPoint: item.minQuantity,
    optimalOrderQuantity: Math.max(item.minQuantity * 2, 10),
    // Add other forecast metrics as needed
  };
} 