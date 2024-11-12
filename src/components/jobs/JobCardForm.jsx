import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

const initialJobData = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  registrationNo: '',
  mileage: '',
  description: '',
  estimatedCost: ''
};

export function JobCardForm({ onSubmit, initialData, isSubmitting, error, submitButton }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      customerName: initialData?.customerName || '',
      customerPhone: initialData?.customerPhone || '',
      customerEmail: initialData?.customerEmail || '',
      vehicleMake: initialData?.vehicleMake || '',
      vehicleModel: initialData?.vehicleModel || '',
      vehicleYear: initialData?.vehicleYear || '',
      registrationNo: initialData?.registrationNo || '',
      mileage: initialData?.mileage || '',
      description: initialData?.description || '',
      estimatedCost: initialData?.estimatedCost || ''
    }
  });

  const handleFormSubmit = async (data) => {
    const formattedData = {
      ...data,
      mileage: data.mileage?.toString(),
      vehicleYear: data.vehicleYear?.toString(),
      estimatedCost: parseFloat(data.estimatedCost || 0)
    };
    
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="space-y-4">
          <h2 className="font-semibold">Customer Details</h2>
          <div className="space-y-2">
            <Label htmlFor="customerName">Name *</Label>
            <Input
              id="customerName"
              name="customerName"
              {...register('customerName')}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              {...register('customerPhone')}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              {...register('customerEmail')}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="space-y-4">
          <h2 className="font-semibold">Vehicle Details</h2>
          <div className="space-y-2">
            <Label htmlFor="vehicleMake">Make *</Label>
            <Input
              id="vehicleMake"
              name="vehicleMake"
              {...register('vehicleMake')}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleModel">Model</Label>
            <Input
              id="vehicleModel"
              name="vehicleModel"
              {...register('vehicleModel')}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Year</Label>
              <Input
                id="vehicleYear"
                name="vehicleYear"
                {...register('vehicleYear')}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                {...register('mileage')}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNo">Registration No *</Label>
            <Input
              id="registrationNo"
              name="registrationNo"
              {...register('registrationNo')}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-4">
        <h2 className="font-semibold">Job Details</h2>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            {...register('description')}
            disabled={isSubmitting}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedCost">Estimated Cost</Label>
          <Input
            id="estimatedCost"
            name="estimatedCost"
            type="number"
            {...register('estimatedCost')}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {submitButton}
    </form>
  );
} 