import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, TrendingUp, Zap, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Rocket className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold tracking-tight">VENTUREAI</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border border-border bg-muted">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium tracking-wide uppercase">Mission Control</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Launch Your Next
              <span className="block text-primary mt-2">
                Profitable Business
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
              Discover validated business opportunities, get AI-powered insights, and launch 
              profitable online businesses in days, not months.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-20">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                  Start Building Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/opportunities">
                <Button size="lg" variant="outline">
                  Explore Opportunities
                </Button>
              </Link>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">Market Intelligence</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI analyzes trends from Google, Reddit, Product Hunt, and Indie Hackers to find hot opportunities.
                </p>
              </div>

              <div className="p-6 border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">AI Validation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get instant business validation with market demand scores, competitor analysis, and revenue projections.
                </p>
              </div>

              <div className="p-6 border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-4">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">Rapid Launch</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Follow our AI-guided 8-step wizard to launch your business from idea to live in days.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 mt-32 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 VentureAI. Built with Next.js, Redis, and Claude AI.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
