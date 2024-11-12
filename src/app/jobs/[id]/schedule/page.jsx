'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/index';
import { useAuth } from '@clerk/nextjs';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { ChevronRight, Home } from 'lucide-react';
import { useMechanics } from '@/hooks/useMechanics';
import { useJobDetails } from '@/hooks/useJobDetails';
import { useSchedule } from '@/hooks/useSchedule';

const timeSlots = [
  { value: 'MORNING', label: 'Morning (9 AM - 12 PM)' },
  { value: 'AFTERNOON', label: 'Afternoon (12 PM - 4 PM)' },
  { value: 'EVENING', label: 'Evening (4 PM - 8 PM)' }
];  

export default function ScheduleJobPage({ params }) {
  console.log('Job ID from params:', params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoaded, isSignedIn } = useAuth();
  const { mechanics, isLoading: mechanicsLoading } = useMechanics();
  const { job, isLoading: jobLoading } = useJobDetails(params.id);
  const { assignJob, isAssigning } = useSchedule();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('2');

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime || !selectedMechanic) {
      toast.error('Please fill in all required fields');
      return;
    }

    assignJob({
      jobId: params.id,
      scheduleData: {
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        mechanicId: selectedMechanic,
        estimatedHours: parseFloat(estimatedHours)
      }
    }, {
      onSuccess: () => {
        router.push(`/jobs/${params.id}`);
      }
    });
  };

  // Log the job ID from params
  console.log('Job ID from params:', params.id);

  // Log the job data when it changes
  useEffect(() => {
    if (job) {
      console.log('Job Data:', job);
    }
  }, [job]);

  if (!isLoaded || jobLoading || mechanicsLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-2">Loading scheduling details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-4 p-4 max-w-3xl">
      <div className="flex items-start gap-1 text-sm text-muted-foreground mb-3 ml-0">
        <Button 
          variant="link" 
          className="h-auto p-0 text-muted-foreground"
          onClick={() => router.push('/')}
        >
          <Home className="h-4 w-4" />
        </Button>
        <ChevronRight className="h-4 w-4" />
        <Button 
          variant="link" 
          className="h-auto p-0 text-muted-foreground"
          onClick={() => router.push('/jobs')}
        >
          Jobs
        </Button>
        <ChevronRight className="h-4 w-4" />
        <Button 
          variant="link" 
          className="h-auto p-0 text-muted-foreground"
          onClick={() => router.push(`/jobs/${params.id}`)}
        >
          Job #{job?.jobNumber}
        </Button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Schedule</span>
      </div>

      <Card>
        <CardHeader className="space-y-0.5 pb-2 border-b">
          <div>
            <h2 className="text-lg font-semibold">Schedule Job #{job?.jobNumber}</h2>
            <p className="text-xs text-muted-foreground">All fields marked with * are required</p>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          <div className="grid grid-cols-2 gap-x-6">
            {/* Left Column - Calendar */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Select Date *</h3>
              <div className="border rounded-lg p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>

            {/* Right Column - Schedule Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Schedule Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Time Slot *</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value} className="text-sm">
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Assigned Mechanic *</label>
                    <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select mechanic" />
                      </SelectTrigger>
                      <SelectContent>
                        {mechanics.map((mechanic) => (
                          <SelectItem key={mechanic.id} value={mechanic.id} className="text-sm">
                            {mechanic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Estimated Hours *</label>
                    <input
                      type="number"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                      className="w-full h-8 px-3 text-sm border rounded-md"
                      min="1"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime || !selectedMechanic || !estimatedHours}
                className="w-full h-8 mt-6 text-sm"
              >
                Schedule Job
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 