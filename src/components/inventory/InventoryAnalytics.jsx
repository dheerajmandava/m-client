'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function InventoryAnalytics() {
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: api.getInventory
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const totalItems = inventory.length || 0;
  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity).length || 0;
  const totalValue = inventory.reduce((sum, item) => 
    sum + (item.quantity * parseFloat(item.costPrice || 0)), 0) || 0;
  
  // Calculate potential profit margin
  const potentialProfit = inventory.reduce((sum, item) => {
    const costPrice = parseFloat(item.costPrice || 0);
    const sellingPrice = parseFloat(item.sellingPrice || 0);
    const margin = (sellingPrice - costPrice) * item.quantity;
    return sum + margin;
  }, 0) || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalValue.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">₹{potentialProfit.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
} 