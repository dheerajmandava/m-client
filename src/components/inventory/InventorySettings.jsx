'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function InventorySettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['inventory-settings'],
    queryFn: api.getInventorySettings
  });

  const [formData, setFormData] = useState({
    orderingCost: settings?.orderingCost || '',
    holdingCostPercentage: settings?.holdingCostPercentage || '',
    // ... other settings
  });

  const updateSettings = useMutation({
    mutationFn: api.updateInventorySettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory-settings']);
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings.mutate({
      orderingCost: parseFloat(formData.orderingCost),
      holdingCostPercentage: parseFloat(formData.holdingCostPercentage),
      // ... other settings
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderingCost">Ordering Cost</Label>
            <Input
              type="number"
              id="orderingCost"
              value={formData.orderingCost}
              onChange={(e) => setFormData({ ...formData, orderingCost: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="holdingCostPercentage">Holding Cost Percentage</Label>
            <Input
              type="number"
              id="holdingCostPercentage"
              value={formData.holdingCostPercentage}
              onChange={(e) => setFormData({ ...formData, holdingCostPercentage: e.target.value })}
            />
          </div>
          <Button type="submit">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
} 