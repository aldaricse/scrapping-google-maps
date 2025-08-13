"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  Star,
  MapPin,
  Phone,
  Globe,
  Users,
  Award,
  Target,
  PieChart,
  X,
  Download,
} from "lucide-react"
import { Place } from "@/types/places"

interface StatisticsModalProps {
  businesses: Place[]
  searchTerm: string
  totalResults: number
}

export function StatisticsModal({
  businesses,
  searchTerm,
  totalResults,
}: StatisticsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "ratings" | "categories" | "locations">("overview")

  const statistics = useMemo(() => {
    if (businesses.length === 0) return null

    // Estadísticas básicas
    const totalReviews = businesses.reduce((sum, b) => sum + (b.reviews ?? 0), 0)
    const avgRating = businesses.reduce((sum, b) => sum + (b.rating || 0), 0) / businesses.length
    const businessesWithPhone = businesses.filter((b) => b.phone).length
    const businessesWithweb = businesses.filter((b) => b.web).length

    // Distribución por categorías
    const categoryStats = businesses.reduce(
      (acc, business) => {
        acc[business.category] = (acc[business.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Distribución por calificaciones
    const ratingDistribution = {
      "5 estrellas": businesses.filter((b) => !!b.rating && b.rating >= 4.5).length,
      "4-4.5 estrellas": businesses.filter((b) => !!b.rating && b.rating >= 4 && b.rating < 4.5).length,
      "3-4 estrellas": businesses.filter((b) => !!b.rating && b.rating >= 3 && b.rating < 4).length,
      "Menos de 3": businesses.filter((b) => !!b.rating && b.rating < 3).length,
    }

    // Top negocios por reseñas
    const topByReviews = [...businesses].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)).slice(0, 5)

    // Top negocios por calificación
    const topByRating = [...businesses].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5)

    // Análisis de ubicaciones (por zona/distrito)
    const locationStats = businesses.reduce(
      (acc, business) => {
        // Extraer zona de la dirección (simplificado)
        const addressParts = business.address?.split(",")
        const zone = (addressParts && addressParts[addressParts.length - 2]?.trim()) || "Zona no especificada"
        acc[zone] = (acc[zone] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalReviews,
      avgRating,
      businessesWithPhone,
      businessesWithweb,
      categoryStats,
      ratingDistribution,
      topByReviews,
      topByRating,
      locationStats,
    }
  }, [businesses])

  const exportStatistics = () => {
    const statsData = {
      searchInfo: {
        searchTerm,
        location,
        totalResults,
        scrapedAt: new Date().toISOString(),
      },
      summary: {
        totalBusinesses: businesses.length,
        averageRating: Number(statistics?.avgRating.toFixed(1)),
        totalReviews: statistics?.totalReviews,
        businessesWithPhone: statistics?.businessesWithPhone,
        businessesWithweb: statistics?.businessesWithweb,
      },
      distributions: {
        categories: statistics?.categoryStats,
        ratings: statistics?.ratingDistribution,
        locations: statistics?.locationStats,
      },
      topBusinesses: {
        byReviews: statistics?.topByReviews.map((b) => ({
          name: b.name,
          reviews: b.reviews,
          rating: b.rating,
        })),
        byRating: statistics?.topByRating.map((b) => ({
          name: b.name,
          rating: b.rating,
          reviews: b.reviews,
        })),
      },
    }

    const dataStr = JSON.stringify(statsData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `scraping-statistics-${searchTerm}-${location}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const getPercentage = (value: number, total: number) => Math.round((value / total) * 100)

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Estadísticas de Scraping</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Análisis de {totalResults} resultados para "{searchTerm}"
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportStatistics}
            className="bg-transparent dark:border-gray-600 dark:text-gray-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-auto">
        <div className="flex space-x-8 px-6">
          {[
            { id: "overview", label: "Resumen", icon: BarChart3 },
            { id: "ratings", label: "Calificaciones", icon: Star },
            { id: "categories", label: "Categorías", icon: Target },
            { id: "locations", label: "Ubicaciones", icon: MapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }
                `}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(95vh-160px)]">
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Negocios</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{businesses.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating Promedio</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {statistics?.avgRating.toFixed(1)}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reseñas</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {statistics?.totalReviews.toLocaleString()}
                        </p>
                      </div>
                      <Award className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Con Sitio Web</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {getPercentage(statistics?.businessesWithweb || 0, businesses.length)}%
                        </p>
                      </div>
                      <Globe className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Información de contacto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Información de Contacto Disponible
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Con Teléfono</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {statistics?.businessesWithPhone} de {businesses.length}
                      </span>
                    </div>
                    <Progress
                      value={getPercentage(statistics?.businessesWithPhone || 0, businesses.length)}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Con Sitio Web</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {statistics?.businessesWithweb} de {businesses.length}
                      </span>
                    </div>
                    <Progress
                      value={getPercentage(statistics?.businessesWithweb || 0, businesses.length)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Top negocios */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top por Reseñas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {statistics?.topByReviews.map((business, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {business.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">{business.rating}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {business.reviews} reseñas
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Top por Calificación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {statistics?.topByRating.map((business, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {business.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{business.reviews} reseñas</p>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {business.rating} ⭐
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "ratings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Distribución de Calificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statistics && Object.entries(statistics.ratingDistribution).map(([range, count]) => (
                    <div key={range} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{range}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {count} negocios ({getPercentage(count, businesses.length)}%)
                        </span>
                      </div>
                      <Progress value={getPercentage(count, businesses.length)} className="h-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Análisis de Calidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistics?.ratingDistribution["5 estrellas"]}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">Excelente (4.5+)</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {statistics?.ratingDistribution["4-4.5 estrellas"]}
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">Muy Bueno (4-4.5)</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {statistics?.ratingDistribution["Menos de 3"]}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">Necesita Mejora (&lt;3)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Distribución por Categorías
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statistics && Object.entries(statistics.categoryStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {count} negocios ({getPercentage(count, businesses.length)}%)
                          </span>
                        </div>
                        <Progress value={getPercentage(count, businesses.length)} className="h-3" />
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "locations" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Distribución Geográfica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statistics && Object.entries(statistics.locationStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([zone, count]) => (
                      <div key={zone} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{zone}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {count} negocios ({getPercentage(count, businesses.length)}%)
                          </span>
                        </div>
                        <Progress value={getPercentage(count, businesses.length)} className="h-3" />
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Concentración por Zona</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {statistics && Object.entries(statistics.locationStats)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 6)
                      .map(([zone, count]) => (
                        <div key={zone} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{zone}</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{count}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getPercentage(count, businesses.length)}% del total
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}