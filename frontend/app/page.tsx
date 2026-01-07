'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  
  const [stats, setStats] = useState({
    members: 0,
    operational_presence: 0,
    events: 0,
    resources: 0
  })
  const [loading, setLoading] = useState(true)
  const [animatedStats, setAnimatedStats] = useState({
    members: 0,
    operational_presence: 0,
    events: 0,
    resources: 0
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const [membersRes, operationalRes, eventsRes, resourcesRes] = await Promise.all([
          fetch(`${API_URL}/public/members/`, { cache: 'no-store' }),
          fetch(`${API_URL}/public/operational-presence/`, { cache: 'no-store' }),
          fetch(`${API_URL}/public/events/`, { cache: 'no-store' }),
          fetch(`${API_URL}/public/resources/`, { cache: 'no-store' })
        ])

        const [members, operational, events, resources] = await Promise.all([
          membersRes.json(),
          operationalRes.json(),
          eventsRes.json(),
          resourcesRes.json()
        ])

        setStats({
          members: members.count || 0,
          operational_presence: operational.count || 0,
          events: events.count || 0,
          resources: resources.count || 0
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [API_URL])

  // Animate stats counting up
  useEffect(() => {
    if (!loading) {
      const duration = 2000
      const steps = 60
      const interval = duration / steps
      
      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        setAnimatedStats({
          members: Math.round(stats.members * easeOut),
          operational_presence: Math.round(stats.operational_presence * easeOut),
          events: Math.round(stats.events * easeOut),
          resources: Math.round(stats.resources * easeOut)
        })
        
        if (step >= steps) clearInterval(timer)
      }, interval)
      
      return () => clearInterval(timer)
    }
  }, [loading, stats])

  return (
    <div className="flex flex-col bg-background overflow-hidden">
      {/* Hero Section - Stripe-inspired with animated gradient */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animated-gradient opacity-90" />
        
        {/* Floating orbs for depth */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">Coordinating Humanitarian Action Since 2012</span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">Empowering </span>
              <span className="gradient-text">Humanitarian</span>
              <br className="hidden sm:block" />
              <span className="text-text-primary"> Action in </span>
              <span className="gradient-text">South Sudan</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
              The premier coordination platform for NGOs delivering life-saving assistance 
              and sustainable development across South Sudan.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                href="/membership" 
                className="group relative w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-accent to-accent-light text-background font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Become a Member
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              
              <Link 
                href="/about" 
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-white/20 text-text-primary font-bold text-lg backdrop-blur-sm hover:border-accent/50 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Learn More
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Scroll indicator */}
            <div className="hidden lg:flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-text-secondary uppercase tracking-widest">Scroll to explore</span>
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Statistics Section - Floating glass cards */}
      <section className="relative py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">Our Impact</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Making a Difference <span className="gradient-text">Together</span>
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { value: animatedStats.members, label: 'Member Organizations', icon: '🏢' },
              { value: animatedStats.operational_presence, label: '3W Data Records', icon: '📊' },
              { value: animatedStats.events, label: 'Active Events', icon: '📅' },
              { value: animatedStats.resources, label: 'Resources Shared', icon: '📚' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative p-6 sm:p-8 rounded-2xl lg:rounded-3xl bg-background-surface border border-gray-800 hover:border-accent/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5"
              >
                <div className="relative z-10">
                  <span className="text-3xl mb-4 block">{stat.icon}</span>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent mb-2 tabular-nums">
                    {loading ? (
                      <div className="h-12 w-20 bg-gray-800 rounded animate-pulse" />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </div>
                  <div className="text-sm sm:text-base text-text-secondary font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Premium Bento Grid */}
      <section className="relative py-24 lg:py-32 bg-background">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/3" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-widest mb-4">Our Services</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Everything You Need to <span className="gradient-text">Coordinate</span>
            </p>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Comprehensive tools and resources to enhance humanitarian coordination and impact
            </p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Large featured card - 3W Mapping */}
            <Link href="/tools/3w-mapping" className="group md:col-span-2 lg:col-span-1 lg:row-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 p-8 lg:p-10 flex flex-col justify-between min-h-[300px] lg:min-h-[500px] transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4 group-hover:text-accent transition-colors">3W Mapping</h3>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Interactive visualization of Who does What Where across all states of South Sudan. Real-time data for better coordination.
                </p>
              </div>
              <div className="flex items-center text-accent font-semibold mt-6">
                Explore Map
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </Link>
            
            {/* Resources */}
            <Link href="/resources" className="group relative overflow-hidden rounded-3xl bg-background-surface border border-gray-800 p-8 min-h-[240px] flex flex-col justify-between transition-all duration-500 hover:border-secondary/50 hover:shadow-xl hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-secondary transition-colors">Resources & Knowledge</h3>
                <p className="text-text-secondary">Reports, guidelines, and best practices from the humanitarian community.</p>
              </div>
              <div className="flex items-center text-secondary font-medium mt-4">
                Browse Library
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            
            {/* Events */}
            <Link href="/events" className="group relative overflow-hidden rounded-3xl bg-background-surface border border-gray-800 p-8 min-h-[240px] flex flex-col justify-between transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">Coordination Events</h3>
                <p className="text-text-secondary">Meetings, workshops, and events bringing organizations together.</p>
              </div>
              <div className="flex items-center text-primary font-medium mt-4">
                View Calendar
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            
            {/* Jobs - Wide card */}
            <Link href="/jobs" className="group md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 p-8 min-h-[200px] flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all duration-500 hover:border-secondary/50 hover:shadow-xl">
              <div className="flex-1">
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-secondary transition-colors">Jobs, Training & Tenders</h3>
                <p className="text-text-secondary">Find career opportunities, skill-building programs, and procurement notices in the humanitarian sector.</p>
              </div>
              <div className="flex items-center text-secondary font-semibold">
                View Opportunities
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
            
            {/* Security */}
            <Link href="/portal/login" className="group relative overflow-hidden rounded-3xl bg-background-surface border border-gray-800 p-8 min-h-[200px] flex flex-col justify-between transition-all duration-500 hover:border-red-500/50 hover:shadow-xl hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-red-400 transition-colors">Security Portal</h3>
                <p className="text-text-secondary">Secure access to security updates, incident reporting, and safety information.</p>
              </div>
              <div className="flex items-center text-red-400 font-medium mt-4">
                Member Access
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            
            {/* Forum */}
            <Link href="/forum" className="group relative overflow-hidden rounded-3xl bg-background-surface border border-gray-800 p-8 min-h-[200px] flex flex-col justify-between transition-all duration-500 hover:border-accent/50 hover:shadow-xl hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">Forum Discussions</h3>
                <p className="text-text-secondary">Engage with the community, share experiences, and collaborate on solutions.</p>
              </div>
              <div className="flex items-center text-accent font-medium mt-4">
                Join Discussion
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section - Infinite scroll effect */}
      <section className="relative py-24 lg:py-32 bg-background-surface overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">Trusted Partners</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Working <span className="gradient-text">Together</span> for South Sudan
            </p>
          </div>
          
          {/* Partner logos grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['OCHA', 'UNDP', 'UNICEF', 'WFP', 'UNHCR', 'WHO', 'FAO', 'IOM', 'USAID', 'EU', 'DFID', 'JICA'].map((partner, i) => (
              <div 
                key={i} 
                className="group relative bg-background rounded-2xl border border-gray-800 p-6 h-24 flex items-center justify-center transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1"
              >
                <span className="text-text-secondary font-bold text-lg group-hover:text-accent transition-colors">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium gradient design */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animated-gradient opacity-90" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              Ready to Make a <span className="gradient-text">Difference</span>?
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              Join over {stats.members.toLocaleString()} organizations coordinating humanitarian action and development across South Sudan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/membership" 
                className="group w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-background font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Apply for Membership
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link 
                href="/contact" 
                className="group w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-white/30 text-text-primary font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get in Touch
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-text-secondary">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Established 2012</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Non-Profit Organization</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Open Membership</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
