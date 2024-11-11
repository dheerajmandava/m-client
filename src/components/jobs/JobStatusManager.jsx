import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const JOB_STATUSES = [
  { 
    value: 'PENDING', 
    label: 'Pending', 
    icon: Clock,
    description: 'Job is waiting to be started',
    color: 'text-yellow-600'
  },
  { 
    value: 'IN_PROGRESS', 
    label: 'In Progress', 
    icon: Clock,
    description: 'Work is currently being done',
    color: 'text-blue-600'
  },
  { 
    value: 'COMPLETED', 
    label: 'Completed', 
    icon: CheckCircle,
    description: 'All work has been finished',
    color: 'text-green-600'
  },
  { 
    value: 'CANCELLED', 
    label: 'Cancelled', 
    icon: AlertCircle,
    description: 'Job has been cancelled',
    color: 'text-gray-600'
  },
];

export default function JobStatusManager({ jobId, currentStatus, className }) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const currentStatusInfo = JOB_STATUSES.find(s => s.value === status);
  const Icon = currentStatusInfo?.icon;

  const handleStatusUpdate = async () => {
    if (!notes.trim()) {
      toast.error('Please add notes about this status change');
      return;
    }

    setIsUpdating(true);
    try {
      const result = await api.updateJobStatus(jobId, { status, notes });
      if (result.success) {
        toast.success('Status updated successfully');
        queryClient.invalidateQueries(['job', jobId]);
        queryClient.invalidateQueries(['jobs']);
        setNotes('');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="border-b bg-muted/5 py-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {Icon && <Icon className={cn("h-5 w-5", currentStatusInfo.color)} />}
          Status Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2.5">
          <label className="text-sm font-medium text-muted-foreground">
            Current Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {JOB_STATUSES.map(({ value, label, icon: StatusIcon, description, color }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={cn("h-4 w-4", color)} />
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground">
                        {description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <label className="text-sm font-medium text-muted-foreground">
            Status Update Notes
          </label>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this status change..."
            className="min-h-[100px] resize-none"
          />
        </div>

        <Button 
          onClick={handleStatusUpdate} 
          disabled={isUpdating || !notes.trim() || status === currentStatus}
          className="w-full"
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating Status...
            </>
          ) : (
            'Update Status'
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 