import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateEstimatePDF(data) {
  try {
    const doc = new jsPDF();
    
    // Add shop details
    doc.setFontSize(20);
    doc.text(data.shop.name, 15, 20);
    
    doc.setFontSize(10);
    doc.text(data.shop.address, 15, 30);
    doc.text(`Phone: ${data.shop.phone}`, 15, 35);
    doc.text(`Email: ${data.shop.email}`, 15, 40);
    if (data.shop.gst) {
      doc.text(`GST: ${data.shop.gst}`, 15, 45);
    }

    // Add estimate details
    doc.setFontSize(14);
    doc.text(`Estimate: ${data.estimateNumber}`, 15, 60);
    
    // Add job details
    doc.setFontSize(10);
    doc.text(`Job Number: ${data.jobCard.jobNumber}`, 15, 70);
    doc.text(`Customer: ${data.jobCard.customerName}`, 15, 75);
    doc.text(`Vehicle: ${data.jobCard.vehicleMake} ${data.jobCard.vehicleModel}`, 15, 80);
    doc.text(`Registration: ${data.jobCard.registrationNo}`, 15, 85);

    // Add items table
    const tableData = data.items.map(item => [
      item.type,
      item.description,
      item.quantity,
      `₹${item.unitPrice.toFixed(2)}`,
      `₹${item.amount.toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 95,
      head: [['Type', 'Description', 'Qty', 'Unit Price', 'Amount']],
      body: tableData,
    });

    // Add summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ₹${(data.subtotal || 0).toFixed(2)}`, 140, finalY);
    doc.text(`Tax: ₹${(data.taxAmount || 0).toFixed(2)}`, 140, finalY + 5);
    if (data.discountAmount > 0) {
      doc.text(`Discount: ₹${(data.discountAmount || 0).toFixed(2)}`, 140, finalY + 10);
    }
    doc.setFontSize(12);
    doc.text(`Total: ₹${(data.total || 0).toFixed(2)}`, 140, finalY + 15);

    return doc;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error('Failed to generate PDF');
  }
} 