'use client';

import { useState } from 'react';
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

export default function AddInventoryDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    partNumber: '',
    name: '',
    description: '',
    quantity: 0,
    minQuantity: 5,
    costPrice: '',
    sellingPrice: ''
  });

  const addInventoryMutation = useMutation({
    mutationFn: (data) => api.addInventoryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory']);
      toast.success('Inventory item added successfully');
      onOpenChange(false);
      setFormData({
        partNumber: '',
        name: '',
        description: '',
        quantity: 0,
        minQuantity: 5,
        costPrice: '',
        sellingPrice: ''
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add inventory item');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addInventoryMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partNumber">Part Number *</Label>
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
              <Label htmlFor="name">Name *</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Initial Quantity *</Label>
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
              <Label htmlFor="minQuantity">Min Quantity *</Label>
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
              <Label htmlFor="costPrice">Cost Price *</Label>
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
              <Label htmlFor="sellingPrice">Selling Price *</Label>
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
              disabled={addInventoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={addInventoryMutation.isPending}
            >
              {addInventoryMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 