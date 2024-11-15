import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { generateEstimatePDF } from '@/lib/pdfGenerator';
import { useShop } from '@/contexts/ShopContext';
import { X, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function EstimateDetailsDialog({ estimate, onClose }) {
  const { shop } = useShop();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Estimate Details</DialogTitle>
          <DialogDescription>
            {estimate?.estimateNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Shop Details */}
          <div>
            <h4 className="text-sm font-medium mb-2">Shop Details</h4>
            <div className="text-sm">
              <p className="font-medium">{shop?.name}</p>
              <p>{shop?.address}</p>
              <p>{shop?.phone}</p>
              {shop?.gst && <p>GST: {shop?.gst}</p>}
            </div>
          </div>

          {/* Estimate Details */}
          <div>
            <h4 className="text-sm font-medium mb-2">Items</h4>
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-right p-2">Quantity</th>
                      <th className="text-right p-2">Unit Price</th>
                      <th className="text-right p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimate?.items?.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{item.type}</td>
                        <td className="p-2">{item.description}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">₹{item.unitPrice.toFixed(2)}</td>
                        <td className="p-2 text-right">₹{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-sm font-medium mb-2">Summary</h4>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>₹{estimate?.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax Amount:</span>
                    <span>₹{estimate?.taxAmount.toFixed(2)}</span>
                  </div>
                  {estimate?.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Discount ({estimate.discountRate}%):
                      </span>
                      <span>-₹{estimate.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{estimate?.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 