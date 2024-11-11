'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SupplierDetailsDialog({ supplier, open, onOpenChange }) {
  const { data: orders } = useQuery({
    queryKey: ['supplier-orders', supplier?.id],
    queryFn: () => api.getSupplierOrders(supplier.id),
    enabled: !!supplier?.id
  });

  const { data: inventory } = useQuery({
    queryKey: ['supplier-inventory', supplier?.id],
    queryFn: () => api.getSupplierInventory(supplier.id),
    enabled: !!supplier?.id
  });

  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Supplier Details - {supplier.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-lg font-medium">{supplier.name}</p>
                <p>{supplier.email}</p>
                <p>{supplier.phone}</p>
                <p className="whitespace-pre-line">{supplier.address}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Business Terms</h3>
                <p>Payment Terms: {supplier.terms || '-'}</p>
                <p>Lead Time: {supplier.leadTime ? `${supplier.leadTime} days` : '-'}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            {!orders?.data?.length ? (
              <div className="text-center py-6 text-muted-foreground">
                No orders found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.data.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === 'COMPLETE' ? 'success' :
                          order.status === 'PENDING' ? 'warning' :
                          'default'
                        }>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="inventory">
            {!inventory?.data?.length ? (
              <div className="text-center py-6 text-muted-foreground">
                No inventory items found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part Number</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.partNumber}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 