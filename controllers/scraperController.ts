import { statusLog } from '@/lib/contants';
import { getCountPlacesByLogId, searchPlaces } from '@/services/placeService';
import { scraperPlaces } from '@/services/scraperService';
import { createScrappingLog, getScrappingLogByParams, updateScrappingLog } from '@/services/scrappingLogService';

export const scraperPlaceHandler = async (query: string, maxResults: number = 200) => {
  try {
    if(!query) {
      throw new Error('Query is required');
    }

    const existLog = await getScrappingLogByParams({
      searchQuery: query,
    })

    if (!existLog || existLog.length === 0) {
      const dataLog = await createScrappingLog({
        searchQuery: query,
        status: statusLog.PENDING
      });

      const logId = dataLog.id;
      await scraperPlaces(logId, query, maxResults)

      const countPlaces = await getCountPlacesByLogId(logId)
      
      await updateScrappingLog(dataLog.id, {
        status: statusLog.COMPLETED,
        processedCount: countPlaces,
        completedAt: new Date(),
      });
    }

    const result = await searchPlaces(query)
    return result;
  } catch (error) {
    console.error('Error in scraperPlaceHandler:', error);
    throw new Error('Failed to scrape places');
  }
}