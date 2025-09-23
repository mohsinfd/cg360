import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard: React.FC = () => {
  return (
    <motion.div
      className="card-interactive p-4 lg:p-6"
      animate={{ opacity: [0.6, 0.8, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-1 w-24"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
        
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonCard;


