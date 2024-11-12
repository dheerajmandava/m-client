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

  const { data: inventoryItems = [], isLoading: isLoadingParts } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => api.inventory.getAll(),
  });

  const installPartMutation = useMutation({
    mutationFn: (partData) => api.jobs.addPart(jobId, partData),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      toast.success('Part installed successfully');
      setSelectedPart(null);
      setQuantity(1);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to install part');
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
              const part = inventoryItems.find(p => p.id === value);
              setSelectedPart(part);
              setQuantity(1);
            }}
            disabled={installPartMutation.isPending || isLoadingParts}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingParts ? "Loading..." : "Select Part"} />
            </SelectTrigger>
            <SelectContent>
              {inventoryItems.map(part => (
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
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            placeholder="Quantity"
            disabled={installPartMutation.isPending || !selectedPart}
          />
        </div>

        {selectedPart && (
          <div className="text-sm text-gray-600">
            <p>Part Number: {selectedPart.partNumber}</p>
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