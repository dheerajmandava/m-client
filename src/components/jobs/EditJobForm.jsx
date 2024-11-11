import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditJobForm({ job, onClose }) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      customerName: job.customerName,
      customerPhone: job.customerPhone,
      customerEmail: job.customerEmail,
      vehicleMake: job.vehicleMake,
      vehicleModel: job.vehicleModel,
      vehicleYear: job.vehicleYear,
      registrationNo: job.registrationNo,
      mileage: job.mileage,
      description: job.description,
      estimatedCost: job.estimatedCost
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.updateJobCard(job.id, data),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      queryClient.invalidateQueries(['job', job.id]);
      toast.success('Job updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update job');
    }
  });

  return (
    <div className="py-2 space-y-3">
      {/* Customer Details */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Customer Details *</h3>
        <div className="space-y-2">
          <div>
            <Label className="text-xs font-medium text-gray-600">Name</Label>
            <Input 
              className="h-8 text-sm mt-0.5"
              {...register('customerName', { required: true })} 
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-600">Contact</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                className="h-8 text-sm"
                placeholder="Phone"
                {...register('customerPhone')} 
              />
              <Input 
                className="h-8 text-sm"
                placeholder="Email"
                type="email" 
                {...register('customerEmail')} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-x-4">
        {/* Left Column - Vehicle Details */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Vehicle Details</h3>
            <div className="space-y-2">
              <div>
                <Label className="text-xs font-medium text-gray-600">Make & Model *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    className="h-8 text-sm"
                    placeholder="Make"
                    {...register('vehicleMake', { required: true })} 
                  />
                  <Input 
                    className="h-8 text-sm"
                    placeholder="Model"
                    {...register('vehicleModel', { required: true })} 
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">Registration *</Label>
                <Input 
                  className="h-8 text-sm mt-0.5"
                  {...register('registrationNo', { required: true })} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Additional Details */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Additional Details</h3>
            <div className="space-y-2">
              <div>
                <Label className="text-xs font-medium text-gray-600">Year</Label>
                <Input 
                  className="h-8 text-sm mt-0.5"
                  {...register('vehicleYear')} 
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">Mileage</Label>
                <Input 
                  className="h-8 text-sm mt-0.5"
                  {...register('mileage')} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Job Description *</h3>
        <div className="space-y-2">
          <Textarea 
            className="min-h-[80px] text-sm resize-none"
            placeholder="Describe the work needed..."
            {...register('description', { required: true })}
          />
          <div>
            <Label className="text-xs font-medium text-gray-600">Estimated Cost</Label>
            <Input 
              className="h-8 text-sm mt-0.5"
              type="number" 
              step="0.01" 
              {...register('estimatedCost')} 
            />
          </div>
        </div>
      </div>

      {/* Add padding-bottom to prevent jump when scrolling */}
      <div className="pb-2">
        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-2 border-t mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose} 
            className="h-8 text-sm px-4"
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={handleSubmit((data) => updateMutation.mutate(data))}
            disabled={updateMutation.isPending}
            className="h-8 text-sm px-4"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Job'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 