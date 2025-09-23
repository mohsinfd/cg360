import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface NudgeBannerProps {
  text: string;
}

const NudgeBanner: React.FC<NudgeBannerProps> = ({ text }) => {
  return (
    <div className="card bg-blue-50 border-blue-200 banner-enter">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md animate-glow">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="body-md font-semibold text-blue-800">{text}</p>
          <p className="body-sm text-blue-600 mt-1">Continue to unlock more insights</p>
        </div>
        <ArrowRight className="w-5 h-5 text-blue-600 animate-float" />
      </div>
    </div>
  );
};

export default NudgeBanner;
