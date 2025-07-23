"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Search, Loader2, Phone, Globe, Clock, Star, Download, ExternalLink } from "lucide-react"

interface BusinessData {
  name: string
  address: string
  phone?: string
  website?: string
  rating: number
  reviewCount: number
  category: string
  hours?: string
  priceLevel?: string
  photos: string[]
  reviews: {
    author: string
    rating: number
    text: string
    date: string
  }[]
}

export default function GoogleMapsScrapingApp() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [businesses, setBusinesses] = useState<BusinessData[]>([])
  const [error, setError] = useState("")
  const [totalResults, setTotalResults] = useState(0)

  const handleScrape = async () => {
    if (!searchTerm || !location) return

    setIsLoading(true)
    setError("")
    setBusinesses([])

    try {
      // Simular scraping de Google Maps
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Datos simulados de negocios
      const mockBusinesses: BusinessData[] = [
        {
          name: "Restaurante El Buen Sabor",
          address: "Av. Principal 123, " + location,
          phone: "+1 234-567-8900",
          website: "https://elbuensabor.com",
          rating: 4.5,
          reviewCount: 127,
          category: "Restaurante",
          hours: "Lun-Dom: 11:00 AM - 10:00 PM",
          priceLevel: "$$",
          photos: [
            "/placeholder.svg?height=200&width=300",
            "/placeholder.svg?height=200&width=300",
            "/placeholder.svg?height=200&width=300",
          ],
          reviews: [
            {
              author: "María González",
              rating: 5,
              text: "Excelente comida y servicio. Muy recomendado.",
              date: "hace 2 semanas",
            },
            {
              author: "Carlos Ruiz",
              rating: 4,
              text: "Buena calidad precio, ambiente agradable.",
              date: "hace 1 mes",
            },
          ],
        },
        {
          name: "Café Central",
          address: "Calle 5ta #456, " + location,
          phone: "+1 234-567-8901",
          rating: 4.2,
          reviewCount: 89,
          category: "Cafetería",
          hours: "Lun-Vie: 7:00 AM - 6:00 PM, Sáb-Dom: 8:00 AM - 5:00 PM",
          priceLevel: "$",
          photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
          reviews: [
            {
              author: "Ana López",
              rating: 4,
              text: "Buen café y ambiente tranquilo para trabajar.",
              date: "hace 1 semana",
            },
          ],
        },
        {
          name: "Tienda Tech Solutions",
          address: "Plaza Comercial 789, " + location,
          phone: "+1 234-567-8902",
          website: "https://techsolutions.com",
          rating: 4.7,
          reviewCount: 203,
          category: "Tienda de electrónicos",
          hours: "Lun-Sáb: 9:00 AM - 8:00 PM, Dom: 10:00 AM - 6:00 PM",
          priceLevel: "$$$",
          photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
          reviews: [
            {
              author: "Pedro Martínez",
              rating: 5,
              text: "Excelente atención y productos de calidad.",
              date: "hace 3 días",
            },
          ],
        },
      ]

      setBusinesses(mockBusinesses)
      setTotalResults(mockBusinesses.length)
    } catch (err) {
      setError("Error al realizar el scraping. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(businesses, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `google-maps-${searchTerm}-${location}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <MapPin className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl font-light text-gray-900">Google Maps Scraper</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Extrae información detallada de negocios locales desde Google Maps
          </p>
        </div>

        {/* Search Form */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-3">
              <Input
                placeholder="¿Qué buscas? (ej: restaurantes, cafeterías)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-200 focus:border-gray-400 transition-colors"
                disabled={isLoading}
              />
              <Input
                placeholder="Ubicación (ej: Madrid, España)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-gray-200 focus:border-gray-400 transition-colors"
                disabled={isLoading}
              />
              <Button
                onClick={handleScrape}
                disabled={!searchTerm || !location || isLoading}
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
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Results Header */}
        {businesses.length > 0 && (
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium text-gray-900">Resultados encontrados: {totalResults}</h2>
              <p className="text-gray-600 text-sm">
                Búsqueda: "{searchTerm}" en {location}
              </p>
            </div>
            <Button onClick={exportData} variant="outline" className="border-gray-300 hover:bg-gray-50 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Exportar JSON
            </Button>
          </div>
        )}

        {/* Business Results */}
        <div className="space-y-6">
          {businesses.map((business, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{business.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 font-medium">{business.rating}</span>
                            <span className="text-gray-500 text-sm ml-1">({business.reviewCount} reseñas)</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {business.category}
                          </Badge>
                          {business.priceLevel && (
                            <Badge variant="outline" className="text-xs">
                              {business.priceLevel}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{business.address}</span>
                        </div>
                        {business.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{business.phone}</span>
                          </div>
                        )}
                        {business.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <a
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              Sitio web
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {business.hours && (
                          <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                            <span className="text-gray-700">{business.hours}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reviews */}
                    {business.reviews.length > 0 && (
                      <div className="space-y-3">
                        <Separator />
                        <h4 className="font-medium text-gray-900">Reseñas recientes</h4>
                        <div className="space-y-3">
                          {business.reviews.slice(0, 2).map((review, reviewIndex) => (
                            <div key={reviewIndex} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{review.author}</span>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-sm text-gray-700">{review.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Photos */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Fotos</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {business.photos.slice(0, 4).map((photo, photoIndex) => (
                        <div key={photoIndex} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`${business.name} foto ${photoIndex + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Loader2 className="h-6 w-6 text-red-500 animate-spin" />
            </div>
            <p className="text-gray-600">Extrayendo información de Google Maps...</p>
            <p className="text-gray-500 text-sm mt-1">Esto puede tomar unos momentos</p>
          </div>
        )}

        {/* Empty State */}
        {!businesses.length && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-gray-500">Ingresa un término de búsqueda y ubicación para comenzar</p>
            <p className="text-gray-400 text-sm mt-1">Ejemplo: "restaurantes" en "Madrid, España"</p>
          </div>
        )}
      </div>
    </div>
  )
}
