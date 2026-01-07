'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

interface MemberDetail {
  id: number
  name: string
  member_type: string
  description: string
  website: string
  email: string
  phone: string
  logo: string | null
  address: string
  city: string
  state: string
}

export default function MemberDetail() {
  const params = useParams()
  const [member, setMember] = useState<MemberDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchMember()
    }
    setIsVisible(true)
  }, [params.slug])

  const fetchMember = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const response = await axios.get(`${API_URL}/public/members/${params.slug}/`)
      setMember(response.data)
    } catch (error) {
      console.error('Failed to fetch member:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading organization details...</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-background-surface border border-gray-800 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Organization Not Found</h2>
          <p className="text-text-secondary mb-6">The organization you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/members" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:shadow-lg transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Members
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-60" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/members" className="hover:text-accent transition-colors">Members</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-text-primary">{member.name}</span>
          </nav>
          
          <div className={`max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Logo */}
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {member.logo ? (
                  <img src={member.logo} alt={member.name} className="max-w-full max-h-full object-contain p-4" />
                ) : (
                  <span className="text-5xl font-bold text-accent">{member.name.charAt(0)}</span>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                  member.member_type === 'NATIONAL' 
                    ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                    : 'bg-primary/20 text-primary border border-primary/30'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {member.member_type === 'NATIONAL' ? 'National NGO' : 'International NGO'}
                </span>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                  {member.name}
                </h1>
                
                {member.website && (
                  <a 
                    href={member.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Content */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                {member.description && (
                  <div className="p-8 rounded-3xl bg-background-surface border border-gray-800">
                    <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      About
                    </h2>
                    <p className="text-text-secondary leading-relaxed">{member.description}</p>
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                  <h2 className="text-xl font-bold text-text-primary mb-6">Quick Actions</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Link href="/tools/3w-mapping" className="group flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-gray-800 hover:border-accent/30 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary group-hover:text-accent transition-colors">View on 3W Map</div>
                        <div className="text-sm text-text-secondary">See operational presence</div>
                      </div>
                    </Link>
                    
                    <Link href="/members" className="group flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-gray-800 hover:border-secondary/30 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary group-hover:text-secondary transition-colors">All Members</div>
                        <div className="text-sm text-text-secondary">Browse organizations</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Sidebar - Contact Info */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-background-surface border border-gray-800">
                  <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Information
                  </h2>
                  
                  <div className="space-y-4">
                    {member.email && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-text-secondary">Email</div>
                          <a href={`mailto:${member.email}`} className="text-text-primary hover:text-accent transition-colors break-all">
                            {member.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member.phone && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-text-secondary">Phone</div>
                          <a href={`tel:${member.phone}`} className="text-text-primary hover:text-secondary transition-colors">
                            {member.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {member.address && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-text-secondary">Address</div>
                          <div className="text-text-primary">{member.address}</div>
                        </div>
                      </div>
                    )}
                    
                    {member.website && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-text-secondary">Website</div>
                          <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-light transition-colors break-all">
                            {member.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Back Button */}
                <Link 
                  href="/members" 
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border border-gray-800 text-text-secondary hover:text-accent hover:border-accent/30 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to All Members
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
