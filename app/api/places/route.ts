import { NextRequest } from 'next/server';
import { createPlaceHandler, getPlacesHandler } from '@/controllers/placeController';

export async function GET(request: NextRequest) {
  return getPlacesHandler(request);
}

export async function POST(request: NextRequest) {
  return createPlaceHandler(request);
}