'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, ArrowLeft, Clock, User, Car } from 'lucide-react';
import { api } from '@/lib/api';

// Format date directly in component for now
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

  const { data: mechanic, isLoading } = useQuery({
    queryKey: ['mechanic', params.id],
    queryFn: () => api.mechanics.getById(params.id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-2">Loading mechanic details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mechanicData = mechanic;

  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => router.push('/mechanics')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Mechanics
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mechanic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Mechanic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{mechanicData.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{mechanicData.phone || 'No phone number'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{mechanicData.email || 'No email'}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {mechanicData.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Jobs Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mechanicData.jobs?.length > 0 ? (
                mechanicData.jobs.map((job) => (
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