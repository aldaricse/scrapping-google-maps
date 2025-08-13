import { NextRequest, NextResponse } from 'next/server';
import { scraperPlaceHandler } from '@/controllers/scraperController';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    if(!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }
    const result = await scraperPlaceHandler(query);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error scraper place:', error);
    return NextResponse.json({ error: 'Error scraper place' }, { status: 500 });
  }
}