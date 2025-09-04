import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Waves, Globe, BarChart3, MessageSquare, ArrowRight, Zap, Database, Users, Sparkles, TrendingUp, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <Waves className="h-9 w-9 text-cyan-600 transition-transform group-hover:scale-110 duration-300" />
              <div className="absolute -inset-1 bg-cyan-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-cyan-700 bg-clip-text text-transparent">
              ARGO-AI Explorer
            </span>
          </div>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 font-semibold">
              Launch Explorer
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-24 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 backdrop-blur-sm mb-8">
            <Sparkles className="h-4 w-4 text-cyan-600" />
            <span className="text-sm font-semibold text-cyan-700">AI-Powered Ocean Analytics</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent">
              Explore Global
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ocean Data
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Dive into the world's largest oceanographic dataset with conversational AI. 
            <span className="text-cyan-700 font-semibold"> Analyze ARGO float measurements</span>, 
            visualize ocean profiles, and discover patterns across the globe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-0 shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-105 px-8 py-6 text-lg font-semibold group">
                <Globe className="mr-3 h-6 w-6 transition-transform group-hover:rotate-12" />
                Start Exploring
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white backdrop-blur-sm transition-all duration-300 hover:border-cyan-400 hover:shadow-lg px-8 py-6 text-lg font-semibold group">
              <BarChart3 className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 transition-transform group-hover:scale-110">
                3,000+
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wider font-semibold">Active ARGO Floats</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 transition-transform group-hover:scale-110">
                2M+
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wider font-semibold">Ocean Profiles</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 transition-transform group-hover:scale-110">
                20+
              </div>
              <div className="text-gray-600 text-sm uppercase tracking-wider font-semibold">Years of Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 backdrop-blur-sm mb-6">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Advanced Analytics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Powerful Ocean Analytics
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Advanced tools and AI-driven insights to unlock the secrets of our oceans with cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-cyan-300 hover:-translate-y-2">
            <CardHeader className="pb-4">
              <div className="relative mb-4">
                <Globe className="h-10 w-10 text-cyan-600 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300" />
                <div className="absolute -inset-2 bg-cyan-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">
                Interactive 3D Globe
              </CardTitle>
              <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed font-medium">
                Explore ARGO float locations on a beautiful 3D Earth visualization with real-time data and interactive controls
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-indigo-300 hover:-translate-y-2">
            <CardHeader className="pb-4">
              <div className="relative mb-4">
                <MessageSquare className="h-10 w-10 text-indigo-600 transition-transform group-hover:scale-110 duration-300" />
                <div className="absolute -inset-2 bg-indigo-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                AI Chat Interface
              </CardTitle>
              <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed font-medium">
                Ask questions in natural language and get intelligent insights about ocean data with advanced AI models
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-emerald-300 hover:-translate-y-2">
            <CardHeader className="pb-4">
              <div className="relative mb-4">
                <BarChart3 className="h-10 w-10 text-emerald-600 transition-transform group-hover:scale-110 duration-300" />
                <div className="absolute -inset-2 bg-emerald-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Advanced Visualizations
              </CardTitle>
              <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed font-medium">
                Interactive charts for temperature, salinity, and biogeochemical profiles with customizable parameters
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-amber-300 hover:-translate-y-2">
            <CardHeader className="pb-4">
              <div className="relative mb-4">
                <Zap className="h-10 w-10 text-amber-600 transition-transform group-hover:scale-110 duration-300" />
                <div className="absolute -inset-2 bg-amber-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                Real-time Analysis
              </CardTitle>
              <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed font-medium">
                Instant processing and analysis of oceanographic measurements with lightning-fast performance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-blue-300 hover:-translate-y-2">
            <CardHeader className="pb-4">
              <div className="relative mb-4">
                <Database className="h-10 w-10 text-blue-600 transition-transform group-hover:scale-110 duration-300" />
                <div className="absolute -inset-2 bg-blue-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Comprehensive Dataset
              </CardTitle>
              <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed font-medium">
                Access to thousands of ARGO floats with historical and current data spanning decades of observations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-violet-300 hover:-translate-y-2">
            <CardHeader className="pb-4">
              <div className="relative mb-4">
                <Users className="h-10 w-10 text-violet-600 transition-transform group-hover:scale-110 duration-300" />
                <div className="absolute -inset-2 bg-violet-600/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                Research Collaboration
              </CardTitle>
              <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed font-medium">
                Share findings and collaborate with the global oceanographic community through integrated tools
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="relative bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 shadow-xl overflow-hidden group hover:border-cyan-300 transition-all duration-500">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/20 to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardHeader className="relative z-10 pb-6">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-300">
                  <Shield className="h-8 w-8 text-cyan-700" />
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-cyan-800 bg-clip-text text-transparent mb-4">
                Ready to Dive Into Ocean Science?
              </CardTitle>
              <CardDescription className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
                Join researchers worldwide in exploring the depths of our oceans with 
                <span className="text-cyan-700 font-semibold"> AI-powered insights</span> and 
                comprehensive data analysis tools
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pb-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-0 shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-105 px-8 py-6 text-lg font-semibold group">
                    <Waves className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
                    Launch ARGO-AI Explorer
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white backdrop-blur-sm transition-all duration-300 hover:border-cyan-400 px-8 py-6 text-lg font-semibold">
                  Learn More
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Real-time Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-600" />
                  <span className="font-medium">Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium">Global Community</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-gray-50/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4 group">
                <div className="relative">
                  <Waves className="h-8 w-8 text-cyan-600 transition-transform group-hover:scale-110 duration-300" />
                  <div className="absolute -inset-1 bg-cyan-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-cyan-700 bg-clip-text text-transparent">
                  ARGO-AI Explorer
                </span>
              </div>
              <p className="text-gray-600 max-w-md leading-relaxed font-medium">
                Empowering ocean research through AI-driven analytics and comprehensive oceanographic data exploration.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors font-medium">Dashboard</a></li>
                <li><a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors font-medium">Data Explorer</a></li>
                <li><a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors font-medium">AI Analytics</a></li>
                <li><a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors font-medium">Visualizations</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors font-medium">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors font-medium">API Reference</a></li>
                <li><a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors font-medium">Community</a></li>
                <li><a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors font-medium">Support</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0 font-medium">
              © 2025 ARGO-AI Explorer. Powered by ARGO Global Ocean Observing System.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors text-sm font-medium">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-cyan-600 transition-colors text-sm font-medium">Terms of Service</a>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
