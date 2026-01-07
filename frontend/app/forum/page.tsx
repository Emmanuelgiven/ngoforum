'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ForumPost {
  id: number
  title: string
  slug: string
  author_name: string
  category: number
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  comment_count: number
  created_at: string
}

interface ForumCategory {
  id: number
  name: string
  slug: string
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  useEffect(() => {
    setIsVisible(true)
    // Fetch categories once on mount
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories/`)
        if (response.ok) {
          const data = await response.json()
          setCategories(data.results || [])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [API_URL])

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (search) params.search = search
        const queryString = new URLSearchParams(params).toString()
        const response = await fetch(`${API_URL}/public/posts/?${queryString}`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data.results || [])
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [search, API_URL])

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'General'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-70" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">Community Hub</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">Discussion </span>
              <span className="gradient-text">Forum</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Connect with the humanitarian community, share knowledge, and collaborate on initiatives.
            </p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search discussions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background-surface border border-gray-800 rounded-2xl text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Forum Posts */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-6 bg-background-surface border border-gray-800 rounded-3xl animate-pulse">
                  <div className="h-5 bg-gray-800 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-background-surface border border-gray-800 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No discussions yet</h3>
              <p className="text-text-secondary">Be the first to start a conversation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/forum/${post.id}`}
                  className="block group relative p-6 bg-background-surface border border-gray-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-accent/30 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        {post.is_pinned && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-lg">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                            Pinned
                          </div>
                        )}
                        <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded-full">
                          {getCategoryName(post.category)}
                        </span>
                      </div>
                      
                      <div className="text-xs text-text-secondary">
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    
                    {/* Post stats */}
                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {post.view_count} views
                      </span>
                      {post.is_locked && (
                        <span className="flex items-center gap-1 text-yellow-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Locked
                        </span>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white text-xs font-bold">
                          {post.author_name.charAt(0).toUpperCase()}
                        </div>
                        <span>{post.author_name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comment_count} comments
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
