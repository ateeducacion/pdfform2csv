// tests/pdf-form-to-csv.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Función auxiliar para mostrar mensajes de log durante la ejecución
const log = (message) => {
  console.log(`[TEST LOG] ${message}`);
};

test('procesa PDFs y genera CSV', async ({ page }) => {
  log('Iniciando test: procesa PDFs y genera CSV');
  
  // Usar un timeout más largo para la navegación en CI
  await page.goto('http://localhost:9001', { 
    timeout: process.env.CI ? 60000 : 30000,
    waitUntil: 'networkidle'
  });

  // Usar el archivo de muestra existente
  const pdfPath = path.resolve(__dirname, '../samples/Memoria AICLE 24_25 (1).pdf');
  
  // Verificar que el archivo existe
  const fileExists = fs.existsSync(pdfPath);
  log(`Archivo de muestra existe: ${fileExists}`);
  expect(fileExists).toBeTruthy();

  // Subir archivo
  log('Subiendo archivo PDF...');
  const input = await page.locator('#pdfFiles');
  await input.setInputFiles(pdfPath);
  log('Archivo PDF subido correctamente');

  // Esperar compatibilidad
  log('Esperando a que el botón de extracción esté habilitado...');
  await page.waitForSelector('#extractBtn:not([disabled])');
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
  
  log('Test completado con éxito');
});

// Omitir este test en CI para simplificar
test('procesa PDF de muestra existente', async ({ page }) => {
  // Omitir este test en CI
  if (process.env.CI) {
    log('Omitiendo test en entorno CI');
    test.skip();
    return;
  }
  
  log('Iniciando test: procesa PDF de muestra existente');
  await page.goto('http://localhost:9001', { 
    timeout: process.env.CI ? 60000 : 30000,
    waitUntil: 'networkidle'
  });

  // Usar el archivo de muestra existente (el mismo que el primer test)
  const pdfPath = path.resolve(__dirname, '../samples/Memoria AICLE 24_25 (1).pdf');
  
  // Verificar que el archivo existe
  const fileExists = fs.existsSync(pdfPath);
  log(`Archivo de muestra existe: ${fileExists}`);
  expect(fileExists).toBeTruthy();

  // Subir archivo
  log('Subiendo archivo PDF...');
  const input = await page.locator('#pdfFiles');
  await input.setInputFiles(pdfPath);
  log('Archivo PDF subido correctamente');

  // Esperar compatibilidad (con timeout más largo)
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
  
  // Verificar que la tabla de vista previa contiene datos
  const tableContent = await page.locator('#csvPreview').textContent();
  log('Verificando que la tabla contiene datos...');
  expect(tableContent.length).toBeGreaterThan(10);
  log(`Contenido de la tabla (primeros 100 caracteres): ${tableContent.substring(0, 100)}...`);
  
  // Capturar y mostrar los encabezados de la tabla
  const headers = await page.locator('#csvPreview table thead tr').textContent();
  log(`Encabezados de la tabla: ${headers}`);
  
  log('Test completado con éxito');
});

