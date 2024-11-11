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
import { Loader2 } from 'lucide-react';

export default function CreateSupplierDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    terms: '',
    leadTime: ''
  });

  const createSupplierMutation = useMutation({
    mutationFn: (data) => api.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      toast.success('Supplier created successfully');
      onOpenChange(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        terms: '',
        leadTime: ''
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create supplier');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createSupplierMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                phone: e.target.value
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: e.target.value
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Payment Terms</Label>
            <Input
              id="terms"
              value={formData.terms}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                terms: e.target.value
              }))}
              placeholder="Net 30, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadTime">Lead Time (days)</Label>
            <Input
              id="leadTime"
              type="number"
              value={formData.leadTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                leadTime: e.target.value
              }))}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createSupplierMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createSupplierMutation.isPending}
            >
              {createSupplierMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Supplier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 