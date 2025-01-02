// src/components/home/CTA.tsx
export default function CTA() {
    return (
      <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        </div>
  
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Main Content */}
            <div className="space-y-20">
              {/* Hero Section */}
              <div className="text-center space-y-8">
                <div className="inline-flex items-center gap-2 bg-slate-900/5 px-4 py-2 rounded-full text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  New: Advanced Price Analytics
                </div>
  
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Scan. Analyze.
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {" "}Profit.
                  </span>
                </h1>
  
                <p className="text-slate-600 text-xl md:text-2xl max-w-2xl mx-auto">
                  Instantly analyze Amazon prices with our barcode scanner
                </p>
  
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button className="btn btn-primary btn-lg rounded-full px-8 h-14 min-h-14">
                    Start Free Trial
                  </button>
                  <button className="btn btn-ghost btn-lg h-14 min-h-14">
                    Watch Demo →
                  </button>
                </div>
              </div>
  
              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Instant Scan",
                    description: "Scan any barcode for immediate price analysis",
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    )
                  },
                  {
                    title: "Price History",
                    description: "Track historical price changes and trends",
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    )
                  },
                  {
                    title: "Smart Insights",
                    description: "Get AI-powered pricing recommendations",
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/80 transition-all duration-300"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }