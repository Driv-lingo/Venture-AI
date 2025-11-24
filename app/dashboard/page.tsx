'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, TrendingUp, Briefcase, DollarSign, Users, ArrowRight, Play, Pause, CheckCircle, Globe } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
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
              <div className="h-8 w-8 border border-border bg-muted flex items-center justify-center text-sm font-bold">
                {profile?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            Welcome back, {profile?.name || 'Entrepreneur'}
          </h1>
          <p className="text-muted-foreground">
            Mission Control — Here's what's happening with your businesses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wide">Total Businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{businesses.length}</span>
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wide">Active Businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{activeBusinesses}</span>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wide">Total Revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">${totalRevenue.toLocaleString()}</span>
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wide">Total Customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{totalCustomers}</span>
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Rocket className="h-5 w-5 text-primary" />
                Discover New Opportunities
              </CardTitle>
              <CardDescription>
                Find validated business ideas matched to your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/opportunities">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Browse Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Launch a New Business
              </CardTitle>
              <CardDescription>
                Start your business launch wizard with AI guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/opportunities">
                <Button variant="outline" className="w-full">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Businesses List */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Your Businesses</CardTitle>
            <CardDescription>
              Manage and track your launched businesses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {businesses.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You haven't launched any businesses yet</p>
                <Link href="/opportunities">
                  <Button className="bg-primary hover:bg-primary/90">
                    Explore Opportunities
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.map((business) => {
                  const latestMetric = business.metrics?.[0];
                  return (
                    <div
                      key={business.id}
                      className="p-4 border border-border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{business.opportunityTitle}</h3>
                          <p className="text-sm text-muted-foreground">{business.niche}</p>
                          {business.launchProgress > 0 && business.launchProgress < 100 && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <span>Launch Progress: {business.launchProgress}%</span>
                              </div>
                              <div className="h-1 bg-muted overflow-hidden">
                                <div 
                                  className="h-full bg-primary"
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
                                ? 'bg-primary text-primary-foreground'
                                : business.status === 'building'
                                ? 'bg-secondary text-secondary-foreground'
                                : ''
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
                        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
                          <div>
                            <p className="text-xs text-gray-500">Visitors</p>
                            <p className="text-lg font-semibold text-white">{latestMetric.visitors}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Leads</p>
                            <p className="text-lg font-semibold text-white">{latestMetric.leads}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Customers</p>
                            <p className="text-lg font-semibold text-white">{latestMetric.customers}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Revenue</p>
                            <p className="text-lg font-semibold text-white">${latestMetric.revenue}</p>
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
