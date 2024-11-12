import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api/index';

export default function PartsManager({ jobId }) {
  const queryClient = useQueryClient();
  const [selectedPart, setSelectedPart] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { data: inventoryData, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => api.inventory.getAll()
  });

  const installPartMutation = useMutation({
    mutationFn: (partData) => api.jobs.addPart(jobId, partData),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      toast.success('Part installed successfully');
    }
  });

  const returnPartMutation = useMutation({
    mutationFn: ({ partId, reason }) => api.jobs.returnPart(jobId, partId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      toast.success('Part returned successfully');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPart) return;

    installPartMutation.mutate({
      inventoryId: selectedPart.id,
      quantity
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            value={selectedPart?.id || ''}
            onValueChange={(value) => {
              const part = inventoryData.find(p => p.id === value);
              setSelectedPart(part);
            }}
            disabled={installPartMutation.isPending || isLoadingInventory}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingInventory ? "Loading..." : "Select Part"} />
            </SelectTrigger>
            <SelectContent>
              {inventoryData.map(part => (
                <SelectItem 
                  key={part.id} 
                  value={part.id}
                  disabled={part.quantity <= 0}
                >
                  {part.name} - {part.partNumber} (In Stock: {part.quantity})
                  {part.quantity <= 0 ? ' - Out of Stock' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            type="number"
            min="1"
            max={selectedPart?.quantity || 1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            placeholder="Quantity"
            disabled={installPartMutation.isPending}
          />
        </div>

        {selectedPart && (
          <div className="text-sm text-gray-600">
            <p>Cost Price: ₹{selectedPart.costPrice}</p>
            <p>Selling Price: ₹{selectedPart.sellingPrice}</p>
            <p>Available: {selectedPart.quantity}</p>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={!selectedPart || quantity < 1 || installPartMutation.isPending || selectedPart?.quantity <= 0}
          className="w-full"
        >
          {installPartMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Installing Part...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Install Part
            </>
          )}
        </Button>
      </form>
    </div>
  );
} 