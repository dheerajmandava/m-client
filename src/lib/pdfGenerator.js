import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generateEstimatePDF = (estimate, shopDetails) => {
  // Validate required data
  if (!estimate || !shopDetails) {
    throw new Error('Missing required data for PDF generation');
  }

  // Validate shop details
  if (!shopDetails.name || !shopDetails.address || !shopDetails.phone) {
    throw new Error('Missing required shop details');
  }

  // Validate estimate data
  if (!estimate.jobCard) {
    throw new Error('Missing job card details in estimate');
  }

  // Create PDF with slightly larger page size for margins
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  try {
    // Add shop details
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(shopDetails.name, 20, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text([
      shopDetails.address,
      `Phone: ${shopDetails.phone}`,
      `Email: ${shopDetails.email || 'N/A'}`,
      `GST: ${shopDetails.gstNumber || 'N/A'}`
    ], 20, 30);

    // Estimate details
    doc.setFontSize(16);
    doc.text(`Estimate: ${estimate.estimateNumber}`, 20, 60);
    
    doc.setFontSize(10);
    doc.text([
      `Date: ${format(new Date(estimate.createdAt), 'PPP')}`,
      `Valid Until: ${estimate.validUntil ? format(new Date(estimate.validUntil), 'PPP') : 'N/A'}`,
      `Status: ${estimate.status}`
    ], 20, 70);

    // Customer details in a clean box
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(120, 65, 70, 30, 3, 3, 'FD');
    doc.text([
      'Bill To:',
      estimate.jobCard.customerName,
      `Vehicle: ${estimate.jobCard.vehicleMake} ${estimate.jobCard.vehicleModel}`,
      `Reg No: ${estimate.jobCard.registrationNo}`
    ], 125, 72);

    // Professional items table with adjusted spacing
    doc.autoTable({
      startY: 100,
      margin: { right: 15 },
      head: [['Type', 'Description', 'Qty', 'Price', 'Amount', 'Tax', 'Tax Amt']],
      body: estimate.items.map(item => {
        const amount = item.quantity * item.unitPrice;
        const taxRate = item.type === 'PARTS_12' ? 12 : 
                       item.type === 'PARTS_28' ? 28 : 18;
        const taxAmount = (amount * taxRate) / 100;
        
        return [
          item.type,
          item.description,
          item.quantity,
          `₹${item.unitPrice.toFixed(2)}`,
          `₹${amount.toFixed(2)}`,
          `${taxRate}%`,
          `₹${taxAmount.toFixed(2)}`
        ];
      }),
      foot: [[{
        content: [
          `  Subtotal   : ₹${estimate.subtotal.toFixed(2)}`,
          `Tax Amount   : ₹${estimate.taxAmount.toFixed(2)}`,
          estimate.discountAmount > 0 ? `Discount     : -₹${estimate.discountAmount.toFixed(2)}` : '',
          `     Total   : ₹${estimate.total.toFixed(2)}`
        ].filter(Boolean).join('\n'),
        colSpan: 7,
        styles: {
          halign: 'right',
          fontSize: 9,
          cellPadding: [5, 30, 5, 0],
          lineHeight: 1.3,
          font: 'helvetica',
          textColor: [80, 80, 80]
        }
      }]],
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [240, 240, 240],
        lineWidth: 0.1,
        halign: 'center'
      },
      headStyles: {
        fillColor: [250, 250, 250],
        textColor: [0, 0, 0],
        fontSize: 9,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 'auto', halign: 'left' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 22 },
        4: { cellWidth: 22 },
        5: { cellWidth: 15 },
        6: { cellWidth: 22 }
      }
    });

    // Add terms and footer
    const finalY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(10);
    doc.text('Terms & Conditions:', 20, finalY);
    doc.setFontSize(9);
    doc.text(estimate.termsAndConditions || 'Standard terms and conditions apply', 20, finalY + 5);

    return doc;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + error.message);
  }
}; 