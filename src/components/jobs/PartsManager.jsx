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
import { api } from '@/lib/api';

export default function PartsManager({ jobId }) {
  const queryClient = useQueryClient();
  const [selectedPart, setSelectedPart] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { data: inventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => api.getInventory()
  });

  const addPartMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.addPartToJob(jobId, data);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      queryClient.invalidateQueries(['jobParts', jobId]);
      queryClient.invalidateQueries(['inventory']);
      setSelectedPart(null);
      setQuantity(1);
      toast.success('Part added successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add part');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPart) return;

    addPartMutation.mutate({
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
              const part = inventory?.data?.find(p => p.id === value);
              setSelectedPart(part);
            }}
            disabled={addPartMutation.isPending || isLoadingInventory}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingInventory ? "Loading..." : "Select Part"} />
            </SelectTrigger>
            <SelectContent>
              {inventory?.data?.map(part => (
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
            disabled={addPartMutation.isPending}
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
          disabled={!selectedPart || quantity < 1 || addPartMutation.isPending || selectedPart?.quantity <= 0}
          className="w-full"
        >
          {addPartMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Part...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Part
            </>
          )}
        </Button>
      </form>
    </div>
  );
} 