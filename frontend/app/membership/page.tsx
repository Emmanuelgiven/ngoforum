import Link from "next/link";

export default function MembershipPage() {
  const benefits = [
    {
      icon: "🌐",
      title: "Global Network Access",
      description: "Connect with NGOs across 150+ countries and expand your reach internationally."
    },
    {
      icon: "📚",
      title: "Resource Library",
      description: "Access exclusive guides, templates, and best practices from leading organizations."
    },
    {
      icon: "🎓",
      title: "Training & Workshops",
      description: "Participate in capacity-building programs and professional development sessions."
    },
    {
      icon: "🤝",
      title: "Partnership Opportunities",
      description: "Find collaboration partners and joint venture opportunities within our network."
    },
    {
      icon: "📢",
      title: "Advocacy Platform",
      description: "Amplify your voice on critical issues through our collective advocacy efforts."
    },
    {
      icon: "💼",
      title: "Funding Connections",
      description: "Get introduced to donors, grants, and funding opportunities tailored to your mission."
    }
  ];

  const includedFeatures = [
    "Full access to member directory and networking tools",
    "Priority registration for all events and conferences",
    "Exclusive member-only webinars and workshops",
    "Resource library with 500+ documents and templates",
    "Quarterly impact reports and sector insights",
    "Dedicated member support and consultation",
    "Logo placement on our partner organizations page",
    "Voting rights in annual general meetings"
  ];

  const applicationSteps = [
    {
      step: 1,
      title: "Create Account",
      description: "Register on our portal with your organization's details and contact information."
    },
    {
      step: 2,
      title: "Submit Application",
      description: "Complete the membership application form with required documentation."
    },
    {
      step: 3,
      title: "Review Process",
      description: "Our membership committee reviews applications within 5-7 business days."
    },
    {
      step: 4,
      title: "Welcome Aboard",
      description: "Upon approval, pay the annual fee and unlock all member benefits immediately."
    }
  ];

  const eligibilityRequirements = [
    "Registered non-profit or NGO status in your country of operation",
    "Minimum of 1 year of active operations",
    "Alignment with our mission and values",
    "Commitment to ethical practices and transparency",
    "Willingness to participate in network activities"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="animated-gradient absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-surface border border-gray-800 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-400">Now accepting new members for 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Join the Leading
              <span className="gradient-text block mt-2">NGO Network</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Become part of a global community dedicated to creating positive change. 
              Connect, collaborate, and amplify your impact with organizations worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portal/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
              >
                Apply for Membership
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full border border-gray-700 text-gray-300 hover:bg-background-surface hover:border-gray-600 transition-all duration-300"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Join <span className="gradient-text">Our Network?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Unlock a world of opportunities designed to help your organization thrive and make a greater impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-background-surface border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-background-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              One annual fee gives you complete access to everything our network has to offer.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="relative rounded-3xl bg-background-surface border border-gray-800 overflow-hidden">
              {/* Popular badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-bl-2xl">
                  Annual Membership
                </div>
              </div>

              <div className="p-10">
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-2xl text-gray-400">$</span>
                    <span className="text-7xl font-bold gradient-text">200</span>
                    <span className="text-xl text-gray-400">/year</span>
                  </div>
                  <p className="text-gray-400">
                    Less than $17/month for unlimited access
                  </p>
                </div>

                <div className="space-y-4 mb-10">
                  {includedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/portal/login"
                  className="block w-full py-4 text-center text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  Get Started Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How to <span className="gradient-text">Apply</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to join our network.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-600 via-purple-600 to-transparent hidden md:block" />

              <div className="space-y-8">
                {applicationSteps.map((step, index) => (
                  <div key={index} className="relative flex gap-6 md:gap-8">
                    {/* Step number */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/25">
                      {step.step}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 rounded-3xl bg-background-surface border border-gray-800">
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {step.title}
                      </h3>
                      <p className="text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-24 bg-background-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Eligibility <span className="gradient-text">Requirements</span>
              </h2>
              <p className="text-gray-400 text-lg">
                We welcome organizations that meet the following criteria.
              </p>
            </div>

            <div className="rounded-3xl bg-background-surface border border-gray-800 p-8 md:p-10">
              <div className="space-y-4">
                {eligibilityRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-lg">{requirement}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-800">
                <p className="text-gray-400 text-center">
                  Not sure if you qualify?{" "}
                  <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                    Contact us
                  </Link>{" "}
                  and we'll be happy to help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="animated-gradient absolute inset-0 opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Make a <span className="gradient-text">Greater Impact?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join hundreds of organizations already benefiting from our network. 
            Your journey to greater collaboration starts here.
          </p>
          
          <Link
            href="/portal/login"
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
          >
            Apply Now
            <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <p className="mt-6 text-gray-500 text-sm">
            Applications are reviewed within 5-7 business days
          </p>
        </div>
      </section>
    </div>
  );
}
