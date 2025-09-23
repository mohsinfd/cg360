import React from 'react';
import { LOUNGE_CHOICES } from '../constants';

interface LoungePickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const LoungePicker: React.FC<LoungePickerProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className="card space-y-4">
      <div className="heading-sm text-neutral-900">{label}</div>
      <div className="grid grid-cols-4 gap-3">
        {LOUNGE_CHOICES.map(choice => (
          <button
            key={choice.value}
            onClick={() => onChange(choice.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 hover-lift ${
              value === choice.value
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-medium'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-semibold mb-1">{choice.label}</div>
              <div className="text-xs text-neutral-500">
                {choice.value === 0 ? 'No visits' : 
                 choice.value === 2 ? '1-2 visits' :
                 choice.value === 5 ? '3-5 visits' : '6+ visits'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LoungePicker;
