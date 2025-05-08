import { test, expect } from '@playwright/test';
import fs from 'fs';

test('verificación básica de archivos', async () => {
  console.log('[TEST CI] Iniciando test básico para CI');
  
  // Verificar que los archivos principales existen
  expect(fs.existsSync('index.html')).toBeTruthy();
  expect(fs.existsSync('samples/Memoria AICLE 24_25 (1).pdf')).toBeTruthy();
  
  // Verificar contenido básico del HTML
  const html = fs.readFileSync('index.html', 'utf8');
  expect(html).toContain('PDF Form to CSV');
  expect(html).toContain('<input type="file" id="pdfFiles"');
  expect(html).toContain('<button id="extractBtn"');
  
  console.log('[TEST CI] Test básico completado con éxito');
});
