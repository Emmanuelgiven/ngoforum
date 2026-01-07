'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import api from '@/lib/api'

export default function Jobs() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'job' | 'training' | 'tender'>('job')
  
  const [myJobs, setMyJobs] = useState<any[]>([])
  const [myTrainings, setMyTrainings] = useState<any[]>([])
  const [myTenders, setMyTenders] = useState<any[]>([])

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    job_type: 'FULL_TIME',
    deadline: ''
  })

  const [trainingForm, setTrainingForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    registration_deadline: ''
  })

  const [tenderForm, setTenderForm] = useState({
    title: '',
    description: '',
    requirements: '',
    budget_range: '',
    deadline: ''
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/portal/login')
      return
    }
    fetchMyData()
  }, [])

  const fetchMyData = async () => {
    try {
      const [jobsRes, trainingsRes, tendersRes] = await Promise.all([
        api.get('/jobs/'),
        api.get('/trainings/'),
        api.get('/tenders/')
      ])
      setMyJobs(jobsRes.data.results || [])
      setMyTrainings(trainingsRes.data.results || [])
      setMyTenders(tendersRes.data.results || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      await api.post('/jobs/', jobForm)
      setMessage('Job posted successfully!')
      setJobForm({
        title: '',
        description: '',
        requirements: '',
        location: '',
        job_type: 'FULL_TIME',
        deadline: ''
      })
      fetchMyData()
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to post job')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTrainingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      await api.post('/trainings/', trainingForm)
      setMessage('Training posted successfully!')
      setTrainingForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        registration_deadline: ''
      })
      fetchMyData()
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to post training')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTenderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      await api.post('/tenders/', tenderForm)
      setMessage('Tender posted successfully!')
      setTenderForm({
        title: '',
        description: '',
        requirements: '',
        budget_range: '',
        deadline: ''
      })
      fetchMyData()
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to post tender')
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
        <h1 className="text-4xl font-bold mb-8">Post Opportunities</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('job')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'job'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            Post Job
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'training'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            Post Training
          </button>
          <button
            onClick={() => setActiveTab('tender')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'tender'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            Post Tender
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Forms */}
          <div>
            {activeTab === 'job' && (
              <form onSubmit={handleJobSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Post Job Opening</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Job Type *</label>
                  <select
                    value={jobForm.job_type}
                    onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="CONSULTANT">Consultant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Requirements</label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Application Deadline *</label>
                  <input
                    type="date"
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
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
                  {submitting ? 'Posting...' : 'Post Job'}
                </button>
              </form>
            )}

            {activeTab === 'training' && (
              <form onSubmit={handleTrainingSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Post Training</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Training Title *</label>
                  <input
                    type="text"
                    value={trainingForm.title}
                    onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={trainingForm.description}
                    onChange={(e) => setTrainingForm({ ...trainingForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={trainingForm.start_date}
                      onChange={(e) => setTrainingForm({ ...trainingForm, start_date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={trainingForm.end_date}
                      onChange={(e) => setTrainingForm({ ...trainingForm, end_date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={trainingForm.location}
                    onChange={(e) => setTrainingForm({ ...trainingForm, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Registration Deadline</label>
                  <input
                    type="date"
                    value={trainingForm.registration_deadline}
                    onChange={(e) => setTrainingForm({ ...trainingForm, registration_deadline: e.target.value })}
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
                  {submitting ? 'Posting...' : 'Post Training'}
                </button>
              </form>
            )}

            {activeTab === 'tender' && (
              <form onSubmit={handleTenderSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Post Tender</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tender Title *</label>
                  <input
                    type="text"
                    value={tenderForm.title}
                    onChange={(e) => setTenderForm({ ...tenderForm, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={tenderForm.description}
                    onChange={(e) => setTenderForm({ ...tenderForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Requirements</label>
                  <textarea
                    value={tenderForm.requirements}
                    onChange={(e) => setTenderForm({ ...tenderForm, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <input
                    type="text"
                    value={tenderForm.budget_range}
                    onChange={(e) => setTenderForm({ ...tenderForm, budget_range: e.target.value })}
                    placeholder="e.g., $10,000 - $50,000"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Submission Deadline *</label>
                  <input
                    type="date"
                    value={tenderForm.deadline}
                    onChange={(e) => setTenderForm({ ...tenderForm, deadline: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
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
                  {submitting ? 'Posting...' : 'Post Tender'}
                </button>
              </form>
            )}
          </div>

          {/* My Postings */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Postings</h2>
            <div className="space-y-4">
              {activeTab === 'job' && myJobs.map((job) => (
                <div key={job.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{job.job_title}</h3>
                      <p className="text-sm text-text-secondary">{job.location} • {job.job_type}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm ${
                      job.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'training' && myTrainings.map((training) => (
                <div key={training.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{training.title}</h3>
                      <p className="text-sm text-text-secondary">
                        {new Date(training.start_date).toLocaleDateString()} • {training.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'tender' && myTenders.map((tender) => (
                <div key={tender.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{tender.title}</h3>
                      <p className="text-sm text-text-secondary">
                        Deadline: {new Date(tender.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {((activeTab === 'job' && myJobs.length === 0) ||
                (activeTab === 'training' && myTrainings.length === 0) ||
                (activeTab === 'tender' && myTenders.length === 0)) && (
                <div className="text-center py-8 text-text-secondary">
                  No {activeTab}s posted yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
