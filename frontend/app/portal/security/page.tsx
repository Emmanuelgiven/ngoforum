'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'

export default function SecurityReport() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    incident_type: 'SECURITY_INCIDENT',
    who_involved: '',
    where_location: '',
    when_date_time: '',
    what_happened: '',
    what_you_did: '',
    what_you_need: '',
    immediate_needs: ''
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/portal/login')
      return
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      await api.post('/security/incidents/', formData)
      setMessage('Security incident reported successfully. Our team has been notified.')
      setFormData({
        incident_type: 'SECURITY_INCIDENT',
        who_involved: '',
        where_location: '',
        when_date_time: '',
        what_happened: '',
        what_you_did: '',
        what_you_need: '',
        immediate_needs: ''
      })
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <h1 className="text-3xl font-bold text-red-900 mb-2">
              🔒 Security Incident Report
            </h1>
            <p className="text-red-700">
              Use this form to report security incidents using the 6Ws framework. 
              Reports are confidential and immediately sent to the security team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Incident Type *</label>
              <select
                value={formData.incident_type}
                onChange={(e) => setFormData({ ...formData, incident_type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="SECURITY_INCIDENT">Security Incident</option>
                <option value="THEFT">Theft</option>
                <option value="ASSAULT">Assault</option>
                <option value="KIDNAPPING">Kidnapping</option>
                <option value="ARMED_CONFLICT">Armed Conflict</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* 6Ws Framework */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">6Ws Framework</h3>

              {/* WHO */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-600">1. WHO</span> - Who was involved? *
                </label>
                <textarea
                  value={formData.who_involved}
                  onChange={(e) => setFormData({ ...formData, who_involved: e.target.value })}
                  rows={2}
                  placeholder="Describe who was involved in the incident (staff, beneficiaries, etc.)"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* WHERE */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-600">2. WHERE</span> - Where did it happen? *
                </label>
                <input
                  type="text"
                  value={formData.where_location}
                  onChange={(e) => setFormData({ ...formData, where_location: e.target.value })}
                  placeholder="Specific location (address, GPS coordinates if available)"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* WHEN */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-600">3. WHEN</span> - When did it happen? *
                </label>
                <input
                  type="datetime-local"
                  value={formData.when_date_time}
                  onChange={(e) => setFormData({ ...formData, when_date_time: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* WHAT HAPPENED */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-600">4. WHAT HAPPENED</span> - Describe the incident *
                </label>
                <textarea
                  value={formData.what_happened}
                  onChange={(e) => setFormData({ ...formData, what_happened: e.target.value })}
                  rows={4}
                  placeholder="Provide detailed description of what occurred"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* WHAT YOU DID */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-600">5. WHAT YOU DID</span> - Actions taken in response *
                </label>
                <textarea
                  value={formData.what_you_did}
                  onChange={(e) => setFormData({ ...formData, what_you_did: e.target.value })}
                  rows={3}
                  placeholder="What immediate actions did you take?"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* WHAT YOU NEED */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-600">6. WHAT YOU NEED</span> - Support required *
                </label>
                <textarea
                  value={formData.what_you_need}
                  onChange={(e) => setFormData({ ...formData, what_you_need: e.target.value })}
                  rows={3}
                  placeholder="What support or assistance do you need?"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* Immediate Needs */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-600 font-bold">URGENT:</span> Immediate needs (if any)
                </label>
                <textarea
                  value={formData.immediate_needs}
                  onChange={(e) => setFormData({ ...formData, immediate_needs: e.target.value })}
                  rows={2}
                  placeholder="List any urgent needs requiring immediate attention"
                  className="w-full px-4 py-2 border border-red-300 rounded-lg"
                />
              </div>
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

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-semibold"
              >
                {submitting ? 'Submitting Report...' : 'Submit Security Report'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/portal/dashboard')}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>

            <p className="text-sm text-text-secondary text-center">
              All security reports are treated as confidential and sent immediately to the security team.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
