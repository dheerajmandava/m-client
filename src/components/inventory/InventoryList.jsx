'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/index';
import { toast } from 'sonner';
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
import { Edit, Trash2 } from 'lucide-react';

export default function InventoryList({ filterLowStock = false }) {
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory', { lowStock: filterLowStock }],
    queryFn: () => filterLowStock ? api.inventory.getLowStock() : api.inventory.getAll()
  });

  console.log('inventory', inventory);

  const deleteInventoryMutation = useMutation({
    mutationFn: (id) => api.inventory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory']);
      toast.success('Item deleted successfully');
      setDeleteItem(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete item');
    }
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading inventory...</div>;
  }

  if (!inventory.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {filterLowStock 
          ? 'No low stock items found.' 
          : 'No inventory items found. Add your first item.'}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Min. Quantity</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.partNumber}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.minQuantity}</TableCell>
              <TableCell>${item.costPrice.toFixed(2)}</TableCell>
              <TableCell>${item.sellingPrice.toFixed(2)}</TableCell>
              <TableCell>
                <StockStatus item={item} />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

function StockStatus({ item }) {
  if (item.quantity <= 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }
  if (item.quantity <= item.minQuantity) {
    return <Badge variant="warning">Low Stock</Badge>;
  }
  return <Badge variant="success">In Stock</Badge>;
} 