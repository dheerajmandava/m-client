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

const statusColors = {
  DRAFT: 'default',
  SENT: 'primary',
  APPROVED: 'success',
  REJECTED: 'destructive',
  EXPIRED: 'secondary'
};

export default function EstimateList({ jobId, onViewEstimate }) {
  const { data: estimatesResponse, isLoading } = useQuery({
    queryKey: ['estimates', jobId],
    queryFn: () => api.estimates.getJobEstimates(jobId)
  });

  const estimates = estimatesResponse || [];

  const [generatingPDF, setGeneratingPDF] = useState(null);

  const handleGeneratePDF = async (estimate) => {
    try {
      setGeneratingPDF(estimate.id);
      
      const [shopResponse, jobResponse] = await Promise.all([
        api.shops.getProfile(),
        api.jobs.get(estimate.jobCardId)
      ]);

      const estimateWithJob = {
        ...estimate,
        jobCard: jobResponse
      };

      const doc = generateEstimatePDF(estimateWithJob, shopResponse);
      doc.save(`${estimate.estimateNumber}.pdf`);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(error.message);
    } finally {
      setGeneratingPDF(null);
    }
  };

  if (isLoading) {
    return <div>Loading estimates...</div>;
  }

  if (!estimates || estimates.length === 0) {
    return <div className="text-muted-foreground">No estimates found</div>;
  }

  return (
    <div className="space-y-4">
      {estimates.map((estimate) => (
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
                  disabled={generatingPDF === estimate.id}
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
      ))}
    </div>
  );
} 