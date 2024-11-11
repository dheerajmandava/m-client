import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function PartsManager({ jobId }) {
  const queryClient = useQueryClient();
  const [newPart, setNewPart] = useState({
    name: '',
    partNumber: '',
    quantity: 1,
    costPrice: '',
    sellingPrice: '',
    supplier: ''
  });

  const addPartMutation = useMutation({
    mutationFn: (partData) => api.addPartToJob(jobId, partData),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      setNewPart({
        name: '',
        partNumber: '',
        quantity: 1,
        costPrice: '',
        sellingPrice: '',
        supplier: ''
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPartMutation.mutate(newPart);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Add Parts</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Part Name"
            value={newPart.name}
            onChange={(e) => setNewPart(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Part Number"
            value={newPart.partNumber}
            onChange={(e) => setNewPart(prev => ({ ...prev, partNumber: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newPart.quantity}
            onChange={(e) => setNewPart(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Cost Price"
            value={newPart.costPrice}
            onChange={(e) => setNewPart(prev => ({ ...prev, costPrice: e.target.value }))}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Selling Price"
            value={newPart.sellingPrice}
            onChange={(e) => setNewPart(prev => ({ ...prev, sellingPrice: e.target.value }))}
          />
          <Input
            placeholder="Supplier"
            value={newPart.supplier}
            onChange={(e) => setNewPart(prev => ({ ...prev, supplier: e.target.value }))}
          />
        </div>
        <Button type="submit">Add Part</Button>
      </form>
    </div>
  );
} 