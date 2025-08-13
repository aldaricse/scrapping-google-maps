import { getScrappingLogByParams } from '@/services/scrappingLogService';
import { NextResponse } from 'next/server';

export const getScrappingLogsHandler = async () => {
  try {
    const result = await getScrappingLogByParams({});
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching scrapping logs:', error);
    return NextResponse.json({ error: 'Error fetching scrapping log' }, { status: 500 });
  }
}