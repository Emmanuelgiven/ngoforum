'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

interface Event {
  id: number
  title: string
  slug: string
  theme?: string
  description?: string
  event_date: string
  event_time: string | null
  location: string
  venue?: string
  event_type: string
  status: string
  registration_required: boolean
  registration_link?: string
  created_by_name?: string
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const response = await axios.get(`${API_URL}/public/events/`)
      setEvents(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-70" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">Stay Connected</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">Upcoming </span>
              <span className="gradient-text">Events</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
              Join us for meetings, workshops, and coordination events bringing the humanitarian community together.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Events List */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-8 bg-background-surface border border-gray-800 rounded-3xl animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gray-800 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-800 rounded w-1/3" />
                      <div className="h-4 bg-gray-800 rounded w-full" />
                      <div className="h-4 bg-gray-800 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-background-surface border border-gray-800 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No upcoming events</h3>
              <p className="text-text-secondary">Check back later for new events.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event, index) => {
                const eventDate = new Date(event.event_date)
                return (
                  <div 
                    key={event.id} 
                    className="group relative p-6 lg:p-8 bg-background-surface border border-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row gap-6">
                      {/* Date Box */}
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-accent">{format(eventDate, 'd')}</span>
                        <span className="text-sm font-medium text-accent/80">{format(eventDate, 'MMM')}</span>
                        <span className="text-xs text-text-secondary">{format(eventDate, 'yyyy')}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                          {event.title}
                        </h2>
                        {event.theme && (
                          <p className="text-text-secondary mb-4 line-clamp-2">{event.theme}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-3">
                          <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                            {event.event_type}
                          </span>
                          <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded-full">
                            {event.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </div>
                          {event.event_time && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {event.event_time}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Register Button */}
                      {event.registration_link && (
                        <div className="flex items-center">
                          <a
                            href={event.registration_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all"
                          >
                            Register
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
