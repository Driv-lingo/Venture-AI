'use client';

import { Sparkles, CheckCircle2, Zap, Star, Mail, Phone, MapPin } from 'lucide-react';

interface PageRendererProps {
  page: any;
  theme: any;
}

export function PageRenderer({ page, theme }: PageRendererProps) {
  if (!page || !page.content) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No page content available
      </div>
    );
  }

  const content = page.content;

  return (
    <div 
      className="min-h-screen"
      style={{
        fontFamily: theme.fontFamily || 'Inter, system-ui, sans-serif',
        backgroundColor: '#f9fafb',
      }}
    >
      {/* Hero Section with Gradient */}
      {content.hero && (
        <section 
          className="relative py-24 px-6 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor || '#2563eb'} 0%, ${theme.secondaryColor || '#1e40af'} 100%)`
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Welcome</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 text-white leading-tight">
              {content.hero.headline}
            </h1>
            <p className="text-2xl mb-10 text-white/90 max-w-3xl mx-auto">
              {content.hero.subheadline}
            </p>
            {content.hero.cta && (
              <button 
                className="px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
                style={{ 
                  backgroundColor: theme.accentColor || '#10b981',
                  color: '#ffffff'
                }}
              >
                {content.hero.cta} →
              </button>
            )}
          </div>
        </section>
      )}

      {/* Features Section with Cards */}
      {content.features && content.features.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: theme.primaryColor }}>
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600">Everything you need to succeed</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {content.features.map((feature: any, idx: number) => (
                <div 
                  key={idx} 
                  className="group p-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)`
                    }}
                  >
                    {idx === 0 && <Zap className="h-7 w-7 text-white" />}
                    {idx === 1 && <Star className="h-7 w-7 text-white" />}
                    {idx === 2 && <CheckCircle2 className="h-7 w-7 text-white" />}
                    {idx > 2 && <Sparkles className="h-7 w-7 text-white" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-opacity-80 transition-colors" style={{ color: theme.primaryColor }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {content.benefits && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: theme.primaryColor }}>
              Benefits
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-center">{content.benefits}</p>
            </div>
          </div>
        </section>
      )}

      {/* Services Section with Pricing Cards */}
      {content.services && content.services.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: theme.primaryColor }}>
                Our Services
              </h2>
              <p className="text-xl text-gray-600">Choose the perfect plan for your needs</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.services.map((service: any, idx: number) => (
                <div 
                  key={idx} 
                  className="relative p-8 bg-white border-2 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  style={{ borderColor: idx === 1 ? theme.accentColor : '#e5e7eb' }}
                >
                  {idx === 1 && (
                    <div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-semibold"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: theme.primaryColor }}>
                      {service.name}
                    </h3>
                    {service.price && (
                      <div className="mb-4">
                        <span className="text-5xl font-bold" style={{ color: theme.accentColor }}>
                          {service.price}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed text-center">{service.description}</p>
                  <button 
                    className="w-full py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                    style={{ 
                      backgroundColor: idx === 1 ? theme.accentColor : theme.primaryColor,
                      color: '#ffffff'
                    }}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {content.story && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8" style={{ color: theme.primaryColor }}>
              Our Story
            </h2>
            <p className="text-gray-700 text-lg mb-8">{content.story}</p>
            {content.mission && (
              <>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: theme.primaryColor }}>
                  Our Mission
                </h3>
                <p className="text-gray-700 mb-8">{content.mission}</p>
              </>
            )}
            {content.values && content.values.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: theme.primaryColor }}>
                  Our Values
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {content.values.map((value: string, idx: number) => (
                    <li key={idx} className="text-gray-700">{value}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      )}

      {/* Contact Section with Icons */}
      {content.email && (
        <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4" style={{ color: theme.primaryColor }}>
                Get In Touch
              </h2>
              <p className="text-xl text-gray-600">We'd love to hear from you</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {content.email && (
                <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${theme.primaryColor}15` }}
                  >
                    <Mail className="h-8 w-8" style={{ color: theme.primaryColor }} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: theme.primaryColor }}>Email</h3>
                  <p className="text-gray-600 text-center">{content.email}</p>
                </div>
              )}
              {content.phone && (
                <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${theme.accentColor}15` }}
                  >
                    <Phone className="h-8 w-8" style={{ color: theme.accentColor }} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: theme.primaryColor }}>Phone</h3>
                  <p className="text-gray-600 text-center">{content.phone}</p>
                </div>
              )}
              {content.address && (
                <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${theme.secondaryColor}15` }}
                  >
                    <MapPin className="h-8 w-8" style={{ color: theme.secondaryColor }} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: theme.primaryColor }}>Address</h3>
                  <p className="text-gray-600 text-center">{content.address}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {content.cta && (
        <section 
          className="py-16 px-6"
          style={{ backgroundColor: theme.secondaryColor || '#1e293b' }}
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{content.cta.text}</h2>
            {content.cta.action && (
              <button 
                className="px-8 py-3 rounded-lg font-semibold text-lg mt-4"
                style={{ 
                  backgroundColor: theme.accentColor || '#10b981',
                  color: '#ffffff'
                }}
              >
                {content.cta.action}
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
