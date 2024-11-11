export function calculateInventoryMetrics(inventory, orders) {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
  
  return inventory?.data?.map(item => {
    // Get all orders containing this item
    const itemOrders = orders?.data?.filter(order => 
      order.items.some(orderItem => orderItem.partNumber === item.partNumber)
    ) || [];

    // Last 30 days orders
    const recentOrders = itemOrders.filter(order => 
      new Date(order.createdAt) >= thirtyDaysAgo
    );

    // Calculate total quantity ordered in last 30 days
    const monthlyOrderQuantity = recentOrders.reduce((sum, order) => {
      const orderItem = order.items.find(i => i.partNumber === item.partNumber);
      return sum + (orderItem?.quantity || 0);
    }, 0);

    // Calculate daily usage rate
    const dailyUsage = monthlyOrderQuantity / 30;

    // Calculate turnover rate (annualized)
    const annualUsage = dailyUsage * 365;
    const turnoverRate = item.quantity > 0 ? annualUsage / item.quantity : 0;

    // Predict days until reorder point
    const daysUntilReorder = dailyUsage > 0 
      ? Math.round((item.quantity - item.minQuantity) / dailyUsage)
      : null;

    // Calculate reorder recommendation
    const shouldReorder = item.quantity <= item.minQuantity;
    const reorderQuantity = shouldReorder 
      ? Math.max(Math.ceil(dailyUsage * 30), item.minQuantity)
      : 0;

    return {
      ...item,
      turnoverRate,
      dailyUsage,
      daysUntilReorder,
      shouldReorder,
      reorderQuantity
    };
  }) || [];
} 