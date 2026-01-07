'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  data: any[]
}

export default function Map3W({ data }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([7.8627, 29.6949], 6) // Center on South Sudan

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current)

      markersRef.current = L.layerGroup().addTo(mapRef.current)
    }

    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.clearLayers()
    }

    // Approximate county coordinates for South Sudan (simplified)
    const countyCoordinates: { [key: string]: [number, number] } = {
      'Juba': [4.8517, 31.5825],
      'Torit': [4.4141, 32.5697],
      'Yei': [4.0900, 30.6783],
      'Bor': [6.2067, 31.5597],
      'Wau': [7.7028, 27.9950],
      'Aweil': [8.7667, 27.4000],
      'Rumbek': [6.8028, 29.6789],
      'Bentiu': [9.2333, 29.7833],
      'Malakal': [9.5334, 31.6500],
      'Kapoeta': [4.7717, 33.5903],
    }

    // Group data by county
    const countyData: { [key: string]: any[] } = {}
    data.forEach(item => {
      const county = item.county.name
      if (!countyData[county]) {
        countyData[county] = []
      }
      countyData[county].push(item)
    })

    // Add markers for each county
    Object.entries(countyData).forEach(([county, items]) => {
      const coords = countyCoordinates[county] || [6.8769, 31.3070] // Default to Juba if not found

      // Create marker
      const marker = L.circleMarker(coords, {
        radius: Math.min(items.length * 2 + 5, 30),
        fillColor: '#2c5aa0',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      })

      // Create popup content
      const sectorCounts: { [key: string]: number } = {}
      items.forEach(item => {
        sectorCounts[item.sector.name] = (sectorCounts[item.sector.name] || 0) + 1
      })

      let popupContent = `
        <div class="p-2">
          <h3 class="font-bold text-lg mb-2">${county}</h3>
          <p class="mb-2"><strong>${items.length}</strong> activities</p>
          <div class="text-sm">
            <strong>Sectors:</strong>
            <ul class="mt-1">
              ${Object.entries(sectorCounts).map(([sector, count]) => 
                `<li>• ${sector}: ${count}</li>`
              ).join('')}
            </ul>
          </div>
        </div>
      `

      marker.bindPopup(popupContent)

      if (markersRef.current) {
        marker.addTo(markersRef.current)
      }
    })

    return () => {
      // Cleanup is handled by keeping the map instance
    }
  }, [data])

  return <div id="map" className="h-[600px] w-full" />
}
