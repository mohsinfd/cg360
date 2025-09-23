// Core types for CardGenius 360

export type EmpStatus = 'salaried' | 'self_employed' | 'student' | 'other';

export type CategoryKey = 'shopping' | 'food' | 'travel' | 'bills' | 'rent_insurance';

export type Step = 'category_pick' | 'category_inputs' | 'results';

export interface Payload {
  amazon_spends: number;
  flipkart_spends: number;
  other_online_spends: number;
  other_offline_spends: number;
  grocery_spends_online: number;
  online_food_ordering: number;
  fuel: number;
  dining_or_going_out: number;
  flights_annual: number;
  hotels_annual: number;
  domestic_lounge_usage_quarterly: number;
  international_lounge_usage_quarterly: number;
  mobile_phone_bills: number;
  electricity_bills: number;
  water_bills: number;
  insurance_health_annual: number;
  insurance_car_or_bike_annual: number;
  rent: number;
  school_fees: number;
}

export interface Eligibility {
  inhandIncome?: number;
  empStatus?: EmpStatus;
  pincode?: string;
  token?: string;
}

export interface CardResult {
  id: string;
  name: string;
  monthlySavings: number;
  annualSavings?: number;
  tags?: string[];
  eligible?: boolean;
  overallRank?: number;
  eligibleRank?: number;
  logo?: string;
  keyPerks?: string[];
}

export interface CG360State {
  step: Step;
  chosen: CategoryKey[];
  idx: number;
  payload: Payload;
  eligibility: Eligibility;
  results: {
    overall: CardResult[];
    eligible: CardResult[];
  };
  accuracy: number;
  banners: {
    update?: string;
    nudge?: string;
  };
  activeTab: 'eligible' | 'all';
  isLoading?: boolean;
}

export interface CategoryConfig {
  key: CategoryKey;
  label: string;
  fields: (keyof Payload)[];
  weight: number;
}

export type UpdateCopy = {
  [K in CategoryKey]: string;
};

export type NudgeCopy = {
  [K in CategoryKey]: string;
};
