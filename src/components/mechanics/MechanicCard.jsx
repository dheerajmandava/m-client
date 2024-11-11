import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Calendar, Phone, Mail, Clock } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function MechanicCard({ mechanic }) {
  const router = useRouter()
  
  const activeJobs = mechanic.jobs?.filter(job => 
    job.status === 'IN_PROGRESS' || job.status === 'PENDING'
  ) || [];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium">{mechanic.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="secondary" className="text-xs">
                    {activeJobs.length} Active Jobs
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="p-3 max-w-xs">
                  <h4 className="font-medium mb-2">Current Assignments:</h4>
                  {activeJobs.map(job => (
                    <div key={job.id} className="text-sm mb-2 last:mb-0">
                      <div className="font-medium">#{job.jobNumber}</div>
                      <div className="flex items-center gap-1.5 text-xs mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(job.scheduledDate).toLocaleDateString()}</span>
                        <span>·</span>
                        <Clock className="h-3 w-3" />
                        <span>{job.scheduledTime}</span>
                      </div>
                    </div>
                  ))}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>{mechanic.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{mechanic.email}</span>
        </div>
      </div>


      <div className="flex gap-2 mt-auto">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 text-xs"
          onClick={() => router.push(`/mechanics/${mechanic.id}`)}
        >
          Mechanic Details
        </Button>
        <Button 
          variant="default"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => router.push(`/mechanics/${mechanic.id}/schedule`)}
        >
          View Schedule
        </Button>
      </div>
    </Card>
  )
} 