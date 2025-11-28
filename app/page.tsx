import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, TrendingUp, Zap, Target, Sparkles, BarChart3, Shield, Users2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl" />
                  <Rocket className="relative h-8 w-8 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">VentureAI</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="gradient-primary font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">AI-Powered Business Intelligence</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-balance">
                Launch Your Next
                <span className="block bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent mt-2">
                  Profitable Business
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover validated business opportunities, get AI-powered insights, and launch 
                profitable online businesses in days, not months.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link href="/auth/signup">
                  <Button size="lg" className="gradient-primary font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all text-lg px-8 py-6">
                    Start Building Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/opportunities">
                  <Button size="lg" variant="outline" className="font-semibold text-lg px-8 py-6 border-2">
                    Explore Opportunities
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground mb-20">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">10,000+ Entrepreneurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="font-medium">$50M+ Revenue Generated</span>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative p-8 rounded-2xl border border-border bg-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">Market Intelligence</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI analyzes trends from Google, Reddit, Product Hunt, and Indie Hackers to find hot opportunities.
                  </p>
                </div>
              </div>

              <div className="group relative p-8 rounded-2xl border border-border bg-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Target className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">AI Validation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get instant business validation with market demand scores, competitor analysis, and revenue projections.
                  </p>
                </div>
              </div>

              <div className="group relative p-8 rounded-2xl border border-border bg-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Rocket className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">Rapid Launch</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Follow our AI-guided 8-step wizard to launch your business from idea to live in days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 mt-32 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">VentureAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 VentureAI. Enterprise-grade business intelligence platform.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Built with Next.js, Redis, and Claude AI.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
