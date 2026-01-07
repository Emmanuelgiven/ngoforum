'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'

export default function Events() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [myEvents, setMyEvents] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    venue: '',
    registration_link: ''
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/portal/login')
      return
    }
    fetchMyEvents()
  }, [])

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/events/')
      setMyEvents(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      await api.post('/events/', formData)
      setMessage('Event created successfully!')
      setFormData({
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        location: '',
        venue: '',
        registration_link: ''
      })
      fetchMyEvents()
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to create event')
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
        <h1 className="text-4xl font-bold mb-8">Create Event</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Post New Event</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Time</label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Juba, Central Equatoria"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g., NGO Forum Conference Room"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Registration/Meeting Link</label>
                <input
                  type="url"
                  value={formData.registration_link}
                  onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
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
                {submitting ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          </div>

          {/* My Events */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Posted Events</h2>
            <div className="space-y-4">
              {myEvents.map((event) => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-text-secondary">
                        {new Date(event.event_date).toLocaleDateString()} • {event.location}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm ${
                      event.is_approved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {event.is_approved ? 'Approved' : 'Pending'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
                </div>
              ))}
              {myEvents.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                  No events posted yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
