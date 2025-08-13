import { useState } from 'react';
import { getPlaces } from '@/lib/api/services/placeApiService';
import { Place, PlaceFilters } from '@/types/places';

export function usePlaces(initialFilters: PlaceFilters = {}) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [filters, setFilters] = useState<PlaceFilters>(initialFilters);

  const fetchPlaces = async (newFilters?: PlaceFilters) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = newFilters || filters;
      const response = await getPlaces(currentFilters);

      setPlaces(response.places);
      setPagination(response.pagination);

      if (newFilters) {
        setFilters(currentFilters);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching places');
    } finally {
      setLoading(false);
    }
  };

  return {
    places,
    loading,
    error,
    pagination,
    filters,
    changePage: (page: number) => fetchPlaces({ ...filters, page }),
    changeFilters: (newFilters: Partial<PlaceFilters>) => {
      const updatedFilters = { ...filters, ...newFilters, page: 1 };
      fetchPlaces(updatedFilters);
    },
    refetch: () => fetchPlaces()
  };
}