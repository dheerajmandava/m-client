import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 9;
  return {
    value: `${hour}:00`,
    label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
  };
});

export default function EditScheduleForm({ job, mechanics, onClose }) {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date(job.scheduledDate));
  const [selectedTime, setSelectedTime] = useState(job.scheduledTime);
  const [selectedMechanic, setSelectedMechanic] = useState(job.mechanic?.id);
  const [estimatedHours, setEstimatedHours] = useState(
    job.estimatedHours?.toString() || '1'
  );

  const updateMutation = useMutation({
    mutationFn: (data) => api.updateJobSchedule(job.id, data),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      queryClient.invalidateQueries(['job', job.id]);
      toast.success('Schedule updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update schedule');
    }
  });

  const handleSubmit = () => {
    updateMutation.mutate({
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      mechanicId: selectedMechanic,
      estimatedHours: parseFloat(estimatedHours)
    });
  };

  return (
    <div className="py-2 space-y-3">
      <div className="grid grid-cols-2 gap-x-4">
        {/* Left Column - Assignment */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Assignment</h3>
            <div className="space-y-2">
              <div>
                <Label className="text-xs font-medium text-gray-600">Mechanic *</Label>
                <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
                  <SelectTrigger className="h-8 text-sm mt-0.5">
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
                <Label className="text-xs font-medium text-gray-600">Duration (hours) *</Label>
                <Select value={estimatedHours} onValueChange={setEstimatedHours}>
                  <SelectTrigger className="h-8 text-sm mt-0.5">
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                      <SelectItem key={hours} value={hours.toString()} className="text-sm">
                        {hours}h
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Schedule */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Schedule</h3>
            <div className="space-y-2">
              <div>
                <Label className="text-xs font-medium text-gray-600">Date *</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mt-0.5"
                  disabled={(date) => date < new Date()}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">Time Slot *</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="h-8 text-sm mt-0.5">
                    <SelectValue placeholder="Select time" />
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
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t mt-2">
        <Button 
          size="sm"
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="h-8 text-sm px-4"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Schedule'
          )}
        </Button>
      </div>
    </div>
  );
} 