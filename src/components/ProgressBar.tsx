import React from 'react';
import { Check, Clock, Circle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, steps }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-6 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : index === currentStep
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg animate-pulse'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-6 h-6" />
                  ) : index === currentStep ? (
                    <Clock className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-4">
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step}
                  </p>
                  <p
                    className={`text-xs transition-colors ${
                      index < currentStep
                        ? 'text-green-600'
                        : index === currentStep
                        ? 'text-indigo-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {index < currentStep
                      ? 'Completed'
                      : index === currentStep
                      ? 'In Progress'
                      : 'Pending'}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-6 rounded-full transition-all duration-500 ${
                    index < currentStep 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Progress percentage */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;