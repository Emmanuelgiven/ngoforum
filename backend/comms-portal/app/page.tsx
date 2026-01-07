export default function DocsPortal() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">NGO Forum - Communications Portal</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to the Communications Portal</h2>
          <p className="text-gray-700 mb-6">
            Stay connected with the latest news, press releases, and communication 
            materials from the South Sudan NGO Forum.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">📰 Press Releases</h3>
              <p className="text-gray-600">Latest press releases and media statements</p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">📢 Announcements</h3>
              <p className="text-gray-600">Important announcements and updates</p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🎯 Campaigns</h3>
              <p className="text-gray-600">Advocacy campaigns and initiatives</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <a href="/" className="text-blue-600 hover:underline">
              ← Back to main site
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
