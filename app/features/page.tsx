export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#00d4ff] to-[#39ff14] bg-clip-text text-transparent">
            FSIDE Pro Features
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the powerful features that make FSIDE Pro the ultimate full-stack development environment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Code Generation",
              description: "Generate React components and Django models with advanced AI assistance",
              icon: "🤖",
            },
            {
              title: "Real-time Collaboration",
              description: "Work together with your team in real-time with live cursors and instant sync",
              icon: "👥",
            },
            {
              title: "3D API Visualization",
              description: "Visualize your API relationships and dependencies in stunning 3D",
              icon: "🌐",
            },
            {
              title: "Monaco Editor Integration",
              description: "Full VS Code editor experience with syntax highlighting and IntelliSense",
              icon: "💻",
            },
            {
              title: "Docker Deployment",
              description: "Production-ready containerization with one-click deployment",
              icon: "🐳",
            },
            {
              title: "Performance Analytics",
              description: "Monitor your application performance with detailed metrics and insights",
              icon: "📊",
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-[#00d4ff]">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
