'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Building2, Mail, Phone, MapPin, Pencil } from 'lucide-react';

export default function ShopProfilePage() {
  const router = useRouter();
  
  const { data: shopData, isLoading, error } = useQuery({
    queryKey: ['shop'],
    queryFn: () => api.shops.getProfile()
  });

  console.log('Shop Data:', shopData); // Add this for debugging

  // Check for loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading shop details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check for error state
  if (error || !shopData?.success) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-4">Error Loading Shop Profile</h2>
            <p className="text-gray-600 mb-6">
              {shopData?.message || error?.message || 'Failed to load shop profile'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if shop exists
  const shop = shopData;
  if (!shop) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-4">No Shop Profile Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't created a shop profile yet.
            </p>
            <Button 
              onClick={() => router.push('/shop/new')}
              className="flex items-center gap-2"
            >
              Create Shop Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shop Profile</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/shop/edit')}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Building2 className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <h3 className="font-semibold">{shop.name}</h3>
                <p className="text-sm text-muted-foreground">Shop Name</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <h3 className="font-semibold">{shop.email}</h3>
                <p className="text-sm text-muted-foreground">Email Address</p>
              </div>
            </div>

            {shop.phone && (
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <h3 className="font-semibold">{shop.phone}</h3>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                </div>
              </div>
            )}

            {shop.address && (
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <h3 className="font-semibold whitespace-pre-wrap">{shop.address}</h3>
                  <p className="text-sm text-muted-foreground">Address</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 