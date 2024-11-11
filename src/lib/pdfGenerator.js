import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generateEstimatePDF = (estimate, shopDetails) => {
  const doc = new jsPDF();
  
  // Add shop logo and details
  doc.setFontSize(20);
  doc.text(shopDetails.name, 20, 20);
  
  doc.setFontSize(10);
  doc.text([
    shopDetails.address,
    `Phone: ${shopDetails.phone}`,
    `Email: ${shopDetails.email}`,
    `GST: ${shopDetails.gstNumber}`
  ], 20, 30);

  // Estimate details
  doc.setFontSize(16);
  doc.text(`Estimate: ${estimate.estimateNumber}`, 20, 60);
  
  doc.setFontSize(10);
  doc.text([
    `Date: ${format(new Date(estimate.createdAt), 'PP')}`,
    `Valid Until: ${format(new Date(estimate.validUntil), 'PP')}`,
    `Status: ${estimate.status}`
  ], 20, 70);

  // Customer details
  doc.text([
    'Bill To:',
    estimate.jobCard.customerName,
    estimate.jobCard.customerPhone,
    `Vehicle: ${estimate.jobCard.vehicleMake} ${estimate.jobCard.vehicleModel}`,
    `Reg No: ${estimate.jobCard.registrationNo}`
  ], 120, 70);

  // Items table
  doc.autoTable({
    startY: 100,
    head: [['Type', 'Description', 'Qty', 'Unit Price', 'Amount']],
    body: estimate.items.map(item => [
      item.type,
      item.description,
      item.quantity,
      `₹${item.unitPrice.toFixed(2)}`,
      `₹${item.amount.toFixed(2)}`
    ]),
    foot: [
      ['', '', '', 'Subtotal:', `₹${estimate.subtotal.toFixed(2)}`],
      ['', '', '', `Tax (${estimate.taxRate}%):`, `₹${estimate.taxAmount.toFixed(2)}`],
      ['', '', '', 'Discount:', `₹${estimate.discountAmount.toFixed(2)}`],
      ['', '', '', 'Total:', `₹${estimate.total.toFixed(2)}`]
    ],
    theme: 'grid'
  });

  // Terms and conditions
  if (estimate.termsAndConditions) {
    doc.text('Terms and Conditions:', 20, doc.lastAutoTable.finalY + 20);
    doc.setFontSize(9);
    doc.text(estimate.termsAndConditions.split('\n'), 20, doc.lastAutoTable.finalY + 30);
  }

  return doc;
}; 