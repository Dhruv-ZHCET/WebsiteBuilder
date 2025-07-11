import React from 'react';
import { ChevronLeft, ChevronRight, Eye, Save, Sparkles, Download } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onPreview: () => void;
  onSave: () => void;
  canProceed: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onPreview,
  onSave,
  canProceed
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 px-4 py-6 sticky bottom-0 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex space-x-3">
          {!isFirstStep && (
            <button
              onClick={onPrevious}
              className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-medium">Previous</span>
            </button>
          )}
          
          <button
            onClick={onPreview}
            className="flex items-center space-x-2 px-6 py-3 text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Eye className="w-4 h-4" />
            <span className="font-medium">Preview</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onSave}
            className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Save className="w-4 h-4" />
            <span className="font-medium">Save Draft</span>
          </button>
          
          {isLastStep ? (
            <button
              onClick={onNext}
              disabled={!canProceed}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Website</span>
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!canProceed}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none font-semibold"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationButtons;