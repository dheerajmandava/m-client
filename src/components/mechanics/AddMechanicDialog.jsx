'use client';

import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

const MECHANIC_SPECIALTIES = [
  { value: 'GENERAL', label: 'General Repairs' },
  { value: 'ENGINE', label: 'Engine Specialist' },
  { value: 'TRANSMISSION', label: 'Transmission' },
  { value: 'ELECTRICAL', label: 'Electrical Systems' },
  { value: 'BRAKES', label: 'Brakes & Suspension' },
  { value: 'DIAGNOSTICS', label: 'Diagnostics' },
];

export default function AddMechanicDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const addMechanicMutation = useMutation({
    mutationFn: (mechanicData) => api.createMechanic(mechanicData),
    onSuccess: (response) => {
      if (!response.success) {
        throw new Error(response.message || 'Failed to add mechanic');
      }
      queryClient.invalidateQueries(['mechanics']);
      toast.success('Mechanic added successfully');
      handleClose();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(error.message || 'Failed to add mechanic');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!specialties.length) {
      toast.error('At least one specialty is required');
      return;
    }

    addMechanicMutation.mutate({
      name: name.trim(),
      specialties,
      phone: phone.trim(),
      email: email.trim(),
    });
  };

  const handleClose = () => {
    setName('');
    setSpecialties([]);
    setPhone('');
    setEmail('');
    onOpenChange(false);
  };

  const handleSpecialtyChange = (value) => {
    setSpecialties(current => {
      if (current.includes(value)) {
        return current.filter(item => item !== value);
      } else {
        return [...current, value];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Mechanic</DialogTitle>
          <DialogDescription>
            Add a new mechanic to your workshop. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter mechanic's name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Specialties *</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {MECHANIC_SPECIALTIES.map((specialty) => (
                <div key={specialty.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty.value}
                    checked={specialties.includes(specialty.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleSpecialtyChange(specialty.value);
                      } else {
                        handleSpecialtyChange(specialty.value);
                      }
                    }}
                  />
                  <Label
                    htmlFor={specialty.value}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {specialty.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={addMechanicMutation.isPending}
            >
              {addMechanicMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Mechanic'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 