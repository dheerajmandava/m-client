'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { JobCardForm } from '@/components/jobs/JobCardForm';
import { api } from '@/lib/api/index';

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

  const createMutation = useMutation({
    mutationFn: (data) => api.jobs.create(formatJobData(data)),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job created successfully');
      router.push(`/jobs/${response.data.id}`);
    }
  });

  const handleSubmit = (formData) => {
    setError('');
    createMutation.mutate(formData);
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
            isSubmitting={createMutation.isPending}
            error={error}
            submitButton={
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/jobs')}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
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