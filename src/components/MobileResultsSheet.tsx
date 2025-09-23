import React, { useState, useEffect } from 'react';
import { CardResult } from '../types';
import { formatCurrency } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileResultsSheetProps {
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

const MobileResultsSheet: React.FC<MobileResultsSheetProps> = ({
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
  const [isOpen, setIsOpen] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const displayCards = activeTab === 'eligible' ? eligibleCards : overallCards;
  const progressPercentage = Math.round((categoryIndex / totalCategories) * 100);
  const maxSavings = Math.max(...displayCards.map(card => card.monthlySavings || 0));
  const canAddMore = categoryIndex < totalCategories - 1;

  // Auto-open when results are available
  useEffect(() => {
    if (overallCards.length > 0 && !isOpen) {
      setIsOpen(true);
    }
  }, [overallCards.length, isOpen]);

  // Global mouse move listener for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const currentY = e.clientY;
      const deltaY = currentY - dragStartY;
      
      // Only allow downward drag
      if (deltaY > 0) {
        setCurrentY(Math.min(deltaY, 200)); // Limit to 200px max
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const endY = e.clientY;
      const deltaY = endY - dragStartY;
      
      console.log('Global mouse ended, delta:', deltaY);
      
      setIsDragging(false);
      setCurrentY(0);
      setDragStartY(0);
      
      // Close if dragged down more than 100px
      if (deltaY > 100) {
        console.log('Closing sheet due to drag');
        setIsOpen(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStartY]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
    console.log('Touch started at:', e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY;
    
    // Only allow downward drag
    if (deltaY > 0) {
      setCurrentY(Math.min(deltaY, 200)); // Limit to 200px max
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - dragStartY;
    
    console.log('Touch ended, delta:', deltaY);
    
    setIsDragging(false);
    setCurrentY(0);
    setDragStartY(0);
    
    // Close if dragged down more than 100px
    if (deltaY > 100) {
      console.log('Closing sheet due to drag');
      setIsOpen(false);
    }
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragStartY(e.clientY);
    setIsDragging(true);
    console.log('Mouse started at:', e.clientY);
  };

  const toggleSheet = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Results Button */}
      <AnimatePresence>
        {overallCards.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              scale: [0.8, 1.05, 1]
            }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              scale: { delay: 0.2, duration: 0.5 }
            }}
            className="fixed bottom-6 left-4 right-4 z-50 lg:hidden"
          >
            <motion.button
              onClick={toggleSheet}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 20px 40px rgba(59, 130, 246, 0.3)",
                  "0 25px 50px rgba(59, 130, 246, 0.5)",
                  "0 20px 40px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 30px 60px rgba(59, 130, 246, 0.6)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <span className="text-xl">🎯</span>
                  </motion.div>
                  <div className="text-left">
                    <motion.div 
                      className="font-semibold text-lg"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {overallCards.length} Cards Found
                    </motion.div>
                    <motion.div 
                      className="text-sm opacity-90"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 0.9 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      Max savings: {formatCurrency(maxSavings)}/month
                    </motion.div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="text-right"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-xs opacity-75">Profile</div>
                    <div className="font-bold">{progressPercentage}%</div>
                  </motion.div>
                  <motion.div
                    animate={{ 
                      rotate: isOpen ? 180 : 0,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 0.3 },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                    className="w-6 h-6 flex items-center justify-center"
                  >
                    <span className="text-xl">📱</span>
                  </motion.div>
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                console.log('Backdrop clicked - closing sheet');
                setIsOpen(false);
              }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: isDragging ? currentY : 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 lg:hidden"
              style={{ maxHeight: "85vh" }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <motion.div 
                  className="w-12 h-1 bg-gray-300 rounded-full"
                  animate={{ 
                    backgroundColor: isDragging ? "#6b7280" : "#d1d5db",
                    scale: isDragging ? 1.2 : 1
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Test Close Button */}
              <div className="text-center mb-2">
                <button
                  onClick={() => {
                    console.log('Test close button clicked');
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
                >
                  TEST CLOSE
                </button>
              </div>

              {/* Drag Feedback */}
              {isDragging && currentY > 50 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm font-semibold"
                >
                  Release to close
                </motion.div>
              )}

              {/* Header */}
              <div className="px-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">🎯 Your Card Recommendations</h3>
                    <p className="text-sm text-gray-600">
                      {categoryIndex === 0 ? 'Based on your first category' : 
                       `Based on ${categoryIndex + 1} spending categories`}
                    </p>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Close button clicked');
                      setIsOpen(false);
                    }}
                    className="w-12 h-12 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <span className="text-red-600 text-xl font-bold">✕</span>
                  </motion.button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => onTabChange('eligible')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeTab === 'eligible'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Eligible ({eligibleCards.length})
                  </button>
                  <button
                    onClick={() => onTabChange('all')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeTab === 'all'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All ({overallCards.length})
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: "calc(85vh - 200px)" }}>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : displayCards.length > 0 ? (
                  <div className="space-y-4">
                    {displayCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">
                              {card.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{card.name}</h4>
                            {card.overallRank && card.eligibleRank && card.overallRank !== card.eligibleRank && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                #{card.overallRank} → #{card.eligibleRank} for you
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {formatCurrency(card.monthlySavings)}/month
                            </div>
                            {card.annualSavings && card.annualSavings > 0 && (
                              <div className="text-sm text-gray-600">
                                {formatCurrency(card.annualSavings)} annually
                              </div>
                            )}
                          </div>
                          {card.tags && card.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {card.tags.slice(0, 2).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg font-semibold"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {card.keyPerks && card.keyPerks.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {card.keyPerks.slice(0, 2).map((perk, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-lg font-semibold"
                              >
                                {perk}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-600">Fill a category to see AI recommendations</p>
                  </div>
                )}

                {/* Add More Spending Button */}
                {canAddMore && onAddMoreSpending && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl"
                  >
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        🚀 Unlock Better Cards
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Add more spending categories to access premium cards with higher savings
                      </p>
                      <button 
                        onClick={() => {
                          onAddMoreSpending();
                          setIsOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Add More Spending Categories
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileResultsSheet;
