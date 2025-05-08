/**
 * Script: create-basic-pdf.js
 * Description: Generates a fillable PDF form named 'basic.pdf' with the following text fields:
 *              - Name
 *              - Surname
 *              - Phone
 *              - Email
 * 
 * Usage: Run with Node.js to generate the form:
 *        node create-basic-pdf.js
 */
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

async function createFormPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  const form = pdfDoc.getForm();

  const fields = [
    { name: 'name', label: 'Name', x: 50, y: 350 },
    { name: 'surname', label: 'Surname', x: 50, y: 300 },
    { name: 'phone', label: 'Phone', x: 50, y: 250 },
    { name: 'email', label: 'Email', x: 50, y: 200 },
  ];

  for (const field of fields) {
    page.drawText(`${field.label}:`, {
      x: field.x,
      y: field.y + 5,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const textField = form.createTextField(field.name);
    textField.enableMultiline(); // opcional, puedes quitarlo
    textField.addToPage(page, {
      x: field.x + 100,
      y: field.y,
      width: 200,
      height: 20,
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('basic.pdf', pdfBytes);
}

createFormPdf();

