'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Resource {
  id: number
  title: string
  description: string
  category_name: string
  resource_type: string
  file: string | null
  external_url: string
  published_date: string
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    fetchResources()
  }, [search])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const params: Record<string, string> = {}
      if (search) params.search = search
      const response = await axios.get(`${API_URL}/public/resources/`, { params })
      setResources(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-70" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">Knowledge Hub</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">Resources & </span>
              <span className="gradient-text">Documents</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Access reports, guidelines, and best practices from the humanitarian community.
            </p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background-surface border border-gray-800 rounded-2xl text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Resources Grid */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 bg-background-surface border border-gray-800 rounded-3xl animate-pulse">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl mb-4" />
                  <div className="h-5 bg-gray-800 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-background-surface border border-gray-800 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No resources found</h3>
              <p className="text-text-secondary">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="group relative p-6 bg-background-surface border border-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    
                    {/* Category */}
                    <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded-full mb-3">
                      {resource.category_name}
                    </span>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {resource.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    {/* Date */}
                    <div className="text-xs text-text-secondary mb-4">
                      Published {resource.published_date}
                    </div>
                    
                    {/* Download Button */}
                    {resource.file ? (
                      <a
                        href={resource.file}
                        download
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-background font-semibold text-sm hover:shadow-lg hover:shadow-accent/20 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </a>
                    ) : resource.external_url ? (
                      <a
                        href={resource.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-background font-semibold text-sm hover:shadow-lg hover:shadow-secondary/20 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View External
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700 text-gray-400 font-semibold text-sm cursor-not-allowed">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        No File
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
