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

          {/* Contextual messaging */}
          <div className="space-y-4">
            {hasResults && (
              <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-800 font-medium mb-2">
                  {categoryIndex === 0 ? JOURNEY_MESSAGES.progress.first_category :
                   categoryIndex < 3 ? JOURNEY_MESSAGES.progress.mid_journey :
                   JOURNEY_MESSAGES.progress.near_complete}
                </p>
                <p className="text-blue-600 text-sm">
                  {categoryPrompt.fields_intro}
                </p>
              </div>
            )}
            
            {/* Results Available Indicator */}
            {hasResults && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-green-800 text-sm font-medium">
                    Recommendations ready! Check the floating button below.
                  </span>
                </div>
              </div>
            )}
            
            {/* First Category: Floating CTA Design */}
            {categoryIndex === 0 ? (
              <div className="space-y-4">
                {/* Secondary Skip Button */}
                <button
                  onClick={onSkip}
                  className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Skip This Category
                </button>
                
                {/* Floating Primary CTA */}
                <div className="fixed bottom-6 left-4 right-4 z-50">
                  <button
                    onClick={handleComplete}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 animate-pulse"
                    style={{
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  >
                    <span className="text-xl">💳</span>
                    <span>{hasResults ? 'View Results' : 'Get Recommendations'}</span>
                    <span className="text-sm opacity-80">→</span>
                  </button>
                </div>
                
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
                  {hasResults ? 'View Results' : 'Get Recommendations'}
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