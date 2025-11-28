'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Grid3x3, 
  Quote, 
  Video, 
  Mail, 
  Star,
  ShoppingCart,
  Users,
  MessageSquare,
  Plus
} from 'lucide-react';

interface Section {
  id: string;
  type: string;
  name: string;
  icon: any;
  description: string;
  category: string;
  colorFrom: string;
  colorTo: string;
}

const SECTIONS: Section[] = [
  {
    id: 'hero-gradient',
    type: 'hero',
    name: 'Hero with Gradient',
    icon: Layout,
    description: 'Eye-catching hero section with gradient background',
    category: 'hero',
    colorFrom: '#3B82F6',
    colorTo: '#8B5CF6',
  },
  {
    id: 'hero-image',
    type: 'hero',
    name: 'Hero with Image',
    icon: ImageIcon,
    description: 'Hero section with background image',
    category: 'hero',
    colorFrom: '#374151',
    colorTo: '#111827',
  },
  {
    id: 'features-grid',
    type: 'features',
    name: 'Feature Grid',
    icon: Grid3x3,
    description: '3-column feature showcase with icons',
    category: 'features',
    colorFrom: '#10B981',
    colorTo: '#14B8A6',
  },
  {
    id: 'features-cards',
    type: 'features',
    name: 'Feature Cards',
    icon: Grid3x3,
    description: 'Elevated cards with hover effects',
    category: 'features',
    colorFrom: '#8B5CF6',
    colorTo: '#EC4899',
  },
  {
    id: 'testimonials',
    type: 'testimonials',
    name: 'Testimonials',
    icon: Quote,
    description: 'Customer testimonials with ratings',
    category: 'social',
    colorFrom: '#F59E0B',
    colorTo: '#F97316',
  },
  {
    id: 'team-grid',
    type: 'team',
    name: 'Team Grid',
    icon: Users,
    description: 'Team member profiles with photos',
    category: 'about',
    colorFrom: '#6366F1',
    colorTo: '#3B82F6',
  },
  {
    id: 'pricing-table',
    type: 'pricing',
    name: 'Pricing Table',
    icon: ShoppingCart,
    description: 'Pricing plans with feature comparison',
    category: 'pricing',
    colorFrom: '#EF4444',
    colorTo: '#EC4899',
  },
  {
    id: 'contact-form',
    type: 'contact',
    name: 'Contact Form',
    icon: Mail,
    description: 'Professional contact form with validation',
    category: 'contact',
    colorFrom: '#14B8A6',
    colorTo: '#10B981',
  },
  {
    id: 'gallery',
    type: 'gallery',
    name: 'Image Gallery',
    icon: ImageIcon,
    description: 'Responsive image gallery with lightbox',
    category: 'media',
    colorFrom: '#EC4899',
    colorTo: '#F43F5E',
  },
  {
    id: 'video-embed',
    type: 'video',
    name: 'Video Section',
    icon: Video,
    description: 'Embedded video with description',
    category: 'media',
    colorFrom: '#06B6D4',
    colorTo: '#3B82F6',
  },
  {
    id: 'cta-banner',
    type: 'cta',
    name: 'CTA Banner',
    icon: Star,
    description: 'Call-to-action banner with button',
    category: 'cta',
    colorFrom: '#F97316',
    colorTo: '#EF4444',
  },
  {
    id: 'faq',
    type: 'faq',
    name: 'FAQ Accordion',
    icon: MessageSquare,
    description: 'Frequently asked questions with expandable answers',
    category: 'content',
    colorFrom: '#7C3AED',
    colorTo: '#8B5CF6',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Sections' },
  { id: 'hero', label: 'Hero' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'social', label: 'Social Proof' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'media', label: 'Media' },
  { id: 'cta', label: 'Call to Action' },
  { id: 'content', label: 'Content' },
];

interface SectionBuilderProps {
  open: boolean;
  onClose: () => void;
  onAddSection: (section: Section) => void;
}

export function SectionBuilder({ open, onClose, onAddSection }: SectionBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const filteredSections = SECTIONS.filter(section => 
    selectedCategory === 'all' || section.category === selectedCategory
  );

  const handleAddSection = () => {
    if (selectedSection) {
      onAddSection(selectedSection);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Add New Section
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose from our library of professionally designed sections
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full">
            {CATEGORIES.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs lg:text-sm">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="flex-1 overflow-y-auto mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {filteredSections.map(section => {
                const Icon = section.icon;
                return (
                  <Card
                    key={section.id}
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-premium hover:-translate-y-1 ${
                      selectedSection?.id === section.id ? 'ring-2 ring-primary shadow-premium' : ''
                    }`}
                    onClick={() => setSelectedSection(section)}
                  >
                    <CardContent className="p-0">
                      {/* Section Preview */}
                      <div className="relative h-40 rounded-t-lg overflow-hidden">
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to bottom right, ${section.colorFrom}, ${section.colorTo})`
                          }}
                        >
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Icon className="h-16 w-16 text-white opacity-80" />
                          </div>
                        </div>
                        {selectedSection?.id === section.id && (
                          <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-2">
                            <Plus className="h-4 w-4" />
                          </div>
                        )}
                      </div>

                      {/* Section Info */}
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base mb-1">{section.name}</h3>
                            <p className="text-xs text-muted-foreground">{section.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredSections.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No sections found in this category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedSection ? (
              <span className="font-medium">Selected: {selectedSection.name}</span>
            ) : (
              <span>Select a section to add to your page</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSection}
              disabled={!selectedSection}
              className="gradient-primary font-semibold shadow-lg shadow-primary/25"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
