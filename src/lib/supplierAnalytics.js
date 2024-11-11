export function analyzeSupplierPerformance(suppliers, orders, inventory) {
  return suppliers?.data?.map(supplier => {
    const supplierOrders = orders?.data?.filter(order => order.supplier.id === supplier.id) || [];
    const supplierItems = inventory?.data?.filter(item => item.supplier?.id === supplier.id) || [];

    // Delivery Performance
    const onTimeDeliveries = supplierOrders.filter(order => {
      const deliveryDate = new Date(order.completedAt);
      const expectedDate = new Date(order.expectedDate);
      return order.status === 'COMPLETE' && deliveryDate <= expectedDate;
    }).length;

    const deliveryRate = supplierOrders.length > 0 
      ? (onTimeDeliveries / supplierOrders.length) * 100 
      : 0;

    // Quality Metrics
    const qualityIssues = supplierOrders.filter(order => 
      order.items.some(item => item.status === 'REJECTED')
    ).length;

    const qualityRate = supplierOrders.length > 0 
      ? ((supplierOrders.length - qualityIssues) / supplierOrders.length) * 100 
      : 0;

    // Cost Analysis
    const averageOrderValue = supplierOrders.reduce((sum, order) => 
      sum + order.total, 0) / (supplierOrders.length || 1);

    // Lead Time Analysis
    const leadTimes = supplierOrders
      .filter(order => order.status === 'COMPLETE')
      .map(order => {
        const orderDate = new Date(order.createdAt);
        const deliveryDate = new Date(order.completedAt);
        return Math.ceil((deliveryDate - orderDate) / (1000 * 60 * 60 * 24));
      });

    const averageLeadTime = leadTimes.length > 0 
      ? leadTimes.reduce((sum, time) => sum + time, 0) / leadTimes.length 
      : 0;

    // Response Time
    const responseRates = supplierOrders.map(order => {
      const orderDate = new Date(order.createdAt);
      const responseDate = new Date(order.updatedAt);
      return Math.ceil((responseDate - orderDate) / (1000 * 60 * 60));
    });

    const averageResponseTime = responseRates.length > 0 
      ? responseRates.reduce((sum, time) => sum + time, 0) / responseRates.length 
      : 0;

    return {
      id: supplier.id,
      name: supplier.name,
      metrics: {
        deliveryRate,
        qualityRate,
        averageOrderValue,
        averageLeadTime,
        averageResponseTime,
        totalOrders: supplierOrders.length,
        activeItems: supplierItems.length,
        qualityIssues,
        onTimeDeliveries
      },
      score: calculateSupplierScore({
        deliveryRate,
        qualityRate,
        averageLeadTime,
        averageResponseTime
      })
    };
  }) || [];
}

function calculateSupplierScore(metrics) {
  const weights = {
    deliveryRate: 0.35,
    qualityRate: 0.35,
    averageLeadTime: 0.2,
    averageResponseTime: 0.1
  };

  const leadTimeScore = Math.max(0, 100 - (metrics.averageLeadTime * 2));
  const responseTimeScore = Math.max(0, 100 - (metrics.averageResponseTime / 24 * 10));

  return Math.round(
    metrics.deliveryRate * weights.deliveryRate +
    metrics.qualityRate * weights.qualityRate +
    leadTimeScore * weights.averageLeadTime +
    responseTimeScore * weights.averageResponseTime
  );
} 