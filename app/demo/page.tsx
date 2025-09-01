export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#00d4ff] to-[#39ff14] bg-clip-text text-transparent">
            Live Demo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience FSIDE Pro in action with our interactive demo
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#00d4ff]">Interactive Demo Environment</h2>
            <p className="text-gray-300 mb-6">
              Try out FSIDE Pro's core features in a sandboxed environment. No registration required!
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-[#39ff14]">Code Editor Demo</h3>
                <p className="text-gray-300 mb-4">Experience the Monaco editor with syntax highlighting</p>
                <button className="bg-[#00d4ff] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00b8e6] transition-colors">
                  Launch Editor
                </button>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-[#39ff14]">AI Assistant Demo</h3>
                <p className="text-gray-300 mb-4">Test AI-powered code generation capabilities</p>
                <button className="bg-[#39ff14] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#32e012] transition-colors">
                  Try AI Assistant
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-300 mb-4">Ready to get started with the full version?</p>
            <button className="bg-gradient-to-r from-[#00d4ff] to-[#39ff14] text-black px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
