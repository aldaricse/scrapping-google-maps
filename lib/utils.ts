import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Place } from "@/types/places"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadCSV(places: Place[]) {
  if (!places || places.length === 0) {
    console.warn('No places data to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Nombre',
    'Dirección', 
    'Teléfono',
    'Sitio Web',
    'Categoría',
    'Calificación',
    'Reseñas',
    'Fecha de Extracción'
  ];

  // Convert places data to CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...places.map(place => [
      escapeCSVField(place.name || ''),
      escapeCSVField(place.address || ''),
      escapeCSVField(place.phone || ''),
      escapeCSVField(place.web || ''),
      escapeCSVField(place.category || ''),
      place.rating || '',
      place.reviews || '',
      place.createdAt ? new Date(place.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
    ].join(','))
  ];

  // Create CSV content
  const csvContent = csvRows.join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `google-maps-places-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Helper function to escape CSV fields that contain commas, quotes, or newlines
function escapeCSVField(field: string): string {
  if (typeof field !== 'string') {
    return String(field || '');
  }
  
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  
  return field;
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
  }
  
  return phone; // Return original if can't format
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}