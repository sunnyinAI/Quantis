// Mock Agmarknet-style mandi price data
const COMMODITIES = [
  { id: 'tomato', name: 'Tomato', name_hi: 'टमाटर', unit: 'Quintal', category: 'vegetables' },
  { id: 'onion', name: 'Onion', name_hi: 'प्याज', unit: 'Quintal', category: 'vegetables' },
  { id: 'potato', name: 'Potato', name_hi: 'आलू', unit: 'Quintal', category: 'vegetables' },
  { id: 'cauliflower', name: 'Cauliflower', name_hi: 'गोभी', unit: 'Quintal', category: 'vegetables' },
  { id: 'cabbage', name: 'Cabbage', name_hi: 'पत्तागोभी', unit: 'Quintal', category: 'vegetables' },
  { id: 'spinach', name: 'Spinach', name_hi: 'पालक', unit: 'Quintal', category: 'vegetables' },
  { id: 'carrot', name: 'Carrot', name_hi: 'गाजर', unit: 'Quintal', category: 'vegetables' },
  { id: 'okra', name: 'Okra / Bhindi', name_hi: 'भिंडी', unit: 'Quintal', category: 'vegetables' },
  { id: 'brinjal', name: 'Brinjal', name_hi: 'बैंगन', unit: 'Quintal', category: 'vegetables' },
  { id: 'capsicum', name: 'Capsicum', name_hi: 'शिमला मिर्च', unit: 'Quintal', category: 'vegetables' },
  { id: 'banana', name: 'Banana', name_hi: 'केला', unit: 'Dozen', category: 'fruits' },
  { id: 'apple', name: 'Apple', name_hi: 'सेब', unit: 'Quintal', category: 'fruits' },
  { id: 'mango', name: 'Mango', name_hi: 'आम', unit: 'Quintal', category: 'fruits' },
  { id: 'orange', name: 'Orange', name_hi: 'संतरा', unit: 'Quintal', category: 'fruits' },
  { id: 'guava', name: 'Guava', name_hi: 'अमरूद', unit: 'Quintal', category: 'fruits' },
  { id: 'grapes', name: 'Grapes', name_hi: 'अंगूर', unit: 'Quintal', category: 'fruits' },
  { id: 'lemon', name: 'Lemon', name_hi: 'नींबू', unit: 'Quintal', category: 'fruits' },
  { id: 'watermelon', name: 'Watermelon', name_hi: 'तरबूज', unit: 'Quintal', category: 'fruits' },
  { id: 'wheat', name: 'Wheat', name_hi: 'गेहूँ', unit: 'Quintal', category: 'grains' },
  { id: 'rice', name: 'Rice', name_hi: 'चावल', unit: 'Quintal', category: 'grains' },
  { id: 'maize', name: 'Maize', name_hi: 'मक्का', unit: 'Quintal', category: 'grains' },
  { id: 'soybean', name: 'Soybean', name_hi: 'सोयाबीन', unit: 'Quintal', category: 'oilseeds' },
  { id: 'mustard', name: 'Mustard', name_hi: 'सरसों', unit: 'Quintal', category: 'oilseeds' },
  { id: 'groundnut', name: 'Groundnut', name_hi: 'मूंगफली', unit: 'Quintal', category: 'oilseeds' },
];

