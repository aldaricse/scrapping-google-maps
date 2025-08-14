import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const launchBrowser = async () => {
  const isDev = process.env.NODE_ENV === 'development'

  let executablePath: string;
  if (isDev) {
    // Usa Puppeteer completo en desarrollo
    const puppeteer = await import('puppeteer');
    executablePath = puppeteer.executablePath();
  } else {
    // Usa Chromium optimizado en serverless
    executablePath = await chromium.executablePath();
  }

  const browser = await puppeteerCore.launch({
    headless: "shell",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath,
  });

  return browser;
};
