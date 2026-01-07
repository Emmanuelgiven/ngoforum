'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'

export default function Documents() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [myDocuments, setMyDocuments] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/portal/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, documentsRes] = await Promise.all([
        api.get('/resource-categories/'),
        api.get('/resources/')
      ])
      setCategories(categoriesRes.data.results || [])
      setMyDocuments(documentsRes.data.results || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    if (!file) {
      setMessage('Please select a file to upload')
      setSubmitting(false)
      return
    }

    // Check file size (15MB = 15 * 1024 * 1024 bytes)
    if (file.size > 15 * 1024 * 1024) {
      setMessage('File size must be less than 15MB')
      setSubmitting(false)
      return
    }

    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('file', file)

      await api.post('/resources/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setMessage('Document uploaded successfully!')
      setFormData({ title: '', description: '', category: '' })
      setFile(null)
      fetchData()
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to upload document')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Upload Resources</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Upload New Document</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">File * (Max 15MB)</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                {file && (
                  <p className="text-sm text-text-secondary mt-1">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {message && (
                <div className={`p-4 rounded ${
                  message.includes('success') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
              >
                {submitting ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>

          {/* My Documents */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Uploaded Documents</h2>
            <div className="space-y-4">
              {myDocuments.map((doc) => (
                <div key={doc.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{doc.title}</h3>
                      <p className="text-sm text-text-secondary">{doc.category?.name}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm ${
                      doc.is_approved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doc.is_approved ? 'Approved' : 'Pending'}
                    </div>
                  </div>
                  {doc.description && (
                    <p className="text-sm text-gray-700 mb-2">{doc.description}</p>
                  )}
                  <div className="text-xs text-text-muted">
                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {myDocuments.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                  No documents uploaded yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
