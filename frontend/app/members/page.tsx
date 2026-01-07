'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

interface Member {
  id: number
  name: string
  slug: string
  organization_type: string
  website: string
  logo: string | null
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchMembers()
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [filter, search])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const params: Record<string, string> = {}
      
      if (filter !== 'ALL') {
        params.organization_type = filter
      }
      if (search) {
        params.search = search
      }

      const response = await axios.get(`${API_URL}/public/members/`, { params })
      setMembers(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: members.length,
    nngo: members.filter(m => m.organization_type === 'NNGO').length,
    ingo: members.filter(m => m.organization_type === 'INGO').length
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
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">{stats.total} Organizations</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">Our </span>
              <span className="gradient-text">Member Organizations</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
              Discover the national and international NGOs working together to make a difference in South Sudan.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-8 z-10 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-background-surface border border-gray-800 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent">{stats.total}</div>
                <div className="text-sm text-text-secondary">Total Members</div>
              </div>
              <div className="text-center border-x border-gray-800">
                <div className="text-2xl sm:text-3xl font-bold text-secondary">{stats.nngo}</div>
                <div className="text-sm text-text-secondary">National NGOs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.ingo}</div>
                <div className="text-sm text-text-secondary">International NGOs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background-surface border border-gray-800 rounded-xl text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-background-surface border border-gray-800 rounded-xl">
              {[
                { value: 'ALL', label: 'All' },
                { value: 'NNGO', label: 'National NGOs' },
                { value: 'INGO', label: 'International NGOs' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === tab.value
                      ? 'bg-accent text-background'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-6 bg-background-surface border border-gray-800 rounded-2xl animate-pulse">
                  <div className="h-20 bg-gray-800 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-background-surface border border-gray-800 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No organizations found</h3>
              <p className="text-text-secondary">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member, index) => (
                <Link
                  key={member.id}
                  href={`/members/${member.slug}`}
                  className="group relative p-6 bg-background-surface border border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-center mb-4 rounded-xl bg-white/5 overflow-hidden">
                      {member.logo ? (
                        <img 
                          src={member.logo} 
                          alt={member.name}
                          className="max-h-16 max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-accent">{member.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Name */}
                    <h3 className="font-bold text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {member.name}
                    </h3>
                    
                    {/* Type Badge */}
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      member.organization_type === 'NNGO'
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {member.organization_type === 'NNGO' ? 'National NGO' : 'International NGO'}
                    </span>
                    
                    {/* View arrow */}
                    <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                      <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-80" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
            Want to Join Our Network?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Become a member and connect with humanitarian organizations across South Sudan.
          </p>
          <Link 
            href="/membership"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-background font-bold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent/20 hover:scale-[1.02]"
          >
            Apply for Membership
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
