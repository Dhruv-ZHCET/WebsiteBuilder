import React from 'react';
import { useState } from 'react';
import { industryTemplates } from '../../data/templates';
import { IndustryTemplate } from '../../types';
import * as LucideIcons from 'lucide-react';
import TemplatePreview from '../TemplatePreview';

interface IndustrySelectionProps {
  selectedIndustry: string;
  onSelect: (industry: IndustryTemplate) => void;
  onPreview?: (templateId: string) => void;
}

const IndustrySelection: React.FC<IndustrySelectionProps> = ({ 
  selectedIndustry, 
  onSelect, 
  onPreview 
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<{ id: string; name: string } | null>(null);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-8 h-8" /> : <LucideIcons.Globe className="w-8 h-8" />;
  };

  const handlePreview = (template: IndustryTemplate) => {
    setPreviewTemplate({ id: template.id, name: template.name });
    onPreview?.(template.id);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Industry Template
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the industry that best matches your business. Each template is optimized with 
          industry-specific features and layouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industryTemplates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedIndustry === template.id
                ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(template)}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-4">
              <div className="text-indigo-600">
                {getIcon(template.icon)}
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-gray-600 mb-4">{template.description}</p>
            
            <div className="mb-4">
              <button
                onClick={() => handlePreview(template)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mb-3"
              >
                Preview Template
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Pages included:</p>
                <div className="flex flex-wrap gap-1">
                  {template.pages.map((page, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {page}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Key features:</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">
                      +{template.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <TemplatePreview
        templateId={previewTemplate?.id || ''}
        templateName={previewTemplate?.name || ''}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </>
  );
};

export default IndustrySelection;