'use server'

import { getRandomDelay } from '@/lib/utils';
import { createPlace } from './placeService';
import { Place } from '@/types/places';
import { launchBrowser } from '@/lib/puppeteer';

export const scraperPlaces = async (logId: number, query: string, maxResults: number = 100) => {
  const browser = await launchBrowser();

  const page = await browser.newPage();

  // Esperar a que la página esté lista antes de navegar
  await page.setDefaultNavigationTimeout(30000);
  await page.setDefaultTimeout(30000);

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');

  const scrapedLinks = new Set();
  try {
    await page.goto('https://www.google.com/maps', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.type('input.searchboxinput', query);
    await page.keyboard.press('Enter');
    await new Promise(res => setTimeout(res, getRandomDelay(15, 18)));

    let sameCountStreak = 0;
    let processedCount = 0;

    while (true) {
      const cards = await page.$$('[role="feed"] .Nv2PK');
      let addedNew = false;

      // Recopilar lugares primero (sin abrir páginas de detalle)
      const placesToProcess = [];

      for (const [i, card] of cards.entries()) {
        if (scrapedLinks.size >= maxResults) break;

        const place = await page.evaluate((card) => {
          const getText = (selector: any) => {
            const el = card.querySelector(selector);
            return el ? el.innerText.trim().replace("(", "").replace(")", "") : null;
          };

          const getAttr = (selector: any, attr: any) => {
            const el = card.querySelector(selector);
            return el ? el.getAttribute(attr) : null;
          };

          const data = {
            name: getText('.qBF1Pd'),
            link: getAttr('a.hfpxzc', 'href'),
            rating: getText('.MW4etd'),
            reviews: getText('.UY7F9'),
            category: getText('.W4Efsd > span > span'),
            thumbnail: getAttr('img', 'src')
          };

          return data;
        }, card);

        if (!place || scrapedLinks.has(place.link)) continue;

        scrapedLinks.add(place.link);
        placesToProcess.push(place);
        addedNew = true;
      }

      // Procesar lugares en lotes para evitar abrir demasiadas páginas
      const BATCH_SIZE = 5; // Procesar de 5 en 5

      for (let i = 0; i < placesToProcess.length; i += BATCH_SIZE) {
        const batch = placesToProcess.slice(i, i + BATCH_SIZE);

        for (const place of batch) {
          if (processedCount >= maxResults) break;

          await processPlaceDetail(logId, place, query);
          processedCount++;

          console.log(`${processedCount}/${maxResults} - ${place.name}`);

          // PAUSA MÁS LARGA entre lugares para evitar sobrecarga
          await new Promise(res => setTimeout(res, getRandomDelay(5, 7)));
        }

        if (processedCount >= maxResults) break;
      }

      console.log('Total acumulado:', scrapedLinks.size);

      if (scrapedLinks.size >= maxResults || processedCount >= maxResults) {
        console.log(`Límite máximo alcanzado: ${maxResults} resultados`);
        break;
      }

      if (sameCountStreak >= 10) break;

      await page.evaluate(() => {
        const scrollContainer = document.querySelector('div[role="feed"]');
        if (scrollContainer) scrollContainer.scrollBy(0, 2000);
      });

      await new Promise(res => setTimeout(res, getRandomDelay(10, 13)));
      sameCountStreak = addedNew ? 0 : sameCountStreak + 1;
    }

  } catch (error: any) {
    console.error('Error en scraper principal:', error.message);
  } finally {
    await browser.close();
  }

  return Array.from(scrapedLinks);
};

const processPlaceDetail = async (logId: number, place: any, query: string) => {
  const browser = await launchBrowser();

  let pageDetail = null;

  try {
    pageDetail = await browser.newPage();

    // TIMEOUTS FIJOS - NO MÁS ALEATORIOS
    await pageDetail.setDefaultTimeout(60000); // 60 segundos fijo
    await pageDetail.setDefaultNavigationTimeout(90000); // 90 segundos fijo

    // Configurar interceptación de recursos para acelerar carga
    await pageDetail.setRequestInterception(true);
    pageDetail.on('request', (req: any) => {
      const resourceType = req.resourceType();
      // Bloquear recursos innecesarios para acelerar carga
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await pageDetail.goto(place.link, {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });

    await new Promise(res => setTimeout(res, getRandomDelay(5, 8)));

    // Extraer datos de detalles
    const details = await pageDetail.evaluate(() => {
      const getAriaLabel = (selector: any, prefixToRemove = '') => {
        const el = document.querySelector(selector);
        if (!el) return null;

        let label = el.getAttribute('aria-label') || '';
        if (prefixToRemove && label.startsWith(prefixToRemove)) {
          label = label.slice(prefixToRemove.length).trim();
        }

        return label;
      };

      const getHref = (selector: any) => {
        const el = document.querySelector(selector);
        return el ? el.href : null;
      };

      return {
        address: getAriaLabel('[aria-label^="Dirección"]', 'Dirección:') || getAriaLabel('[aria-label^="Address"]', 'Address:'),
        phone: getAriaLabel('[aria-label^="Teléfono"]', 'Teléfono:') || getAriaLabel('[aria-label^="Phone"]', 'Phone:'),
        web: getHref('[aria-label^="Sitio web"]') || getHref('[aria-label^="Website"]'),
      };
    });

    const dataPlace = { ...place, ...details };

    const placeData: Place = {
      logId,
      searchCriteria: query,
      name: dataPlace.name,
      address: dataPlace.address,
      category: dataPlace.category,
      ...(!!dataPlace.rating && { rating: parseFloat(dataPlace.rating) }),
      ...(!!dataPlace.reviews && { reviews: parseInt(dataPlace.reviews) }),
      ...(!!dataPlace.thumbnail && { thumbnail: dataPlace.thumbnail }),
      ...(!!dataPlace.phone && { phone: dataPlace.phone }),
      ...(!!dataPlace.web && { web: dataPlace.web }),
      link: dataPlace.link,
    };

    await createPlace(placeData);

  } catch (error: any) {
    console.error(`❌ Error procesando ${place.name}: ${error.message}`);

    if (error.message.includes('Protocol') || error.message.includes('ProtocolError')) {
      await new Promise(res => setTimeout(res, getRandomDelay(5, 8)));
    }

  } finally {
    if (pageDetail) {
      try {
        await pageDetail.close();
      } catch (e: any) {
        console.log(`Error cerrando página de ${place.name}:`, e.message);
      }
    }
    await browser.close();
  }
};