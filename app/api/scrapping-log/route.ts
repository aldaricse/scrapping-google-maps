import { getScrappingLogsHandler } from '@/controllers/scrappingLogController';

export async function GET() {
  return getScrappingLogsHandler();
}