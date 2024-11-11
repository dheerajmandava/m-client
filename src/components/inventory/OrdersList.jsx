'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from 'lucide-react';
import CreateOrderDialog from './CreateOrderDialog';
import OrderDetailsDialog from './OrderDetailsDialog';

export default function OrdersList() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: api.getPartOrders
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  return (
    <>
      {!orders?.data?.length ? (
        <div className="text-center py-6 text-muted-foreground">
          No purchase orders found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.supplier.name}</TableCell>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell>₹{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <OrderStatus status={order.status} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreateOrderDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      <OrderDetailsDialog 
        orderId={selectedOrder?.id}
        open={selectedOrder !== null}
        onOpenChange={setSelectedOrder}
      />
    </>
  );
}

function OrderStatus({ status }) {
  const variants = {
    PENDING: 'warning',
    PARTIAL: 'default',
    COMPLETE: 'success',
    CANCELLED: 'destructive'
  };

  return (
    <Badge variant={variants[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
} 