import { PlaceFilters } from '@/types/places';
import { axiosPrivate } from '../base';
import { buildQueryString } from '@/lib/utils';

export const getPlaces = async (filters: PlaceFilters = {}) => {
  const queryString = buildQueryString(filters);
  const result = await axiosPrivate.get(`/places${queryString}`);
  return result.data;
}