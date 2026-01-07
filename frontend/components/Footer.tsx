import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-background-surface border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">South Sudan NGO Forum</h3>
            <p className="text-text-secondary">
              Coordinating humanitarian action and development initiatives across South Sudan
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-accent transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-text-secondary hover:text-accent transition">
                  Members
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-text-secondary hover:text-accent transition">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-text-secondary hover:text-accent transition">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="text-text-secondary hover:text-accent transition">
                  Documents
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-text-secondary hover:text-accent transition">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/tools/3w-mapping" className="text-text-secondary hover:text-accent transition">
                  3W Mapping
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-text-secondary hover:text-accent transition">
                  Jobs & Tenders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-text-primary">Portals</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://docs.southsudanngoforum.org" className="text-text-secondary hover:text-accent transition">
                  Documents Portal
                </a>
              </li>
              <li>
                <a href="https://comms.southsudanngoforum.org" className="text-text-secondary hover:text-accent transition">
                  Communications
                </a>
              </li>
              <li>
                <a href="https://services.southsudanngoforum.org" className="text-text-secondary hover:text-accent transition">
                  Services
                </a>
              </li>
              <li>
                <a href="https://nngocaptool.southsudanngoforum.org" className="text-text-secondary hover:text-accent transition">
                  NNGO Cap Tool
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-text-secondary">
          <p>&copy; {new Date().getFullYear()} South Sudan NGO Forum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
