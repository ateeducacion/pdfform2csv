import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false, // Ejecutar tests secuencialmente para mejor visibilidad
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Usar un solo worker para mejor visibilidad de logs
  reporter: [['html'], ['list']], // Añadir reporter de lista para ver resultados en consola
  use: {
    baseURL: 'http://localhost:9001',
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
    // Mostrar más información durante la ejecución
    actionTimeout: 15000,
    navigationTimeout: 15000,
    // Habilitar logs del navegador
    logger: {
      isEnabled: (name, severity) => true,
      log: (name, severity, message, args) => console.log(`${name} ${severity}: ${message}`)
    }
  },
});
