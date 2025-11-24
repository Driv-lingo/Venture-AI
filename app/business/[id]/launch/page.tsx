'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Loader2, Rocket } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Domain Name', description: 'Choose your business domain' },
  { id: 2, title: 'Brand Identity', description: 'Define your brand' },
  { id: 3, title: 'MVP Specification', description: 'Plan your minimum viable product' },
  { id: 4, title: 'Landing Page', description: 'Create your landing page copy' },
  { id: 5, title: 'Marketing Strategy', description: 'Plan your go-to-market' },
  { id: 6, title: 'Pricing Model', description: 'Set your pricing' },
  { id: 7, title: 'Legal Checklist', description: 'Handle legal requirements' },
  { id: 8, title: 'Launch', description: 'Go live!' },
];

export default function BusinessLaunchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [wizardData, setWizardData] = useState({
    domainName: '',
    brandName: '',
    tagline: '',
    colorScheme: '',
    targetAudience: '',
    mvpFeatures: '',
    landingPageCopy: '',
    marketingChannels: '',
    pricingTier1: '',
    pricingTier2: '',
    pricingTier3: '',
    legalStructure: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadBusiness();
    }
  }, [status, router, businessId]);

  const loadBusiness = async () => {
    try {
      const res = await fetch(`/api/business/${businessId}`);
      if (res.ok) {
        const data = await res.json();
        setBusiness(data.business);
        
        // Load saved wizard data if it exists
        if (data.business.wizardData) {
          setWizardData(data.business.wizardData);
        }
        
        // Auto-update status to 'building' if still in 'planning'
        if (data.business.status === 'planning') {
          await fetch(`/api/business/${businessId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'building' }),
          });
        }
        
        // Calculate current step based on launch progress
        const step = Math.min(Math.floor((data.business.launchProgress / 100) * 8) + 1, 8);
        setCurrentStep(step);
      } else {
        toast.error('Business not found');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to load business:', error);
      toast.error('Failed to load business');
    }
  };

  const generateWithAI = async (field: string, prompt: string) => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            niche: business?.niche,
            opportunityTitle: business?.opportunityTitle,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWizardData(prev => ({ ...prev, [field]: data.content }));
        toast.success('Generated with AI!');
      } else {
        toast.error('Failed to generate');
      }
    } catch (error) {
      toast.error('AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const saveProgress = async () => {
    // Validate current step has data
    if (currentStep === 1 && !wizardData.domainName.trim()) {
      toast.error('Please enter a domain name');
      return;
    }
    if (currentStep === 2 && (!wizardData.brandName.trim() || !wizardData.tagline.trim())) {
      toast.error('Please complete brand name and tagline');
      return;
    }
    if (currentStep === 3 && !wizardData.mvpFeatures.trim()) {
      toast.error('Please specify MVP features');
      return;
    }

    setLoading(true);
    try {
      const progress = (currentStep / 8) * 100;
      const status = currentStep < 8 ? 'building' : 'live';

      const res = await fetch(`/api/business/${businessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          launchProgress: progress,
          status,
          wizardData, // Save wizard data to database
        }),
      });

      if (res.ok) {
        toast.success('Progress saved!');
        if (currentStep < 8) {
          setCurrentStep(currentStep + 1);
        } else {
          // Step 8: Auto-generate website based on wizard data
          toast.info('Generating your website...');
          
          try {
            const websiteRes = await fetch(`/api/website/${businessId}/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                wizardData,
                businessInfo: {
                  title: business.opportunityTitle,
                  niche: business.niche,
                },
              }),
            });

            if (websiteRes.ok) {
              toast.success('🎉 Business launched & website generated!');
              router.push(`/business/${businessId}/builder`);
            } else {
              toast.success('🎉 Business launched successfully!');
              router.push('/dashboard');
            }
          } catch (error) {
            toast.success('🎉 Business launched successfully!');
            router.push('/dashboard');
          }
        }
      } else {
        toast.error('Failed to save progress');
      }
    } catch (error) {
      toast.error('Failed to save progress');
    } finally {
      setLoading(false);
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progress = ((currentStep - 1) / 8) * 100;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Business Launch Wizard</h1>
          </div>
          <p className="text-muted-foreground">{business.opportunityTitle}</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep} of 8</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
              className={`p-2 border text-center transition-all ${
                step.id === currentStep
                  ? 'bg-primary text-primary-foreground border-primary'
                  : step.id < currentStep
                  ? 'bg-secondary text-secondary-foreground border-secondary'
                  : 'border-border text-muted-foreground'
              }`}
              disabled={step.id > currentStep}
            >
              {step.id < currentStep ? (
                <CheckCircle2 className="h-5 w-5 mx-auto" />
              ) : (
                <span className="text-sm font-semibold">{step.id}</span>
              )}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Domain Name */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="domainName">Domain Name</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="domainName"
                      value={wizardData.domainName}
                      onChange={(e) => setWizardData({ ...wizardData, domainName: e.target.value })}
                      placeholder="mybusiness.com"
                    />
                    <Button
                      onClick={() => generateWithAI('domainName', `Suggest 5 domain names for: ${business.opportunityTitle}`)}
                      disabled={generating}
                      variant="outline"
                    >
                      {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Brand Identity */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="brandName" className="text-white">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={wizardData.brandName}
                    onChange={(e) => setWizardData({ ...wizardData, brandName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tagline" className="text-white">Tagline</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="tagline"
                      value={wizardData.tagline}
                      onChange={(e) => setWizardData({ ...wizardData, tagline: e.target.value })}
                      placeholder="Your catchy tagline"
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Button
                      onClick={() => generateWithAI('tagline', `Create a catchy tagline for: ${business.opportunityTitle}`)}
                      disabled={generating}
                      variant="outline"
                      className="border-white/20"
                    >
                      <Rocket className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="colorScheme" className="text-white">Color Scheme</Label>
                  <Input
                    id="colorScheme"
                    value={wizardData.colorScheme}
                    onChange={(e) => setWizardData({ ...wizardData, colorScheme: e.target.value })}
                    placeholder="e.g., Blue and Orange"
                    className="bg-white/5 border-white/10 text-white mt-2"
                  />
                </div>
              </div>
            )}

            {/* Step 3: MVP Specification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mvpFeatures" className="text-white">Core MVP Features</Label>
                  <div className="flex gap-2 mt-2">
                    <textarea
                      id="mvpFeatures"
                      value={wizardData.mvpFeatures}
                      onChange={(e) => setWizardData({ ...wizardData, mvpFeatures: e.target.value })}
                      placeholder="List your core features..."
                      rows={6}
                      className="w-full bg-white/5 border-white/10 text-white rounded-md p-3"
                    />
                  </div>
                  <Button
                    onClick={() => generateWithAI('mvpFeatures', `List core MVP features for: ${business.opportunityTitle}`)}
                    disabled={generating}
                    variant="outline"
                    className="border-white/20 mt-2"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Landing Page */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="landingPageCopy">Landing Page Copy</Label>
                  <textarea
                    id="landingPageCopy"
                    value={wizardData.landingPageCopy}
                    onChange={(e) => setWizardData({ ...wizardData, landingPageCopy: e.target.value })}
                    placeholder="Write compelling copy for your landing page..."
                    rows={8}
                    className="w-full border border-border rounded-md p-3"
                  />
                </div>
                <Button
                  onClick={() => generateWithAI('landingPageCopy', `Create landing page copy for: ${business.opportunityTitle}`)}
                  disabled={generating}
                  variant="outline"
                  className="mt-2"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
              </div>
            )}

            {/* Step 5: Marketing Strategy */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="marketingChannels">Marketing Channels</Label>
                  <textarea
                    id="marketingChannels"
                    value={wizardData.marketingChannels}
                    onChange={(e) => setWizardData({ ...wizardData, marketingChannels: e.target.value })}
                    placeholder="List your marketing channels (e.g., SEO, Social Media, Paid Ads)..."
                    rows={6}
                    className="w-full border border-border rounded-md p-3"
                  />
                </div>
                <Button
                  onClick={() => generateWithAI('marketingChannels', `Suggest marketing strategy for: ${business.opportunityTitle}`)}
                  disabled={generating}
                  variant="outline"
                  className="mt-2"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Generate with AI
                </Button>
              </div>
            )}

            {/* Step 6: Pricing Model */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pricingTier1">Tier 1 (Basic)</Label>
                  <Input
                    id="pricingTier1"
                    value={wizardData.pricingTier1}
                    onChange={(e) => setWizardData({ ...wizardData, pricingTier1: e.target.value })}
                    placeholder="e.g., $9/month - Basic features"
                  />
                </div>
                <div>
                  <Label htmlFor="pricingTier2">Tier 2 (Pro)</Label>
                  <Input
                    id="pricingTier2"
                    value={wizardData.pricingTier2}
                    onChange={(e) => setWizardData({ ...wizardData, pricingTier2: e.target.value })}
                    placeholder="e.g., $29/month - Pro features"
                  />
                </div>
                <div>
                  <Label htmlFor="pricingTier3">Tier 3 (Enterprise)</Label>
                  <Input
                    id="pricingTier3"
                    value={wizardData.pricingTier3}
                    onChange={(e) => setWizardData({ ...wizardData, pricingTier3: e.target.value })}
                    placeholder="e.g., $99/month - Enterprise features"
                  />
                </div>
              </div>
            )}

            {/* Step 7: Legal Checklist */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="legalStructure">Legal Structure</Label>
                  <Input
                    id="legalStructure"
                    value={wizardData.legalStructure}
                    onChange={(e) => setWizardData({ ...wizardData, legalStructure: e.target.value })}
                    placeholder="e.g., LLC, Sole Proprietorship, Corporation"
                  />
                </div>
                <div className="p-4 border border-border bg-muted rounded-md">
                  <h4 className="font-semibold mb-3">Legal Checklist</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Register business name</li>
                    <li>✓ Get EIN from IRS</li>
                    <li>✓ Open business bank account</li>
                    <li>✓ Create terms of service</li>
                    <li>✓ Create privacy policy</li>
                    <li>✓ Set up accounting system</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 8: Launch */}
            {currentStep === 8 && (
              <div className="text-center py-12">
                <Rocket className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Ready to Launch!</h3>
                <p className="text-muted-foreground mb-6">
                  You've completed all the steps. Click below to launch your business!
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={saveProgress}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : currentStep === 8 ? (
                  <Rocket className="h-4 w-4 mr-2" />
                ) : null}
                {currentStep === 8 ? 'Launch Business' : 'Next Step'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
