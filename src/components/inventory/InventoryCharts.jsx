'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatIndianCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function InventoryCharts() {
  const { data: inventoryData = { data: [] } } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => api.inventory.getAll()
  });

  const { data: ordersData = { data: [] } } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.partOrders.getAll()
  });

  const { data: suppliersData = { data: [] } } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => api.suppliers.getAll()
  });

  // Ensure we have arrays to work with
  const inventory = Array.isArray(inventoryData.data) ? inventoryData.data : [];
  const orders = Array.isArray(ordersData.data) ? ordersData.data : [];
  const suppliers = Array.isArray(suppliersData.data) ? suppliersData.data : [];

  // Calculate supplier performance
  const supplierPerformance = suppliers.map(supplier => {
    const supplierOrders = orders.filter(order => order.supplier?.id === supplier.id) || [];
    const totalOrders = supplierOrders.length;
    const completedOnTime = supplierOrders.filter(order => 
      order.status === 'COMPLETE' && 
      new Date(order.completedAt) <= new Date(order.expectedDate)
    ).length;
    const performanceRate = totalOrders ? (completedOnTime / totalOrders) * 100 : 0;

    return {
      name: supplier.name,
      orders: totalOrders,
      performance: performanceRate.toFixed(1),
      value: supplierOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    };
  });

  // Calculate monthly inventory value trends
  const monthlyTrends = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { month, value: 0, orders: 0 };
    }
    acc[month].value += order.total || 0;
    acc[month].orders += 1;
    return acc;
  }, {});

  const trendData = Object.values(monthlyTrends);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Value Trends</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Inventory Value Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => formatIndianCurrency(value)}
                    />
                    <Tooltip 
                      formatter={(value) => formatIndianCurrency(value)}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Order Value"
                      stroke="#8884d8" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplierPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="orders" 
                      name="Total Orders"
                      fill="#8884d8" 
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="performance" 
                      name="Performance Rate"
                      fill="#82ca9d" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 