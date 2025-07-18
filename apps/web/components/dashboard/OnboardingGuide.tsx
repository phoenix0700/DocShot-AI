'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';

interface OnboardingGuideProps {
  onCreateProject: () => void;
}

export function OnboardingGuide({ onCreateProject }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const steps = [
    {
      title: 'Welcome to DocShot AI! 🎉',
      description:
        "You're now ready to automate your screenshot management. Let's get you set up in just a few minutes.",
      action: {
        label: 'Get Started',
        onClick: () => setCurrentStep(1),
      },
    },
    {
      title: 'Create Your First Project',
      description:
        'A project contains all the screenshots for one website or application. You can configure multiple URLs, selectors, and automation rules.',
      action: {
        label: 'Create Project',
        onClick: onCreateProject,
      },
    },
    {
      title: 'Configure Screenshots',
      description:
        'After creating a project, add screenshot configurations. Specify URLs, CSS selectors, viewports, and scheduling options.',
      action: {
        label: 'Got it!',
        onClick: () => setCurrentStep(2),
      },
    },
    {
      title: 'Set Up Integrations',
      description:
        'Connect GitHub, Slack, or email notifications to automatically update your documentation when changes are detected.',
      action: {
        label: 'Explore Integrations',
        onClick: () => window.open('/docs/integrations', '_blank'),
      },
    },
  ];

  if (dismissed) {
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-700/20"></div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{currentStep + 1}</span>
            </div>
            <div className="text-sm font-medium opacity-90">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-6">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
          <p className="text-white/90 leading-relaxed">{currentStepData.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={currentStepData.action.onClick}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              {currentStepData.action.label}
            </Button>

            {currentStep > 0 && currentStep < steps.length - 1 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="text-white/80 hover:text-white text-sm underline"
              >
                Skip this step
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {currentStep < steps.length - 1 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        {currentStep === 1 && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="font-semibold mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-white/90 space-y-1">
              <li>• Start with your most important pages (homepage, docs, dashboard)</li>
              <li>• Use CSS selectors to capture specific sections</li>
              <li>• Set up GitHub integration for automatic commits</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
