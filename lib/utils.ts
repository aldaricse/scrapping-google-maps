import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRandomDelay = (minSeconds: number, maxSeconds: number) => {
  const min = minSeconds * 1000;
  const max = maxSeconds * 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export const convertArrayOfObjectsToCSV = (array: any[]) => {
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(array[0]);

  let result = keys.join(columnDelimiter) + lineDelimiter;

  array.forEach((item) => {
    keys.forEach((key, index) => {
      if (index > 0) result += columnDelimiter;

      let fieldValue = item[key];

      if (typeof fieldValue === "string") {
        fieldValue = fieldValue.replace(/#/g, "");

        if (fieldValue.includes('"')) {
          fieldValue = fieldValue.replace(/"/g, '""');
          fieldValue = `"${fieldValue}"`;
        } else if (
          fieldValue.includes(columnDelimiter) ||
          fieldValue.includes(lineDelimiter)
        ) {
          fieldValue = `"${fieldValue}"`;
        }
      }

      result += fieldValue;
    });
    result += lineDelimiter;
  });
  return result;
};

export const downloadCSV = (array: any[]) => {
  const link = document.createElement("a");
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const encodedUri = encodeURI(`data:text/csv;charset=utf-8,\ufeff${csv}`);

  const filename = "export.csv";

  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
