import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useSchedule(startDate, endDate) {
  // Update only the API call
  return useQuery({
    queryKey: ['schedule', startDate, endDate],
    queryFn: () => api.schedule.getSchedule(startDate, endDate),
    select: (data) => ({
      events: data || [],
      // ... any other data transformations you need
    })
  });
} 