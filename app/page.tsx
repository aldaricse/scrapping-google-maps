"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Loader2, Phone, Globe, ExternalLink, Download, Eye } from "lucide-react"
import { scraperPlaces } from "@/lib/api/services/scraperApiService"
import { usePlaces } from "@/hooks/use-places"
import { Pagination } from "@/components/pagination"
import { StarRating } from "@/components/start-rating"
import { useCustomModal } from "@/hooks/use-custom-modal"
import { CustomModal } from "@/components/custom-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { StatisticsModal } from "@/components/statistics-modal"
import { Place } from "@/types/places"
import { SearchAutocomplete } from "@/components/search-autocomplete"
import { getScrappingLogs } from "@/lib/api/services/scrappingLogApiService"
import { ScrappingLog } from "@/types/scrappingLog"
import { downloadCSV } from "@/lib/utils"

export default function GoogleMapsScrapingApp() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { places, changeFilters, loading, pagination, changePage, filters } = usePlaces()
  const { isOpen, config, openModal, closeModal } = useCustomModal()
  const [allPlaces, setAllPlaces] = useState<Place[]>([])
  const [scrappingLogsData, setScrappingLogsData] = useState([])

  useEffect(() => {
    let intervalId: any;

    if (isLoading) {
      intervalId = setInterval(() => {
        changeFilters({
          searchCriteria: searchTerm,
          page: filters.page,
          limit: 10
        });
      }, 20000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoading]);


  const fetchScrapingLogs = async () => {
    try {
      const logs = await getScrappingLogs();
      setScrappingLogsData(logs);
    } catch (error) {
      console.error("Error fetching scrapping logs:", error);
    }
  }

  useEffect(() => {
    fetchScrapingLogs()
  }, [])

  const handleScrape = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!searchTerm) return

    setIsLoading(true)

    try {
      changeFilters({
        searchCriteria: searchTerm,
        page: filters.page,
        limit: 10
      });

      const placesData = await scraperPlaces(searchTerm);
      setAllPlaces(placesData);

      if (placesData && placesData.length > 0) handleOpenStatistics(placesData);

      fetchScrapingLogs();

    } catch (err) {
      console.error("Error scraping places:", err);
    } finally {
      changeFilters({
        searchCriteria: searchTerm,
        page: filters.page,
        limit: 10
      });
      setIsLoading(false);
    }
  }

  const handleOpenStatistics = (placesData: Place[]) => {
    openModal({
      title: "Estadísticas de Scraping",
      content: (
        <StatisticsModal
          businesses={placesData}
          searchTerm={searchTerm}
          totalResults={placesData.length}
        />
      ),
      showCloseButton: true,
      closeOnOverlayClick: true,
      size: "lg"
    });
  }

  const exportData = () => {
    downloadCSV(allPlaces);
  }

  const handleViewStatistics = () => {
    handleOpenStatistics(allPlaces);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center relative">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <MapPin className="h-8 w-8 text-red-500" />
            </div>
            {/* Theme Toggle */}
            <div className="absolute top-0 right-0">
              <ThemeToggle />
            </div>
          </div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100">Google Maps Scraper</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Extrae información detallada de negocios locales desde Google Maps
          </p>
        </div>

        {/* Search Form */}
        <Card className="border-0 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-3">
              <SearchAutocomplete
                value={searchTerm}
                onChange={setSearchTerm}
                disabled={isLoading}
                placeholder="¿Qué buscas? (ej: restaurantes san borja)"
                data={scrappingLogsData.map((log: ScrappingLog) => log.searchQuery)}
                className="border-gray-200 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 transition-colors"
              />
              <Button
                onClick={handleScrape}
                disabled={searchTerm.length < 9 || isLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        {places.length > 0 && (
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Resultados encontrados: {pagination.total}</h2>
            </div>
            {
              allPlaces && allPlaces.length > 0 &&
              <div className="flex items-center gap-2">
                <Button onClick={handleViewStatistics} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Estadísticas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportData}
                  className="bg-transparent dark:border-gray-600 dark:text-gray-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            }
          </div>
        )}

        {/* Business Results */}
        <div className="grid lg:grid-cols-2 gap-4">
          {
            places.map(place => (
              <Card
                key={place.id} className="border-0 shadow-sm dark:bg-gray-800 dark:border-gray-700"
              >
                <CardContent className="p-4 lg:p-6 flex gap-4">
                  {
                    !!place.thumbnail &&
                    <div className="flex-shrink-0 size-24">
                      <div
                        className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                      >
                        <img
                          src={place.thumbnail}
                          alt={place.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </div>
                  }
                  <div className="grid gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{place.name}</h3>
                          <div className="flex flex-col lg:flex-row lg:items-center gap-2 my-1">
                            <div className="flex">
                              <StarRating
                                rating={place.rating || 0}
                                size={16}
                              />
                              <span className="ml-1 font-medium dark:text-gray-100">{place.rating}</span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">({place.reviews || 0} reseñas)</span>
                            <span>
                              <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                                {place.category}
                              </Badge>
                            </span>
                          </div>
                          <div className="grid gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{place.address}</span>
                              </div>
                              {place.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  <span className="text-gray-700 dark:text-gray-300">{place.phone}</span>
                                </div>
                              )}
                              {place.web && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                    Sitio web
                                    <ExternalLink className="h-3 w-3" />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>

        <Pagination
          pagination={pagination}
          onPageChange={changePage}
          loading={loading}
        />

        {/* Loading State */}
        {isLoading && places.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Loader2 className="h-6 w-6 text-red-500 animate-spin" />
            </div>
            <p className="text-gray-600">Extrayendo información de Google Maps...</p>
            <p className="text-gray-500 text-sm mt-1">Esto puede tomar unos momentos</p>
          </div>
        )}

        {/* Empty State */}
        {!places.length && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-gray-500">Ingresa un término de búsqueda y ubicación para comenzar</p>
            <p className="text-gray-400 text-sm mt-1">Ejemplo: "restaurantes" en "Lima"</p>
          </div>
        )}
      </div>

      {/* Modal personalizado */}
      <CustomModal
        isOpen={isOpen}
        onClose={closeModal}
        title={config.title}
        size={config.size}
        showCloseButton={config.showCloseButton}
        closeOnOverlayClick={config.closeOnOverlayClick}
        className={config.className}
      >
        {config.content}
      </CustomModal>
    </div>
  )
}
