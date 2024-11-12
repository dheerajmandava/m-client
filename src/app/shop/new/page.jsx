'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';

export default function CreateShopPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.shops.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shop']);
      toast.success('Shop profile created successfully');
      router.push('/shop/profile');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create shop profile');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Shop Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Shop Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            {createMutation.error && (
              <div className="text-red-500 text-sm">{createMutation.error.message}</div>
            )}
            <Button 
              type="submit" 
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Shop...
                </>
              ) : (
                'Create Shop'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 