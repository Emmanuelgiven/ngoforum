export default function DocsPortal() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">NGO Forum - Services Portal</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to the Services Portal</h2>
          <p className="text-gray-700 mb-6">
            Access member services, technical support, and capacity building 
            resources provided by the South Sudan NGO Forum.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🎓 Training</h3>
              <p className="text-gray-600">Capacity building and training programs</p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">💡 Technical Support</h3>
              <p className="text-gray-600">Get technical assistance and guidance</p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🤝 Partnerships</h3>
              <p className="text-gray-600">Partnership and collaboration opportunities</p>
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
