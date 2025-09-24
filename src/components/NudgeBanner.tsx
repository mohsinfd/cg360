import React from 'react';

interface NudgeBannerProps {
  text: string;
}

const NudgeBanner: React.FC<NudgeBannerProps> = ({ text }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 banner-enter">
      <div className="flex items-center gap-3">
        <span className="text-purple-600 text-lg">💡</span>
        <p className="text-purple-800 text-sm font-medium flex-1">{text}</p>
      </div>
    </div>
  );
};

export default NudgeBanner;
