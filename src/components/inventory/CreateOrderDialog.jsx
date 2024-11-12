'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Loader2, Plus, Trash2 } from 'lucide-react';

export default function CreateOrderDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState([{ 
    partNumber: '', 
    name: '', 
    quantity: 1, 
    costPrice: '' 
  }]);
  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');

  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderItems, setOrderItems] = useState([{ partNumber: '', quantity: 1 }]);

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => api.suppliers.getAll()
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => api.inventory.getAll()
  });

  const createOrderMutation = useMutation({
    mutationFn: (data) => api.createPartOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Purchase order created successfully');
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create purchase order');
    }
  });

  const addItem = (e) => {
    e.preventDefault(); // Prevent form submission
    setItems([...items, { partNumber: '', name: '', quantity: 1, costPrice: '' }]);
  };

  const removeItem = (e, index) => {
    e.preventDefault(); // Prevent form submission
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const resetForm = () => {
    setItems([{ partNumber: '', name: '', quantity: 1, costPrice: '' }]);
    setSupplierId('');
    setNotes('');
  };

  // Calculate order total
  const orderTotal = items.reduce((total, item) => {
    const itemTotal = item.quantity * parseFloat(item.costPrice || 0);
    return total + itemTotal;
  }, 0);

  // Validate individual item
  const validateItem = (item) => {
    const errors = [];
    if (!item.partNumber) errors.push('Part number is required');
    if (!item.name) errors.push('Name is required');
    if (!item.quantity || item.quantity < 1) errors.push('Quantity must be at least 1');
    if (!item.costPrice || parseFloat(item.costPrice) <= 0) errors.push('Cost must be greater than 0');
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierId) {
      toast.error('Please select a supplier');
      return;
    }

    // Validate all items
    const itemErrors = items.map((item, index) => ({
      index,
      errors: validateItem(item)
    })).filter(item => item.errors.length > 0);

    if (itemErrors.length > 0) {
      itemErrors.forEach(({ index, errors }) => {
        toast.error(`Item ${index + 1}: ${errors.join(', ')}`);
      });
      return;
    }
    
    createOrderMutation.mutate({
      supplierId,
      notes,
      items: items.filter(item => item.partNumber && item.name)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {(suppliers || []).map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Items</Label>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <Input
                      placeholder="Part Number"
                      value={item.partNumber}
                      onChange={(e) => updateItem(index, 'partNumber', e.target.value)}
                      className={!item.partNumber && 'border-red-500'}
                    />
                    <Input
                      placeholder="Name"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      className={!item.name && 'border-red-500'}
                    />
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className={`w-20 ${(!item.quantity || item.quantity < 1) && 'border-red-500'}`}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Cost"
                      value={item.costPrice}
                      onChange={(e) => updateItem(index, 'costPrice', e.target.value)}
                      className={`w-24 ${(!item.costPrice || parseFloat(item.costPrice) <= 0) && 'border-red-500'}`}
                    />
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => removeItem(e, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {/* Item subtotal */}
                  <div className="text-sm text-right text-muted-foreground">
                    Subtotal: ₹{(item.quantity * parseFloat(item.costPrice || 0)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button 
                type="button"
                variant="outline" 
                onClick={addItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Item
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or instructions..."
            />
          </div>

          {/* Order Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Order Total:</span>
              <span>₹{orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createOrderMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createOrderMutation.isPending || orderTotal <= 0}
            >
              {createOrderMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Order (₹{orderTotal.toFixed(2)})
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 