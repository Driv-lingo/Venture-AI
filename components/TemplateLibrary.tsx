'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Briefcase, ShoppingCart, Heart, Utensils, Dumbbell, GraduationCap, Search, Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  isPremium: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const TEMPLATES: Template[] = [
  {
    id: 'modern-saas',
    name: 'Modern SaaS',
    category: 'business',
    description: 'Perfect for software companies and tech startups',
    features: ['Hero with CTA', 'Feature Grid', 'Pricing Tables', 'Testimonials'],
    isPremium: false,
    colors: { primary: '#2563EB', secondary: '#1E40AF', accent: '#10B981' },
  },
  {
    id: 'elegant-portfolio',
    name: 'Elegant Portfolio',
    category: 'creative',
    description: 'Showcase your work with style and sophistication',
    features: ['Project Gallery', 'About Section', 'Contact Form', 'Skills Display'],
    isPremium: true,
    colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#EC4899' },
  },
  {
    id: 'ecommerce-pro',
    name: 'E-Commerce Pro',
    category: 'ecommerce',
    description: 'Complete online store with product showcase',
    features: ['Product Grid', 'Shopping Cart', 'Checkout', 'Reviews'],
    isPremium: true,
    colors: { primary: '#10B981', secondary: '#059669', accent: '#F59E0B' },
  },
  {
    id: 'restaurant-deluxe',
    name: 'Restaurant Deluxe',
    category: 'food',
    description: 'Appetizing design for restaurants and cafes',
    features: ['Menu Display', 'Reservations', 'Gallery', 'Location Map'],
    isPremium: false,
    colors: { primary: '#F97316', secondary: '#EA580C', accent: '#EF4444' },
  },
  {
    id: 'fitness-studio',
    name: 'Fitness Studio',
    category: 'health',
    description: 'Energetic design for gyms and fitness centers',
    features: ['Class Schedule', 'Trainer Profiles', 'Membership Plans', 'Blog'],
    isPremium: false,
    colors: { primary: '#EF4444', secondary: '#DC2626', accent: '#EC4899' },
  },
  {
    id: 'education-hub',
    name: 'Education Hub',
    category: 'education',
    description: 'Professional platform for online courses',
    features: ['Course Catalog', 'Instructor Bios', 'Student Portal', 'Resources'],
    isPremium: true,
    colors: { primary: '#6366F1', secondary: '#4F46E5', accent: '#3B82F6' },
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: Sparkles },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart },
  { id: 'creative', label: 'Creative', icon: Heart },
  { id: 'food', label: 'Food & Dining', icon: Utensils },
  { id: 'health', label: 'Health & Fitness', icon: Dumbbell },
  { id: 'education', label: 'Education', icon: GraduationCap },
];

interface TemplateLibraryProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export function TemplateLibrary({ open, onClose, onSelectTemplate }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Choose Your Template
          </DialogTitle>
          <DialogDescription className="text-base">
            Start with a professionally designed template and customize it to match your brand
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-2"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-7 w-full">
              {CATEGORIES.map(category => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{category.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={selectedCategory} className="flex-1 overflow-y-auto mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                {filteredTemplates.map(template => (
                  <Card
                    key={template.id}
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-premium hover:-translate-y-1 ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-primary shadow-premium' : ''
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-0">
                      {/* Template Preview */}
                      <div className="relative h-48 rounded-t-lg overflow-hidden">
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to bottom right, ${template.colors.primary}, ${template.colors.secondary})`
                          }}
                        >
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-white text-center p-6">
                              <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                              <p className="text-sm opacity-90">Preview</p>
                            </div>
                          </div>
                        </div>
                        {template.isPremium && (
                          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {selectedTemplate?.id === template.id && (
                          <div className="absolute top-3 left-3 bg-primary text-white rounded-full p-2">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                        
                        {/* Features */}
                        <div className="space-y-1 mb-4">
                          {template.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Check className="h-3 w-3 text-primary" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Color Palette */}
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: template.colors.primary }} />
                          <div className="w-6 h-6 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: template.colors.secondary }} />
                          <div className="w-6 h-6 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: template.colors.accent }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">No templates found</p>
                  <p className="text-sm mt-2">Try adjusting your search or category filter</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedTemplate ? (
              <span className="font-medium">Selected: {selectedTemplate.name}</span>
            ) : (
              <span>Select a template to continue</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUseTemplate}
              disabled={!selectedTemplate}
              className="gradient-primary font-semibold shadow-lg shadow-primary/25"
            >
              Use This Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
