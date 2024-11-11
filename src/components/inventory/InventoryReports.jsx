'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { Download, Mail, Loader2 } from 'lucide-react';
import { exportToCSV, generateInventoryReport } from '@/lib/exportUtils';

export default function InventoryReports() {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingNotifications, setIsSendingNotifications] = useState(false);

  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: api.getInventory
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: api.getPartOrders
  });

  const handleExport = async (type) => {
    setIsExporting(true);
    try {
      let filename, data;
      
      switch(type) {
        case 'inventory':
          filename = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
          data = generateInventoryReport(inventory.data, orders.data);
          break;
        case 'orders':
          filename = `orders-report-${new Date().toISOString().split('T')[0]}.csv`;
          data = orders.data.map(order => ({
            'Order ID': order.id,
            'Date': new Date(order.createdAt).toLocaleDateString(),
            'Supplier': order.supplier.name,
            'Items': order.items.length,
            'Total': formatIndianCurrency(order.total),
            'Status': order.status
          }));
          break;
      }
      
      exportToCSV(data, filename);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully`);
    } catch (error) {
      toast.error(`Failed to export ${type} report`);
    } finally {
      setIsExporting(false);
    }
  };

  const sendLowStockNotifications = async () => {
    setIsSendingNotifications(true);
    try {
      const lowStockItems = inventory.data.filter(item => item.quantity <= item.minQuantity);
      await api.sendLowStockNotifications(lowStockItems);
      toast.success('Low stock notifications sent successfully');
    } catch (error) {
      toast.error('Failed to send notifications');
    } finally {
      setIsSendingNotifications(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Reports & Notifications</CardTitle>
          <Button
            variant="outline"
            onClick={sendLowStockNotifications}
            disabled={isSendingNotifications}
          >
            {isSendingNotifications ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Send Low Stock Alerts
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export" className="space-y-4">
          <TabsList>
            <TabsTrigger value="export">Export Reports</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleExport('inventory')}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Inventory Report
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('orders')}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Orders Report
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Select Date Range</h3>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-4">
                <Button className="w-full" disabled={!dateRange.from || !dateRange.to}>
                  Schedule Report
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 