'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Job {
  id: number
  job_title: string
  organization_name: string
  location: string
  application_deadline: string
  job_type: string
  description: string
  application_email: string
  application_url: string
}

interface Training {
  id: number
  title: string
  provider: string
  start_date: string
  end_date: string
  location: string
  description: string
  link: string
}

interface Tender {
  id: number
  title: string
  organization_name: string
  deadline: string
  description: string
  link: string
}

export default function Jobs() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'trainings' | 'tenders'>('jobs')
  const [jobs, setJobs] = useState<Job[]>([])
  const [trainings, setTrainings] = useState<Training[]>([])
  const [tenders, setTenders] = useState<Tender[]>([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  useEffect(() => {
    setIsVisible(true)
    fetchJobs()
    fetchTrainings()
    fetchTenders()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/jobs/`)
      setJobs(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    }
  }

  const fetchTrainings = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/trainings/`)
      setTrainings(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch trainings:', error)
    }
  }

  const fetchTenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/tenders/`)
      setTenders(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch tenders:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'jobs' as const, label: 'Job Vacancies', count: jobs.length },
    { id: 'trainings' as const, label: 'Trainings', count: trainings.length },
    { id: 'tenders' as const, label: 'Tenders', count: tenders.length },
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
              <span className="text-sm font-medium text-text-secondary">Opportunities</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">Jobs, Trainings </span>
              <span className="gradient-text">& Tenders</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
              Discover career opportunities, professional development, and business opportunities in the humanitarian sector.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-accent text-background shadow-lg shadow-accent/20'
                    : 'bg-background-surface border border-gray-800 text-text-secondary hover:border-accent/30 hover:text-text-primary'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-background/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6 bg-background-surface border border-gray-800 rounded-3xl animate-pulse">
                  <div className="h-5 bg-gray-800 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Jobs Tab */}
              {activeTab === 'jobs' && (
                jobs.length === 0 ? (
                  <EmptyState icon="briefcase" message="No job vacancies available at the moment." />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                      <div key={job.id} className="group relative p-6 bg-background-surface border border-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded-full">
                              {job.job_type}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                            {job.job_title}
                          </h3>
                          
                          <p className="text-text-secondary text-sm mb-4">{job.organization_name}</p>
                          
                          <div className="flex flex-wrap gap-3 text-xs text-text-secondary mb-4">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1 text-red-400">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Deadline: {job.application_deadline}
                            </div>
                          </div>
                          
                          <a href={job.application_url || `mailto:${job.application_email}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent text-sm font-medium hover:underline">
                            Apply Now
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Trainings Tab */}
              {activeTab === 'trainings' && (
                trainings.length === 0 ? (
                  <EmptyState icon="academic" message="No training opportunities available at the moment." />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trainings.map((training) => (
                      <div key={training.id} className="group relative p-6 bg-background-surface border border-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-secondary/30 hover:shadow-xl hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
                            </svg>
                          </div>
                          
                          <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-secondary transition-colors">
                            {training.title}
                          </h3>
                          
                          <p className="text-text-secondary text-sm mb-4">{training.provider}</p>
                          
                          <div className="flex flex-wrap gap-3 text-xs text-text-secondary mb-4">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {training.start_date} - {training.end_date}
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {training.location}
                            </div>
                          </div>
                          
                          <a href={training.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary text-sm font-medium hover:underline">
                            Learn More
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Tenders Tab */}
              {activeTab === 'tenders' && (
                tenders.length === 0 ? (
                  <EmptyState icon="document" message="No tenders available at the moment." />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tenders.map((tender) => (
                      <div key={tender.id} className="group relative p-6 bg-background-surface border border-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          
                          <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                            {tender.title}
                          </h3>
                          
                          <p className="text-text-secondary text-sm mb-4">{tender.organization_name}</p>
                          
                          <div className="flex items-center gap-1 text-xs text-red-400 mb-4">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Deadline: {tender.deadline}
                          </div>
                          
                          <a href={tender.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                            View Details
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  const icons: Record<string, React.ReactNode> = {
    briefcase: (
      <svg className="w-10 h-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    academic: (
      <svg className="w-10 h-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14v7" />
      </svg>
    ),
    document: (
      <svg className="w-10 h-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  }
  
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-full bg-background-surface border border-gray-800 flex items-center justify-center mx-auto mb-6">
        {icons[icon]}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">Nothing here yet</h3>
      <p className="text-text-secondary">{message}</p>
    </div>
  )
}
