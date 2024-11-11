'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { calculateForecasts } from '@/lib/forecasting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, ShoppingCart } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function InventoryForecast() {
  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: api.getInventory
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: api.getPartOrders
  });

  const { data: settings } = useQuery({
    queryKey: ['inventory-settings'],
    queryFn: api.getInventorySettings
  });

  const forecasts = calculateForecasts(inventory, orders, settings);
  const itemsNeedingReorder = forecasts.filter(
    item => item.quantity <= item.forecast.reorderPoint
  );

  const createReorderList = async () => {
    try {
      const reorderItems = itemsNeedingReorder.map(item => ({
        partNumber: item.partNumber,
        name: item.name,
        quantity: item.forecast.optimalOrderQuantity,
        supplier: item.supplier
      }));

      // You'll need to implement this API endpoint
      await api.createBulkOrder(reorderItems);
      toast.success('Reorder list created successfully');
    } catch (error) {
      toast.error('Failed to create reorder list');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventory Forecast</h2>
        {itemsNeedingReorder.length > 0 && (
          <Button onClick={createReorderList}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Create Reorder List ({itemsNeedingReorder.length} items)
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {forecasts.slice(0, 4).map(item => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {item.name} ({item.partNumber})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={item.forecast.historicalUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#8884d8" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trend</span>
                  <Badge variant={
                    item.forecast.trend === 'increasing' ? 'success' :
                    item.forecast.trend === 'decreasing' ? 'destructive' :
                    'secondary'
                  }>
                    {item.forecast.trend === 'increasing' ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : item.forecast.trend === 'decreasing' ? (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    ) : (
                      <Minus className="h-4 w-4 mr-1" />
                    )}
                    {item.forecast.trendValue}% per month
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Next Month Forecast</span>
                  <span>{item.forecast.nextMonthUsage} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reorder Point</span>
                  <span>{item.forecast.reorderPoint} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Optimal Order Quantity</span>
                  <span>{item.forecast.optimalOrderQuantity} units</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reorder Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Recommended Order</TableHead>
                <TableHead>Estimated Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemsNeedingReorder.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.forecast.reorderPoint}</TableCell>
                  <TableCell>{item.forecast.optimalOrderQuantity}</TableCell>
                  <TableCell>
                    {formatIndianCurrency(item.forecast.optimalOrderQuantity * item.costPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>Current Settings:</p>
        <ul className="list-disc list-inside">
          <li>Ordering Cost: ₹{settings?.orderingCost || 0}</li>
          <li>Holding Cost: {settings?.holdingCostPercentage || 0}% of item cost</li>
        </ul>
      </div>
    </div>
  );
} 