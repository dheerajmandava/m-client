'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { api } from '@/lib/api/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Car, User, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SchedulePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: ['jobs', selectedDate],
    queryFn: () => api.schedule.getSchedule(selectedDate)
  });

  const jobsData = jobsResponse || [];

  // Create stable reference for the data
  const scheduledJobs = useMemo(() => {
    const jobs = jobsData || [];
    return [...jobs].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [jobsData]);

  // Table columns with stable reference
  const columns = useMemo(() => [
    {
      accessorKey: 'scheduledTime',
      header: 'Time',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.scheduledTime}</span>
        </div>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.customerName}</span>
          <p className="text-xs text-muted-foreground">#{row.original.jobNumber}</p>
        </div>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Car className="h-4 w-4 text-muted-foreground" />
          <div>
            {row.original.vehicleMake} {row.original.vehicleModel}
            <span className="text-muted-foreground ml-2">
              {row.original.registrationNo}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'mechanic',
      header: 'Assigned To',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.mechanic?.name || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'estimatedHours',
      header: 'Duration',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.estimatedHours}h</span>
        </div>
      ),
    },
  ], []);

  // Table instance with stable data reference
  const table = useReactTable({
    data: scheduledJobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleDateChange = useCallback((date) => {
    setIsCalendarOpen(false);
    setSelectedDate(date);
  }, []);

  const handleClearDate = useCallback(() => {
    setIsCalendarOpen(false);
    setSelectedDate(null);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? 'Loading...' : `${jobsData.length || 0} jobs scheduled`}
            {selectedDate ? ` for ${format(selectedDate, "MMMM d, yyyy")}` : ' in total'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[240px]",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>All scheduled jobs</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-2 border-b">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={handleClearDate}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Show all jobs
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Scheduled Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading schedule...</p>
            </div>
          ) : scheduledJobs.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-sm font-medium">No jobs scheduled</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No jobs are scheduled for this date.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push('/jobs')}
              >
                View All Jobs
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/jobs/${row.original.id}`)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 