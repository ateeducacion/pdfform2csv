import { test, expect } from '@playwright/test';

test('verificación básica de la página', async ({ page }) => {
  console.log('[TEST CI] Iniciando test básico para CI');
  
  // Navegar a la página
  await page.goto('http://localhost:9001', { 
    timeout: 60000,
    waitUntil: 'networkidle'
  });
  
  // Verificar que los elementos principales existen
  await expect(page.locator('h1')).toContainText('PDF Form to CSV');
  await expect(page.locator('#pdfFiles')).toBeVisible();
  await expect(page.locator('#extractBtn')).toBeVisible();
  
  console.log('[TEST CI] Test básico completado con éxito');
});
