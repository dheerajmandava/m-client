import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Eye, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api/index';
import { toast } from 'sonner';
import { generateEstimatePDF } from '@/lib/pdfGenerator';
import { useShop } from '@/contexts/ShopContext';
import { useEstimates } from '@/hooks/useEstimates';

const statusColors = {
  DRAFT: 'default',
  SENT: 'primary',
  APPROVED: 'success',
  REJECTED: 'destructive',
  EXPIRED: 'secondary'
};

export default function EstimateList({ jobId, onViewEstimate }) {
  const { shop, loading: shopLoading } = useShop();
  const { estimates, isLoading } = useEstimates(jobId);
  const [generatingPDF, setGeneratingPDF] = useState(null);

  const handleGeneratePDF = async (estimate) => {
    try {
      if (!shop) {
        toast.error('Shop details not available');
        return;
      }

      setGeneratingPDF(estimate.id);

      // Fetch complete estimate details with items
      const { data: estimateDetails } = await api.estimates.fetchOne(estimate.id);
      
      if (!estimateDetails) {
        throw new Error('Failed to fetch estimate details');
      }

      // No need to fetch job details separately as they're included in estimateDetails
      const jobDetails = estimateDetails.jobCard;
      
      if (!jobDetails) {
        throw new Error('Job details not found in estimate');
      }

      // Recalculate totals if they're zero
      const calculatedTotals = {
        subtotal: estimateDetails.subtotal || estimateDetails.items.reduce((sum, item) => 
          sum + (item.quantity * item.unitPrice), 0),
        taxAmount: estimateDetails.taxAmount || estimateDetails.items.reduce((sum, item) => {
          const amount = item.quantity * item.unitPrice;
          switch(item.type) {
            case 'LABOR': return sum + (amount * 0.18);
            case 'PARTS_12': return sum + (amount * 0.12);
            case 'PARTS_18': return sum + (amount * 0.18);
            case 'PARTS_28': return sum + (amount * 0.28);
            default: return sum;
          }
        }, 0),
      };

      calculatedTotals.total = estimateDetails.total || 
        (calculatedTotals.subtotal + calculatedTotals.taxAmount - (estimateDetails.discountAmount || 0));

      const pdfData = {
        ...estimateDetails,
        ...calculatedTotals,
        jobCard: jobDetails,
        shop: {
          name: shop.name,
          address: shop.address,
          phone: shop.phone,
          email: shop.email,
          gst: shop.gst
        }
      };

      // Validate required data
      const requiredFields = ['items'];
      const missingFields = requiredFields.filter(field => {
        if (field === 'items') {
          return !pdfData[field] || !pdfData[field].length;
        }
        return pdfData[field] === undefined || pdfData[field] === null;
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const doc = generateEstimatePDF(pdfData);
      doc.save(`${estimate.estimateNumber}.pdf`);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(error.message || 'Failed to generate PDF');
    } finally {
      setGeneratingPDF(null);
    }
  };

  if (isLoading) return <div>Loading estimates...</div>;

  return (
    <div className="space-y-4">
      {(!estimates || estimates.length === 0) ? (
        <div className="text-muted-foreground">No estimates found</div>
      ) : (
        estimates.map((estimate) => (
          <Card key={estimate.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {estimate.estimateNumber}
                </CardTitle>
                <Badge variant={statusColors[estimate.status]}>
                  {estimate.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div>{format(new Date(estimate.createdAt), 'PPP')}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Valid Until</div>
                  <div>
                    {estimate.validUntil 
                      ? format(new Date(estimate.validUntil), 'PPP')
                      : 'Not specified'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="font-semibold">₹{estimate.total.toFixed(2)}</div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewEstimate(estimate)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGeneratePDF(estimate)}
                    disabled={generatingPDF === estimate.id || shopLoading}
                    title={shopLoading ? "Loading shop details..." : "Generate PDF"}
                  >
                    {generatingPDF === estimate.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}