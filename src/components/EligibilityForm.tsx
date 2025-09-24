import React, { useState } from 'react';
import { EmpStatus, Eligibility } from '../types';
import { EMPLOYMENT_OPTIONS } from '../constants';

interface EligibilityFormProps {
  onSubmit: (eligibility: Eligibility) => void;
  onCancel: () => void;
  initialData?: Eligibility;
}

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
}) => {
  const [income, setIncome] = useState(initialData.inhandIncome || '');
  const [empStatus, setEmpStatus] = useState<EmpStatus | ''>(initialData.empStatus || '');
  const [pincode, setPincode] = useState(initialData.pincode || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eligibilityData: Eligibility = {
      inhandIncome: Number(income) || undefined,
      empStatus: empStatus || undefined,
      pincode: pincode || undefined,
    };

    onSubmit(eligibilityData);
  };

  const isValid = income && empStatus && pincode;

  return (
    <div className="card-elevated space-y-6">
      <div className="text-center">
        <h3 className="heading-lg text-neutral-900 mb-3">
          Complete Your Profile
        </h3>
        <p className="body-md text-neutral-600">
          Help us find cards that match your income, employment, and location
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Income Field - Always visible */}
        <div>
          <label className="block heading-sm text-neutral-900 mb-3">
            Monthly In-hand Income (₹)
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="input-field data-text"
            placeholder="e.g., 50000"
            min="0"
          />
        </div>

        {/* Employment Field - Always visible */}
        <div>
          <label className="block heading-sm text-neutral-900 mb-3">
            Employment Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EMPLOYMENT_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setEmpStatus(option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 hover-lift ${
                  empStatus === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-medium'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200'
                }`}
              >
                <div className="text-center font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Pincode Field - Always visible */}
        <div>
          <label className="block heading-sm text-neutral-900 mb-3">
            Pincode
          </label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="input-field data-text"
            placeholder="e.g., 110001"
            maxLength={6}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`flex-1 ${
              isValid ? 'btn-primary' : 'px-6 py-3 bg-neutral-300 text-neutral-500 rounded-xl cursor-not-allowed font-medium'
            }`}
          >
            Apply Eligibility
          </button>
        </div>
      </form>
    </div>
  );
};

export default EligibilityForm;
