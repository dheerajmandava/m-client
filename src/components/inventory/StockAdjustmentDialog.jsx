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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

const ADJUSTMENT_TYPES = {
  IN: 'Stock In',
  OUT: 'Stock Out',
  ADJUSTMENT: 'Adjustment'
};

const ADJUSTMENT_REASONS = {
  PURCHASE: 'Purchase',
  SALE: 'Sale',
  RETURN: 'Return',
  DAMAGE: 'Damage',
  COUNT_ADJUSTMENT: 'Count Adjustment'
};

export default function StockAdjustmentDialog({ item, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: 'ADJUSTMENT',
    quantity: '',
    reason: 'COUNT_ADJUSTMENT',
    notes: '',
    reference: ''
  });

  const createAdjustmentMutation = useMutation({
    mutationFn: (data) => api.createStockAdjustment({
      ...data,
      inventoryId: item.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory']);
      queryClient.invalidateQueries(['stock-adjustments']);
      toast.success('Stock adjustment created successfully');
      onOpenChange(false);
      setFormData({
        type: 'ADJUSTMENT',
        quantity: '',
        reason: 'COUNT_ADJUSTMENT',
        notes: '',
        reference: ''
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create stock adjustment');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.quantity || isNaN(formData.quantity)) {
      toast.error('Please enter a valid quantity');
      return;
    }
    createAdjustmentMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock - {item?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Adjustment Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                type: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ADJUSTMENT_TYPES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                quantity: e.target.value
              }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                reason: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ADJUSTMENT_REASONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                reference: e.target.value
              }))}
              placeholder="Order #, Job Card #, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              placeholder="Additional details..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createAdjustmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createAdjustmentMutation.isPending}
            >
              {createAdjustmentMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Adjustment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 