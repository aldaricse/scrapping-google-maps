import { NextRequest, NextResponse } from 'next/server';
import { createPlace, getPlaces } from '@/services/placeService';
import { Place } from '@/types/places';
import { log } from 'console';

export const getPlacesHandler = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      category: searchParams.get('category') || undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      searchCriteria: searchParams.get('searchCriteria') || undefined
    };

    const result = await getPlaces(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.log('Error fetching places:', error);
    return NextResponse.json({ error: 'Error fetching places' }, { status: 500 });
  }
}

export const createPlaceHandler = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const result = await createPlace(body as Place);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating place' }, { status: 400 });
  }
}