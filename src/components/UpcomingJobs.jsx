import { useRouter } from 'next/navigation';

export default function UpcomingJobs({ jobs }) {
  const router = useRouter();

  const upcomingJobs = jobs.filter(job => job.scheduledDate && new Date(job.scheduledDate) >= new Date())
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upcoming Jobs</h3>
      {upcomingJobs.length === 0 ? (
        <p className="text-gray-600">No upcoming jobs scheduled</p>
      ) : (
        upcomingJobs.map(job => (
          <div
            key={job.id}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{job.customerName}</p>
                <p className="text-sm text-gray-600">
                  {job.vehicleMake} {job.vehicleModel} - {job.registrationNo}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {new Date(job.scheduledDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">{job.scheduledTime}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 