'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/members', label: 'Members' },
    { href: '/events', label: 'Events' },
    { href: '/resources', label: 'Resources' },
  ]

  const toolsLinks = [
    { href: '/tools/3w-mapping', label: '3W Mapping', icon: '🗺️' },
    { href: '/jobs', label: 'Jobs & Opportunities', icon: '💼' },
    { href: '/forum', label: 'Discussion Forum', icon: '💬' },
  ]

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-background-surface/80 backdrop-blur-xl border-b border-border shadow-elevated' 
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-accent via-accent-light to-secondary flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300 group-hover:scale-105">
                  <span className="text-background font-bold text-lg lg:text-xl">SS</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg lg:text-xl font-bold text-text-primary group-hover:text-accent transition-colors duration-300">
                  South Sudan
                </div>
                <div className="text-xs lg:text-sm text-text-secondary -mt-0.5">NGO Forum</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="relative px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-secondary group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </Link>
              ))}

              {/* Tools Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
              >
                <button className="flex items-center px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 group">
                  Tools
                  <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`absolute top-full left-0 mt-2 w-64 transition-all duration-300 ${toolsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <div className="absolute -top-2 left-0 right-0 h-4" />
                  <div className="glass-card rounded-2xl p-2 border border-border">
                    {toolsLinks.map((tool, index) => (
                      <Link key={tool.href} href={tool.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-background/50 transition-all duration-200 group ${index > 0 ? 'mt-1' : ''}`}>
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">{tool.icon}</span>
                        <span className="font-medium">{tool.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/contact" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
                Contact
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/membership" className="text-sm font-medium text-accent hover:text-accent-light transition-colors duration-200">
                Join Us
              </Link>
              <Link href="/portal/login" className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-background font-semibold text-sm overflow-hidden transition-all duration-300 hover:shadow-glow-md hover:scale-[1.02]">
                <span className="relative z-10">Member Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-light to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-text-primary rounded-xl hover:bg-background-surface transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transform transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current transform transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 w-full max-w-sm h-full bg-background-surface border-l border-border shadow-elevated transform transition-transform duration-500 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full pt-20 pb-8 px-6">
            <nav className="flex-1 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center py-4 text-lg font-medium text-text-secondary hover:text-accent border-b border-border/50 transition-all duration-200">
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Tools & Features</div>
                {toolsLinks.map((tool) => (
                  <Link key={tool.href} href={tool.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-text-secondary hover:text-accent transition-colors duration-200">
                    <span className="text-xl">{tool.icon}</span>
                    <span className="font-medium">{tool.label}</span>
                  </Link>
                ))}
              </div>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-4 text-lg font-medium text-text-secondary hover:text-accent border-b border-border/50 transition-colors duration-200">
                Contact
              </Link>
            </nav>
            <div className="space-y-3 pt-6 border-t border-border">
              <Link href="/membership" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center text-accent font-semibold border-2 border-accent rounded-xl hover:bg-accent/10 transition-colors duration-200">
                Become a Member
              </Link>
              <Link href="/portal/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center bg-gradient-to-r from-accent to-accent-light text-background font-semibold rounded-xl shadow-glow-sm">
                Member Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 lg:h-20" />
    </>
  )
}
