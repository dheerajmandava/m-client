"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, Clock, User, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800"
};

export default function JobCard({ job }) {
  const router = useRouter();

  return (
    <Card 
      onClick={() => router.push(`/jobs/${job.id}`)}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4">
        {/* Header with customer name and status */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#1A1A1A] font-medium">
            {job.customerName}
          </h3>
          <Badge className={cn(statusStyles[job.status])}>
            {job.status}
          </Badge>
        </div>

        {/* Vehicle details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#4A5568]">
            <Car className="h-4 w-4 text-primary" />
            <span className="text-sm">
              {job.vehicleMake} {job.vehicleModel}
            </span>
            <span className="text-sm text-primary font-medium">
              {job.registrationNo}
            </span>
          </div>

          {/* Schedule info */}
          <div className="flex items-center gap-2 text-[#4A5568]">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm">
              {new Date(job.scheduledDate).toLocaleDateString()}
            </span>
            <Clock className="h-4 w-4 text-primary ml-2" />
            <span className="text-sm">{job.scheduledTime}</span>
          </div>

          {/* Mechanic info if assigned */}
          {job.mechanic && (
            <div className="flex items-center gap-2 text-[#4A5568]">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm">{job.mechanic.name}</span>
            </div>
          )}
        </div>

        {/* Footer with date */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-[#718096]">
            Created {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}