'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddInventoryDialog from '@/components/inventory/AddInventoryDialog';
import CreateOrderDialog from '@/components/inventory/CreateOrderDialog';
import OrdersList from '@/components/inventory/OrdersList';
import InventoryList from '@/components/inventory/InventoryList';
import InventoryAnalytics from '@/components/inventory/InventoryAnalytics';
import InventoryCharts from '@/components/inventory/InventoryCharts';
import InventoryInsights from '@/components/inventory/InventoryInsights';
import InventoryReports from '@/components/inventory/InventoryReports';

export default function InventoryPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-6">
        <InventoryAnalytics />
        <InventoryCharts />
        <InventoryInsights />
        <InventoryReports />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryList filterLowStock />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Purchase Orders</CardTitle>
              <Button onClick={() => setShowOrderDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </CardHeader>
            <CardContent>
              <OrdersList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddInventoryDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      <CreateOrderDialog 
        open={showOrderDialog}
        onOpenChange={setShowOrderDialog}
      />
    </div>
  );
} 