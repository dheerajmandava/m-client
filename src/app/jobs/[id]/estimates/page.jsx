'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateEstimateForm from '@/components/estimates/CreateEstimateForm';
import EstimateList from '@/components/estimates/EstimateList';
import EstimateDetailsDialog from '@/components/estimates/EstimateDetailsDialog';
import { api } from '@/lib/api';

export default function JobEstimatesPage({ params }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState(null);

  const { data: jobData } = useQuery({
    queryKey: ['job', params.id],
    queryFn: () => api.getJobCard(params.id)
  });

  const { data: estimates, refetch: refetchEstimates } = useQuery({
    queryKey: ['estimates', params.id],
    queryFn: () => api.getJobEstimates(params.id)
  });

  const handleEstimateCreated = async () => {
    setIsCreateDialogOpen(false);
    await refetchEstimates();
  };

  const handleViewEstimate = (estimate) => {
    setSelectedEstimate(estimate);
  };

  const handleCloseEstimateDetails = () => {
    setSelectedEstimate(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Estimates</h1>
          <p className="text-muted-foreground">
            Job #{jobData?.data?.jobNumber} - {jobData?.data?.customerName}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Estimate
        </Button>
      </div>

      {/* Job Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Vehicle</h4>
              <p>{jobData?.data?.vehicleMake} {jobData?.data?.vehicleModel}</p>
              <p className="text-sm text-muted-foreground">{jobData?.data?.registrationNo}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
              <p>{jobData?.data?.customerName}</p>
              <p className="text-sm text-muted-foreground">{jobData?.data?.customerPhone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
              <p className="text-sm">{jobData?.data?.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimates List */}
      <Card>
        <CardHeader>
          <CardTitle>All Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          <EstimateList 
            jobId={params.id} 
            onViewEstimate={handleViewEstimate} 
          />
        </CardContent>
      </Card>

      {/* Create Estimate Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-[800px] p-0 overflow-hidden">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <DialogTitle className="text-lg font-semibold">Create New Estimate</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Add items and details for the estimate</p>
          </div>
          
          {/* Form Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(85vh-8rem)]">
            <CreateEstimateForm 
              jobId={params.id} 
              onSuccess={handleEstimateCreated} 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Estimate Details Dialog */}
      {selectedEstimate && (
        <EstimateDetailsDialog 
          estimate={selectedEstimate} 
          onClose={handleCloseEstimateDetails}
        />
      )}
    </div>
  );
} 