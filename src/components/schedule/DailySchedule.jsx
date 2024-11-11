'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";

// Create time slots for each hour from 9 AM to 8 PM
const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 9;
  return {
    id: `${hour}:00`,
    label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
  };
});

export default function DailySchedule({ schedules = [], mechanics = [], selectedDate }) {
  const router = useRouter();

  const getStatusColor = useCallback((schedule) => {
    switch (schedule.status) {
      case 'IN_PROGRESS': return 'bg-blue-50';
      case 'COMPLETED': return 'bg-green-50';
      default: return 'bg-amber-50';
    }
  }, []);

  const columns = useMemo(() => [
    {
      accessorKey: 'mechanic',
      header: 'Mechanic',
      cell: ({ row }) => {
        const mechanic = mechanics.find(m => m.id === row.original.mechanicId);
        return mechanic?.name || 'Unassigned';
      }
    },
    ...timeSlots.map(slot => ({
      accessorKey: slot.id,
      header: slot.label,
      cell: ({ getValue }) => {
        const schedule = getValue();
        if (!schedule) return (
          <div className="h-full p-2 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
            <span className="text-xs">Available</span>
          </div>
        );

        return (
          <div 
            className={`p-2 rounded-md cursor-pointer ${getStatusColor(schedule)}`}
            onClick={() => router.push(`/jobs/${schedule.id}`)}
          >
            <p className="font-medium truncate">{schedule.customerName}</p>
            <p className="text-xs text-gray-600 truncate">
              {schedule.vehicleMake} {schedule.vehicleModel}
            </p>
            <div className="mt-1 flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {schedule.estimatedHours}h
              </Badge>
              <Badge variant="outline" className="text-xs">
                {schedule.status}
              </Badge>
            </div>
          </div>
        );
      }
    }))
  ], [mechanics, getStatusColor, router]);

  const data = useMemo(() => {
    return mechanics.map(mechanic => ({
      mechanicId: mechanic.id,
      ...timeSlots.reduce((acc, slot) => ({
        ...acc,
        [slot.id]: schedules.find(s => 
          s.mechanicId === mechanic.id && 
          s.scheduledTime === slot.id
        )
      }), {})
    }));
  }, [mechanics, schedules]);

  if (mechanics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No mechanics available. Please add mechanics first.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.accessorKey} className="text-center whitespace-nowrap">
                {typeof column.header === 'string' ? column.header : column.header()}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.mechanicId}>
              {columns.map(column => (
                <TableCell 
                  key={column.accessorKey}
                  className="text-center"
                >
                  {column.cell({ row: { original: row }, getValue: () => row[column.accessorKey] })}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 