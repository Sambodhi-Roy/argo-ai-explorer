import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Waves, Globe, BarChart3, MessageSquare, ArrowRight, Zap, Database, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Waves className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">ARGO-AI Explorer</span>
          </div>
          <Link href="/dashboard">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              Launch Explorer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-6 text-balance">
            Explore Global Ocean Data with
            <span className="text-cyan-400"> AI-Powered Insights</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 text-pretty">
            Dive into the world's largest oceanographic dataset with conversational AI. Analyze ARGO float measurements,
            visualize ocean profiles, and discover patterns in temperature, salinity, and biogeochemical data across the
            globe.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                <Globe className="mr-2 h-5 w-5" />
                Start Exploring
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <BarChart3 className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Ocean Analytics</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Advanced tools and AI-driven insights to unlock the secrets of our oceans
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Globe className="h-8 w-8 text-cyan-400 mb-2" />
              <CardTitle className="text-white">Interactive 3D Globe</CardTitle>
              <CardDescription className="text-gray-300">
                Explore ARGO float locations on a beautiful 3D Earth visualization with real-time data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-cyan-400 mb-2" />
              <CardTitle className="text-white">AI Chat Interface</CardTitle>
              <CardDescription className="text-gray-300">
                Ask questions in natural language and get intelligent insights about ocean data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-cyan-400 mb-2" />
              <CardTitle className="text-white">Advanced Visualizations</CardTitle>
              <CardDescription className="text-gray-300">
                Interactive charts for temperature, salinity, and biogeochemical profiles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Zap className="h-8 w-8 text-cyan-400 mb-2" />
              <CardTitle className="text-white">Real-time Analysis</CardTitle>
              <CardDescription className="text-gray-300">
                Instant processing and analysis of oceanographic measurements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Database className="h-8 w-8 text-cyan-400 mb-2" />
              <CardTitle className="text-white">Comprehensive Dataset</CardTitle>
              <CardDescription className="text-gray-300">
                Access to thousands of ARGO floats with historical and current data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Users className="h-8 w-8 text-cyan-400 mb-2" />
              <CardTitle className="text-white">Research Collaboration</CardTitle>
              <CardDescription className="text-gray-300">
                Share findings and collaborate with the global oceanographic community
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-400/30 backdrop-blur-sm max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Ready to Dive In?</CardTitle>
            <CardDescription className="text-gray-300">
              Start exploring global ocean data with AI-powered insights today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                <Waves className="mr-2 h-5 w-5" />
                Launch ARGO-AI Explorer
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waves className="h-6 w-6 text-cyan-400" />
            <span className="text-lg font-semibold text-white">ARGO-AI Explorer</span>
          </div>
          <p className="text-gray-400 text-sm">
            Powered by ARGO Global Ocean Observing System • Built with AI for Ocean Science
          </p>
        </div>
      </footer>
    </div>
  )
}
