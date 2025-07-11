import React from 'react';
import { FileText, Type, Users, Phone } from 'lucide-react';

interface ContentData {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutContent: string;
  servicesTitle: string;
  contactTitle: string;
  footerText: string;
}

interface ContentCustomizationProps {
  content: ContentData;
  onChange: (content: ContentData) => void;
}

const ContentCustomization: React.FC<ContentCustomizationProps> = ({ content, onChange }) => {
  const handleChange = (field: keyof ContentData, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Customize Your Content
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Personalize the content that will appear on your website. This includes your main 
          headlines, descriptions, and key messaging.
        </p>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Type className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Hero Section</h3>
              <p className="text-gray-500">The first thing visitors see on your website</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Headline *
              </label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Welcome to Your Business"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <textarea
                value={content.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="A brief description of what you offer"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">About Section</h3>
              <p className="text-gray-500">Tell your story and build trust</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Title *
              </label>
              <input
                type="text"
                value={content.aboutTitle}
                onChange={(e) => handleChange('aboutTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="About Us"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Content *
              </label>
              <textarea
                value={content.aboutContent}
                onChange={(e) => handleChange('aboutContent', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell your story, your mission, and what makes you unique..."
                required
              />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Services Section</h3>
              <p className="text-gray-500">Highlight what you offer</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services Title *
            </label>
            <input
              type="text"
              value={content.servicesTitle}
              onChange={(e) => handleChange('servicesTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Our Services"
              required
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Contact Section</h3>
              <p className="text-gray-500">Make it easy for customers to reach you</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Title *
            </label>
            <input
              type="text"
              value={content.contactTitle}
              onChange={(e) => handleChange('contactTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Contact Us"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Footer</h3>
              <p className="text-gray-500">Copyright and additional information</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer Text
            </label>
            <input
              type="text"
              value={content.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="© 2024 Your Company Name. All rights reserved."
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Content Writing Tips</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Keep headlines clear and benefit-focused</li>
          <li>• Use simple, conversational language</li>
          <li>• Focus on how you help customers solve problems</li>
          <li>• Include relevant keywords naturally</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentCustomization;