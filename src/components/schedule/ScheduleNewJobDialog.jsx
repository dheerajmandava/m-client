import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 9;
  return {
    value: `${hour}:00`,
    label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
  };
});

export default function ScheduleNewJobDialog({ open, onOpenChange, onSubmit, mechanics = [] }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('1');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const availableMechanics = Array.isArray(mechanics) ? mechanics : [];

  const { data: unscheduledJobs, isLoading } = useQuery({
    queryKey: ['unscheduledJobs'],
    queryFn: api.getUnscheduledJobs,
    enabled: open // Only fetch when dialog is open
  });

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setSelectedJob('');
      setSelectedDate(new Date());
      setSelectedTime('');
      setSelectedMechanic('');
      setEstimatedHours('1');
    }
  }, [open]);

  const handleSubmit = async (data) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="space-y-0.5 pb-2 border-b">
          <DialogTitle className="text-base font-semibold">Schedule New Job</DialogTitle>
          <p className="text-xs text-muted-foreground">All fields marked with * are required</p>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {/* Job Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Select Unscheduled Job *</h3>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select a job to schedule" />
              </SelectTrigger>
              <SelectContent>
                {unscheduledJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id} className="text-sm">
                    {job.customerName} - {job.vehicleMake} {job.vehicleModel} ({job.registrationNo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schedule Details */}
          <div className="grid grid-cols-2 gap-x-4">
            {/* Left Column - Assignment */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Assignment</h3>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="mechanic" className="text-xs font-medium text-gray-600">
                      Mechanic *
                    </Label>
                    <Select
                      value={selectedMechanic}
                      onValueChange={setSelectedMechanic}
                    >
                      <SelectTrigger id="mechanic" className="h-8 text-sm mt-0.5">
                        <SelectValue placeholder="Select mechanic" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMechanics.map((mechanic) => (
                          <SelectItem key={mechanic.id} value={mechanic.id} className="text-sm">
                            {mechanic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-xs font-medium text-gray-600">
                      Duration (hours) *
                    </Label>
                    <Select value={estimatedHours} onValueChange={setEstimatedHours}>
                      <SelectTrigger id="duration" className="h-8 text-sm mt-0.5">
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
                    <Button
                      variant="outline"
                      className="h-8 text-sm mt-0.5 w-full justify-start text-left font-normal"
                      onClick={() => setCalendarOpen(true)}
                    >
                      {selectedDate.toLocaleDateString()}
                    </Button>
                    {calendarOpen && (
                      <div className="absolute z-50 bg-white border rounded-md shadow-lg p-2 mt-1">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setCalendarOpen(false);
                          }}
                          minDate={new Date()}
                          className="rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="timeSlot" className="text-xs font-medium text-gray-600">
                      Time Slot *
                    </Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger id="timeSlot" className="h-8 text-sm mt-0.5">
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
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t mt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="h-8 text-sm px-4">
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={handleSubmit}
            disabled={!selectedJob || !selectedDate || !selectedTime || !selectedMechanic}
            className="h-8 text-sm px-4"
          >
            Schedule Job
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 