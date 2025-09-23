import React, { useState, useEffect } from 'react';
import { CardResult, Payload } from '../types';
import { formatCurrency } from '../utils';
import { JOURNEY_MESSAGES } from '../constants';

interface SimpleMobileResultsSheetProps {
  overallCards: CardResult[];
  eligibleCards: CardResult[];
  activeTab: 'eligible' | 'all';
  onTabChange: (tab: 'eligible' | 'all') => void;
  currentCategory?: string;
  categoryIndex?: number;
  totalCategories?: number;
  onAddMoreSpending?: () => void;
  payload?: Payload; // Add payload to check for any spending data
}

const SimpleMobileResultsSheet: React.FC<SimpleMobileResultsSheetProps> = ({
  overallCards,
  eligibleCards,
  activeTab,
  onTabChange,
  currentCategory,
  categoryIndex = 0,
  totalCategories = 5,
  onAddMoreSpending,
  payload,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);

  const displayCards = activeTab === 'eligible' ? eligibleCards : overallCards;
  const progressPercentage = Math.round((categoryIndex / totalCategories) * 100);
  const maxSavings = Math.max(...displayCards.map(card => card.monthlySavings || 0));

  // Check if user has input any spending data
  const hasSpendingData = payload ? Object.values(payload).some(value => value > 0) : false;
  const canAddMore = categoryIndex < totalCategories - 1;

  // Debug logging
  console.log('=== SIMPLE MOBILE RESULTS SHEET DEBUG ===');
  console.log('overallCards.length:', overallCards.length);
  console.log('eligibleCards.length:', eligibleCards.length);
  console.log('displayCards.length:', displayCards.length);
  console.log('hasSpendingData:', hasSpendingData);
  console.log('Should show floating button:', overallCards.length > 0);
  console.log('canAddMore:', canAddMore);
  console.log('onAddMoreSpending exists:', !!onAddMoreSpending);
  console.log('categoryIndex:', categoryIndex);
  console.log('totalCategories:', totalCategories);

  // No auto-open - user must manually open the sheet

  const closeSheet = () => {
    setIsOpen(false);
    setShowAllCards(false); // Reset to show only 3 cards when reopening
  };

  const openSheet = () => {
    setIsOpen(true);
  };


  return (
    <>
      {/* Debug Info */}
      <div className="fixed top-4 left-4 bg-red-500 text-white p-2 rounded text-xs z-50 lg:hidden">
        Mobile: {overallCards.length} cards | Button: {overallCards.length > 0 ? 'SHOWING' : 'HIDDEN'} | canAddMore: {canAddMore ? 'YES' : 'NO'}
      </div>

      {/* Mobile Floating Button - Always show when there are results */}
      {overallCards.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
          <button
            onClick={openSheet}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl shadow-xl font-semibold text-lg"
          >
            💳 View {overallCards.length} Cards
          </button>
        </div>
      )}

      {/* Bottom Sheet Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeSheet}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Minimal Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden max-h-[80vh]">
            {/* Minimal Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {overallCards.length > 0 ? 'Your Cards' : 'Analysis'}
                </h3>
                <button
                  onClick={closeSheet}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <span className="text-gray-600 text-sm">✕</span>
                </button>
              </div>
              
              {/* Minimal Tab Switcher - Only show when there are results */}
              {overallCards.length > 0 && (
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => onTabChange('eligible')}
                    className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'eligible'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    Eligible ({eligibleCards.length})
                  </button>
                  <button
                    onClick={() => onTabChange('all')}
                    className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'all'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    All ({overallCards.length})
                  </button>
                </div>
              )}
            </div>

            {/* Minimal Content */}
            <div className="px-4 py-4">
              {displayCards.length > 0 ? (
                <div className="space-y-3">
                  {(showAllCards ? displayCards : displayCards.slice(0, 3)).map((card, index) => (
                    <div
                      key={card.id}
                      className="bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {card.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{card.name}</h4>
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(card.monthlySavings)}/mo
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {displayCards.length > 3 && !showAllCards && (
                    <button
                      onClick={() => setShowAllCards(true)}
                      className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                    >
                      View All {displayCards.length} Cards
                    </button>
                  )}
                  {showAllCards && displayCards.length > 3 && (
                    <button
                      onClick={() => setShowAllCards(false)}
                      className="w-full bg-gray-50 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Show Less
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-500 text-lg">💳</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {hasSpendingData 
                      ? "Analyzing your spending..."
                      : "Add spending to see recommendations"
                    }
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {displayCards.length > 0 && (
                <div className="mt-4 space-y-3">
                  {canAddMore && onAddMoreSpending && (
                    <button 
                      onClick={() => {
                        console.log('=== CONTINUE TO NEXT CATEGORY BUTTON CLICKED ===');
                        console.log('canAddMore:', canAddMore);
                        console.log('onAddMoreSpending exists:', !!onAddMoreSpending);
                        console.log('categoryIndex:', categoryIndex);
                        console.log('totalCategories:', totalCategories);
                        onAddMoreSpending();
                        closeSheet();
                      }}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue to Next Category
                    </button>
                  )}
                  <button 
                    onClick={closeSheet}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    {canAddMore ? 'Stay Here' : 'Done'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SimpleMobileResultsSheet;
