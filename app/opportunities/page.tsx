'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Rocket, TrendingUp, DollarSign, Clock, Target, Zap, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OpportunitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadOpportunities();
    }
  }, [status, router]);

  const loadOpportunities = async () => {
    try {
      const res = await fetch('/api/opportunities?limit=20');
      if (res.ok) {
        const data = await res.json();
        
        // If no opportunities exist, generate them
        if (data.opportunities.length === 0) {
          toast.info('Generating personalized opportunities for you...');
          await generateOpportunities();
          return;
        }
        
        setOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const generateOpportunities = async () => {
    try {
      const res = await fetch('/api/opportunities/generate', {
        method: 'POST',
      });
      
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities);
        toast.success(`Generated ${data.opportunities.length} opportunities based on your profile!`);
      } else {
        const error = await res.json();
        console.error('Generation error:', error);
        if (error.error === 'Please complete onboarding first') {
          toast.error('Please complete onboarding first!');
          router.push('/onboarding');
        } else {
          toast.error(error.details || error.error || 'Failed to generate opportunities');
        }
      }
    } catch (error) {
      console.error('Failed to generate opportunities:', error);
      toast.error('Failed to generate opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (opportunity: any) => {
    setSelectedOpp(opportunity);
    setValidating(true);
    setValidation(null);

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: opportunity.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Validation failed');
      }

      const data = await res.json();
      setValidation(data.validation);
      toast.success('Validation complete!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to validate');
      setSelectedOpp(null);
    } finally {
      setValidating(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'from-yellow-400 to-orange-500';
    if (score >= 80) return 'from-gray-300 to-gray-400';
    return 'from-orange-400 to-red-500';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Good Match';
    return 'Fair Match';
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold tracking-tight">VENTUREAI</span>
            </div>
            <nav className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/opportunities">
                <Button variant="ghost" size="sm">Opportunities</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">
              Discover Opportunities
            </h1>
            <p className="text-muted-foreground">
              AI-matched business opportunities based on your profile
            </p>
          </div>
          {opportunities.length > 0 && (
            <Button
              onClick={() => {
                setLoading(true);
                generateOpportunities();
              }}
              disabled={loading}
              variant="outline"
            >
              <Rocket className="h-4 w-4 mr-2" />
              {loading ? 'Generating...' : 'Generate More'}
            </Button>
          )}
        </div>

        {opportunities.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No opportunities available yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <Card
                key={opp.id}
                className="border-border hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleValidate(opp)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-primary text-primary-foreground">
                      {opp.matchScore}% {getMatchLabel(opp.matchScore)}
                    </Badge>
                    <Badge variant="outline">
                      {opp.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{opp.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {opp.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>
                      ${opp.estimatedRevenueMin.toLocaleString()} - ${opp.estimatedRevenueMax.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>Startup: ${opp.startupCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{opp.timeToLaunchHours}h to launch</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Why this matches you:</p>
                    <p className="text-sm">{opp.matchExplanation}</p>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Zap className="mr-2 h-4 w-4" />
                    Validate & Launch
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Validation Dialog */}
      <Dialog open={!!selectedOpp} onOpenChange={() => { setSelectedOpp(null); setValidation(null); }}>
        <DialogContent className="border-border max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedOpp?.title}</DialogTitle>
            <DialogDescription>
              AI-powered business validation
            </DialogDescription>
          </DialogHeader>

          {validating ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing opportunity with Claude AI...</p>
            </div>
          ) : validation ? (
            <div className="space-y-6">
              {/* Score Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Market Demand</p>
                    <div className="flex items-center gap-2">
                      <Progress value={validation.marketDemand} className="flex-1" />
                      <span className="text-lg font-bold">{validation.marketDemand}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Competitor Gaps</p>
                    <div className="flex items-center gap-2">
                      <Progress value={validation.competitorGaps} className="flex-1" />
                      <span className="text-lg font-bold">{validation.competitorGaps}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Profitability</p>
                    <div className="flex items-center gap-2">
                      <Progress value={validation.profitability} className="flex-1" />
                      <span className="text-lg font-bold">{validation.profitability}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <Progress value={100 - validation.riskScore} className="flex-1" />
                      <span className="text-lg font-bold">{validation.riskScore}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Projections */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Revenue Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Month 1</p>
                      <p className="text-lg font-semibold">
                        ${validation.revenueMonth1Min} - ${validation.revenueMonth1Max}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Month 3</p>
                      <p className="text-lg font-semibold">
                        ${validation.revenueMonth3Min} - ${validation.revenueMonth3Max}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Month 6</p>
                      <p className="text-lg font-semibold">
                        ${validation.revenueMonth6Min} - ${validation.revenueMonth6Max}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risks */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Key Risks & Mitigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {validation.risks.map((risk: any, idx: number) => (
                    <div key={idx} className="p-3 border border-border">
                      <div className="flex items-start gap-2">
                        <Badge
                          variant="outline"
                          className={
                            risk.severity === 'high'
                              ? 'border-destructive text-destructive'
                              : risk.severity === 'medium'
                              ? 'border-primary text-primary'
                              : 'border-secondary text-secondary'
                          }
                        >
                          {risk.severity.toUpperCase()}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{risk.risk}</p>
                          <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Action Plan */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Recommended Action Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {validation.actionPlan.map((action: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border border-border">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{action.step}</p>
                          <Badge variant="outline" className="text-xs">
                            {action.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{action.estimatedTime}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setSelectedOpp(null); setValidation(null); }}
                >
                  Back to Opportunities
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/business/launch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          opportunityTitle: selectedOpp.title,
                          niche: selectedOpp.niche,
                        }),
                      });
                      if (res.ok) {
                        toast.success('Business launch initiated!');
                        router.push('/dashboard');
                      }
                    } catch (error) {
                      toast.error('Failed to launch business');
                    }
                  }}
                >
                  Proceed to Launch
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
