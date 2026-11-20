/**
 * Script: generate-test-pdfs.js
 * Description: Genera y rellena PDFs de prueba para los tests
 */
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');

// Función para generar un texto aleatorio
function randomText(prefix = '') {
  return `${prefix}_${Math.random().toString(36).substring(2, 8)}`;
}

async function generateTestPDFs() {
  // Asegurarse de que existen los PDFs base
  const basicPdfPath = path.resolve(__dirname, 'fixtures/basic.pdf');
  const complexPdfPath = path.resolve(__dirname, 'fixtures/complex.pdf');
  
  // Crear directorios si no existen
  const fixturesDir = path.resolve(__dirname, 'fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  
  if (!fs.existsSync(basicPdfPath)) {
    console.error('Error: No se encuentra basic.pdf. Ejecuta primero create-basic-pdf.js');
    process.exit(1);
  }
  
  if (!fs.existsSync(complexPdfPath)) {
    console.error('Error: No se encuentra complex.pdf. Ejecuta primero create-complex-pdf.js');
    process.exit(1);
  }
  
  // Generar basic-filled.pdf
  const basicPdfBytes = fs.readFileSync(basicPdfPath);
  const basicPdfDoc = await PDFDocument.load(basicPdfBytes);
  const basicForm = basicPdfDoc.getForm();
  
  // Rellenar campos con datos aleatorios
  const basicData = {
    name: randomText('Nombre'),
    surname: randomText('Apellido'),
    phone: `6${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: `${randomText('usuario')}@example.com`
  };
  
  // Guardar los datos para verificación posterior
  fs.writeFileSync(
    path.resolve(__dirname, 'fixtures/basic-data.json'), 
    JSON.stringify(basicData, null, 2)
  );
  
  // Rellenar el formulario
  Object.entries(basicData).forEach(([field, value]) => {
    basicForm.getTextField(field).setText(value);
  });
  
  // Guardar el PDF rellenado
  const filledBasicPdfBytes = await basicPdfDoc.save();
  fs.writeFileSync(
    path.resolve(__dirname, 'fixtures/basic-filled.pdf'), 
    filledBasicPdfBytes
  );
  
  // Generar complex-filled.pdf
  const complexPdfBytes = fs.readFileSync(complexPdfPath);
  const complexPdfDoc = await PDFDocument.load(complexPdfBytes);
  const complexForm = complexPdfDoc.getForm();
  
  // Rellenar campos con datos aleatorios
  const complexData = {
    name: randomText('Nombre'),
    surname: randomText('Apellido'),
    phone: `6${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: `${randomText('usuario')}@example.com`,
    acceptTerms: true,
    subscribeNewsletter: Math.random() > 0.5,
    isStudent: Math.random() > 0.5,
    favoriteFruit: ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'][Math.floor(Math.random() * 5)]
  };
  
  // Rellenar campos de array
  for (let i = 1; i <= 3; i++) { // Solo rellenamos 3 de los 5 disponibles
    const suffix = String(i).padStart(2, '0');
    complexData[`nombreProfe[${suffix}]`] = randomText(`Profesor${i}`);
    complexData[`emailProfe[${suffix}]`] = `profesor${i}@example.com`;
  }
  
  // Guardar los datos para verificación posterior
  fs.writeFileSync(
    path.resolve(__dirname, 'fixtures/complex-data.json'), 
    JSON.stringify(complexData, null, 2)
  );
  
  // Rellenar el formulario
  Object.entries(complexData).forEach(([field, value]) => {
    if (field === 'acceptTerms' || field === 'subscribeNewsletter') {
      if (value) {
        complexForm.getCheckBox(field).check();
      } else {
        complexForm.getCheckBox(field).uncheck();
      }
    } else if (field === 'isStudent') {
      if (value === true || value === 'Yes') {
        complexForm.getCheckBox(field).check();
      } else {
        complexForm.getCheckBox(field).uncheck();
      }
    } else if (field === 'favoriteFruit') {
      complexForm.getDropdown(field).select(value);
    } else if (field.includes('[')) {
      try {
        complexForm.getTextField(field).setText(value);
      } catch (e) {
        console.warn(`Campo no encontrado: ${field}`);
      }
    } else {
      try {
        complexForm.getTextField(field).setText(value);
      } catch (e) {
        console.warn(`Campo no encontrado: ${field}`);
      }
    }
  });
  
  // Guardar el PDF rellenado
  const filledComplexPdfBytes = await complexPdfDoc.save();
  fs.writeFileSync(
    path.resolve(__dirname, 'fixtures/complex-filled.pdf'), 
    filledComplexPdfBytes
  );
  
  console.log('PDFs de prueba generados correctamente:');
  console.log('- tests/fixtures/basic-filled.pdf');
  console.log('- tests/fixtures/complex-filled.pdf');
}

generateTestPDFs().catch(console.error);
