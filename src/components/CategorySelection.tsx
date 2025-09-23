import React from 'react';
import { CategoryKey } from '../types';
import { DEFAULT_ORDER, CATEGORY_CONFIG } from '../constants';

interface CategorySelectionProps {
  onSelect: (categories: CategoryKey[]) => void;
  selectedCategories: CategoryKey[];
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  onSelect,
}) => {
  const handleStartWithCategory = (category: CategoryKey) => {
    console.log('=== STARTING WITH SPECIFIC CATEGORY ===');
    console.log('Starting category:', category);
    
    // Start with this category, but allow user to continue to others
    const categoryIndex = DEFAULT_ORDER.indexOf(category);
    const remainingCategories = DEFAULT_ORDER.slice(categoryIndex);
    
    console.log('Remaining categories:', remainingCategories);
    onSelect(remainingCategories);
  };

  return (
    <div className="px-4 py-6">
      {/* Mobile-First Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Card</h1>
        <p className="text-gray-600 text-sm">Start with your biggest spending category</p>
      </div>

      {/* Compact Category Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {DEFAULT_ORDER.map((category) => (
          <button
            key={category}
            onClick={() => handleStartWithCategory(category)}
            className="p-4 bg-white border border-gray-200 rounded-xl text-center hover:border-blue-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-sm">
                {CATEGORY_CONFIG[category].label.charAt(0)}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {CATEGORY_CONFIG[category].label}
            </div>
          </button>
        ))}
      </div>

      {/* Simple CTA */}
      <button
        onClick={() => onSelect([])}
        className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
      >
        Use Default Order
      </button>
    </div>
  );
};

export default CategorySelection;
