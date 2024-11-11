import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

const ITEM_TYPES = [
  { value: 'LABOR', label: 'Labor - 18%' },
  { value: 'PARTS_12', label: 'Parts - 12%' },
  { value: 'PARTS_18', label: 'Parts - 18%' },
  { value: 'PARTS_28', label: 'Parts - 28%' }
];

export default function CreateEstimateForm({ jobId, onSuccess }) {
  const [items, setItems] = useState([{
    type: 'LABOR',
    description: '',
    quantity: 1,
    price: '',
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(null)
  const [isBusinessCustomer, setIsBusinessCustomer] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm({
    defaultValues: {
      taxRate: 18, // Default GST rate
      discountRate: 0,
      termsAndConditions: 'Standard terms and conditions apply',
      validUntil: ''
    }
  });

  const addItem = () => {
    setItems([...items, {
      type: 'LABOR',
      description: '',
      quantity: 1,
      price: '',
    }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTax = (item) => {
    const amount = item.quantity * item.price;
    switch(item.type) {
      case 'LABOR':
        return amount * 0.18;
      case 'PARTS_12':
        return amount * 0.12;
      case 'PARTS_18':
        return amount * 0.18;
      case 'PARTS_28':
        return amount * 0.28;
      default:
        return 0;
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const estimateData = {
        items: items.map(item => ({
          type: item.type,
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.price),
          amount: Number(item.quantity) * Number(item.price),
          taxRate: item.type === 'PARTS_12' ? 12 : 
                  item.type === 'PARTS_28' ? 28 : 18,
        })),
        discountRate: Number(formData.discountRate) || 0,
        validUntil: formData.validUntil,
        termsAndConditions: formData.termsAndConditions,
      };

      await api.createEstimate(jobId, estimateData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create estimate:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = calculateSubtotal();
  const totalTax = items.reduce((sum, item) => sum + calculateTax(item), 0);
  const discountRate = parseFloat(watch('discountRate')) || 0;
  const discountAmount = (subtotal * discountRate) / 100;
  const total = subtotal + totalTax - discountAmount;

  const calculateItemTax = (item) => {
    const amount = item.quantity * item.price;
    switch(item.type) {
      case 'LABOR': return amount * 0.18;
      case 'PARTS_12': return amount * 0.12;
      case 'PARTS_18': return amount * 0.18;
      case 'PARTS_28': return amount * 0.28;
      default: return 0;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Items Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Items</h3>
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-3">
                <div className="grid grid-cols-[1.2fr_2.5fr_0.8fr_1fr_0.8fr_0.4fr] gap-2">
                  <div>
                    <Label className="text-[11px] font-medium text-gray-600">Type</Label>
                    <Select
                      value={item.type}
                      onValueChange={(value) => updateItem(index, 'type', value)}
                    >
                      <SelectTrigger className="h-8 text-xs mt-0.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ITEM_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-xs">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-[11px] font-medium text-gray-600">Description</Label>
                    <Input
                      className="h-8 text-xs mt-0.5"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-[11px] font-medium text-gray-600">Quantity</Label>
                    <Input
                      className="h-8 text-xs mt-0.5"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-[11px] font-medium text-gray-600">Price</Label>
                    <Input
                      className="h-8 text-xs mt-0.5"
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      placeholder="₹"
                    />
                  </div>

                  <div>
                    <Label className="text-[11px] font-medium text-gray-600">Tax</Label>
                    <Input
                      className="h-8 text-xs mt-0.5 bg-gray-50"
                      value={`₹${calculateItemTax(item).toFixed(2)}`}
                      readOnly
                    />
                  </div>

                  <div className="flex items-end justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="h-8 px-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={addItem} 
            className="w-full h-8 text-sm"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Discount */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Discount</h3>
          <div>
            <Label className="text-xs font-medium text-gray-600">Discount Rate (%)</Label>
            <Input 
              type="number" 
              step="0.01" 
              className="h-8 text-sm mt-0.5"
              placeholder="0.00"
              {...register('discountRate')} 
            />
          </div>
        </div>

        {/* Right Column - Validity */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Validity</h3>
          <div>
            <Label className="text-xs font-medium text-gray-600">Valid Until</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full h-8 text-sm mt-0.5 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setValue('validUntil', newDate ? format(newDate, 'yyyy-MM-dd') : '');
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Terms & Conditions</h3>
        <Textarea 
          className="min-h-[80px] text-sm resize-none mt-0.5"
          {...register('termsAndConditions')} 
        />
      </div>

      {/* Summary Card */}
      <Card className="bg-gray-50">
        <CardContent className="p-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total GST:</span>
              <span>₹{items.reduce((sum, item) => sum + calculateTax(item), 0).toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Discount ({discountRate}%):
                </span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium pt-1.5 border-t">
              <span>Total Amount:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="h-8 text-sm">
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Estimate'
          )}
        </Button>
      </div>
    </form>
  );
} 