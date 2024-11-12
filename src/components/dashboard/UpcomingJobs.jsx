import { useRouter } from 'next/navigation';
import { Clock, User } from 'lucide-react';
import useUpcomingJobs from '@/hooks/useUpcomingJobs';

export default function UpcomingJobs() {
  const router = useRouter();
  const { jobs, isLoading } = useUpcomingJobs();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="relative pl-6">
      {jobs.map((job, index) => (
        <div key={job.id} className="relative mb-4 last:mb-0">
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
  );
} 