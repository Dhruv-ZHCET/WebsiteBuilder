import React from 'react';
import { colorThemes } from '../../data/templates';
import { ColorTheme } from '../../types';
import { Palette, Check } from 'lucide-react';

interface ColorThemeProps {
  selectedTheme: string;
  onSelect: (theme: ColorTheme) => void;
}

const ColorThemeStep: React.FC<ColorThemeProps> = ({ selectedTheme, onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Color Theme
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select a color scheme that reflects your brand personality. Each theme is carefully 
          crafted for optimal readability and user experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colorThemes.map((theme) => (
          <div
            key={theme.id}
            className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedTheme === theme.id
                ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(theme)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">{theme.name}</h3>
              </div>
              {selectedTheme === theme.id && (
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div
                className="w-full h-20 rounded-lg"
                style={{ background: theme.preview }}
              />
              
              <div className="grid grid-cols-5 gap-2">
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: theme.primary }}
                  title="Primary"
                />
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: theme.secondary }}
                  title="Secondary"
                />
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: theme.accent }}
                  title="Accent"
                />
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: theme.background }}
                  title="Background"
                />
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: theme.text }}
                  title="Text"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2 text-xs text-gray-500">
                <span>Primary</span>
                <span>Secondary</span>
                <span>Accent</span>
                <span>Background</span>
                <span>Text</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">Preview</div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span>Headers & Buttons</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <span>Links & Highlights</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Custom Colors Available
          </h3>
          <p className="text-yellow-700">
            Need a specific color scheme? Contact our team after website creation to customize 
            your colors to match your exact brand guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorThemeStep;