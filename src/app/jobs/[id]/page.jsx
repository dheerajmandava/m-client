'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Car, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  FileText,
  Settings, 
  Hash, 
  Clock, 
  Timer,
  Pencil,
  Trash2,
  X,
  Wrench,
  Plus,
  Package,
  MoreVertical,
  CheckCircle,
  Undo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JobStatusManager from '@/components/jobs/JobStatusManager';
import JobNotes from '@/components/jobs/JobNotes';
import { api } from '@/lib/api/index';

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
import EditJobForm from '@/components/jobs/EditJobForm';
import EditScheduleForm from '@/components/jobs/EditScheduleForm';
import { toast } from 'sonner';
import PartsManager from '@/components/jobs/PartsManager';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useJobDetails } from '@/hooks/useJobDetails';
import { useJobParts } from '@/hooks/useJobParts';
import { useMechanics } from '@/hooks/useMechanics';

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

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showScheduleEditDialog, setShowScheduleEditDialog] = useState(false);

  const { 
    job, 
    isLoading, 
    error,
    updateJob,
    updateStatus,
    deleteJob 
  } = useJobDetails(id);

  const { mechanics } = useMechanics();

  const { 
    parts, 
    totalCost,
    isLoading: partsLoading, 
    error: partsError,
    installPart,
    returnPart,
    isInstalling,
    isReturning 
  } = useJobParts(id);

  if (isLoading || partsLoading || !job) {
    return null;
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
                {job.customerName}
              </h1>
              <div className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                <span className="text-sm text-primary font-medium">
                  Job #{job.id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-[#718096] text-sm">
              Created on {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        

        <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          onClick={() => router.push(`/jobs/${id}/estimates`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Estimates
          </Button>
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
                <div className={sectionStyles.fieldValue}>{job.customerName}</div>
              </div>
              
              <div className={sectionStyles.field}>
                <div className={sectionStyles.fieldLabel}>Phone Number</div>
                <div className={sectionStyles.fieldValue}>{job.customerPhone}</div>
              </div>

              <div className={sectionStyles.field}>
                <div className={sectionStyles.fieldLabel}>Email Address</div>
                <div className={sectionStyles.fieldValue}>{job.customerEmail}</div>
              </div>

              <div className={sectionStyles.field}>
                <div className={sectionStyles.fieldLabel}>Job Number</div>
                <div className={sectionStyles.fieldValue}>#{job.jobNumber}</div>
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
                  <div className={sectionStyles.fieldValue}>{job.vehicleMake}</div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Model</div>
                  <div className={sectionStyles.fieldValue}>{job.vehicleModel}</div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Registration</div>
                  <div className={sectionStyles.fieldValue}>
                    <span className="font-mono">{job.registrationNo}</span>
                  </div>
                </div>
                {job.mileage && (
                  <div className={sectionStyles.field}>
                    <div className={sectionStyles.fieldLabel}>Mileage</div>
                    <div className={sectionStyles.fieldValue}>
                      {job.mileage.toLocaleString()} km
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
                    {new Date(job.scheduledDate).toLocaleDateString()}
                  </div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Time</div>
                  <div className={sectionStyles.fieldValue}>{job.scheduledTime}</div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Duration</div>
                  <div className={sectionStyles.fieldValue}>{job.estimatedHours}h</div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Mechanic</div>
                  <div className={sectionStyles.fieldValue}>
                    {job?.mechanic?.name || 'Not assigned'}
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
                    {job.serviceType || 'Not specified'}
                  </div>
                </div>
                <div className={sectionStyles.field}>
                  <div className={sectionStyles.fieldLabel}>Priority</div>
                  <div className={sectionStyles.fieldValue}>
                    {job.priority || 'Normal'}
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
              jobId={job.id} 
              currentStatus={job.status}
              onUpdateStatus={(status, notes) => updateStatus({ status, notes })}
            />
          </div>
          
          {/* Notes section - reduced width */}
          <div className="w-[500px]"> {/* Fixed width instead of flex-1 */}
            <JobNotes 
              jobId={job.id} 
              notes={job.notes || []} 
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
            <EditJobForm 
              job={job} 
              onClose={() => setShowEditDialog(false)}
              onUpdate={updateJob}
            />
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
              onClick={() => {
                deleteJob();
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showScheduleEditDialog} onOpenChange={setShowScheduleEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
          </DialogHeader>
          <EditScheduleForm 
            jobId={id}
            currentSchedule={job}
            onClose={() => setShowScheduleEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Card className="flex-1">
        <CardHeader className={sectionStyles.header}>
          <div className={sectionStyles.headerTitle}>
            <Wrench className="h-3.5 w-3.5 text-primary" />
            Parts Used
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Part
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Parts</DialogTitle>
              </DialogHeader>
              <PartsManager jobId={id} />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className={sectionStyles.content}>
          <div className="space-y-4">
            {!parts?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No parts added yet</p>
              </div>
            ) : (
              <>
                {parts.map(part => (
                  <div key={part.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <div className="font-medium">{part.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {part.partNumber} • {part.quantity} units
                      </div>
                      <div className="text-sm font-medium mt-1">
                        ₹{(part.sellingPrice * part.quantity).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        part.status === 'INSTALLED' ? 'success' :
                        part.status === 'PENDING' ? 'warning' : 
                        'secondary'
                      }>
                        {part.status}
                      </Badge>
                      
                      {(part.status === 'PENDING' || part.status === 'INSTALLED') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {part.status === 'PENDING' && (
                              <DropdownMenuItem 
                                onClick={() => installPart(part.id)}
                                disabled={isInstalling}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {isInstalling ? 'Installing...' : 'Mark as Installed'}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => returnPart({ partId: part.id, reason: 'Not needed' })}
                              disabled={isReturning}
                            >
                              <Undo className="h-4 w-4 mr-2" />
                              {isReturning ? 'Returning...' : 'Return to Stock'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Parts Cost</span>
                    <span className="text-lg font-semibold">
                      ₹{totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 