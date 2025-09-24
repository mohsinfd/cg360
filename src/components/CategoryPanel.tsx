import React, { useState } from 'react';
import { CategoryKey, Payload, Eligibility } from '../types';
import { CATEGORY_CONFIG, FIELD_CONFIG, JOURNEY_MESSAGES } from '../constants';
import InputSlider from './InputSlider';
import LoungePicker from './LoungePicker';
import EligibilityForm from './EligibilityForm';

interface CategoryPanelProps {
  category: CategoryKey;
  payload: Payload;
  onUpdate: (updater: (payload: Payload) => Payload) => void;
  onComplete: () => void;
  onSkip: () => void;
  eligibility: Eligibility;
  onEligibilityUpdate: (eligibility: Eligibility) => void;
  categoryIndex: number;
  hasResults: boolean;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({
  category,
  payload,
  onUpdate,
  onComplete,
  onSkip,
  eligibility,
  onEligibilityUpdate,
  categoryIndex,
  hasResults,
}) => {
  const [showEligibilityForm, setShowEligibilityForm] = useState(false);
  const [eligibilityType, setEligibilityType] = useState<'income' | 'pincode'>('income');

  const config = CATEGORY_CONFIG[category];

  // Show eligibility form after Food (index 1) and Travel (index 2)
  const shouldShowEligibility = 
    (categoryIndex === 1 && !eligibility.inhandIncome) || // After Food
    (categoryIndex === 2 && !eligibility.pincode); // After Travel

  const handleFieldUpdate = (field: keyof Payload, value: number) => {
    onUpdate(prev => ({ ...prev, [field]: value }));
  };

  const handleEligibilitySubmit = (newEligibility: Eligibility) => {
    onEligibilityUpdate(newEligibility);
    setShowEligibilityForm(false);
    // After submitting eligibility, complete the category
    onComplete();
  };

  const handleEligibilityCancel = () => {
    setShowEligibilityForm(false);
  };

  const handleComplete = () => {
    console.log('=== CONTINUE ANALYSIS BUTTON CLICKED ===');
    console.log('Category:', category);
    console.log('Should show eligibility:', shouldShowEligibility);
    console.log('Show eligibility form:', showEligibilityForm);
    console.log('Category index:', categoryIndex);
    
    if (shouldShowEligibility && !showEligibilityForm) {
      console.log('Showing eligibility form');
      setEligibilityType(categoryIndex === 1 ? 'income' : 'pincode');
      setShowEligibilityForm(true);
    } else {
      console.log('Calling onComplete');
      onComplete();
    }
  };

  const renderField = (field: keyof Payload) => {
    const fieldConfig = FIELD_CONFIG[field];
    
    if (field.includes('lounge')) {
      return (
        <LoungePicker
          key={field}
          label={fieldConfig.label}
          value={payload[field]}
          onChange={(value) => handleFieldUpdate(field, value)}
        />
      );
    }

    return (
      <InputSlider
        key={field}
        label={fieldConfig.label}
        value={payload[field]}
        onChange={(value) => handleFieldUpdate(field, value)}
        max={fieldConfig.max}
        unit={fieldConfig.unit}
      />
    );
  };

  const categoryPrompt = JOURNEY_MESSAGES.category_prompts[category];
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          {categoryPrompt.title}
        </h2>
        <p className="text-base text-gray-600">
          {categoryPrompt.subtitle}
        </p>
      </div>

      {/* Eligibility Form */}
      {showEligibilityForm && (
        <div className="space-y-4">
          <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <p className="text-purple-800 font-medium">
              {(categoryPrompt as any).eligibility_prompt || 'Please provide your eligibility information to continue.'}
            </p>
          </div>
          <EligibilityForm
            onSubmit={handleEligibilitySubmit}
            onCancel={handleEligibilityCancel}
            initialData={eligibility}
            showPincode={eligibilityType === 'pincode'}
          />
        </div>
      )}

      {/* Category Fields */}
      {!showEligibilityForm && (
        <>
          <div className="space-y-6">
            {config.fields.map(renderField)}
          </div>

          {/* Consolidated Progressive Banner */}
          <div className="space-y-4">
            {/* Single Progressive Message */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-blue-600">🎯</span>
                <p className="text-blue-800 font-semibold">
                  {categoryIndex === 0 ? 'Building Your Profile' :
                   categoryIndex < 3 ? 'Profile Progress' :
                   'Almost Complete!'}
                </p>
              </div>
              
              {/* Dynamic Progress Message */}
              <p className="text-blue-700 text-sm mb-2">
                {hasResults ? 
                  `✅ ${categoryIndex === 0 ? 'Shopping' : 'Previous categories'} analyzed. ${categoryPrompt.fields_intro}` :
                  categoryPrompt.fields_intro
                }
              </p>
              
              {/* Next Action Hint */}
              {hasResults && (
                <p className="text-purple-600 text-xs font-medium">
                  💡 Add {config.label.toLowerCase()} to unlock more insights
                </p>
              )}
            </div>
            
            {/* Simplified CTA Design */}
            {categoryIndex === 0 ? (
              <div className="space-y-4">
                {/* Secondary Skip Button */}
                <button
                  onClick={onSkip}
                  className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Skip This Category
                </button>
                
                {/* Floating Primary CTA - Only show when no results yet */}
                {!hasResults && (
                  <div className="fixed bottom-6 left-4 right-4 z-50">
                    <button
                      onClick={handleComplete}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">💳</span>
                      <span>Get Recommendations</span>
                      <span className="text-sm opacity-80">→</span>
                    </button>
                  </div>
                )}
                
                {/* Spacer to prevent content overlap */}
                <div className="h-20"></div>
              </div>
            ) : (
              /* Other Categories: Standard Layout */
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onSkip}
                  className="flex-1 btn-secondary"
                >
                  Skip This Category
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 btn-primary"
                >
                  {hasResults ? 'Continue Analysis' : 'Get Recommendations'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPanel;