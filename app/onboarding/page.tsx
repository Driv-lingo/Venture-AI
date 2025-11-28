'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const SKILLS_OPTIONS = [
  'Marketing', 'SEO', 'Content Writing', 'Copywriting', 'Design', 'Development',
  'Coding', 'Sales', 'Social Media', 'Analytics', 'Video Editing', 'Photography',
  'E-commerce', 'Dropshipping', 'Consulting', 'Coaching', 'Teaching', 'Customer Service'
];

const INTERESTS_OPTIONS = [
  'Technology', 'Health & Fitness', 'Finance', 'Education', 'E-commerce',
  'SaaS', 'Content Creation', 'Marketing', 'Design', 'Productivity',
  'Gaming', 'Travel', 'Food & Beverage', 'Fashion', 'Real Estate'
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skills: [] as string[],
    interests: [] as string[],
    capital: '',
    timeCommitment: '',
    experienceLevel: '',
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (step === 1 && formData.skills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }
    if (step === 2 && formData.interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.capital || !formData.timeCommitment || !formData.experienceLevel) {
      toast.error('Please complete all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          onboardingComplete: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save profile');
      }

      toast.success('Profile completed! Redirecting to dashboard...');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative w-full max-w-3xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl" />
            <Rocket className="relative h-10 w-10 text-primary" />
          </div>
          <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">VentureAI</span>
        </div>

        <Card className="border-border shadow-premium bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-3xl mb-2">Let's get to know you</CardTitle>
                <CardDescription className="text-base">
                  Step {step} of {totalSteps} - Building your entrepreneur profile
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{Math.round(progress)}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-8 pb-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-2xl font-semibold mb-2 block">What skills do you have?</Label>
                  <p className="text-base text-muted-foreground">Select all that apply to help us match you with the right opportunities</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {SKILLS_OPTIONS.map(skill => (
                    <Badge
                      key={skill}
                      variant={formData.skills.includes(skill) ? 'default' : 'outline'}
                      className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${
                        formData.skills.includes(skill)
                          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {formData.skills.includes(skill) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-2xl font-semibold mb-2 block">What are your interests?</Label>
                  <p className="text-base text-muted-foreground">Choose industries and topics you're passionate about</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {INTERESTS_OPTIONS.map(interest => (
                    <Badge
                      key={interest}
                      variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                      className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${
                        formData.interests.includes(interest)
                          ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {formData.interests.includes(interest) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-2xl font-semibold mb-2 block">How much capital can you invest?</Label>
                  <p className="text-base text-muted-foreground">This helps us recommend businesses within your budget</p>
                </div>
                <div className="grid gap-4">
                  {[
                    { value: 'under1k', label: 'Under $1,000', desc: 'Bootstrap with minimal investment' },
                    { value: '1k-5k', label: '$1,000 - $5,000', desc: 'Moderate startup budget' },
                    { value: '5k-plus', label: '$5,000+', desc: 'Significant capital available' },
                  ].map(option => (
                    <div
                      key={option.value}
                      className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                        formData.capital === option.value
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormData({ ...formData, capital: option.value })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold mb-1">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </div>
                        {formData.capital === option.value && (
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-2xl font-semibold mb-2 block">How much time can you commit?</Label>
                  <p className="text-base text-muted-foreground">Choose your availability level for building your business</p>
                </div>
                <div className="grid gap-4">
                  {[
                    { value: 'sideHustle', label: 'Side Hustle', desc: '~10 hours per week' },
                    { value: 'partTime', label: 'Part Time', desc: '~20 hours per week' },
                    { value: 'fullTime', label: 'Full Time', desc: '~40 hours per week' },
                  ].map(option => (
                    <div
                      key={option.value}
                      className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                        formData.timeCommitment === option.value
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormData({ ...formData, timeCommitment: option.value })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold mb-1">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </div>
                        {formData.timeCommitment === option.value && (
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-2xl font-semibold mb-2 block">What's your experience level?</Label>
                  <p className="text-base text-muted-foreground">Help us tailor recommendations to your expertise</p>
                </div>
                <div className="grid gap-4">
                  {[
                    { value: 'beginner', label: 'Beginner', desc: 'New to entrepreneurship' },
                    { value: 'intermediate', label: 'Intermediate', desc: 'Some business experience' },
                    { value: 'advanced', label: 'Advanced', desc: 'Experienced entrepreneur' },
                  ].map(option => (
                    <div
                      key={option.value}
                      className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                        formData.experienceLevel === option.value
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormData({ ...formData, experienceLevel: option.value })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold mb-1">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </div>
                        {formData.experienceLevel === option.value && (
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-8 h-12 font-semibold border-2"
                >
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 h-12 gradient-primary font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 h-12 gradient-primary font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
