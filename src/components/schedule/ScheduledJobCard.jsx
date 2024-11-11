import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Clock, User, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800"
}

export default function ScheduledJobCard({ job }) {
  const router = useRouter()

  return (
    <Card 
      className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => router.push(`/jobs/${job.id}`)}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{job.customerName}</h3>
            <Badge className={cn(statusStyles[job.status])}>
              {job.status?.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">#{job.jobNumber}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{job.scheduledTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <Car className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{job.vehicleMake} {job.vehicleModel}</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            {job.registrationNo}
          </span>
        </div>
      </div>

      {job.mechanic && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center gap-1.5 text-sm">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>{job.mechanic.name}</span>
          </div>
          {job.estimatedHours && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Timer className="h-3.5 w-3.5" />
              <span>{job.estimatedHours}h</span>
            </div>
          )}
        </div>
      )}
    </Card>
  )
} 