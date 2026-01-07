'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'

export default function OperationalData() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  
  const [states, setStates] = useState<any[]>([])
  const [counties, setCounties] = useState<any[]>([])
  const [sectors, setSectors] = useState<any[]>([])
  const [myData, setMyData] = useState<any[]>([])

  const [formData, setFormData] = useState({
    state: '',
    county: '',
    sector: '',
    year: new Date().getFullYear(),
    beneficiaries: '',
    activities_description: ''
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/portal/login')
      return
    }
    fetchMetadata()
    fetchMyData()
  }, [])

  useEffect(() => {
    if (formData.state) {
      const filtered = counties.filter((c: any) => c.state.toString() === formData.state)
      setCounties(filtered)
    }
  }, [formData.state])

  const fetchMetadata = async () => {
    try {
      const [statesRes, countiesRes, sectorsRes] = await Promise.all([
        api.get('/states/'),
        api.get('/counties/'),
        api.get('/sectors/')
      ])
      setStates(statesRes.data.results || [])
      setCounties(countiesRes.data.results || [])
      setSectors(sectorsRes.data.results || [])
    } catch (error) {
      console.error('Failed to fetch metadata:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyData = async () => {
    try {
      const response = await api.get('/operational-presence/')
      setMyData(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      await api.post('/operational-presence/', {
        county: formData.county,
        sector: formData.sector,
        year: formData.year,
        beneficiaries: parseInt(formData.beneficiaries) || 0,
        activities_description: formData.activities_description
      })
      setMessage('3W data submitted successfully!')
      fetchMyData()
      setFormData({
        state: '',
        county: '',
        sector: '',
        year: new Date().getFullYear(),
        beneficiaries: '',
        activities_description: ''
      })
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to submit data')
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
        <h1 className="text-4xl font-bold mb-8">3W Operational Data</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Submit New Data</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min="2020"
                  max="2030"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value, county: '' })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">County</label>
                <select
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  disabled={!formData.state}
                >
                  <option value="">Select County</option>
                  {counties
                    .filter((c: any) => c.state.toString() === formData.state)
                    .map((county) => (
                      <option key={county.id} value={county.id}>{county.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sector</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Sector</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>{sector.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beneficiaries (estimated)</label>
                <input
                  type="number"
                  value={formData.beneficiaries}
                  onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Activities Description</label>
                <textarea
                  value={formData.activities_description}
                  onChange={(e) => setFormData({ ...formData, activities_description: e.target.value })}
                  rows={3}
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
                {submitting ? 'Submitting...' : 'Submit Data'}
              </button>
            </form>
          </div>

          {/* My Data */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Submitted Data</h2>
            <div className="space-y-4">
              {myData.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{item.sector.name}</div>
                      <div className="text-sm text-text-secondary">
                        {item.county.name} • {item.year}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm ${
                      item.is_approved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.is_approved ? 'Approved' : 'Pending'}
                    </div>
                  </div>
                  {item.beneficiaries && (
                    <div className="text-sm">
                      Beneficiaries: {item.beneficiaries.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
              {myData.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                  No data submitted yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
