export default function DocsPortal() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-orange-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">NGO Forum - NNGO Capacity Tool</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to the NNGO Capacity Tool</h2>
          <p className="text-gray-700 mb-6">
            A comprehensive tool for assessing and strengthening the capacity of 
            National NGOs in South Sudan.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">📊 Assessment</h3>
              <p className="text-gray-600">Conduct organizational capacity assessments</p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">📈 Development Plans</h3>
              <p className="text-gray-600">Create capacity development action plans</p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">📉 Progress Tracking</h3>
              <p className="text-gray-600">Monitor capacity building progress</p>
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
