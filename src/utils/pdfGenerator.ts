import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvoiceData } from '../components/admin/InvoiceGenerator';

export const generateInvoicePDF = async (invoiceData: InvoiceData): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Invoice ${invoiceData.invoiceNumber}`,
    subject: 'Invoice',
    author: invoiceData.companyInfo.name,
    creator: 'ITwala Academy Invoice Generator'
  });

  // Colors
  const primaryColor: [number, number, number] = [41, 128, 185]; // Blue
  const secondaryColor: [number, number, number] = [52, 73, 94]; // Dark gray
  const lightGray: [number, number, number] = [245, 245, 245];

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Company Logo (if provided)
  if (invoiceData.companyInfo.logo) {
    try {
      doc.addImage(invoiceData.companyInfo.logo, 'JPEG', 20, 10, 30, 20);
    } catch (error) {
      console.warn('Could not add logo:', error);
    }
  }

  // Invoice Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 120, 25);

  // Invoice Number and Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 120, 35);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Company Information
  let yPos = 60;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('From:', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.companyInfo.name, 20, yPos);
  
  yPos += 6;
  doc.text(invoiceData.companyInfo.address, 20, yPos);
  
  yPos += 6;
  doc.text(`${invoiceData.companyInfo.city}, ${invoiceData.companyInfo.zipCode}`, 20, yPos);
  
  yPos += 6;
  doc.text(invoiceData.companyInfo.country, 20, yPos);
  
  yPos += 6;
  doc.text(`Email: ${invoiceData.companyInfo.email}`, 20, yPos);
  
  yPos += 6;
  doc.text(`Phone: ${invoiceData.companyInfo.phone}`, 20, yPos);

  if (invoiceData.companyInfo.website) {
    yPos += 6;
    doc.text(`Website: ${invoiceData.companyInfo.website}`, 20, yPos);
  }

  // Client Information
  yPos = 60;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 120, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.clientInfo.name, 120, yPos);
  
  yPos += 6;
  doc.text(invoiceData.clientInfo.email, 120, yPos);
  
  yPos += 6;
  doc.text(invoiceData.clientInfo.address, 120, yPos);
  
  yPos += 6;
  doc.text(`${invoiceData.clientInfo.city}, ${invoiceData.clientInfo.zipCode}`, 120, yPos);
  
  yPos += 6;
  doc.text(invoiceData.clientInfo.country, 120, yPos);

  if (invoiceData.clientInfo.phone) {
    yPos += 6;
    doc.text(`Phone: ${invoiceData.clientInfo.phone}`, 120, yPos);
  }

  // Invoice Details
  yPos = 140;
  doc.setFillColor(...lightGray);
  doc.rect(20, yPos - 5, 170, 20, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Date:', 25, yPos + 5);
  doc.text('Due Date:', 75, yPos + 5);
  doc.text('Status:', 125, yPos + 5);

  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoiceData.issueDate).toLocaleDateString(), 25, yPos + 12);
  doc.text(new Date(invoiceData.dueDate).toLocaleDateString(), 75, yPos + 12);
  
  // Status with color
  const status = invoiceData.status.toUpperCase();
  switch (status) {
    case 'PAID':
      doc.setTextColor(46, 125, 50); // Green
      break;
    case 'OVERDUE':
      doc.setTextColor(211, 47, 47); // Red
      break;
    case 'SENT':
      doc.setTextColor(255, 152, 0); // Orange
      break;
    default:
      doc.setTextColor(97, 97, 97); // Gray
  }
  doc.text(status, 125, yPos + 12);
  doc.setTextColor(0, 0, 0); // Reset to black

  // Items Table
  const tableData = invoiceData.items.map(item => [
    item.description,
    item.quantity.toString(),
    `$${item.rate.toFixed(2)}`,
    `$${item.amount.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: yPos + 25,
    head: [['Description', 'Quantity', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 12
    },
    bodyStyles: {
      fontSize: 11
    },
    columnStyles: {
      1: { halign: 'center' }, // Quantity
      2: { halign: 'right' },  // Rate
      3: { halign: 'right' }   // Amount
    },
    margin: { left: 20, right: 20 }
  });

  // Calculate totals position
  const finalY = (doc as any).lastAutoTable.finalY + 20;

  // Totals Section
  const totalsX = 130;
  let totalsY = finalY;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, totalsY);
  doc.text(`$${invoiceData.subtotal.toFixed(2)}`, 180, totalsY, { align: 'right' });

  // Tax
  totalsY += 8;
  doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX, totalsY);
  doc.text(`$${invoiceData.tax.toFixed(2)}`, 180, totalsY, { align: 'right' });

  // Total
  totalsY += 8;
  doc.setFillColor(...primaryColor);
  doc.rect(totalsX - 5, totalsY - 5, 60, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Total:', totalsX, totalsY + 5);
  doc.text(`$${invoiceData.total.toFixed(2)}`, 180, totalsY + 5, { align: 'right' });

  // Reset colors
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  // Notes
  if (invoiceData.notes && invoiceData.notes.trim()) {
    totalsY += 25;
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, totalsY);
    
    totalsY += 8;
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(invoiceData.notes, 170);
    doc.text(splitNotes, 20, totalsY);
    totalsY += splitNotes.length * 6;
  }

  // Terms and Conditions
  if (invoiceData.terms && invoiceData.terms.trim()) {
    totalsY += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Terms and Conditions:', 20, totalsY);
    
    totalsY += 8;
    doc.setFont('helvetica', 'normal');
    const splitTerms = doc.splitTextToSize(invoiceData.terms, 170);
    doc.text(splitTerms, 20, totalsY);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, pageHeight - 10, { align: 'center' });

  return doc.output('blob');
};

export const previewInvoicePDF = async (invoiceData: InvoiceData): Promise<string> => {
  const blob = await generateInvoicePDF(invoiceData);
  return URL.createObjectURL(blob);
};
