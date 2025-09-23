import { Payload, CategoryKey, UpdateCopy, NudgeCopy, CategoryConfig } from '../types';

export const DEFAULT_PAYLOAD: Payload = {
  amazon_spends: 0,
  flipkart_spends: 0,
  other_online_spends: 0,
  other_offline_spends: 0,
  grocery_spends_online: 0,
  online_food_ordering: 0,
  fuel: 0,
  dining_or_going_out: 0,
  flights_annual: 0,
  hotels_annual: 0,
  domestic_lounge_usage_quarterly: 0,
  international_lounge_usage_quarterly: 0,
  mobile_phone_bills: 0,
  electricity_bills: 0,
  water_bills: 0,
  insurance_health_annual: 0,
  insurance_car_or_bike_annual: 0,
  rent: 0,
  school_fees: 0,
};

export const DEFAULT_ORDER: CategoryKey[] = ['shopping', 'food', 'travel', 'bills', 'rent_insurance'];

// Journey-specific messaging for each step
export const JOURNEY_MESSAGES = {
  // Initial landing
  welcome: {
    title: "Let's find your perfect credit card",
    subtitle: "Tell us about your spending to get personalized recommendations",
    cta: "Start Analysis"
  },
  
  // Category selection
  category_selection: {
    title: "Choose your spending categories",
    subtitle: "Select the areas where you spend most to get accurate recommendations",
    quick_start: "Quick Start with Default Order",
    custom_selection: "Select Specific Categories"
  },
  
  // Individual category prompts
  category_prompts: {
    shopping: {
      title: "Shopping Spending Analysis",
      subtitle: "Help us understand your shopping patterns for better cashback recommendations",
      fields_intro: "Tell us about your monthly shopping expenses across different platforms"
    },
    food: {
      title: "Food & Dining Analysis", 
      subtitle: "Your dining habits help us find cards with the best food rewards",
      fields_intro: "Share your monthly food and dining expenses",
      eligibility_prompt: "We need your income details to show eligible cards"
    },
    travel: {
      title: "Travel Spending Analysis",
      subtitle: "Travel spending unlocks premium cards with lounge access and travel perks", 
      fields_intro: "Tell us about your annual travel expenses and lounge usage",
      eligibility_prompt: "We need your location to check card availability"
    },
    bills: {
      title: "Bills & Utilities Analysis",
      subtitle: "Recurring bills can earn consistent cashback with the right card",
      fields_intro: "Share your monthly utility and bill payments"
    },
    rent_insurance: {
      title: "Rent & Insurance Analysis", 
      subtitle: "High-value expenses like rent and insurance can unlock premium benefits",
      fields_intro: "Tell us about your major annual expenses"
    }
  },
  
  // Progress messages
  progress: {
    first_category: "Great start! Your first category is complete.",
    mid_journey: "You're building a comprehensive profile.",
    near_complete: "Almost there! Just a few more categories.",
    complete: "Profile complete! Here are your personalized recommendations."
  },
  
  // Results messaging
  results: {
    initial: "Based on your spending, here are your top card recommendations",
    improved: "Your recommendations have improved with more spending data",
    final: "Complete profile analysis - here are your personalized card recommendations"
  }
};

export const UPDATE_COPY: UpdateCopy = {
  shopping: 'Shopping patterns analyzed. Cashback cards prioritized.',
  food: 'Dining habits added. Food reward cards unlocked.',
  travel: 'Travel profile complete. Premium travel cards now available.',
  bills: 'Bill payments added. Utility cashback cards included.',
  rent_insurance: 'Major expenses added. Premium card eligibility expanded.',
};

export const NUDGE_COPY: NudgeCopy = {
  shopping: 'Add Food & Dining to unlock restaurant rewards.',
  food: 'Add Travel to access premium cards with lounge benefits.',
  travel: 'Add Bills to capture recurring cashback opportunities.',
  bills: 'Add Rent & Insurance to unlock premium card benefits.',
  rent_insurance: 'Profile complete! View your personalized recommendations.',
};

export const CATEGORY_CONFIG: Record<CategoryKey, CategoryConfig> = {
  shopping: {
    key: 'shopping',
    label: 'Shopping',
    fields: ['amazon_spends', 'flipkart_spends', 'other_online_spends', 'other_offline_spends'],
    weight: 25,
  },
  food: {
    key: 'food',
    label: 'Food & Dining',
    fields: ['online_food_ordering', 'dining_or_going_out', 'grocery_spends_online'],
    weight: 20,
  },
  travel: {
    key: 'travel',
    label: 'Travel',
    fields: ['flights_annual', 'hotels_annual', 'domestic_lounge_usage_quarterly', 'international_lounge_usage_quarterly'],
    weight: 25,
  },
  bills: {
    key: 'bills',
    label: 'Bills',
    fields: ['mobile_phone_bills', 'electricity_bills', 'water_bills'],
    weight: 10,
  },
  rent_insurance: {
    key: 'rent_insurance',
    label: 'Rent & Insurance',
    fields: ['rent', 'insurance_health_annual', 'insurance_car_or_bike_annual', 'school_fees'],
    weight: 20,
  },
};

export const FIELD_CONFIG: Record<keyof Payload, { label: string; max?: number; unit?: string }> = {
  amazon_spends: { label: 'Amazon (monthly)', max: 200000, unit: '₹' },
  flipkart_spends: { label: 'Flipkart (monthly)', max: 200000, unit: '₹' },
  other_online_spends: { label: 'Other Online (monthly)', max: 200000, unit: '₹' },
  other_offline_spends: { label: 'Offline Retail (monthly)', max: 200000, unit: '₹' },
  grocery_spends_online: { label: 'Groceries (monthly)', max: 200000, unit: '₹' },
  online_food_ordering: { label: 'Food Delivery (monthly)', max: 200000, unit: '₹' },
  fuel: { label: 'Fuel (monthly)', max: 200000, unit: '₹' },
  dining_or_going_out: { label: 'Dining Out (monthly)', max: 200000, unit: '₹' },
  flights_annual: { label: 'Flights (annual)', max: 500000, unit: '₹' },
  hotels_annual: { label: 'Hotels (annual)', max: 500000, unit: '₹' },
  domestic_lounge_usage_quarterly: { label: 'Domestic Lounges / quarter', max: 20, unit: 'visits' },
  international_lounge_usage_quarterly: { label: 'International Lounges / quarter', max: 20, unit: 'visits' },
  mobile_phone_bills: { label: 'Mobile Bills (monthly)', max: 200000, unit: '₹' },
  electricity_bills: { label: 'Electricity (monthly)', max: 200000, unit: '₹' },
  water_bills: { label: 'Water (monthly)', max: 200000, unit: '₹' },
  insurance_health_annual: { label: 'Health Insurance (annual)', max: 200000, unit: '₹' },
  insurance_car_or_bike_annual: { label: 'Motor Insurance (annual)', max: 200000, unit: '₹' },
  rent: { label: 'Rent (monthly)', max: 200000, unit: '₹' },
  school_fees: { label: 'School Fees (annual)', max: 300000, unit: '₹' },
};

export const LOUNGE_CHOICES = [
  { label: '0', value: 0 },
  { label: '1–2', value: 2 },
  { label: '3–5', value: 5 },
  { label: '6+', value: 8 },
];

export const EMPLOYMENT_OPTIONS = [
  { label: 'Salaried', value: 'salaried' as const },
  { label: 'Self-employed', value: 'self_employed' as const },
  { label: 'Student', value: 'student' as const },
  { label: 'Other', value: 'other' as const },
];
