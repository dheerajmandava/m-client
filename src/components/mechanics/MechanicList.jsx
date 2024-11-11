'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function MechanicList({ mechanics = [] }) {
  const router = useRouter();

  if (mechanics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No mechanics found. Add your first mechanic to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mechanics.map((mechanic) => (
          <TableRow key={mechanic.id}>
            <TableCell>{mechanic.name}</TableCell>
            <TableCell>{mechanic.email}</TableCell>
            <TableCell>{mechanic.phone}</TableCell>
            <TableCell>{mechanic.status}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/mechanics/${mechanic.id}`)}
              >
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 