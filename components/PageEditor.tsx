'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Save, X, Plus, Trash2 } from 'lucide-react';

interface PageEditorProps {
  page: any;
  theme: any;
  onSave: (updatedContent: any) => void;
}

export function PageEditor({ page, theme, onSave }: PageEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(page.content);

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(page.content);
    setIsEditing(false);
  };

  const updateHero = (field: string, value: string) => {
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...(content.features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setContent({ ...content, features: newFeatures });
  };

  const addFeature = () => {
    setContent({
      ...content,
      features: [...(content.features || []), { title: 'New Feature', description: 'Description' }],
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = content.features.filter((_: any, i: number) => i !== index);
    setContent({ ...content, features: newFeatures });
  };

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...(content.services || [])];
    newServices[index] = { ...newServices[index], [field]: value };
    setContent({ ...content, services: newServices });
  };

  const addService = () => {
    setContent({
      ...content,
      services: [...(content.services || []), { name: 'New Service', description: 'Description', price: '$99' }],
    });
  };

  const removeService = (index: number) => {
    const newServices = content.services.filter((_: any, i: number) => i !== index);
    setContent({ ...content, services: newServices });
  };

  if (!content) {
    return <div className="p-8 text-center text-muted-foreground">No content available</div>;
  }

  return (
    <div className="relative">
      {/* Edit/Save Buttons */}
      <div className="sticky top-0 z-10 bg-white border-b p-4 flex justify-between items-center">
        <h3 className="font-semibold">{page.title}</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Content
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Hero Section Editor */}
        {content.hero && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Headline</Label>
                {isEditing ? (
                  <Input
                    value={content.hero.headline || ''}
                    onChange={(e) => updateHero('headline', e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-2xl font-bold" style={{ color: theme.primaryColor }}>
                    {content.hero.headline}
                  </p>
                )}
              </div>
              <div>
                <Label>Subheadline</Label>
                {isEditing ? (
                  <Textarea
                    value={content.hero.subheadline || ''}
                    onChange={(e) => updateHero('subheadline', e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                ) : (
                  <p className="mt-2 text-gray-600">{content.hero.subheadline}</p>
                )}
              </div>
              <div>
                <Label>Call to Action Button</Label>
                {isEditing ? (
                  <Input
                    value={content.hero.cta || ''}
                    onChange={(e) => updateHero('cta', e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <Button
                    className="mt-2"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    {content.hero.cta}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Section Editor */}
        {content.features && content.features.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Features</CardTitle>
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.features.map((feature: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Feature Title</Label>
                        {isEditing ? (
                          <Input
                            value={feature.title || ''}
                            onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                            className="mt-2"
                          />
                        ) : (
                          <p className="mt-2 font-semibold" style={{ color: theme.primaryColor }}>
                            {feature.title}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Description</Label>
                        {isEditing ? (
                          <Textarea
                            value={feature.description || ''}
                            onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                            className="mt-2"
                            rows={2}
                          />
                        ) : (
                          <p className="mt-2 text-gray-600">{feature.description}</p>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFeature(idx)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Benefits Section Editor */}
        {content.benefits && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Benefits Description</Label>
              {isEditing ? (
                <Textarea
                  value={content.benefits || ''}
                  onChange={(e) => setContent({ ...content, benefits: e.target.value })}
                  className="mt-2"
                  rows={4}
                />
              ) : (
                <p className="mt-2 text-gray-700">{content.benefits}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* About/Story Section Editor */}
        {content.story && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Story</Label>
                {isEditing ? (
                  <Textarea
                    value={content.story || ''}
                    onChange={(e) => setContent({ ...content, story: e.target.value })}
                    className="mt-2"
                    rows={4}
                  />
                ) : (
                  <p className="mt-2 text-gray-700">{content.story}</p>
                )}
              </div>
              {content.mission && (
                <div>
                  <Label>Mission</Label>
                  {isEditing ? (
                    <Textarea
                      value={content.mission || ''}
                      onChange={(e) => setContent({ ...content, mission: e.target.value })}
                      className="mt-2"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-2 text-gray-700">{content.mission}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Services Section Editor */}
        {content.services && content.services.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Services</CardTitle>
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={addService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.services.map((service: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Service Name</Label>
                        {isEditing ? (
                          <Input
                            value={service.name || ''}
                            onChange={(e) => updateService(idx, 'name', e.target.value)}
                            className="mt-2"
                          />
                        ) : (
                          <p className="mt-2 font-semibold text-xl" style={{ color: theme.primaryColor }}>
                            {service.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Description</Label>
                        {isEditing ? (
                          <Textarea
                            value={service.description || ''}
                            onChange={(e) => updateService(idx, 'description', e.target.value)}
                            className="mt-2"
                            rows={3}
                          />
                        ) : (
                          <p className="mt-2 text-gray-600">{service.description}</p>
                        )}
                      </div>
                      <div>
                        <Label>Price</Label>
                        {isEditing ? (
                          <Input
                            value={service.price || ''}
                            onChange={(e) => updateService(idx, 'price', e.target.value)}
                            className="mt-2"
                          />
                        ) : (
                          <p className="mt-2 text-lg font-bold" style={{ color: theme.accentColor }}>
                            {service.price}
                          </p>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeService(idx)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Contact Section Editor */}
        {content.email && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    value={content.email || ''}
                    onChange={(e) => setContent({ ...content, email: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2">{content.email}</p>
                )}
              </div>
              {content.phone && (
                <div>
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={content.phone || ''}
                      onChange={(e) => setContent({ ...content, phone: e.target.value })}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2">{content.phone}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
