import React, { useState, useMemo, useCallback } from 'react';
import { CG360State, CategoryKey, Payload, Eligibility } from '../types';
import { DEFAULT_PAYLOAD, DEFAULT_ORDER, UPDATE_COPY, NUDGE_COPY } from '../constants';
import { calculateAccuracy } from '../utils';
import { fetchRecommendations } from '../api';
import CategorySelection from './CategorySelection';
import CategoryPanel from './CategoryPanel';
import ResultsPreview from './ResultsPreview';
import SimpleMobileResultsSheet from './SimpleMobileResultsSheet';
import NudgeBanner from './NudgeBanner';
import AnimatedTransition from './AnimatedTransition';

const CardGenius360: React.FC = () => {
  const [state, setState] = useState<CG360State>({
    step: 'category_pick',
    chosen: [],
    idx: 0,
    payload: { ...DEFAULT_PAYLOAD },
    eligibility: {},
    results: { overall: [], eligible: [] },
    accuracy: 0,
    banners: {},
    activeTab: 'all',
    isLoading: false,
  });

  const order = state.chosen.length ? state.chosen : DEFAULT_ORDER;
  const currentCategory = order[state.idx] as CategoryKey | undefined;
  
  // Debug logging
  console.log('=== CARDGENIUS360 RENDER ===');
  console.log('Current idx:', state.idx);
  console.log('Current category:', currentCategory);
  console.log('Order:', order);
  console.log('Results length:', state.results.overall.length);

  // Calculate accuracy
  const accuracy = useMemo(() => 
    calculateAccuracy(state.payload, state.eligibility), 
    [state.payload, state.eligibility]
  );

  // Update accuracy in state
  React.useEffect(() => {
    setState(prev => ({ ...prev, accuracy }));
  }, [accuracy]);

  // Handle category selection
  const handleCategorySelect = useCallback((categories: CategoryKey[]) => {
    setState(prev => ({
      ...prev,
      step: 'category_inputs',
      chosen: categories,
      idx: 0,
    }));
  }, []);

  // Handle category completion
  const handleCategoryComplete = useCallback(async (category: CategoryKey) => {
    try {
      console.log('=== HANDLE CATEGORY COMPLETE STARTED ===');
      console.log('Category:', category);
      console.log('Payload:', state.payload);
      
      // Fetch recommendations
      const response = await fetchRecommendations(state.payload);
      console.log('API Response:', response);
      const cards = response.cards || [];
      console.log('Cards received:', cards.length);
      
      // Separate eligible and overall cards
      const eligibleCards = cards.filter(card => card.eligible);
      const overallCards = cards;
      console.log('Eligible cards:', eligibleCards.length);
      console.log('Overall cards:', overallCards.length);

      // Update banners
      const updateText = UPDATE_COPY[category as keyof typeof UPDATE_COPY];
      const nudgeText = state.idx < order.length - 1 ? NUDGE_COPY[category as keyof typeof NUDGE_COPY] : undefined;
      
      console.log('About to update state with results:', { overall: overallCards.length, eligible: eligibleCards.length });
      
      setState(prev => {
        const newState = {
          ...prev,
          results: { overall: overallCards, eligible: eligibleCards },
          banners: { update: updateText, nudge: nudgeText },
          activeTab: (eligibleCards.length > 0 ? 'eligible' : 'all') as 'eligible' | 'all',
          isLoading: false,
        };
        console.log('New state after update:', newState);
        return newState;
      });

      // Auto-advance to next category after showing results
      setTimeout(() => {
        if (state.idx < order.length - 1) {
          console.log('Auto-advancing to next category...');
          setState(prev => ({ ...prev, idx: prev.idx + 1 }));
        }
      }, 2000); // 2 second delay to let user see results
      
      console.log('=== HANDLE CATEGORY COMPLETE FINISHED ===');
      
    } catch (error) {
      console.error('Error completing category:', error);
    }
  }, [state.payload, state.idx, order.length]);

  // Handle category skip
  const handleCategorySkip = useCallback((category: CategoryKey) => {
    handleCategoryComplete(category);
  }, [handleCategoryComplete]);

  // Handle payload update
  const handlePayloadUpdate = useCallback((updater: (payload: Payload) => Payload) => {
    setState(prev => ({
      ...prev,
      payload: updater(prev.payload),
    }));
  }, []);

  // Handle eligibility update
  const handleEligibilityUpdate = useCallback((eligibility: Eligibility) => {
    setState(prev => ({
      ...prev,
      eligibility: { ...prev.eligibility, ...eligibility },
    }));
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: 'eligible' | 'all') => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-4">
        {/* Mobile-First Minimal Header */}
        {state.step === 'category_inputs' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-semibold text-gray-900">CardGenius 360</h1>
              <div className="text-sm text-gray-500">
                {state.idx + 1} of {order.length}
              </div>
            </div>
            {/* Minimal Progress Indicator */}
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((state.idx + 1) / order.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Content - Mobile-First Progressive Flow */}
        <div className="space-y-6">
          {/* Step 1: Category Selection */}
          {state.step === 'category_pick' && (
            <AnimatedTransition>
              <CategorySelection
                onSelect={handleCategorySelect}
                selectedCategories={state.chosen}
              />
            </AnimatedTransition>
          )}

          {/* Step 2: Progressive Input + Results */}
          {state.step === 'category_inputs' && (
            <div className="space-y-6">
              {/* Current Category Input */}
              {currentCategory && (
                <AnimatedTransition>
                  <CategoryPanel
                    category={currentCategory}
                    payload={state.payload}
                    onUpdate={handlePayloadUpdate}
                    onComplete={() => handleCategoryComplete(currentCategory)}
                    onSkip={() => handleCategorySkip(currentCategory)}
                    eligibility={state.eligibility}
                    onEligibilityUpdate={handleEligibilityUpdate}
                    categoryIndex={state.idx}
                    hasResults={state.results.overall.length > 0}
                    overallCards={state.results.overall}
                  />
                </AnimatedTransition>
              )}

              {/* Subtle Progress Banners - Only show nudge, not update */}
              {state.banners.nudge && (
                <div className="px-4">
                  <NudgeBanner text={state.banners.nudge} />
                </div>
              )}

              {/* Mobile Results Sheet */}
              <SimpleMobileResultsSheet
                overallCards={state.results.overall}
                eligibleCards={state.results.eligible}
                activeTab={state.activeTab}
                onTabChange={handleTabChange}
                currentCategory={currentCategory}
                categoryIndex={state.idx}
                totalCategories={order.length}
                onAddMoreSpending={() => {
                  console.log('=== CONTINUE TO NEXT CATEGORY CLICKED ===');
                  console.log('Current idx:', state.idx);
                  console.log('Order length:', order.length);
                  console.log('Current category:', currentCategory);
                  console.log('Order:', order);
                  
                  if (state.idx < order.length - 1) {
                    console.log('Advancing to next category...');
                    setState(prev => {
                      const newIdx = prev.idx + 1;
                      const newCategory = order[newIdx];
                      console.log('New idx:', newIdx);
                      console.log('New category:', newCategory);
                      return { ...prev, idx: newIdx };
                    });
                  } else {
                    console.log('Already at last category');
                  }
                }}
                payload={state.payload}
                hideFloatingButton={state.results.overall.length > 0} // Hide when CategoryPanel shows both CTAs
              />

              {/* Desktop Results - Completely Hidden on Mobile */}
              <div className="hidden lg:block">
                {state.results.overall.length > 0 && (
                  <AnimatedTransition>
                    <ResultsPreview
                      overallCards={state.results.overall}
                      eligibleCards={state.results.eligible}
                      activeTab={state.activeTab}
                      onTabChange={handleTabChange}
                      isLoading={false}
                      currentCategory={currentCategory}
                      categoryIndex={state.idx}
                      totalCategories={order.length}
                      onAddMoreSpending={() => {
                        if (state.idx < order.length - 1) {
                          setState(prev => ({ ...prev, idx: prev.idx + 1 }));
                        }
                      }}
                    />
                  </AnimatedTransition>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardGenius360;
