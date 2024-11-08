import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function JobStatusCard({ job }) {
  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">
            {job.jobNumber}
          </CardTitle>
          <p className="text-sm text-gray-500">
            Customer: {job.customerName}
          </p>
        </div>
        <Badge className={getStatusColor(job.status)}>
          {job.status?.replace('_', ' ') || 'PENDING'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="text-sm">{job.vehicleMake} {job.vehicleModel} ({job.vehicleYear})</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Registration</p>
            <p className="text-sm">{job.registrationNo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm">{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estimated Cost</p>
            <p className="text-sm font-medium">${job.estimatedCost}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 