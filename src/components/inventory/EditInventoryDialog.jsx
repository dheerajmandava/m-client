'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function EditInventoryDialog({ open, onOpenChange, item }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    partNumber: '',
    name: '',
    description: '',
    quantity: 0,
    minQuantity: 5,
    location: '',
    category: '',
    costPrice: '',
    sellingPrice: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        partNumber: item.partNumber,
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        minQuantity: item.minQuantity,
        location: item.location || '',
        category: item.category || '',
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice
      });
    }
  }, [item]);

  const editInventoryMutation = useMutation({
    mutationFn: (data) => api.updateInventoryItem(item.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory']);
      toast.success('Inventory item updated successfully');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update inventory item');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    editInventoryMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partNumber">Part Number</Label>
            <Input
              id="partNumber"
              value={formData.partNumber}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                partNumber: e.target.value
              }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quantity: parseInt(e.target.value)
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Min Quantity</Label>
              <Input
                id="minQuantity"
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  minQuantity: parseInt(e.target.value)
                }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  costPrice: e.target.value
                }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  sellingPrice: e.target.value
                }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={editInventoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={editInventoryMutation.isPending}
            >
              {editInventoryMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 