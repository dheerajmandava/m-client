import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800"
}

export default function RecentJobsList({ jobs }) {
  const router = useRouter()

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent jobs found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => router.push(`/jobs/${job.id}`)}
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[#1A1A1A] font-medium truncate">
                {job.customerName}
              </p>
              <Badge 
                variant="secondary"
                className={cn("ml-2", statusStyles[job.status])}
              >
                {job.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-[#4A5568]">
                {job.vehicleMake} {job.vehicleModel}
              </p>
              <span className="text-sm text-primary">
                {job.registrationNo}
              </span>
            </div>
          </div>
          <div className="text-right text-sm text-[#718096]">
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
} 