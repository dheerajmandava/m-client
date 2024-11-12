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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Phone, Mail, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SupplierDetailsDialog from './SupplierDetailsDialog';
import EditSupplierDialog from './EditSupplierDialog';

export default function SuppliersList() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => api.suppliers.getAll()
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading suppliers...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!suppliers.length ? (
          <div className="col-span-full text-center py-6 text-muted-foreground">
            No suppliers found.
          </div>
        ) : (
          suppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{supplier.name}</span>
                  <Badge variant={supplier.leadTime ? 'default' : 'outline'}>
                    {supplier.leadTime ? `${supplier.leadTime} days` : 'No lead time'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {supplier.terms || 'No payment terms specified'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supplier.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={`mailto:${supplier.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {supplier.email}
                      </a>
                    </div>
                  )}
                  
                  {supplier.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={`tel:${supplier.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {supplier.phone}
                      </a>
                    </div>
                  )}
                  
                  {supplier.address && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{supplier.address}</span>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingSupplier(supplier)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <SupplierDetailsDialog
        supplier={selectedSupplier}
        open={!!selectedSupplier}
        onOpenChange={(open) => !open && setSelectedSupplier(null)}
      />

      <EditSupplierDialog
        supplier={editingSupplier}
        open={!!editingSupplier}
        onOpenChange={(open) => !open && setEditingSupplier(null)}
      />
    </>
  );
}