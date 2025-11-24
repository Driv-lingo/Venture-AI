'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Rocket className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">VENTUREAI</span>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Let's get to know you</CardTitle>
            <CardDescription>
              Step {step} of {totalSteps}
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <Label className="text-lg">What skills do you have?</Label>
                <p className="text-sm text-muted-foreground">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_OPTIONS.map(skill => (
                    <Badge
                      key={skill}
                      variant={formData.skills.includes(skill) ? 'default' : 'outline'}
                      className={`cursor-pointer ${
                        formData.skills.includes(skill)
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Label className="text-lg">What are your interests?</Label>
                <p className="text-sm text-muted-foreground">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map(interest => (
                    <Badge
                      key={interest}
                      variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                      className={`cursor-pointer ${
                        formData.interests.includes(interest)
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Label className="text-lg">How much capital can you invest?</Label>
                <div className="grid gap-3">
                  {[
                    { value: 'under1k', label: 'Under $1,000', desc: 'Bootstrap with minimal investment' },
                    { value: '1k-5k', label: '$1,000 - $5,000', desc: 'Moderate startup budget' },
                    { value: '5k-plus', label: '$5,000+', desc: 'Significant capital available' },
                  ].map(option => (
                    <div
                      key={option.value}
                      className={`p-4 border cursor-pointer transition-all ${
                        formData.capital === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted'
                      }`}
                      onClick={() => setFormData({ ...formData, capital: option.value })}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Label className="text-lg">How much time can you commit?</Label>
                <div className="grid gap-3">
                  {[
                    { value: 'sideHustle', label: 'Side Hustle', desc: '~10 hours per week' },
                    { value: 'partTime', label: 'Part Time', desc: '~20 hours per week' },
                    { value: 'fullTime', label: 'Full Time', desc: '~40 hours per week' },
                  ].map(option => (
                    <div
                      key={option.value}
                      className={`p-4 border cursor-pointer transition-all ${
                        formData.timeCommitment === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted'
                      }`}
                      onClick={() => setFormData({ ...formData, timeCommitment: option.value })}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <Label className="text-lg">What's your experience level?</Label>
                <div className="grid gap-3">
                  {[
                    { value: 'beginner', label: 'Beginner', desc: 'New to entrepreneurship' },
                    { value: 'intermediate', label: 'Intermediate', desc: 'Some business experience' },
                    { value: 'advanced', label: 'Advanced', desc: 'Experienced entrepreneur' },
                  ].map(option => (
                    <div
                      key={option.value}
                      className={`p-4 border cursor-pointer transition-all ${
                        formData.experienceLevel === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted'
                      }`}
                      onClick={() => setFormData({ ...formData, experienceLevel: option.value })}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90"
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
