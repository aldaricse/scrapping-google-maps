import { Prisma } from '@/lib/generated/prisma';
import { prisma } from '@/lib/prisma';
import { Place, PlaceFilters } from '@/types/places';

export const createPlace = async (data: Place) => {
  const newPlace = await prisma.place.create({
    data: {
      logId: data.logId,
      searchCriteria: data.searchCriteria,
      name: data.name,
      address: data.address,
      category: data.category,
      rating: data.rating ? parseFloat(data.rating.toString()) : null,
      reviews: data.reviews ? parseInt(data.reviews.toString()) : null,
      thumbnail: data.thumbnail,
      phone: data.phone,
      web: data.web,
      link: data.link
    }
  })

  const safePlace = {
    ...newPlace,
    id: Number(newPlace.id),
  }
  return safePlace;
}

export const getPlaces = async (filters: PlaceFilters = {}) => {
  const { page = 1, limit = 10, category, minRating, searchCriteria } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.PlaceWhereInput = {};

  if (category) {
    where.category = category;
  }

  if (minRating) {
    where.rating = { gte: minRating };
  }

  if (searchCriteria) {
    where.OR = [
      { name: { contains: searchCriteria, mode: 'insensitive' } },
      { searchCriteria: { contains: searchCriteria, mode: 'insensitive' } }
    ];
  }

  const [places, total] = await Promise.all([
    prisma.place.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' }
    }),
    prisma.place.count({ where })
  ]);

  const placesFormatted = places.map(place => ({
    ...place,
    rating: place.rating ? parseFloat(place.rating.toString()) : null,
    logId: Number(place.logId),
    id: Number(place.id),
  }));

  return {
    places: placesFormatted,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export const searchPlaces = async (query: string) => {
  const places = await prisma.place.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { searchCriteria: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  const placesFormatted = places.map(place => ({
    ...place,
    rating: place.rating ? parseFloat(place.rating.toString()) : null,
    logId: Number(place.logId),
    id: Number(place.id),
  }));

  return placesFormatted;
}

export const getPlaceById = async (id: number) => {
  const place = await prisma.place.findUnique({
    where: { id }
  });

  if (!place) {
    throw new Error('Place not found');
  }
  const safePlace = {
    ...place,
    id: place.id.toString(),
  }
  return safePlace;
}

export const getCountPlacesByLogId = async (logId: number) => {
  const count = await prisma.place.count({
    where: { logId }
  });

  return count;
}