export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#00d4ff] to-[#39ff14] bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get help with FSIDE Pro and connect with our support team
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold mb-6 text-[#00d4ff]">Contact Support</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <input
                  type="email"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white">
                  <option value="">Select a topic</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                <textarea
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  placeholder="Describe your issue or question..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#00d4ff] text-black py-3 rounded-lg font-semibold hover:bg-[#00b8e6] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-[#39ff14]">Quick Help</h3>
              <div className="space-y-3">
                <a href="/docs" className="block text-gray-300 hover:text-[#00d4ff] transition-colors">
                  📚 Documentation
                </a>
                <a href="/docs#troubleshooting" className="block text-gray-300 hover:text-[#00d4ff] transition-colors">
                  🔧 Troubleshooting Guide
                </a>
                <a href="/docs#api-reference" className="block text-gray-300 hover:text-[#00d4ff] transition-colors">
                  🔗 API Reference
                </a>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-[#39ff14]">Community</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-300 hover:text-[#00d4ff] transition-colors">
                  💬 Discord Community
                </a>
                <a href="#" className="block text-gray-300 hover:text-[#00d4ff] transition-colors">
                  📧 Mailing List
                </a>
                <a href="#" className="block text-gray-300 hover:text-[#00d4ff] transition-colors">
                  🐛 Report Bug
                </a>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-[#39ff14]">Response Times</h3>
              <div className="space-y-2 text-gray-300">
                <div>🚀 Critical Issues: 2-4 hours</div>
                <div>⚡ General Support: 24-48 hours</div>
                <div>💡 Feature Requests: 3-5 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
