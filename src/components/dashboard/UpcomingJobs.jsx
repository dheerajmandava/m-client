import { useRouter } from 'next/navigation'
import { Calendar, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function UpcomingJobs({ jobs }) {
  const router = useRouter()
  
  // Filter and sort upcoming jobs
  const upcomingJobs = jobs
    .filter(job => job.scheduledDate && new Date(job.scheduledDate) >= new Date())
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 5)

  if (upcomingJobs.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 text-sm font-medium">No upcoming jobs</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Schedule your first job to see it here
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/schedule')}
        >
          Schedule Job
        </Button>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="relative space-y-6">
        {upcomingJobs.map((job, index) => (
          <div
            key={job.id}
            className="relative pl-8 before:absolute before:left-3 before:top-[24px] before:h-full before:w-[1px] before:-translate-x-1/2 before:bg-border last:before:hidden"
          >
            <div className="absolute left-0 top-2.5 h-3 w-3 rounded-full bg-primary ring-[3px] ring-background" />
            
            <div 
              onClick={() => router.push(`/jobs/${job.id}`)}
              className="block rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[#1A1A1A] font-medium leading-none">
                    {job.customerName}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[#4A5568]">
                      {job.vehicleMake} {job.vehicleModel}
                    </p>
                    <span className="text-sm text-primary">
                      {job.registrationNo}
                    </span>
                  </div>
                </div>
                <time className="text-sm text-[#718096]">
                  {new Date(job.scheduledDate).toLocaleDateString()}
                </time>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-[#4A5568]">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{job.scheduledTime}</span>
                </div>
                {job.mechanic && (
                  <div className="flex items-center gap-1 text-sm text-[#4A5568]">
                    <User className="h-4 w-4 text-primary" />
                    <span>{job.mechanic.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
} 