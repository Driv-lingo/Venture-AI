'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Eye, 
  Save, 
  Globe, 
  Palette, 
  Layout, 
  Settings,
  Plus,
  Trash2,
  Copy,
  Monitor,
  Smartphone,
  Tablet,
  ArrowLeft,
  Pencil
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { PageRenderer } from '@/components/PageRenderer';
import { PageEditor } from '@/components/PageEditor';

export default function WebsiteBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<any>(null);
  const [website, setWebsite] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');

  // Website configuration
  const [config, setConfig] = useState({
    subdomain: '',
    customDomain: '',
    theme: {
      primaryColor: '#C84B31',
      secondaryColor: '#2D4059',
      accentColor: '#10B981',
      fontFamily: 'Inter',
      logo: '',
    },
    seo: {
      title: '',
      description: '',
      keywords: '',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadData();
    }
  }, [status, router, businessId]);

  // Load Google Font dynamically when font family changes
  useEffect(() => {
    const fontFamily = config.theme.fontFamily;
    if (fontFamily && fontFamily !== 'system-ui') {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [config.theme.fontFamily]);

  const generateWebsite = async (businessData: any) => {
    try {
      console.log('Generating website with data:', {
        wizardData: businessData.wizardData,
        businessInfo: {
          title: businessData.opportunityTitle,
          niche: businessData.niche,
        },
      });

      const res = await fetch(`/api/website/${businessId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wizardData: businessData.wizardData,
          businessInfo: {
            title: businessData.opportunityTitle,
            niche: businessData.niche,
          },
        }),
      });

      console.log('Generation response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('Generation successful:', data);
        toast.success('Website generated successfully!');
        // Reload data to show generated website
        await loadData();
      } else {
        const errorText = await res.text();
        console.error('Generation error response:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch (e) {
          error = { error: errorText };
        }
        console.error('Generation error:', error);
        toast.error(error.details || error.error || `Failed to generate website (${res.status})`);
      }
    } catch (error) {
      console.error('Generate website error:', error);
      toast.error('Failed to generate website');
    }
  };

  const loadData = async () => {
    try {
      // Load business
      const businessRes = await fetch(`/api/business/${businessId}`);
      let businessData: any = null;
      if (businessRes.ok) {
        const data = await businessRes.json();
        businessData = data.business;
        setBusiness(businessData);
        
        console.log('Business loaded:', businessData);
        console.log('Wizard data exists:', !!businessData.wizardData);
        console.log('Wizard data:', businessData.wizardData);
        
        // Initialize config from business data
        setConfig(prev => ({
          ...prev,
          subdomain: businessData.domainName?.replace(/\./g, '-') || '',
          seo: {
            title: businessData.opportunityTitle,
            description: businessData.niche,
            keywords: businessData.niche,
          },
        }));
      }

      // Load website if exists
      const websiteRes = await fetch(`/api/website/${businessId}`);
      if (websiteRes.ok) {
        const websiteData = await websiteRes.json();
        setWebsite(websiteData.website);
        if (websiteData.website) {
          setConfig({
            subdomain: websiteData.website.subdomain || '',
            customDomain: websiteData.website.customDomain || '',
            theme: {
              primaryColor: websiteData.website.theme?.primaryColor || '#C84B31',
              secondaryColor: websiteData.website.theme?.secondaryColor || '#2D4059',
              accentColor: websiteData.website.theme?.accentColor || '#10B981',
              fontFamily: websiteData.website.theme?.fontFamily || 'Inter',
              logo: websiteData.website.theme?.logo || '',
            },
            seo: {
              title: websiteData.website.seo?.title || '',
              description: websiteData.website.seo?.description || '',
              keywords: websiteData.website.seo?.keywords || '',
            },
          });
          
          // Load pages
          const pagesRes = await fetch(`/api/website/${businessId}/pages`);
          if (pagesRes.ok) {
            const pagesData = await pagesRes.json();
            setPages(pagesData.pages);
            if (pagesData.pages.length > 0) {
              setSelectedPage(pagesData.pages[0]);
            }
          }
        } else if (businessData?.wizardData) {
          // No website exists but wizard data is available - auto-generate
          toast.info('Generating your website from wizard data...');
          await generateWebsite(businessData);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load website data');
    } finally {
      setLoading(false);
    }
  };

  const saveWebsite = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/website/${businessId}`, {
        method: website ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        const data = await res.json();
        setWebsite(data.website);
        toast.success('Website saved successfully!');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to save website');
      }
    } catch (error) {
      toast.error('Failed to save website');
    } finally {
      setSaving(false);
    }
  };

  const deployWebsite = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/website/${businessId}/deploy`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Website deployed successfully!');
        loadData();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to deploy website');
      }
    } catch (error) {
      toast.error('Failed to deploy website');
    } finally {
      setSaving(false);
    }
  };

  const regenerateFromWizard = async () => {
    if (!business) {
      toast.error('Business data not loaded');
      return;
    }
    
    if (!business.wizardData) {
      toast.error('No wizard data found. Please complete the launch wizard first.');
      return;
    }
    
    setLoading(true);
    toast.info('Regenerating website from wizard data...');
    await generateWebsite(business);
    setLoading(false);
  };

  const savePageContent = async (updatedContent: any) => {
    if (!selectedPage) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/website/${businessId}/pages/${selectedPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedPage(data.page);
        // Update pages array
        setPages(pages.map(p => p.id === data.page.id ? data.page : p));
        toast.success('Page content saved successfully!');
      } else {
        toast.error('Failed to save page content');
      }
    } catch (error) {
      console.error('Save page error:', error);
      toast.error('Failed to save page content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading website builder...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Rocket className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-lg font-bold tracking-tight">Website Builder</h1>
                  <p className="text-xs text-muted-foreground">{business?.opportunityTitle}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {website?.deploymentUrl && (
                <a href={website.deploymentUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Live
                  </Button>
                </a>
              )}
              <Button variant="outline" size="sm" onClick={saveWebsite} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={deployWebsite} disabled={saving}>
                <Rocket className="h-4 w-4 mr-2" />
                Deploy
              </Button>
              <Button variant="outline" size="sm" onClick={regenerateFromWizard} disabled={loading || !business?.wizardData}>
                <Rocket className="h-4 w-4 mr-2" />
                Regenerate from Wizard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[350px_1fr] gap-6">
          {/* Sidebar - Configuration */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">
                  <Palette className="h-4 w-4 mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="pages">
                  <Layout className="h-4 w-4 mr-2" />
                  Pages
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Design Tab */}
              <TabsContent value="design" className="space-y-4 mt-4">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Theme</CardTitle>
                    <CardDescription>Customize your website's appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={config.theme.primaryColor}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: { ...config.theme, primaryColor: e.target.value }
                          })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={config.theme.primaryColor}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: { ...config.theme, primaryColor: e.target.value }
                          })}
                          placeholder="#C84B31"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={config.theme.secondaryColor}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: { ...config.theme, secondaryColor: e.target.value }
                          })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={config.theme.secondaryColor}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: { ...config.theme, secondaryColor: e.target.value }
                          })}
                          placeholder="#2D4059"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <select
                        id="fontFamily"
                        value={config.theme.fontFamily}
                        onChange={(e) => setConfig({
                          ...config,
                          theme: { ...config.theme, fontFamily: e.target.value }
                        })}
                        className="w-full mt-2 border border-border rounded-md p-2"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="logo">Logo URL</Label>
                      <Input
                        id="logo"
                        value={config.theme.logo}
                        onChange={(e) => setConfig({
                          ...config,
                          theme: { ...config.theme, logo: e.target.value }
                        })}
                        placeholder="https://example.com/logo.png"
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pages Tab */}
              <TabsContent value="pages" className="space-y-4 mt-4">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Pages</CardTitle>
                    <CardDescription>Manage your website pages</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pages.length > 0 ? (
                      pages.map((page) => (
                        <div 
                          key={page.id} 
                          className={`p-3 border rounded-md flex items-center justify-between cursor-pointer hover:bg-accent ${
                            selectedPage?.id === page.id ? 'border-primary bg-accent' : 'border-border'
                          }`}
                          onClick={() => setSelectedPage(page)}
                        >
                          <div>
                            <p className="font-medium">{page.title}</p>
                            <p className="text-xs text-muted-foreground">{page.slug}</p>
                          </div>
                          <Badge variant={page.isPublished ? 'default' : 'outline'}>
                            {page.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No pages yet. Click "Regenerate from Wizard" to generate pages.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4 mt-4">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Domain</CardTitle>
                    <CardDescription>Configure your website domain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="subdomain">Subdomain</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="subdomain"
                          value={config.subdomain}
                          onChange={(e) => setConfig({ ...config, subdomain: e.target.value })}
                          placeholder="mybusiness"
                        />
                        <span className="flex items-center text-sm text-muted-foreground">.ventureai.app</span>
                      </div>
                      {config.subdomain && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Your site: {config.subdomain}.ventureai.app
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                      <Input
                        id="customDomain"
                        value={config.customDomain}
                        onChange={(e) => setConfig({ ...config, customDomain: e.target.value })}
                        placeholder="www.yourdomain.com"
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">SEO</CardTitle>
                    <CardDescription>Optimize for search engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="seoTitle">Page Title</Label>
                      <Input
                        id="seoTitle"
                        value={config.seo.title}
                        onChange={(e) => setConfig({
                          ...config,
                          seo: { ...config.seo, title: e.target.value }
                        })}
                        placeholder="My Awesome Business"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="seoDescription">Meta Description</Label>
                      <textarea
                        id="seoDescription"
                        value={config.seo.description}
                        onChange={(e) => setConfig({
                          ...config,
                          seo: { ...config.seo, description: e.target.value }
                        })}
                        placeholder="A brief description of your business..."
                        rows={3}
                        className="w-full mt-2 border border-border rounded-md p-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="seoKeywords">Keywords</Label>
                      <Input
                        id="seoKeywords"
                        value={config.seo.keywords}
                        onChange={(e) => setConfig({
                          ...config,
                          seo: { ...config.seo, keywords: e.target.value }
                        })}
                        placeholder="business, startup, saas"
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Area - Preview */}
          <div className="space-y-4">
            {/* Device Preview Selector */}
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 border-r pr-4">
                      <Button
                        variant={viewMode === 'preview' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('preview')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant={viewMode === 'edit' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('edit')}
                        disabled={!selectedPage}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    
                    {/* Device Preview (only in preview mode) */}
                    {viewMode === 'preview' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPreviewDevice('desktop')}
                        >
                          <Monitor className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPreviewDevice('tablet')}
                        >
                          <Tablet className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPreviewDevice('mobile')}
                        >
                          <Smartphone className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {website?.buildStatus && (
                    <Badge variant="outline">
                      Status: {website.buildStatus}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview/Edit Area */}
            <Card className="border-border min-h-[600px]">
              <CardContent className="p-0">
                {selectedPage ? (
                  viewMode === 'edit' ? (
                    <div className="overflow-y-auto max-h-[800px]">
                      <PageEditor 
                        page={selectedPage} 
                        theme={config.theme}
                        onSave={savePageContent}
                      />
                    </div>
                  ) : (
                    <div 
                      className={`mx-auto transition-all ${
                        previewDevice === 'desktop' ? 'max-w-full' :
                        previewDevice === 'tablet' ? 'max-w-2xl' :
                        'max-w-sm'
                      }`}
                    >
                      <div className="border border-border rounded-lg overflow-hidden overflow-y-auto max-h-[800px]">
                        <PageRenderer page={selectedPage} theme={config.theme} />
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    No page selected. Generate a website or select a page from the Pages tab.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