// Base mandi prices per quintal (100 kg), in INR
const BASE_MANDI_PRICES = {
  tomato: { min: 800, max: 4000, seasonal: { oct: 600, nov: 500, dec: 600, jan: 800, feb: 1000, mar: 1500, apr: 2500, may: 3500, jun: 4000, jul: 3000, aug: 2000, sep: 1500 } },
  onion: { min: 500, max: 5000, seasonal: { oct: 3000, nov: 4000, dec: 4500, jan: 5000, feb: 3000, mar: 2000, apr: 1500, may: 1200, jun: 800, jul: 600, aug: 500, sep: 1000 } },
  potato: { min: 600, max: 2000, seasonal: { oct: 1200, nov: 1500, dec: 1800, jan: 2000, feb: 1500, mar: 1000, apr: 800, may: 700, jun: 700, jul: 700, aug: 800, sep: 900 } },
  cauliflower: { min: 400, max: 2500, seasonal: { oct: 800, nov: 600, dec: 500, jan: 400, feb: 500, mar: 800, apr: 1500, may: 2500, jun: 2000, jul: 1500, aug: 1200, sep: 1000 } },
  cabbage: { min: 300, max: 1800, seasonal: { oct: 600, nov: 500, dec: 400, jan: 350, feb: 400, mar: 600, apr: 1000, may: 1800, jun: 1500, jul: 1200, aug: 900, sep: 700 } },
  spinach: { min: 400, max: 2000, seasonal: { oct: 600, nov: 500, dec: 400, jan: 400, feb: 500, mar: 700, apr: 1000, may: 2000, jun: 1500, jul: 1200, aug: 900, sep: 700 } },
  carrot: { min: 600, max: 3000, seasonal: { oct: 800, nov: 700, dec: 600, jan: 700, feb: 900, mar: 1200, apr: 2000, may: 3000, jun: 2500, jul: 2000, aug: 1500, sep: 1000 } },
  okra: { min: 800, max: 5000, seasonal: { oct: 2000, nov: 3000, dec: 4000, jan: 5000, feb: 4000, mar: 3000, apr: 2000, may: 1200, jun: 800, jul: 900, aug: 1000, sep: 1500 } },
  brinjal: { min: 400, max: 2500, seasonal: { oct: 800, nov: 1000, dec: 1200, jan: 1500, feb: 2000, mar: 2500, apr: 2000, may: 1500, jun: 1000, jul: 700, aug: 500, sep: 600 } },
  capsicum: { min: 1500, max: 8000, seasonal: { oct: 2000, nov: 2500, dec: 3000, jan: 4000, feb: 5000, mar: 6000, apr: 8000, may: 7000, jun: 5000, jul: 3000, aug: 2000, sep: 1500 } },
  banana: { min: 15, max: 60, seasonal: { oct: 25, nov: 30, dec: 35, jan: 40, feb: 45, mar: 50, apr: 60, may: 55, jun: 45, jul: 35, aug: 25, sep: 20 } },
  apple: { min: 3000, max: 12000, seasonal: { oct: 4000, nov: 5000, dec: 6000, jan: 8000, feb: 10000, mar: 12000, apr: 10000, may: 8000, jun: 6000, jul: 5000, aug: 3000, sep: 3500 } },
  mango: { min: 2000, max: 8000, seasonal: { oct: 8000, nov: 8000, dec: 8000, jan: 8000, feb: 6000, mar: 3000, apr: 2000, may: 2000, jun: 2500, jul: 4000, aug: 6000, sep: 8000 } },
  orange: { min: 1500, max: 6000, seasonal: { oct: 2000, nov: 1500, dec: 1500, jan: 1800, feb: 2500, mar: 3500, apr: 5000, may: 6000, jun: 5000, jul: 4000, aug: 3000, sep: 2500 } },
  guava: { min: 800, max: 4000, seasonal: { oct: 800, nov: 1000, dec: 1500, jan: 2000, feb: 2500, mar: 3000, apr: 4000, may: 3500, jun: 3000, jul: 2000, aug: 1500, sep: 1000 } },
  grapes: { min: 2500, max: 8000, seasonal: { oct: 5000, nov: 6000, dec: 7000, jan: 8000, feb: 7000, mar: 5000, apr: 3500, may: 2500, jun: 3000, jul: 4000, aug: 5000, sep: 5000 } },
  lemon: { min: 1500, max: 10000, seasonal: { oct: 3000, nov: 4000, dec: 5000, jan: 6000, feb: 8000, mar: 10000, apr: 8000, may: 5000, jun: 2500, jul: 1500, aug: 2000, sep: 2500 } },
  watermelon: { min: 300, max: 2000, seasonal: { oct: 2000, nov: 2000, dec: 2000, jan: 2000, feb: 2000, mar: 1500, apr: 800, may: 400, jun: 300, jul: 400, aug: 600, sep: 1000 } },
  wheat: { min: 2000, max: 2500, seasonal: {} },
  rice: { min: 2000, max: 4000, seasonal: {} },
  maize: { min: 1500, max: 2200, seasonal: {} },
  soybean: { min: 4000, max: 6000, seasonal: {} },
  mustard: { min: 5000, max: 7000, seasonal: {} },
  groundnut: { min: 5000, max: 7500, seasonal: {} },
};

