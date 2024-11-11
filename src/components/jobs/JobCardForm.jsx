import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

export function JobCardForm({ onSubmit, isSubmitting, error, submitButton }) {
  const [jobData, setJobData] = useState(initialJobData);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!jobData.customerName || !jobData.vehicleMake || !jobData.registrationNo) {
      return onSubmit(null, 'Please fill in all required fields');
    }

    onSubmit(jobData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="space-y-4">
          <h2 className="font-semibold">Customer Details</h2>
          <div className="space-y-2">
            <Label htmlFor="customerName">Name *</Label>
            <Input
              id="customerName"
              name="customerName"
              value={jobData.customerName}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={jobData.customerPhone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={jobData.customerEmail}
              onChange={handleChange}
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
              value={jobData.vehicleMake}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleModel">Model</Label>
            <Input
              id="vehicleModel"
              name="vehicleModel"
              value={jobData.vehicleModel}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Year</Label>
              <Input
                id="vehicleYear"
                name="vehicleYear"
                value={jobData.vehicleYear}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={jobData.mileage}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNo">Registration No *</Label>
            <Input
              id="registrationNo"
              name="registrationNo"
              value={jobData.registrationNo}
              onChange={handleChange}
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
            value={jobData.description}
            onChange={handleChange}
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
            value={jobData.estimatedCost}
            onChange={handleChange}
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