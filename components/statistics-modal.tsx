import React from 'react';
import { Place } from '@/types/places';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Phone, Globe } from 'lucide-react';

interface StatisticsModalProps {
  businesses: Place[];
  searchTerm: string;
  totalResults: number;
}

export function StatisticsModal({ businesses, searchTerm, totalResults }: StatisticsModalProps) {
  const avgRating = businesses.reduce((sum, place) => sum + (place.rating || 0), 0) / businesses.length;
  const totalReviews = businesses.reduce((sum, place) => sum + (place.reviews || 0), 0);
  const businessesWithPhone = businesses.filter(b => b.phone).length;
  const businessesWithWebsite = businesses.filter(b => b.web).length;
  
  const categories = businesses.reduce((acc, place) => {
    acc[place.category] = (acc[place.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Resultados para: "{searchTerm}"
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Se encontraron {totalResults} resultados
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalResults}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3" />
              Negocios
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
              {avgRating.toFixed(1)}
              <Star className="h-4 w-4 fill-yellow-400" />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Calificación promedio
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalReviews.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total reseñas
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{businessesWithPhone}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
              <Phone className="h-3 w-3" />
              Con teléfono
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 5 Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-blue-600">{businessesWithWebsite}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
              <Globe className="h-3 w-3" />
              Con sitio web
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-orange-600">
              {Math.round((businessesWithPhone / totalResults) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Con contacto
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}