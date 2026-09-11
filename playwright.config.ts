import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: process.env.CI ? 60000 : 30000, // Timeout más largo en CI
  expect: {
    timeout: process.env.CI ? 10000 : 5000
  },
  fullyParallel: false, // Ejecutar tests secuencialmente para mejor visibilidad
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Usar un solo worker para mejor visibilidad de logs
  reporter: process.env.CI ? 'list' : [['html'], ['list']], // Simplificar reporter en CI
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
