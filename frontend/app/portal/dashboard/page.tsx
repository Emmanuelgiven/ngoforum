'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, removeAuthTokens } from '@/lib/auth'
import api from '@/lib/api'

interface Organization {
  name: string
  status: string
  is_verified: boolean
  membership_expiry_date: string
}

export default function Dashboard() {
  const router = useRouter()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/portal/login')
      return
    }

    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile/')
      setOrganization(response.data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    removeAuthTokens()
    router.push('/portal/login')
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Member Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {organization && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">{organization.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-text-secondary">Status</div>
                <div className={`font-semibold ${
                  organization.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {organization.status}
                </div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Verification</div>
                <div className={`font-semibold ${
                  organization.is_verified ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {organization.is_verified ? 'Verified' : 'Pending Verification'}
                </div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Membership Expires</div>
                <div className="font-semibold">{organization.membership_expiry_date || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/portal/profile"
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">Organization Profile</h3>
            <p className="text-text-secondary">Update your organization information and logo</p>
          </Link>

          <Link
            href="/portal/operational-data"
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">3W Data</h3>
            <p className="text-text-secondary">Submit and manage operational presence data</p>
          </Link>

          <Link
            href="/portal/documents"
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">Documents</h3>
            <p className="text-text-secondary">Upload and manage resources</p>
          </Link>

          <Link
            href="/portal/events"
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Events</h3>
            <p className="text-text-secondary">Post and manage events</p>
          </Link>

          <Link
            href="/portal/jobs"
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">Jobs & Tenders</h3>
            <p className="text-text-secondary">Post job openings and tenders</p>
          </Link>

          <Link
            href="/portal/security"
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Security Reports</h3>
            <p className="text-text-secondary">Report security incidents using 6Ws</p>
          </Link>

          <Link
            href="/forum"
            className="p-6 border rounded-lg hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Forum</h3>
            <p className="text-text-secondary">Participate in discussions</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
