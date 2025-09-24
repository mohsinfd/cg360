import React, { useState } from 'react';
import { CategoryKey, Payload, Eligibility } from '../types';
import { CATEGORY_CONFIG, FIELD_CONFIG, JOURNEY_MESSAGES } from '../constants';
import { hasCategoryData } from '../utils';
import InputSlider from './InputSlider';
import LoungePicker from './LoungePicker';
import EligibilityForm from './EligibilityForm';
import CarouselToast from './CarouselToast';

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
  
  // Debug logging for CTA visibility
  const hasCurrentCategoryData = hasCategoryData(payload, config.fields);
  
  console.log('=== CATEGORY PANEL DEBUG ===');
  console.log('Category:', category);
  console.log('Category index:', categoryIndex);
  console.log('Has results:', hasResults);
  console.log('Has current category data:', hasCurrentCategoryData);
  console.log('Button text will be:', hasResults ? 'Update Recommendations' : 'Get Recommendations');
  
  return (
    <div className="space-y-6 pt-20">
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

          {/* Carousel Toast Messages */}
          <CarouselToast 
            messages={[
              {
                id: 'profile-building',
                icon: '🎯',
                title: categoryIndex === 0 ? 'Building Your Profile' : 'Profile Progress',
                message: categoryPrompt.fields_intro,
                color: 'blue' as const
              },
              ...(hasResults ? [{
                id: 'previous-analysis',
                icon: '✅',
                title: 'Analysis Complete',
                message: `${categoryIndex === 0 ? 'Shopping' : 'Previous categories'} analyzed successfully`,
                color: 'green' as const
              }] : []),
              ...(hasResults ? [{
                id: 'next-insights',
                icon: '💡',
                title: 'Unlock More Insights',
                message: `Add ${config.label.toLowerCase()} to unlock more insights`,
                color: 'purple' as const
              }] : [])
            ]}
          />
            
            {/* Universal CTA Design - No Conflicting Buttons */}
            <div className="space-y-4">
              {/* Secondary Skip Button - Always Available */}
              <button
                onClick={onSkip}
                className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                Skip This Category
              </button>
              
              {/* Floating Primary CTA - Always visible on category input screens */}
              <div className="fixed bottom-6 left-4 right-4 z-50">
                <button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span className="text-xl">💳</span>
                  <span>{hasResults ? 'Update Recommendations' : 'Get Recommendations'}</span>
                  <span className="text-sm opacity-80">→</span>
                </button>
              </div>
              
              {/* Spacer to prevent content overlap */}
              <div className="h-20"></div>
            </div>
        </>
      )}
    </div>
  );
};

export default CategoryPanel;