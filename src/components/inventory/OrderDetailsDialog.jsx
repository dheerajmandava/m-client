'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrderDetailsDialog({ orderId, open, onOpenChange }) {
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => api.getPartOrderById(orderId),
    enabled: !!orderId
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update order status');
    }
  });

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) {
    return null;
  }

  const { data: orderData } = order;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details #{orderData.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Supplier</h3>
              <p>{orderData.supplier.name}</p>
              <p>{orderData.supplier.email}</p>
              <p>{orderData.supplier.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Info</h3>
              <p>Date: {new Date(orderData.createdAt).toLocaleDateString()}</p>
              <p>Total: ₹{orderData.total.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                Status: 
                <Select
                  value={orderData.status}
                  onValueChange={(status) => 
                    updateStatusMutation.mutate({ 
                      id: orderData.id, 
                      status 
                    })
                  }
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PARTIAL">Partial</SelectItem>
                    <SelectItem value="COMPLETE">Complete</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Cost Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.partNumber}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ₹{item.costPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'PENDING' ? 'warning' : 'success'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Notes */}
          {orderData.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-muted-foreground">{orderData.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 