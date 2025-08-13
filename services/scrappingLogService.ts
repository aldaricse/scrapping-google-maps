import { statusLog } from '@/lib/contants';
import { prisma } from '@/lib/prisma';
import { ScrappingLog } from '@/types/scrappingLog';

export const createScrappingLog = async (data: Partial<ScrappingLog>) => {
  const newLog = await prisma.scrappingLog.create({
    data: {
      searchQuery: data.searchQuery || '',
      status: data.status || statusLog.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  const safeData = {
    ...newLog,
    id: Number(newLog.id),
  }
  return safeData;
}

export const updateScrappingLog = async (id: number, data: Partial<ScrappingLog>) => {
  const updatedLog = await prisma.scrappingLog.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    }
  });

  const safeData = {
    ...updatedLog,
    id: Number(updatedLog.id),
  }
  return safeData;
}

export const getScrappingLogByParams = async (params: Partial<ScrappingLog>) => {
  const data = await prisma.scrappingLog.findMany({
    where: params
  });

  if (!data) return [];

  const safeData = data.map(log => ({
    ...log,
    id: Number(log.id),
  }));
  return safeData;
}
