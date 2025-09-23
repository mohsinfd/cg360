import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils';
import { uiToValue, valueToUi } from '../utils';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  unit?: string;
  showKeypad?: boolean;
}

const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  onChange,
  max = 200000,
  unit = '₹',
  showKeypad = true,
}) => {
  const [uiValue, setUiValue] = useState(valueToUi(value, max));
  const [showNumericInput, setShowNumericInput] = useState(false);

  useEffect(() => {
    setUiValue(valueToUi(value, max));
  }, [value, max]);

  const handleSliderChange = (newUiValue: number) => {
    setUiValue(newUiValue);
    const newValue = uiToValue(newUiValue, max);
    onChange(newValue);
    
    // Trigger micro-animation feedback
    const sliderElement = document.querySelector(`[data-slider="${label}"]`);
    if (sliderElement) {
      sliderElement.classList.add('slider-feedback');
      setTimeout(() => {
        sliderElement.classList.remove('slider-feedback');
      }, 200);
    }
  };

  const handleNumericChange = (newValue: number) => {
    const clampedValue = Math.max(0, Math.min(newValue, max));
    onChange(clampedValue);
  };

  const formatDisplayValue = (val: number) => {
    if (unit === '₹') {
      return formatCurrency(val);
    }
    return `${val} ${unit}`;
  };

  return (
    <div className="card space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <label className="heading-sm">{label}</label>
        <div className="flex items-center gap-4">
          <span className="data-number">
            {formatDisplayValue(value)}
          </span>
          {showKeypad && (
            <button
              onClick={() => setShowNumericInput(!showNumericInput)}
              className="btn-ghost text-sm"
            >
              {showNumericInput ? 'Slider' : 'Keypad'}
            </button>
          )}
        </div>
      </div>

      {showNumericInput ? (
        <div className="space-y-4">
          <input
            type="number"
            value={value}
            onChange={(e) => handleNumericChange(Number(e.target.value) || 0)}
            className="input-field text-right data-text"
            min={0}
            max={max}
            placeholder="Enter amount"
          />
          <div className="text-xs font-semibold text-white/60 uppercase tracking-wide text-right">
            Max: {formatDisplayValue(max)}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min={0}
              max={100}
              value={uiValue}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="slider-track"
              style={{
                background: `linear-gradient(to right, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.8) ${uiValue}%, rgba(255, 255, 255, 0.2) ${uiValue}%, rgba(255, 255, 255, 0.2) 100%)`
              }}
            />
            <div
              className="slider-thumb absolute top-1/2 transform -translate-y-1/2"
              style={{ left: `calc(${uiValue}% - 16px)` }}
            />
          </div>
          <div className="flex justify-between text-xs font-semibold text-white/60 uppercase tracking-wide">
            <span>{formatDisplayValue(0)}</span>
            <span>{formatDisplayValue(max)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputSlider;
