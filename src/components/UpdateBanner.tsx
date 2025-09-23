import React from 'react';
import { CheckCircle } from 'lucide-react';

interface UpdateBannerProps {
  text: string;
}

const UpdateBanner: React.FC<UpdateBannerProps> = ({ text }) => {
  return (
    <div className="card bg-green-50 border-green-200 banner-enter">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md animate-glow">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="body-md font-semibold text-green-800">{text}</p>
          <p className="body-sm text-green-600 mt-1">Analysis updated successfully</p>
        </div>
      </div>
    </div>
  );
};

export default UpdateBanner;
