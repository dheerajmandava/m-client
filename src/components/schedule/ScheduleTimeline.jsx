import { ScrollArea } from "@/components/ui/scroll-area"

const WORK_HOURS = Array.from({ length: 9 }, (_, i) => i + 9) // 9 AM to 5 PM

export default function ScheduleTimeline({ date, jobs }) {
  const timeSlots = WORK_HOURS.map(hour => ({
    time: `${hour.toString().padStart(2, '0')}:00`,
    jobs: jobs.filter(job => job.scheduledTime.startsWith(hour.toString()))
  }))

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="relative space-y-1">
        {timeSlots.map((slot, index) => (
          <div key={slot.time} className="relative">
            <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 text-sm font-medium">
              {slot.time}
            </div>
            {slot.jobs.length > 0 ? (
              <div className="pl-8 space-y-3">
                {slot.jobs.map(job => (
                  <div 
                    key={job.id}
                    className="relative before:absolute before:left-[-1rem] before:top-[0.875rem] before:h-2 before:w-2 before:rounded-full before:bg-primary"
                  >
                    <div className="rounded-md border bg-card p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{job.customerName}</span>
                        <span className="text-sm text-muted-foreground">
                          {job.estimatedHours}h
                        </span>
                      </div>
                      {job.mechanic && (
                        <div className="text-sm text-muted-foreground">
                          Assigned to: {job.mechanic.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pl-8 py-4 text-sm text-muted-foreground">
                No appointments
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
} 