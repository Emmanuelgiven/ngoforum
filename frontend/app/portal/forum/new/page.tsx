'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'

export default function NewForumPost() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: ''
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/portal/login')
      return
    }
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/forum/categories/')
      setCategories(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      await api.post('/forum/posts/', formData)
      setMessage('Forum post created successfully!')
      
      // Redirect to forum after 2 seconds
      setTimeout(() => {
        router.push('/forum')
      }, 2000)
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to create post')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Create Forum Post</h1>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <p className="text-sm text-text-secondary mt-1">
                Choose the most relevant category for your discussion
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What would you like to discuss?"
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder="Share your thoughts, questions, or insights with the community..."
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <p className="text-sm text-text-secondary mt-1">
                Be clear and respectful. Follow the community guidelines.
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded ${
                message.includes('success') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
                {message.includes('success') && (
                  <p className="text-sm mt-2">Redirecting to forum...</p>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
              >
                {submitting ? 'Creating Post...' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/forum')}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h4 className="font-semibold mb-2">Community Guidelines</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Be respectful and professional</li>
                <li>• Stay on topic</li>
                <li>• No spam or self-promotion</li>
                <li>• Share accurate information</li>
                <li>• Respect confidentiality</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
