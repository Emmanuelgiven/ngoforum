'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Map3W = dynamic(() => import('@/components/Map3W'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-background-surface rounded-2xl border border-gray-800 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <span className="text-text-secondary">Loading map...</span>
      </div>
    </div>
  ),
})

interface State {
  id: number
  name: string
}

interface County {
  id: number
  name: string
  state: number
}

interface Sector {
  id: number
  name: string
  color?: string
}

interface OperationalPresence {
  id: number
  organization_name: string
  sector_name: string
  sector_color?: string
  state_name: string
  county_name: string
  notes: string
  presence_count: number
  year: number
}

const sectorColors: Record<string, string> = {
  'Health': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Education': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'WASH': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Protection': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Food Security': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Shelter': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Livelihoods': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Nutrition': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'default': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function ThreeWMappingPage() {
  const [states, setStates] = useState<State[]>([])
  const [counties, setCounties] = useState<County[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [data, setData] = useState<OperationalPresence[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCounty, setSelectedCounty] = useState<string>('')
  const [selectedSector, setSelectedSector] = useState<string>('')

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  useEffect(() => {
    setIsVisible(true)
    const fetchMetadata = async () => {
      try {
        const [statesRes, countiesRes, sectorsRes] = await Promise.all([
          fetch(`${API_URL}/states/`),
          fetch(`${API_URL}/counties/`),
          fetch(`${API_URL}/sectors/`),
        ])

        if (statesRes.ok) {
          const statesData = await statesRes.json()
          setStates(statesData.results || statesData)
        }
        if (countiesRes.ok) {
          const countiesData = await countiesRes.json()
          setCounties(countiesData.results || countiesData)
        }
        if (sectorsRes.ok) {
          const sectorsData = await sectorsRes.json()
          setSectors(sectorsData.results || sectorsData)
        }
      } catch (error) {
        console.error('Error fetching metadata:', error)
      }
    }

    fetchMetadata()
  }, [API_URL])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedYear) params.append('year', selectedYear)
        if (selectedState) params.append('state', selectedState)
        if (selectedCounty) params.append('county', selectedCounty)
        if (selectedSector) params.append('sector', selectedSector)

        const response = await fetch(`${API_URL}/operational-presence/?${params.toString()}`)
        if (response.ok) {
          const result = await response.json()
          setData(result.results || result)
        }
      } catch (error) {
        console.error('Error fetching 3W data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedYear, selectedState, selectedCounty, selectedSector, API_URL])

  const filteredCounties = selectedState
    ? counties.filter((c) => c.state === parseInt(selectedState))
    : counties

  const totalPresence = data.reduce((sum, item) => sum + (item.presence_count || 0), 0)
  const uniqueOrganizations = new Set(data.map((item) => item.organization_name)).size
  const uniqueLocations = new Set(data.map((item) => `${item.state_name}-${item.county_name}`)).size

  const stats = [
    {
      label: 'Total Activities',
      value: data.length,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'accent',
    },
    {
      label: 'Organizations',
      value: uniqueOrganizations,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'secondary',
    },
    {
      label: 'Locations',
      value: uniqueLocations,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'primary',
    },
    {
      label: 'Total Presence',
      value: totalPresence.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'accent',
    },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-70" />
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">Coordination Tool</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">3W </span>
              <span className="gradient-text">Mapping</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
              Who is doing What, Where? Explore humanitarian activities across South Sudan.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-background-surface border border-gray-800 rounded-3xl text-center">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center mx-auto mb-3 text-${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-background-surface border border-gray-800 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-lg font-bold text-text-primary">Filter Data</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Year */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-gray-800 rounded-xl text-text-primary appearance-none focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* State */}
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setSelectedCounty('')
                  }}
                  className="w-full px-4 py-3 bg-background border border-gray-800 rounded-xl text-text-primary appearance-none focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* County */}
              <div className="relative">
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-gray-800 rounded-xl text-text-primary appearance-none focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                >
                  <option value="">All Counties</option>
                  {filteredCounties.map((county) => (
                    <option key={county.id} value={county.id}>{county.name}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Sector */}
              <div className="relative">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-gray-800 rounded-xl text-text-primary appearance-none focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                >
                  <option value="">All Sectors</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>{sector.name}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-background-surface border border-gray-800 rounded-3xl">
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Operational Presence Map
            </h2>
            <Map3W data={data} />
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-background-surface border border-gray-800 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Activity Data ({data.length} records)
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-text-secondary">No data matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Organization</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Sector</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Notes</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Presence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 20).map((item) => (
                      <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4 text-text-primary font-medium">{item.organization_name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${sectorColors[item.sector_name] || sectorColors.default}`}>
                            {item.sector_name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">
                          {item.county_name}, {item.state_name}
                        </td>
                        <td className="py-3 px-4 text-text-secondary">{item.notes}</td>
                        <td className="py-3 px-4 text-right text-text-primary font-medium">
                          {item.presence_count?.toLocaleString() || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 20 && (
                  <div className="text-center py-4 text-text-secondary text-sm">
                    Showing 20 of {data.length} records
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
