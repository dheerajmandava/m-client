import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '../ui/dialog';
import { useMechanics } from '@/hooks/useMechanics';
import { useSchedule } from '@/hooks/useSchedule';

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 9;
  return {
    value: `${hour}:00`,
    label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
  };
});

export default function EditScheduleForm({ jobId, currentSchedule, onClose }) {
  const queryClient = useQueryClient();
  const { mechanics, isLoading: isLoadingMechanics } = useMechanics();
  
  const { modifySchedule, isModifying } = useSchedule();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    modifySchedule({
      jobId,
      scheduleData: {
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        mechanicId: selectedMechanic,
        estimatedHours: parseFloat(estimatedHours)
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['job', jobId]);
        onClose();
      }
    });
  };

  const [selectedDate, setSelectedDate] = useState(
    currentSchedule?.scheduledDate ? new Date(currentSchedule.scheduledDate) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState(
    currentSchedule?.scheduledTime || ''
  );
  const [selectedMechanic, setSelectedMechanic] = useState(
    currentSchedule?.mechanicId?.toString() || ''
  );
  const [estimatedHours, setEstimatedHours] = useState(
    currentSchedule?.estimatedHours?.toString() || '1'
  );

  console.log('Selected Mechanic:', selectedMechanic);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border mt-0.5"
              disabled={(date) => date < new Date()}
            />
          </div>
          <div className="space-y-2">
            <Label>Time</Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(slot => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mechanic</Label>
          <Select
            value={selectedMechanic}
            onValueChange={(value) => {
              console.log('Selected Value:', value);
              setSelectedMechanic(value);
            }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mechanic" />
            </SelectTrigger>
            <SelectContent>
              {mechanics.map(mechanic => (
                <SelectItem 
                  key={mechanic.id} 
                  value={mechanic.id.toString()}
                >
                  {mechanic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Estimated Hours</Label>
          <Input
            type="number"
            min="0.5"
            step="0.5"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isModifying}
        >
          {isModifying ? 'Updating...' : 'Update Schedule'}
        </Button>
      </DialogFooter>
    </form>
  );
} 