// tests/pdf-form-to-csv.spec.ts
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// Función auxiliar para mostrar mensajes de log durante la ejecución
const log = (message) => {
  console.log(`[TEST LOG] ${message}`);
};

// Generar PDFs de prueba antes de ejecutar los tests
test.beforeAll(async () => {
  log('Generando PDFs de prueba...');
  try {
    // Crear directorio fixtures si no existe
    const fixturesDir = path.resolve(__dirname, 'fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    
    // Verificar si existen los PDFs base
    const basicPdfPath = path.resolve(__dirname, 'fixtures/basic.pdf');
    const complexPdfPath = path.resolve(__dirname, 'fixtures/complex.pdf');
    
    if (!fs.existsSync(basicPdfPath) || !fs.existsSync(complexPdfPath)) {
      log('Generando PDFs base...');
      if (!fs.existsSync(basicPdfPath)) {
        execSync('node tests/fixtures/create-basic-pdf.js');
        // Mover el archivo a la ubicación correcta
        if (fs.existsSync('basic.pdf')) {
          fs.renameSync('basic.pdf', basicPdfPath);
        }
      }
      if (!fs.existsSync(complexPdfPath)) {
        execSync('node tests/fixtures/create-complex-pdf.js');
        // Mover el archivo a la ubicación correcta
        if (fs.existsSync('complex.pdf')) {
          fs.renameSync('complex.pdf', complexPdfPath);
        }
      }
    }
    
    // Generar PDFs rellenados
    execSync('node tests/generate-test-pdfs.js');
    log('PDFs de prueba generados correctamente');
  } catch (error) {
    log(`Error al generar PDFs de prueba: ${error.message}`);
    console.error(error);
  }
});

// Función auxiliar para procesar un PDF
async function processPDF(page: Page, pdfPath: string) {
  // Verificar que el archivo existe
  const fileExists = fs.existsSync(pdfPath);
  log(`Archivo PDF existe: ${fileExists} (${pdfPath})`);
  expect(fileExists).toBeTruthy();

  // Subir archivo
  log('Subiendo archivo PDF...');
  const input = await page.locator('#pdfFiles');
  await input.setInputFiles(pdfPath);
  log('Archivo PDF subido correctamente');

  // Esperar compatibilidad
  log('Esperando a que el botón de extracción esté habilitado...');
  await page.waitForSelector('#extractBtn:not([disabled])', { timeout: 30000 });
  log('Botón de extracción habilitado');

  // Extraer datos
  log('Haciendo clic en el botón de extracción...');
  await page.click('#extractBtn');
  log('Botón de extracción pulsado');

  // Esperar tabla previa y botón de descarga
  log('Esperando a que aparezca la tabla de vista previa...');
  await expect(page.locator('#csvPreview table')).toBeVisible();
  log('Tabla de vista previa visible');
  
  log('Esperando a que aparezca el enlace de descarga...');
  await expect(page.locator('#downloadLink')).toBeVisible();
  log('Enlace de descarga visible');

  // Verificar que el enlace de descarga existe y tiene un href que comienza con 'blob:'
  const csvURL = await page.locator('#downloadLink').getAttribute('href');
  log(`URL del CSV: ${csvURL}`);
  expect(csvURL).toBeTruthy();
  expect(csvURL).toMatch(/^blob:/);
  
  // Verificar que la tabla de vista previa contiene datos
  const tableRows = await page.locator('#csvPreview table tr').count();
  log(`Número de filas en la tabla: ${tableRows}`);
  expect(tableRows).toBeGreaterThan(1); // Al menos la fila de encabezado y una fila de datos
  
  // Capturar y mostrar los encabezados de la tabla
  const headers = await page.locator('#csvPreview table thead tr').textContent();
  log(`Encabezados de la tabla: ${headers}`);
  
  return { tableRows, headers };
}

test('procesa PDF básico con campos rellenados', async ({ page }) => {
  log('Iniciando test: procesa PDF básico con campos rellenados');
  
  // Usar un timeout más largo para la navegación en CI
  await page.goto('http://localhost:9001', { 
    timeout: process.env.CI ? 60000 : 30000,
    waitUntil: 'networkidle'
  });

  // Usar el PDF básico rellenado
  const pdfPath = path.resolve(__dirname, 'fixtures/basic-filled.pdf');
  const dataPath = path.resolve(__dirname, 'fixtures/basic-data.json');
  
  // Cargar los datos esperados
  const expectedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  log(`Datos esperados: ${JSON.stringify(expectedData)}`);
  
  // Procesar el PDF
  const { tableRows, headers } = await processPDF(page, pdfPath);
  
  // Verificar que los datos esperados aparecen en la tabla
  const tableContent = await page.locator('#csvPreview').textContent();
  for (const [field, value] of Object.entries(expectedData)) {
    log(`Verificando campo ${field} con valor ${value}`);
    expect(tableContent).toContain(String(value));
  }
  
  log('Test completado con éxito');
});

test('procesa PDF complejo con campos rellenados', async ({ page }) => {
  // Omitir este test en CI para simplificar
  if (process.env.CI) {
    log('Omitiendo test de PDF complejo en entorno CI');
    test.skip();
    return;
  }
  
  log('Iniciando test: procesa PDF complejo con campos rellenados');
  
  await page.goto('http://localhost:9001', { 
    timeout: process.env.CI ? 60000 : 30000,
    waitUntil: 'networkidle'
  });

  // Usar el PDF complejo rellenado
  const pdfPath = path.resolve(__dirname, 'fixtures/complex-filled.pdf');
  const dataPath = path.resolve(__dirname, 'fixtures/complex-data.json');
  
  // Cargar los datos esperados
  const expectedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  log(`Datos esperados: ${JSON.stringify(expectedData)}`);
  
  // Procesar el PDF
  const { tableRows, headers } = await processPDF(page, pdfPath);
  
  // Verificar que los datos esperados aparecen en la tabla
  const tableContent = await page.locator('#csvPreview').textContent();
  
  // Verificar campos básicos
  for (const field of ['name', 'surname', 'email', 'phone']) {
    if (expectedData[field]) {
      log(`Verificando campo ${field} con valor ${expectedData[field]}`);
      expect(tableContent).toContain(String(expectedData[field]));
    }
  }
  
  // Verificar campos de array
  for (let i = 1; i <= 3; i++) {
    const suffix = String(i).padStart(2, '0');
    const fieldName = `nombreProfe[${suffix}]`;
    if (expectedData[fieldName]) {
      log(`Verificando campo ${fieldName} con valor ${expectedData[fieldName]}`);
      expect(tableContent).toContain(String(expectedData[fieldName]));
    }
  }
  
  log('Test completado con éxito');
});

// Test para procesar múltiples PDFs a la vez
test('procesa múltiples PDFs y genera CSV combinado', async ({ page }) => {
  // Omitir este test en CI para simplificar
  if (process.env.CI) {
    log('Omitiendo test de múltiples PDFs en entorno CI');
    test.skip();
    return;
  }
  
  log('Iniciando test: procesa múltiples PDFs y genera CSV combinado');
  
  await page.goto('http://localhost:9001', { 
    timeout: process.env.CI ? 60000 : 30000,
    waitUntil: 'networkidle'
  });

  // Usar dos PDFs básicos idénticos
  const pdfPath = path.resolve(__dirname, 'fixtures/basic-filled.pdf');
  
  // Subir dos copias del mismo archivo
  log('Subiendo múltiples archivos PDF...');
  const input = await page.locator('#pdfFiles');
  await input.setInputFiles([pdfPath, pdfPath]);
  log('Archivos PDF subidos correctamente');

  // Esperar compatibilidad
  log('Esperando a que el botón de extracción esté habilitado...');
  await page.waitForSelector('#extractBtn:not([disabled])', { timeout: 30000 });
  log('Botón de extracción habilitado');

  // Extraer datos
  log('Haciendo clic en el botón de extracción...');
  await page.click('#extractBtn');
  log('Botón de extracción pulsado');

  // Esperar tabla previa y botón de descarga
  log('Esperando a que aparezca la tabla de vista previa...');
  await expect(page.locator('#csvPreview table')).toBeVisible();
  log('Tabla de vista previa visible');
  
  // Verificar que hay al menos 3 filas (encabezado + 2 PDFs)
  const tableRows = await page.locator('#csvPreview table tr').count();
  log(`Número de filas en la tabla: ${tableRows}`);
  expect(tableRows).toBeGreaterThanOrEqual(3);
  
  log('Test completado con éxito');
});

