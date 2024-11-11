'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Car, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  Settings, 
  Hash, 
  Clock, 
  Timer,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JobStatusManager from '@/components/jobs/JobStatusManager';
import JobNotes from '@/components/jobs/JobNotes';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import EditJobForm from '@/components/jobs/EditJobForm';
import EditScheduleForm from '@/components/jobs/EditScheduleForm';
import { toast } from 'sonner';

const statusStyles = {
  PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border border-green-200",
  CANCELLED: "bg-gray-50 text-gray-700 border border-gray-200"
};

const typographyStyles = {
  h1: "text-lg font-semibold tracking-tight",
  h2: "text-sm font-medium",
  label: "text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70",
  value: "text-xs font-medium",
  small: "text-xs text-muted-foreground",
};

const sectionStyles = {
  card: "bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200",
  header: "border-b bg-muted/5 px-3 py-2",
  headerTitle: "flex items-center gap-1.5 text-xs font-medium",
  content: "p-3",
  fieldGroup: "flex flex-wrap gap-x-6 gap-y-2.5",
  field: "flex-1 min-w-[120px]",
  fieldLabel: "mb-0.5 text-xs text-muted-foreground/70",
  fieldValue: "text-xs font-medium",
};

export default function JobDetailsPage({ params }) {
  const router = useRouter();
  
  const { data: job, isLoading } = useQuery({
    queryKey: ['job', params.id],
    queryFn: () => api.getJobCard(params.id)
  });

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showScheduleEditDialog, setShowScheduleEditDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteJobCard(params.id),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success('Job deleted successfully');
      router.push('/jobs');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete job');
    }
  });

  const { data: mechanicsData } = useQuery({
    queryKey: ['mechanics'],
    queryFn: api.getMechanics
  });

  const mechanics = mechanicsData?.data || [];

  // Simple loading state while data is fetching
  if (isLoading || !job?.data) {
    return null; // Or a simple loading spinner if you prefer
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Job Number */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className={typographyStyles.h1}>
                {job.data.customerName}
              </h1>
              <div className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                <span className="text-sm text-primary font-medium">
                  Job #{job.data.id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-[#718096] text-sm">
              Created on {new Date(job.data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowEditDialog(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Customer Information Card - Full width */}
        <Card>
          <CardHeader className={sectionStyles.header}>
            <div className={sectionStyles.headerTitle}>
              <User className="h-3.5 w-3.5 text-primary" />
              Customer Information
            </div>
          </CardHeader>
          <CardContent className={sectionStyles.content}>
            <div className={sectionStyles.fieldGroup}>
              <div className={sectionStyles.field}>
                <div className={sectionStyles.fieldLabel}>Customer Name</div>
                <div className={sectionStyles.fieldValue}>{job.data.customerName}</div>
              </div>
              
              <div className={sectionStyles.field}>
                <div className={sectionStyles.fieldLabel}>Phone Number</div>
                <div className={sectionStyles.fieldValue}>{job.data.customerPhone}</div>
              </div>

              <div className={sectionStyles.field}>
                <div className={sectionStyles.fieldLabel}>Email Address</div>
                <div className={sectionStyles.fieldValue}>{job.data.customerEmail}</div>
              </div>

              <div className={sectionStyles.field}>
                <div className={sectionStyles.fieldLabel}>Job Number</div>
                <div className={sectionStyles.fieldValue}>#{job.data.jobNumber}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle, Schedule, and Service Cards in one row */}
        <div className="flex gap-4">
          {/* Vehicle Information */}
          <Card className="w-[300px]">
            <CardHeader className={sectionStyles.header}>
              <div className={sectionStyles.headerTitle}>
                <Car className="h-3.5 w-3.5 text-primary" />
                Vehicle Information
              </div>
            </CardHeader>
            <CardContent className={sectionStyles.content}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Make</div>
                  <div className={sectionStyles.fieldValue}>{job.data.vehicleMake}</div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Model</div>
                  <div className={sectionStyles.fieldValue}>{job.data.vehicleModel}</div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Registration</div>
                  <div className={sectionStyles.fieldValue}>
                    <span className="font-mono">{job.data.registrationNo}</span>
                  </div>
                </div>
                {job.data.mileage && (
                  <div className={sectionStyles.field}>
                    <div className={sectionStyles.fieldLabel}>Mileage</div>
                    <div className={sectionStyles.fieldValue}>
                      {job.data.mileage.toLocaleString()} km
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information Card */}
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium">Schedule Information</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowScheduleEditDialog(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Date</div>
                  <div className={sectionStyles.fieldValue}>
                    {new Date(job.data.scheduledDate).toLocaleDateString()}
                  </div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Time</div>
                  <div className={sectionStyles.fieldValue}>{job.data.scheduledTime}</div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Duration</div>
                  <div className={sectionStyles.fieldValue}>{job.data.estimatedHours}h</div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Mechanic</div>
                  <div className={sectionStyles.fieldValue}>
                    {job.data.mechanic?.name || 'Not assigned'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card className="w-[280px]">
            <CardHeader className={sectionStyles.header}>
              <div className={sectionStyles.headerTitle}>
                <Settings className="h-3.5 w-3.5 text-primary" />
                Service Information
              </div>
            </CardHeader>
            <CardContent className={sectionStyles.content}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Type</div>
                  <div className={sectionStyles.fieldValue}>
                    {job.data.serviceType || 'Not specified'}
                  </div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Priority</div>
                  <div className={sectionStyles.fieldValue}>
                    {job.data.priority || 'Normal'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status and Notes section side by side with reduced notes width */}
        <div className="flex gap-4">
          {/* Status Manager - kept same width */}
          <div className="w-[400px]">
            <JobStatusManager 
              jobId={job.data.id} 
              currentStatus={job.data.status} 
              className="h-full"
            />
          </div>
          
          {/* Notes section - reduced width */}
          <div className="w-[500px]"> {/* Fixed width instead of flex-1 */}
            <JobNotes 
              jobId={job.data.id} 
              notes={job.data.notes || []} 
              className="h-full"
            />
          </div>
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px] overflow-hidden rounded-lg p-0">
          <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-semibold">Edit Job Details</DialogTitle>
              <p className="text-xs text-muted-foreground">All fields marked with * are required</p>
            </div>
          </div>
          
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
            <EditJobForm job={job.data} onClose={() => setShowEditDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-md">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showScheduleEditDialog} onOpenChange={setShowScheduleEditDialog}>
        <DialogContent className="sm:max-w-[600px] overflow-hidden rounded-lg p-0">
          <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-semibold">Edit Schedule</DialogTitle>
              <p className="text-xs text-muted-foreground">All fields marked with * are required</p>
            </div>
          </div>
          
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
            <EditScheduleForm 
              job={job.data} 
              mechanics={mechanics} 
              onClose={() => setShowScheduleEditDialog(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 