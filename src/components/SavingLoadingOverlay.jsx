import React, { useState, useEffect } from 'react';
import { Loader2, Link as LinkIcon, Download, Save } from 'lucide-react';

const SavingLoadingOverlay = ({ isVisible, message = "Saving your link..." }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: LinkIcon, text: "Analyzing your link..." },
    { icon: Download, text: "Fetching link details..." },
    { icon: Save, text: "Saving to local storage..." }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isVisible, steps.length]);

  if (!isVisible) return null;

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CurrentIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-500 border-r-orange-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Saving Your Link
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {steps[currentStep].text}
          </p>
          
          {/* Progress Steps */}
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingLoadingOverlay;