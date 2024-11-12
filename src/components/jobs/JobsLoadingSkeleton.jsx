import { Card, CardContent } from '@/components/ui/card';

export default function JobsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <Card key={n}>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg bg-white p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                  
                  <div className="pt-3 border-t space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 