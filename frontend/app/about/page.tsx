'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function About() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Coordination',
      description: 'Facilitate coordination among NGOs and with other humanitarian actors to avoid duplication and maximize impact.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      title: 'Advocacy',
      description: 'Represent NGO interests and concerns in policy discussions with government, donors, and UN agencies.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Information Management',
      description: 'Maintain the 3W database (Who does What Where) to track NGO presence and activities across South Sudan.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: 'Capacity Building',
      description: 'Provide training and capacity building opportunities for member organizations, particularly national NGOs.',
    }
  ]

  const team = [
    { name: 'Executive Director', role: 'Leadership', image: '👤' },
    { name: 'Deputy Director', role: 'Operations', image: '👤' },
    { name: 'Program Manager', role: 'Programs', image: '👤' },
    { name: 'Information Officer', role: 'Data & IT', image: '👤' }
  ]

  const milestones = [
    { year: '2012', title: 'Forum Established', description: 'South Sudan NGO Forum was founded to coordinate humanitarian action.' },
    { year: '2014', title: '100+ Members', description: 'Reached milestone of over 100 member organizations.' },
    { year: '2018', title: '3W Platform Launch', description: 'Launched digital 3W mapping platform for operational tracking.' },
    { year: '2024', title: '300+ Members', description: 'Now serving over 300 national and international NGOs.' }
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-80" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">Established 2012</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">About </span>
              <span className="gradient-text">South Sudan NGO Forum</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              The premier coordination body bringing together national and international 
              non-governmental organizations working to improve lives in South Sudan.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Mission & Vision */}
      <section className="relative py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="group relative p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 overflow-hidden transition-all duration-500 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10">
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">Our Mission</h2>
                <p className="text-text-secondary text-lg leading-relaxed">
                  To strengthen the collective voice and effectiveness of NGOs in South Sudan through 
                  coordination, capacity building, advocacy, and information management.
                </p>
              </div>
            </div>
            
            <div className="group relative p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 overflow-hidden transition-all duration-500 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10">
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">Our Vision</h2>
                <p className="text-text-secondary text-lg leading-relaxed">
                  A well-coordinated, effective, and accountable NGO community that contributes 
                  to sustainable peace, development, and improved lives for all South Sudanese.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="relative py-20 lg:py-28 bg-background-surface">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/3" />
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">Our Work</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              What We <span className="gradient-text">Do</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div key={index} className="group relative p-8 rounded-3xl bg-background border border-gray-800 overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">{value.title}</h3>
                <p className="text-text-secondary leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-widest mb-4">Our Journey</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Key <span className="gradient-text">Milestones</span>
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-secondary to-primary" />
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex gap-8 mb-12 last:mb-0">
                  <div className="relative z-10 w-16 h-16 rounded-full bg-background border-2 border-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-accent">{milestone.year}</span>
                  </div>
                  <div className="flex-1 pt-3">
                    <h3 className="text-xl font-bold text-text-primary mb-2">{milestone.title}</h3>
                    <p className="text-text-secondary">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="relative py-20 lg:py-28 bg-background-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">Our Team</h2>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Leadership <span className="gradient-text">Team</span>
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="group p-8 rounded-3xl bg-background border border-gray-800 text-center transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:-translate-y-1">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {member.image}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1">{member.name}</h3>
                <p className="text-text-secondary text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 overflow-hidden">
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
              <div className="relative z-10 text-center">
                <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">Get in Touch</h2>
                <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                  Have questions about the Forum or interested in becoming a member? We&apos;d love to hear from you.
                </p>
                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 rounded-2xl bg-background/50 backdrop-blur-sm">
                    <div className="text-accent font-semibold mb-1">Email</div>
                    <div className="text-text-secondary text-sm">info@southsudanngoforum.org</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 backdrop-blur-sm">
                    <div className="text-accent font-semibold mb-1">Phone</div>
                    <div className="text-text-secondary text-sm">+211 XXX XXX XXX</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 backdrop-blur-sm">
                    <div className="text-accent font-semibold mb-1">Location</div>
                    <div className="text-text-secondary text-sm">Juba, South Sudan</div>
                  </div>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-background font-bold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent/20 hover:scale-[1.02]">
                  Contact Us
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
