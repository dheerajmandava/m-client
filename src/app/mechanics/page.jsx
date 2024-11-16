'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MechanicCard from '@/components/mechanics/MechanicCard';
import AddMechanicDialog from '@/components/mechanics/AddMechanicDialog';
import { api } from '@/lib/api';

export default function MechanicsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: mechanics = [], isLoading, error } = useQuery({
    queryKey: ['mechanics'],
    queryFn: () => api.mechanics.fetchAll()
  });

  const filteredMechanics = mechanics?.filter(mechanic => 
    mechanic.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-2">Loading mechanics...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-red-500">Error loading mechanics: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mechanics</CardTitle>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Mechanic
          </Button>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search mechanics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm mb-6"
          />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMechanics.map(mechanic => (
              <MechanicCard key={mechanic.id} mechanic={mechanic} />
            ))}
          </div>
        </CardContent>
      </Card>

      <AddMechanicDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </div>
  );
} 