const STATES = [
  { code: 'MH', name: 'Maharashtra' },
  { code: 'DL', name: 'Delhi' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'TS', name: 'Telangana' },
  { code: 'PB', name: 'Punjab' },
  { code: 'HR', name: 'Haryana' },
  { code: 'KL', name: 'Kerala' },
];

const STATE_MULTIPLIERS = {
  MH: 1.0, DL: 1.1, KA: 0.95, TN: 0.92, GJ: 0.98,
  UP: 0.88, WB: 0.90, RJ: 0.95, MP: 0.85, AP: 0.90,
  TS: 0.93, PB: 0.87, HR: 0.90, KL: 1.05
};

const MANDIS = {
  MH: ['Vashi APMC', 'Pune Market Yard', 'Nashik Mandi'],
  DL: ['Azadpur Mandi', 'Ghazipur Mandi', 'Okhla Mandi'],
  KA: ['KR Market Bangalore', 'Mysore Mandi', 'Hubli Mandi'],
  TN: ['Koyambedu Market', 'Madurai Mandi', 'Coimbatore Mandi'],
  GJ: ['Unjha APMC', 'Rajkot Mandi', 'Ahmedabad Mandi'],
  UP: ['Lucknow Mandi', 'Agra Mandi', 'Kanpur Mandi'],
  WB: ['Koley Market', 'Mechhua Mandi'],
  RJ: ['Jaipur Mandi', 'Jodhpur Mandi'],
  MP: ['Indore Mandi', 'Bhopal Mandi'],
  AP: ['Vijayawada Mandi', 'Kurnool Mandi'],
  TS: ['Bowenpally Market', 'Hyderabad APMC'],
  PB: ['Amritsar Mandi', 'Ludhiana Mandi'],
  HR: ['Gurgaon Mandi', 'Karnal Mandi'],
  KL: ['Chalai Market', 'Perumbavoor Mandi'],
};

const getMonthKey = (month) => {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return months[month];
};

const getMandiPrices = (commodityId, stateCode = 'MH') => {
  const commodity = COMMODITIES.find(c => c.id === commodityId);
  if (!commodity) return null;

  const priceData = BASE_MANDI_PRICES[commodityId];
  const stateMultiplier = STATE_MULTIPLIERS[stateCode] || 1.0;
  const mandis = MANDIS[stateCode] || MANDIS['MH'];

  const currentMonth = new Date().getMonth();
  const monthKey = getMonthKey(currentMonth);
  const seasonalPrice = priceData.seasonal[monthKey] || ((priceData.min + priceData.max) / 2);
  const basePrice = seasonalPrice * stateMultiplier;

  const results = mandis.map(mandi => {
    const variance = 1 + (Math.random() * 0.1 - 0.05);
    const price = Math.round(basePrice * variance);
    const prevPrice = Math.round(price * (1 + (Math.random() * 0.2 - 0.1)));
    const change = ((price - prevPrice) / prevPrice * 100).toFixed(1);

    return {
      mandi,
      state: stateCode,
      min_price: Math.round(price * 0.92),
      max_price: Math.round(price * 1.08),
      modal_price: price,
      prev_price: prevPrice,
      change_pct: parseFloat(change),
      unit: commodity.unit,
      date: new Date().toISOString().split('T')[0]
    };
  });

  const lowestPrice = Math.min(...results.map(r => r.modal_price));
  const appDeliveryPrice = Math.round(lowestPrice / 100 * 1.4); // per kg, ~40% markup

  return {
    commodity,
    state: stateCode,
    results,
    insight: {
      mandi_price_per_kg: (lowestPrice / 100).toFixed(2),
      app_delivery_price_per_kg: appDeliveryPrice.toFixed(2),
      savings_pct: Math.round(((appDeliveryPrice - lowestPrice / 100) / appDeliveryPrice) * 100),
      recommendation: lowestPrice / 100 < appDeliveryPrice * 0.7
        ? 'Mandi price significantly cheaper — consider buying from local market'
        : 'App delivery is reasonably priced for convenience'
    }
  };
};

module.exports = { getMandiPrices, COMMODITIES, STATES };
