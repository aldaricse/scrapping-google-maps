import { Place } from "@/types/places";
import { axiosPrivate } from "../base";

export const scraperPlaces = async (query: string): Promise<Place[]> => {
  const result = await axiosPrivate.get(`/scraper?query=${encodeURIComponent(query)}`);
  return result.data;
}