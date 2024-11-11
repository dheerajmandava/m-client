import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LowStockAlert({ items = [] }) {
  if (!items.length) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Low Stock Alert</AlertTitle>
      <AlertDescription>
        {items.length} {items.length === 1 ? 'item is' : 'items are'} running low on stock.
        <ul className="mt-2 list-disc list-inside">
          {items.slice(0, 3).map(item => (
            <li key={item.id}>
              {item.name} ({item.quantity} remaining)
            </li>
          ))}
          {items.length > 3 && (
            <li>And {items.length - 3} more...</li>
          )}
        </ul>
      </AlertDescription>
    </Alert>
  );
} 