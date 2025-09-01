export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#00d4ff] to-[#39ff14] bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete guide to using FSIDE Pro for full-stack development
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 text-[#00d4ff]">Quick Navigation</h3>
              <nav className="space-y-2">
                {[
                  "Getting Started",
                  "Installation",
                  "Configuration",
                  "IDE Features",
                  "AI Integration",
                  "Collaboration",
                  "API Reference",
                  "Deployment",
                  "Troubleshooting",
                ].map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="block text-gray-300 hover:text-[#39ff14] transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <section id="getting-started" className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#00d4ff]">Getting Started</h2>
              <p className="text-gray-300 mb-4">
                Welcome to FSIDE Pro! This comprehensive guide will help you set up and start using the most advanced
                full-stack development environment.
              </p>
              <div className="bg-black/30 rounded-lg p-4 mb-4">
                <code className="text-[#39ff14]">npm install -g fside-pro-cli</code>
              </div>
            </section>

            <section id="installation" className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#00d4ff]">Installation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#39ff14]">Prerequisites</h3>
                  <ul className="text-gray-300 space-y-1 ml-4">
                    <li>• Node.js 18+ and npm</li>
                    <li>• Python 3.9+ and pip</li>
                    <li>• Docker and Docker Compose</li>
                    <li>• Git</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#39ff14]">Quick Setup</h3>
                  <div className="bg-black/30 rounded-lg p-4 space-y-2">
                    <div>
                      <code className="text-[#39ff14]">git clone https://github.com/your-repo/fside-pro.git</code>
                    </div>
                    <div>
                      <code className="text-[#39ff14]">cd fside-pro</code>
                    </div>
                    <div>
                      <code className="text-[#39ff14]">make setup</code>
                    </div>
                    <div>
                      <code className="text-[#39ff14]">make dev</code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="configuration" className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#00d4ff]">Configuration</h2>
              <p className="text-gray-300 mb-4">Configure your FSIDE Pro environment with the following settings:</p>
              <div className="bg-black/30 rounded-lg p-4">
                <pre className="text-[#39ff14] text-sm">
                  {`# .env.local (Frontend - Client-side variables)
NEXT_PUBLIC_API_URL=http://localhost:8000

# .env (Backend - Server-side only - NEVER expose to client)
HUGGINGFACE_API_TOKEN=your_token_here
DATABASE_URL=postgresql://user:pass@localhost:5432/fside
REDIS_URL=redis://localhost:6379
DJANGO_SECRET_KEY=your_secret_key_here`}
                </pre>
              </div>
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">
                  <strong>⚠️ Security Note:</strong> Never expose sensitive tokens like HUGGINGFACE_API_TOKEN to the
                  client. Only use NEXT_PUBLIC_ prefixed variables for client-side access. Keep API tokens and secrets
                  server-side only.
                </p>
              </div>
            </section>

            <section id="ide-features" className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#00d4ff]">IDE Features</h2>
              <p className="text-gray-300 mb-4">
                Explore the powerful features of FSIDE Pro's integrated development environment.
              </p>
            </section>

            <section id="ai-integration" className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#00d4ff]">AI Integration</h2>
              <p className="text-gray-300 mb-4">
                Learn how to integrate AI tools and services into your FSIDE Pro projects.
              </p>
            </section>

            <section id="collaboration" className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#00d4ff]">Collaboration</h2>
              <p className="text-gray-300 mb-4">
                Discover how FSIDE Pro facilitates seamless collaboration among team members.
              </p>
            </section>

            <section id="api-reference" className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#00d4ff]">API Reference</h2>
              <p className="text-gray-300 mb-4">Find detailed information about the APIs available in FSIDE Pro.</p>
            </section>

            <section id="deployment" className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#00d4ff]">Deployment</h2>
              <p className="text-gray-300 mb-4">
                Guidelines for deploying your FSIDE Pro projects to production environments.
              </p>
            </section>

            <section id="troubleshooting" className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#00d4ff]">Troubleshooting</h2>
              <p className="text-gray-300 mb-4">Common issues and solutions when using FSIDE Pro.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
