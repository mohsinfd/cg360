import React from 'react';

interface AccuracyMeterProps {
  accuracy: number;
}

const AccuracyMeter: React.FC<AccuracyMeterProps> = ({ accuracy }) => {
  const getAccuracyColor = () => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 70) return 'text-blue-600';
    if (accuracy >= 50) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const getProgressColor = () => {
    if (accuracy >= 90) return 'from-green-400 to-emerald-500';
    if (accuracy >= 70) return 'from-blue-500 to-purple-500';
    if (accuracy >= 50) return 'from-yellow-400 to-orange-500';
    return 'from-gray-300 to-gray-400';
  };

  return (
    <div className="card-elevated p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Profile Accuracy</span>
        <span className={`data-number ${getAccuracyColor()}`}>{accuracy}%</span>
      </div>
      <div className="progress-bar mb-2">
        <div
          className={`progress-fill ${getProgressColor()}`}
          style={{ width: `${accuracy}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default AccuracyMeter;
