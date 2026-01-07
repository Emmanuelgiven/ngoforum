'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FAQ {
  id: number
  question: string
  answer: string
  category?: string
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const fetchFAQs = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const response = await fetch(`${API_URL}/faqs/`)
        if (response.ok) {
          const data = await response.json()
          setFaqs(data.results || data)
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  const toggleItem = (id: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Fallback FAQs if none from API
  const defaultFAQs: FAQ[] = [
    {
      id: 1,
      question: 'What is the South Sudan NGO Forum?',
      answer: 'The South Sudan NGO Forum is a coordination body that brings together national and international NGOs working in South Sudan. We facilitate collaboration, information sharing, and collective advocacy for the humanitarian sector.',
    },
    {
      id: 2,
      question: 'How can my organization become a member?',
      answer: 'Organizations can apply for membership through our online portal. You\'ll need to submit your registration documents, proof of operations in South Sudan, and pay the annual membership fee. Applications are reviewed within 5-7 business days.',
    },
    {
      id: 3,
      question: 'What are the benefits of membership?',
      answer: 'Members gain access to our network of 200+ NGOs, exclusive resources and training, coordination meeting participation, advocacy support, and visibility through our platforms. Members also get priority access to events and workshops.',
    },
    {
      id: 4,
      question: 'How often are coordination meetings held?',
      answer: 'We hold monthly general coordination meetings and weekly sector-specific working group meetings. Emergency coordination calls are organized as needed in response to humanitarian situations.',
    },
    {
      id: 5,
      question: 'Can I access resources without being a member?',
      answer: 'Some public resources are available to everyone. However, full access to our resource library, training materials, and member-only documents requires an active membership.',
    },
  ]

  const displayFAQs = faqs.length > 0 ? filteredFAQs : defaultFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-70" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">Help Center</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">Frequently Asked </span>
              <span className="gradient-text">Questions</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Find answers to common questions about our platform and services.
            </p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background-surface border border-gray-800 rounded-2xl text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* FAQ List */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-6 bg-background-surface border border-gray-800 rounded-3xl animate-pulse">
                  <div className="h-5 bg-gray-800 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-800 rounded w-full" />
                </div>
              ))}
            </div>
          ) : displayFAQs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-background-surface border border-gray-800 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No matching questions</h3>
              <p className="text-text-secondary">Try adjusting your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayFAQs.map((faq) => (
                <div 
                  key={faq.id}
                  className="group bg-background-surface border border-gray-800 rounded-3xl overflow-hidden transition-all duration-300 hover:border-accent/30"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="text-lg font-semibold text-text-primary pr-4 group-hover:text-accent transition-colors">
                      {faq.question}
                    </h3>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 ${openItems.has(faq.id) ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${openItems.has(faq.id) ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-6 pb-6">
                      <div className="h-px bg-gray-800 mb-4" />
                      <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-12 p-8 bg-background-surface border border-gray-800 rounded-3xl text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Still have questions?</h3>
            <p className="text-text-secondary mb-6">Can&apos;t find what you&apos;re looking for? Our team is here to help.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold rounded-xl hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              Contact Support
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
