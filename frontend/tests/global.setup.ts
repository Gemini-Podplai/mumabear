import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Ensure server is running before tests
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    console.log('✅ Frontend server is ready for testing');
  } catch (error) {
    console.error('❌ Frontend server not ready:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
