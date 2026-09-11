import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

test('verificación básica de archivos', async () => {
  console.log('[TEST CI] Iniciando test básico para CI');
  
  // Verificar que los archivos principales existen
  expect(fs.existsSync('index.html')).toBeTruthy();
  
  // Verificar que existen los scripts para generar PDFs
  expect(fs.existsSync('tests/fixtures/create-basic-pdf.js')).toBeTruthy();
  expect(fs.existsSync('tests/fixtures/create-complex-pdf.js')).toBeTruthy();
  
  // Generar PDFs de prueba si no existen
  const basicPdfPath = path.resolve(__dirname, 'fixtures/basic.pdf');
  if (!fs.existsSync(basicPdfPath)) {
    console.log('[TEST CI] Generando basic.pdf...');
    execSync('node tests/fixtures/create-basic-pdf.js');
  }
  
  // Verificar que se generó correctamente
  expect(fs.existsSync(basicPdfPath)).toBeTruthy();
  
  // Verificar contenido básico del HTML
  const html = fs.readFileSync('index.html', 'utf8');
  expect(html).toContain('PDF Form to CSV');
  expect(html).toContain('<input type="file" id="pdfFiles"');
  expect(html).toContain('<button id="extractBtn"');
  
  console.log('[TEST CI] Test básico completado con éxito');
});
