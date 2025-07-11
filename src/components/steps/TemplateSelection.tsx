import React, { useState } from 'react';
import { websiteTemplates } from '../../data/templates';
import { WebsiteTemplate } from '../../types';
import { Eye, Check, Sparkles, Building, Palette, Zap } from 'lucide-react';

interface TemplateSelectionProps {
  selectedTemplate: WebsiteTemplate | null;
  onSelect: (template: WebsiteTemplate) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ selectedTemplate, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates', icon: Sparkles },
    { id: 'minimalist', name: 'Minimalist', icon: Palette },
    { id: 'bold', name: 'Bold & Modern', icon: Zap },
    { id: 'corporate', name: 'Corporate', icon: Building },
    { id: 'creative', name: 'Creative', icon: Sparkles }
  ];

  const filteredTemplates = activeCategory === 'all' 
    ? websiteTemplates 
    : websiteTemplates.filter(template => template.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'minimalist': return '🎨';
      case 'bold': return '⚡';
      case 'corporate': return '🏢';
      case 'creative': return '✨';
      default: return '🌐';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'minimalist': return 'from-gray-500 to-gray-600';
      case 'bold': return 'from-red-500 to-pink-600';
      case 'corporate': return 'from-blue-600 to-indigo-700';
      case 'creative': return 'from-purple-500 to-pink-500';
      default: return 'from-indigo-500 to-purple-600';
    }
  };

  const TemplatePreview = ({ template }: { template: WebsiteTemplate }) => {
    const mockupHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: ${template.category === 'minimalist' ? '#ffffff' : template.category === 'bold' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : template.category === 'corporate' ? '#f8fafc' : 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'};">
        <header style="padding: 1rem 2rem; background: ${template.category === 'corporate' ? '#1e40af' : template.category === 'minimalist' ? '#000000' : 'rgba(255,255,255,0.1)'}; color: white; backdrop-filter: blur(10px);">
          <nav style="display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin: 0; font-size: 1.5rem; font-weight: bold;">Brand Name</h1>
            <div style="display: flex; gap: 2rem;">
              <a href="#" style="color: white; text-decoration: none;">Home</a>
              <a href="#" style="color: white; text-decoration: none;">About</a>
              <a href="#" style="color: white; text-decoration: none;">Services</a>
              <a href="#" style="color: white; text-decoration: none;">Contact</a>
            </div>
          </nav>
        </header>
        
        <section style="padding: 4rem 2rem; text-align: center; color: ${template.category === 'minimalist' ? '#000' : '#fff'};">
          <h1 style="font-size: ${template.category === 'bold' ? '4rem' : '3rem'}; margin-bottom: 1rem; font-weight: ${template.category === 'corporate' ? '600' : 'bold'};">
            ${template.category === 'minimalist' ? 'Simple. Clean. Effective.' : 
              template.category === 'bold' ? 'BOLD IMPACT' : 
              template.category === 'corporate' ? 'Professional Excellence' : 
              'Creative Vision'}
          </h1>
          <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            ${template.description}
          </p>
          <button style="background: ${template.category === 'minimalist' ? '#000' : template.category === 'corporate' ? '#3b82f6' : 'rgba(255,255,255,0.2)'}; color: ${template.category === 'minimalist' ? '#fff' : '#fff'}; padding: 1rem 2rem; border: none; border-radius: ${template.category === 'corporate' ? '0.5rem' : '2rem'}; font-size: 1.1rem; cursor: pointer; backdrop-filter: blur(10px); border: ${template.category === 'minimalist' ? 'none' : '1px solid rgba(255,255,255,0.3)'};">
            Get Started
          </button>
        </section>
        
        <section style="padding: 4rem 2rem; background: ${template.category === 'minimalist' ? '#f8f9fa' : template.category === 'corporate' ? '#ffffff' : 'rgba(255,255,255,0.1)'}; color: ${template.category === 'minimalist' || template.category === 'corporate' ? '#333' : '#fff'};">
          <div style="max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem;">Features</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
              ${template.features.map(feature => `
                <div style="background: ${template.category === 'minimalist' ? '#ffffff' : template.category === 'corporate' ? '#f8fafc' : 'rgba(255,255,255,0.1)'}; padding: 2rem; border-radius: ${template.category === 'corporate' ? '0.5rem' : '1rem'}; text-align: center; backdrop-filter: blur(10px); border: ${template.category === 'minimalist' ? '1px solid #e5e7eb' : template.category === 'corporate' ? '1px solid #e5e7eb' : '1px solid rgba(255,255,255,0.2)'};">
                  <h3 style="margin-bottom: 1rem; color: ${template.category === 'minimalist' || template.category === 'corporate' ? '#333' : '#fff'};">${feature}</h3>
                  <p style="color: ${template.category === 'minimalist' || template.category === 'corporate' ? '#666' : 'rgba(255,255,255,0.8)'};">Lorem ipsum dolor sit amet consectetur.</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      </div>
    `;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{template.name} Preview</h2>
              <p className="text-gray-600">{template.description}</p>
            </div>
            <button
              onClick={() => setPreviewTemplate(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div dangerouslySetInnerHTML={{ __html: mockupHTML }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Choose Your Website Template
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select from our professionally designed templates. Each template offers unique layouts, 
          styling approaches, and visual tones to match your brand identity.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              selectedTemplate?.id === template.id
                ? 'border-indigo-500 ring-4 ring-indigo-200'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            {/* Template Preview */}
            <div className="relative h-64 bg-gradient-to-br overflow-hidden rounded-t-2xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(template.category)}`}>
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">{getCategoryIcon(template.category)}</div>
                    <h3 className="text-2xl font-bold">{template.name}</h3>
                    <p className="text-sm opacity-90 mt-2">{template.category.toUpperCase()}</p>
                  </div>
                </div>
              </div>
              
              {/* Preview Button */}
              <button
                onClick={() => setPreviewTemplate(template)}
                className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            </div>

            {/* Template Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600">{template.description}</p>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Key Features:</p>
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-200"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Included Sections:</p>
                <div className="flex flex-wrap gap-2">
                  {template.sections.map((section, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>

              {/* Select Button */}
              <button
                onClick={() => onSelect(template)}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  selectedTemplate?.id === template.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedTemplate?.id === template.id ? 'Selected' : 'Select Template'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && <TemplatePreview template={previewTemplate} />}

      {/* Info Section */}
      <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Professional Templates, Endless Possibilities
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Each template is carefully crafted with modern design principles, responsive layouts, 
            and optimized performance. After selection, you'll be able to customize colors, 
            upload your visual assets, and personalize content to match your brand perfectly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Modern Design</h4>
              <p className="text-sm text-gray-600">Contemporary layouts with smooth animations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast & Responsive</h4>
              <p className="text-sm text-gray-600">Optimized for all devices and screen sizes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Palette className="w-6 h-6 text-pink-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fully Customizable</h4>
              <p className="text-sm text-gray-600">Colors, content, and assets tailored to you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;