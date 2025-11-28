'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, TrendingUp, Briefcase, DollarSign, Users, ArrowRight, Play, Pause, CheckCircle, Globe, Sparkles, BarChart3, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadData();
    }
  }, [status, router]);

  const loadData = async () => {
    try {
      const [profileRes, businessesRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/business'),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.user);

        // Redirect to onboarding if not complete
        if (!profileData.user.onboardingComplete) {
          router.push('/onboarding');
          return;
        }
      }

      if (businessesRes.ok) {
        const businessesData = await businessesRes.json();
        setBusinesses(businessesData.businesses);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
            <Rocket className="relative h-12 w-12 text-primary animate-bounce" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = businesses.reduce((sum, b) => {
    const latestMetric = b.metrics?.[0];
    return sum + (latestMetric?.revenue || 0);
  }, 0);

  const totalCustomers = businesses.reduce((sum, b) => {
    const latestMetric = b.metrics?.[0];
    return sum + (latestMetric?.customers || 0);
  }, 0);

  const activeBusinesses = businesses.filter(b => b.status === 'live').length;

  const updateBusinessStatus = async (businessId: string, newStatus: string) => {
    setUpdating(businessId);
    try {
      const res = await fetch(`/api/business/${businessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Business status updated to ${newStatus}`);
        await loadData();
      } else {
        const error = await res.json();
        console.error('Update error:', error);
        toast.error(error.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update exception:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl" />
                <Rocket className="relative h-8 w-8 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">VentureAI</span>
            </div>
            <nav className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="font-medium">Dashboard</Button>
              </Link>
              <Link href="/opportunities">
                <Button variant="ghost" size="sm" className="font-medium">Opportunities</Button>
              </Link>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                {profile?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, {profile?.name || 'Entrepreneur'}
            </h1>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground">
            Here's what's happening with your businesses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <Card className="relative overflow-hidden border-border bg-card hover:shadow-premium transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">{businesses.length}</span>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Across all stages</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border bg-card hover:shadow-premium transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active Businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">{activeBusinesses}</span>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Currently live</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border bg-card hover:shadow-premium transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">${totalRevenue.toLocaleString()}</span>
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-medium mt-3">+12.5% this month</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-border bg-card hover:shadow-premium transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <CardDescription className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">{totalCustomers}</span>
                <div className="p-3 rounded-xl bg-orange-500/10">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Across all businesses</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="group relative overflow-hidden border-border bg-card hover:shadow-premium transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                Discover New Opportunities
              </CardTitle>
              <CardDescription className="text-base">
                Find validated business ideas matched to your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full gradient-primary font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link href="/opportunities">
                  Browse Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border bg-card hover:shadow-premium transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                Launch a New Business
              </CardTitle>
              <CardDescription className="text-base">
                Start your business launch wizard with AI guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full font-semibold border-2 hover:bg-accent">
                <Link href="/opportunities">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Businesses List */}
        <Card className="border-border bg-card shadow-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Your Businesses
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Manage and track your launched businesses
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {businesses.length === 0 ? (
              <div className="text-center py-16">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl" />
                  <Briefcase className="relative h-16 w-16 text-muted-foreground mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No businesses yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">Start your entrepreneurial journey by exploring validated business opportunities</p>
                <Link href="/opportunities">
                  <Button className="gradient-primary font-semibold shadow-lg shadow-primary/25">
                    Explore Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {businesses.map((business) => {
                  const latestMetric = business.metrics?.[0];
                  return (
                    <div
                      key={business.id}
                      className="p-6 rounded-xl border border-border bg-gradient-to-br from-card to-card/50 hover:shadow-premium transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{business.opportunityTitle}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{business.niche}</p>
                          {business.launchProgress > 0 && business.launchProgress < 100 && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                                <span>Launch Progress: {business.launchProgress}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500"
                                  style={{ width: `${business.launchProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={business.status === 'live' ? 'default' : 'outline'}
                            className={
                              business.status === 'live'
                                ? 'bg-green-500 text-white font-semibold px-3 py-1'
                                : business.status === 'building'
                                ? 'bg-orange-500 text-white font-semibold px-3 py-1'
                                : 'font-semibold px-3 py-1'
                            }
                          >
                            {business.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3 mb-3">
                        {business.status === 'planning' && (
                          <Link href={`/business/${business.id}/launch`}>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                              <Rocket className="h-3 w-3 mr-1" />
                              Launch Wizard
                            </Button>
                          </Link>
                        )}
                        {business.status === 'building' && (
                          <>
                            <Link href={`/business/${business.id}/launch`}>
                              <Button size="sm" className="bg-primary hover:bg-primary/90">
                                <Rocket className="h-3 w-3 mr-1" />
                                Continue Wizard
                              </Button>
                            </Link>
                            <Link href={`/business/${business.id}/builder`}>
                              <Button size="sm" variant="outline">
                                <Globe className="h-3 w-3 mr-1" />
                                Build Website
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              className="bg-secondary hover:bg-secondary/90"
                              onClick={() => updateBusinessStatus(business.id, 'live')}
                              disabled={updating === business.id}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {updating === business.id ? 'Updating...' : 'Go Live'}
                            </Button>
                          </>
                        )}
                        {business.status === 'live' && (
                          <>
                            <Link href={`/business/${business.id}/builder`}>
                              <Button size="sm" className="bg-primary hover:bg-primary/90">
                                <Globe className="h-3 w-3 mr-1" />
                                Build Website
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateBusinessStatus(business.id, 'paused')}
                              disabled={updating === business.id}
                            >
                              <Pause className="h-3 w-3 mr-1" />
                              {updating === business.id ? 'Updating...' : 'Pause'}
                            </Button>
                          </>
                        )}
                        {business.status === 'paused' && (
                          <Button 
                            size="sm" 
                            className="bg-secondary hover:bg-secondary/90"
                            onClick={() => updateBusinessStatus(business.id, 'live')}
                            disabled={updating === business.id}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {updating === business.id ? 'Updating...' : 'Resume'}
                          </Button>
                        )}
                      </div>

                      {latestMetric && (
                        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Visitors</p>
                            <p className="text-2xl font-bold">{latestMetric.visitors}</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Leads</p>
                            <p className="text-2xl font-bold">{latestMetric.leads}</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Customers</p>
                            <p className="text-2xl font-bold">{latestMetric.customers}</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Revenue</p>
                            <p className="text-2xl font-bold">${latestMetric.revenue}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
