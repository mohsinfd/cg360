import React from 'react';
import { CardResult } from '../types';
import { formatCurrency } from '../utils';
import { JOURNEY_MESSAGES } from '../constants';
import SkeletonCard from './SkeletonCard';

interface ResultsPreviewProps {
  overallCards: CardResult[];
  eligibleCards: CardResult[];
  activeTab: 'eligible' | 'all';
  onTabChange: (tab: 'eligible' | 'all') => void;
  isLoading?: boolean;
  currentCategory?: string;
  categoryIndex?: number;
  totalCategories?: number;
  onAddMoreSpending?: () => void;
}

const ResultsPreview: React.FC<ResultsPreviewProps> = ({
  overallCards,
  eligibleCards,
  activeTab,
  onTabChange,
  isLoading = false,
  currentCategory,
  categoryIndex = 0,
  totalCategories = 5,
  onAddMoreSpending,
}) => {
  const displayCards = activeTab === 'eligible' ? eligibleCards : overallCards;
  
  // Debug logging
  console.log('=== RESULTSPREVIEW RENDER ===');
  console.log('Props received:', {
    overallCards: overallCards.length,
    eligibleCards: eligibleCards.length,
    activeTab,
    displayCards: displayCards.length,
    isLoading,
    currentCategory,
    categoryIndex,
    totalCategories
  });
  console.log('First overall card:', overallCards[0]);
  console.log('First eligible card:', eligibleCards[0]);

  // Calculate gamification metrics
  const progressPercentage = Math.round((categoryIndex / totalCategories) * 100);
  const maxSavings = Math.max(...displayCards.map(card => card.monthlySavings || 0));
  const canAddMore = categoryIndex < totalCategories - 1;

  return (
    <div className="card-elevated animate-fade-in">
      {/* Debug indicator for desktop ResultsPreview */}
      <div className="bg-yellow-500 text-black p-2 text-xs font-bold mb-4">
        DEBUG: ResultsPreview rendered with {overallCards.length} overall cards, {eligibleCards.length} eligible cards.
      </div>
      {/* Debug indicator */}
      <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
        🔍 DEBUG: ResultsPreview rendered with {overallCards.length} overall cards, {eligibleCards.length} eligible cards
      </div>
      {/* Gamification Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="heading-lg mb-2">🎯 Your Card Recommendations</h3>
            <p className="body-sm text-gray-600">
              {categoryIndex === 0 ? JOURNEY_MESSAGES.results.initial :
               categoryIndex < totalCategories - 1 ? JOURNEY_MESSAGES.results.improved :
               JOURNEY_MESSAGES.results.final}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(maxSavings)}
            </div>
            <div className="text-xs text-gray-500">max savings/month</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Incentive Message */}
        {canAddMore && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">+</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900">
                  Add more spending categories to unlock better cards!
                </p>
                <p className="text-sm text-blue-700">
                  Complete your profile to access premium cards with higher savings
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => onTabChange('eligible')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'eligible'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            Eligible ({eligibleCards.length})
          </button>
          <button
            onClick={() => onTabChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            All ({overallCards.length})
          </button>
        </div>
      </div>

      <div className="space-y-4 lg:space-y-6">
        {isLoading ? (
          <>
            {/* Loading State with Skeleton Cards */}
            <div className="lg:hidden space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="hidden lg:block space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </>
        ) : displayCards.length > 0 ? (
          <>
            {/* Mobile: Show fewer cards, Desktop: Show more */}
            <div className="lg:hidden space-y-3">
              {displayCards.slice(0, 2).map((card, index) => (
                <div key={card.id} className="card-reveal">
                  <CardItem card={card} index={index} />
                </div>
              ))}
            </div>
            <div className="hidden lg:block space-y-6">
              {displayCards.slice(0, 4).map((card, index) => (
                <div key={card.id} className="card-reveal">
                  <CardItem card={card} index={index} />
                </div>
              ))}
            </div>
            
            {/* Show more cards button on mobile */}
            {displayCards.length > 2 && (
              <div className="lg:hidden text-center">
                <button className="btn-secondary text-sm">
                  View {displayCards.length - 2} more cards
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <p className="body-md text-gray-600">Fill a category to see AI recommendations</p>
          </div>
        )}
      </div>

      {/* Add More Spending Button */}
      {canAddMore && onAddMoreSpending && (
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              🚀 Unlock Better Cards
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Add more spending categories to access premium cards with higher savings potential
            </p>
          </div>
          <button 
            onClick={onAddMoreSpending}
            className="btn-primary"
          >
            Add More Spending Categories
          </button>
        </div>
      )}

      {displayCards.length > 4 && (
        <div className="text-center mt-8">
          <button className="btn-primary">
            View all {displayCards.length} cards
          </button>
        </div>
      )}
    </div>
  );
};

interface CardItemProps {
  card: CardResult;
  index: number;
}

const CardItem: React.FC<CardItemProps> = ({ card, index }) => {
  // Add error handling and logging
  console.log(`CardItem ${index}:`, card);
  
  const getRankChange = () => {
    if (card.overallRank && card.eligibleRank && card.overallRank !== card.eligibleRank) {
      return `#${card.overallRank} overall → #${card.eligibleRank} for you`;
    }
    return null;
  };

  const rankChange = getRankChange();

  // Safe access to card properties
  const cardName = card.name || `Card ${index + 1}`;
  const monthlySavings = card.monthlySavings || 0;
  const annualSavings = card.annualSavings || 0;
  const keyPerks = card.keyPerks || [];
  const tags = card.tags || [];

  return (
    <div className="card-interactive p-4 lg:p-6 hover-lift">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm lg:text-lg">
              {cardName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="heading-sm mb-1 truncate">{cardName}</h4>
            {rankChange && (
              <span className="status-success text-xs">
                {rankChange}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="data-number text-lg lg:text-xl mb-1">
              {formatCurrency(monthlySavings)} / month
            </div>
            {annualSavings > 0 && (
              <div className="body-sm text-gray-600">
                {formatCurrency(annualSavings)} annually
              </div>
            )}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 1).map((tag, idx) => (
                <span
                  key={idx}
                  className="status-info text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {keyPerks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keyPerks.slice(0, 2).map((perk, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg font-semibold"
              >
                {perk}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPreview;
