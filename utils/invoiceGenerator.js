const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = (invoiceData, filePath) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Housing Society Invoice', { align: 'center' });

  doc.moveDown();
  doc.fontSize(12).text(`Invoice ID: ${invoiceData._id}`);
  doc.text(`Flat: ${invoiceData.flatNumber}`);
  doc.text(`Name: ${invoiceData.userName}`);
  doc.text(`Amount: ₹${invoiceData.amount}`);
  doc.text(`Due Date: ${invoiceData.dueDate}`);
  doc.text(`Generated On: ${new Date().toLocaleDateString()}`);

  doc.end();
};

module.exports = generateInvoice;
