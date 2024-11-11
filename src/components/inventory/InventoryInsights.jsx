'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { calculateInventoryMetrics } from '@/lib/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/utils';

export default function InventoryInsights() {
  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: api.getInventory
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: api.getPartOrders
  });

  const metrics = calculateInventoryMetrics(inventory, orders);
  const itemsNeedingReorder = metrics.filter(item => item.shouldReorder);

  return (
    <div className="space-y-6">
      {itemsNeedingReorder.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Reorder Alert</AlertTitle>
          <AlertDescription>
            {itemsNeedingReorder.length} items need to be reordered soon.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Daily Usage</TableHead>
                <TableHead>Turnover Rate</TableHead>
                <TableHead>Days Until Reorder</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.partNumber}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.dailyUsage.toFixed(2)} units</TableCell>
                  <TableCell>
                    {item.turnoverRate.toFixed(2)}x
                    {item.turnoverRate > 12 ? (
                      <TrendingUp className="h-4 w-4 inline ml-2 text-green-500" />
                    ) : item.turnoverRate < 4 ? (
                      <TrendingDown className="h-4 w-4 inline ml-2 text-red-500" />
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {item.daysUntilReorder !== null 
                      ? `${item.daysUntilReorder} days`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {item.shouldReorder ? (
                      <Badge variant="destructive">
                        Reorder {item.reorderQuantity} units
                      </Badge>
                    ) : item.daysUntilReorder !== null && item.daysUntilReorder < 14 ? (
                      <Badge variant="warning">
                        Monitor
                      </Badge>
                    ) : (
                      <Badge variant="success">
                        Healthy
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 