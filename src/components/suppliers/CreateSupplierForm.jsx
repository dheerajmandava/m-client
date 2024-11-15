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

export default function CreateSupplierForm({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    gst: '',
    notes: ''
  });

  const createSupplierMutation = useMutation({
    mutationFn: (data) => api.suppliers.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      toast.success('Supplier added successfully');
      onOpenChange(false);
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        gst: '',
        notes: ''
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add supplier');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createSupplierMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactPerson: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
              />
            </div>
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
            <Label htmlFor="gst">GST Number</Label>
            <Input
              id="gst"
              value={formData.gst}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                gst: e.target.value
              }))}
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
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
              Add Supplier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 