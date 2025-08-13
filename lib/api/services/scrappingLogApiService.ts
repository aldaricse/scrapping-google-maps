import { axiosPrivate } from '../base';

export const getScrappingLogs = async () => {
  const result = await axiosPrivate.get(`/scrapping-log`);
  return result.data;
}