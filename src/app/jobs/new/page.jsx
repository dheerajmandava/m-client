'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { JobCardForm } from '@/components/jobs/JobCardForm';
import { api } from '@/lib/api';

const formatJobData = (data) => ({
  ...data,
  mileage: data.mileage?.toString() || null,
  vehicleYear: data.vehicleYear?.toString() || null,
  estimatedCost: data.estimatedCost?.toString() || '0'
});

export default function NewJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.createJobCard(formatJobData(data)),
    onSuccess: (result) => {
      if (!result.success) {
        throw new Error(result.message);
      }
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job card created successfully');
      router.push('/jobs');
    },
    onError: (error) => {
      const message = error.message || 'Failed to create job card';
      setError(message);
      toast.error(message);
    }
  });

  const handleSubmit = (formData) => {
    setError('');
    mutate(formData);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">New Job Card</h1>
        </CardHeader>
        <CardContent>
          <JobCardForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            error={error}
            submitButton={
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/jobs')}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Job Card'
                  )}
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
} 