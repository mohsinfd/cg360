import { Payload, Eligibility } from '../types';

// Non-linear slider mapping (ui 0..100 → ₹0..max)
export function uiToValue(ui: number, max = 200000): number {
  const min = 0;
  const logMax = Math.log10(max + 1);
  const v = Math.pow(10, (ui / 100) * logMax) - 1;
  return Math.round(v);
}

export function valueToUi(val: number, max = 200000): number {
  const logMax = Math.log10(max + 1);
  const clamped = Math.max(0, Math.min(val, max));
  return Math.round((Math.log10(clamped + 1) / logMax) * 100);
}

// Calculate accuracy percentage based on completed categories and eligibility
export function calculateAccuracy(payload: Payload, eligibility: Eligibility): number {
  let score = 0;
  
  // Check if categories have any non-zero values
  const hasShopping = payload.amazon_spends || payload.flipkart_spends || 
                     payload.other_online_spends || payload.other_offline_spends;
  const hasFood = payload.grocery_spends_online || payload.online_food_ordering || 
                 payload.dining_or_going_out;
  const hasTravel = payload.flights_annual || payload.hotels_annual || 
                   payload.domestic_lounge_usage_quarterly || payload.international_lounge_usage_quarterly;
  const hasBills = payload.mobile_phone_bills || payload.electricity_bills || payload.water_bills;
  const hasRentIns = payload.rent || payload.insurance_health_annual || 
                    payload.insurance_car_or_bike_annual || payload.school_fees;
  
  // Add weights for completed categories
  if (hasShopping) score += 25;
  if (hasFood) score += 20;
  if (hasTravel) score += 25;
  if (hasBills) score += 10;
  if (hasRentIns) score += 20;
  
  // Add bonus for eligibility completion
  if (eligibility.inhandIncome && eligibility.empStatus && eligibility.pincode) {
    score += 5;
  }
  
  return Math.min(score, 100);
}

// Format currency for display
export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString()}`;
}

// Check if a category has any non-zero values
export function hasCategoryData(payload: Payload, categoryFields: (keyof Payload)[]): boolean {
  return categoryFields.some(field => payload[field] > 0);
}

// Generate mock card results for development
export function generateMockCards(): any[] {
  return [
    {
      id: '1',
      name: 'HDFC Millennia',
      monthlySavings: 2500,
      annualSavings: 30000,
      tags: ['Cashback', 'Online'],
      eligible: true,
      overallRank: 1,
      eligibleRank: 1,
      keyPerks: ['5% cashback on online', '1% on offline']
    },
    {
      id: '2',
      name: 'SBI Cashback',
      monthlySavings: 2200,
      annualSavings: 26400,
      tags: ['Cashback', 'Fuel'],
      eligible: true,
      overallRank: 2,
      eligibleRank: 2,
      keyPerks: ['5% on online', '2% on fuel']
    },
    {
      id: '3',
      name: 'ICICI Amazon Pay',
      monthlySavings: 1800,
      annualSavings: 21600,
      tags: ['Amazon', 'Cashback'],
      eligible: false,
      overallRank: 3,
      eligibleRank: null,
      keyPerks: ['5% on Amazon', '2% on other']
    },
    {
      id: '4',
      name: 'Axis Ace',
      monthlySavings: 1500,
      annualSavings: 18000,
      tags: ['Cashback', 'Bills'],
      eligible: true,
      overallRank: 4,
      eligibleRank: 3,
      keyPerks: ['2% on all', '5% on bills']
    }
  ];
}

