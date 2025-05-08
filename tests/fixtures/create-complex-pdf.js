/**
 * Script: create-complex-pdf.js
 * Description: Generates a fillable PDF form named 'complex.pdf' including:
 *              - Text fields: name, surname, phone, email
 *              - Checkboxes: acceptTerms, subscribeNewsletter
 *              - Radio buttons group: isStudent (Yes / No)
 *              - Dropdown list: favoriteFruit
 *              - Repeated fields: nameProfe[01-05], emailProfe[01-05]
 * 
 * Usage: Run with Node.js to generate the form:
 *        node create-complex-pdf.js
 */

const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

async function createComplexFormPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const form = pdfDoc.getForm();

  let y = 750;
  const line = () => { y -= 40; };

  // Helper to draw label
  function label(txt, x = 50, yOffset = 0) {
    page.drawText(txt, { x, y: y + yOffset, size: 12, color: rgb(0, 0, 0) });
  }

  // Text Fields
  const textFields = ['name', 'surname', 'phone', 'email'];
  textFields.forEach((name) => {
    label(`${name.charAt(0).toUpperCase() + name.slice(1)}:`);
    const tf = form.createTextField(name);
    tf.addToPage(page, { x: 150, y: y, width: 250, height: 20 });
    line();
  });

  // Checkboxes
  label('Accept Terms:');
  const cb1 = form.createCheckBox('acceptTerms');
  cb1.addToPage(page, { x: 150, y: y, width: 15, height: 15 });
  line();

  label('Subscribe to Newsletter:');
  const cb2 = form.createCheckBox('subscribeNewsletter');
  cb2.addToPage(page, { x: 200, y: y, width: 15, height: 15 });
  line();

  // Radio Buttons (Yes / No)
  label('Are you a student?');
  const radioGroup = form.createRadioGroup('isStudent');
  radioGroup.addOptionToPage('Yes', page, { x: 200, y: y, width: 15, height: 15 });
  label('Yes', 220);
  radioGroup.addOptionToPage('No', page, { x: 300, y: y, width: 15, height: 15 });
  label('No', 320);
  line();

  // Dropdown (Frutas)
  label('Favorite Fruit:');
  const dd = form.createDropdown('favoriteFruit');
  dd.addOptions(['Apple', 'Banana', 'Orange', 'Mango', 'Grapes']);
  dd.select('Apple');
  dd.addToPage(page, { x: 150, y: y, width: 200, height: 20 });
  line();

  // Campos repetidos: nombreProfe[01] a [05], emailProfe[01] a [05]
  for (let i = 1; i <= 5; i++) {
    const suffix = String(i).padStart(2, '0');
    label(`Nombre Profe ${suffix}:`);
    const nameField = form.createTextField(`nombreProfe[${suffix}]`);
    nameField.addToPage(page, { x: 200, y: y, width: 250, height: 20 });
    line();

    label(`Email Profe ${suffix}:`);
    const emailField = form.createTextField(`emailProfe[${suffix}]`);
    emailField.addToPage(page, { x: 200, y: y, width: 250, height: 20 });
    line();
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('complex.pdf', pdfBytes);
}

createComplexFormPdf();
