'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, ArrowLeft, Clock, User, Car } from 'lucide-react';
import { useMechanicDetails } from '@/hooks/useMechanicDetails';

function formatJobDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function MechanicDetailsPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const { 
    mechanic, 
    isLoading,
    error,
    updateMechanic,
    removeMechanic 
  } = useMechanicDetails(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{mechanic.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{mechanic.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{mechanic.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mechanic.jobs?.length > 0 ? (
                mechanic.jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="flex items-start space-x-4 p-3 rounded-lg border"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{job.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatJobDate(job.scheduledDate)}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{job.scheduledTime}</span>
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No scheduled jobs
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 