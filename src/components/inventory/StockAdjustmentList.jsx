'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StockAdjustmentList({ inventoryId }) {
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  const { data: adjustments, isLoading } = useQuery({
    queryKey: ['stock-adjustments', inventoryId, dateRange],
    queryFn: () => api.getStockAdjustments({
      inventoryId,
      startDate: dateRange.from?.toISOString(),
      endDate: dateRange.to?.toISOString()
    })
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading adjustments...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stock Adjustments</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {!adjustments.length ? (
        <div className="text-center py-6 text-muted-foreground">
          No adjustments found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.map((adjustment) => (
              <TableRow key={adjustment.id}>
                <TableCell>
                  {format(new Date(adjustment.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    adjustment.type === 'IN' ? 'success' :
                    adjustment.type === 'OUT' ? 'destructive' :
                    'default'
                  }>
                    {adjustment.type}
                  </Badge>
                </TableCell>
                <TableCell className={cn(
                  "font-medium",
                  adjustment.type === 'IN' ? 'text-green-600' :
                  adjustment.type === 'OUT' ? 'text-red-600' :
                  undefined
                )}>
                  {adjustment.type === 'IN' ? '+' : '-'}{Math.abs(adjustment.quantity)}
                </TableCell>
                <TableCell>{adjustment.reason}</TableCell>
                <TableCell>{adjustment.reference || '-'}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {adjustment.notes || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
} 