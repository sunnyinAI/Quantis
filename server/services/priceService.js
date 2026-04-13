// Mock price data for Indian grocery items
const BASE_PRICES = {
  // Vegetables (per kg)
  'tomato': 40, 'onion': 35, 'potato': 30, 'aloo': 30, 'tamatar': 40,
  'pyaaz': 35, 'gajar': 50, 'carrot': 50, 'gobhi': 60, 'cauliflower': 60,
  'palak': 30, 'spinach': 30, 'methi': 25, 'fenugreek': 25, 'bhindi': 60,
  'okra': 60, 'ladyfinger': 60, 'brinjal': 40, 'baingan': 40, 'capsicum': 80,
  'shimla mirch': 80, 'lemon': 120, 'nimbu': 120, 'ginger': 200, 'adrak': 200,
  'garlic': 250, 'lehsun': 250, 'green chilli': 100, 'hari mirch': 100,
  'peas': 80, 'matar': 80, 'corn': 30, 'makai': 30, 'cucumber': 30, 'kheera': 30,
  'bottle gourd': 30, 'lauki': 30, 'bitter gourd': 60, 'karela': 60,
  'ridge gourd': 40, 'turai': 40, 'pumpkin': 25, 'kaddu': 25,
  'raw banana': 40, 'kachha kela': 40, 'banana': 50, 'kela': 50,

  // Dal & Grains (per kg)
  'toor dal': 150, 'arhar dal': 150, 'chana dal': 90, 'moong dal': 120,
  'masoor dal': 100, 'urad dal': 130, 'rajma': 160, 'kidney beans': 160,
  'chana': 80, 'chickpeas': 160, 'kabuli chana': 160, 'rice': 60, 'chawal': 60,
  'basmati rice': 120, 'basmati': 120, 'wheat': 35, 'gehu': 35,
  'atta': 45, 'maida': 40, 'sooji': 50, 'besan': 70, 'poha': 55,
  'oats': 180, 'quinoa': 350, 'barley': 80, 'jau': 80, 'sago': 90, 'sabudana': 90,

  // Dairy
  'milk': 64, 'doodh': 64, 'paneer': 350, 'curd': 80, 'dahi': 80,
  'butter': 500, 'makhan': 500, 'ghee': 700, 'cheese': 400, 'cream': 200,

  // Oils
  'mustard oil': 180, 'sarson tel': 180, 'sunflower oil': 160, 'coconut oil': 220,
  'groundnut oil': 200, 'olive oil': 800, 'rice bran oil': 180,
  'refined oil': 160, 'vanaspati': 120,

  // Masala
  'salt': 20, 'namak': 20, 'sugar': 45, 'cheeni': 45, 'jaggery': 60, 'gud': 60,
  'turmeric': 200, 'haldi': 200, 'red chilli powder': 250, 'lal mirch': 250,
  'coriander powder': 150, 'dhania': 150, 'cumin': 300, 'jeera': 300,
  'black pepper': 800, 'kali mirch': 800, 'cardamom': 2000, 'elaichi': 2000,
  'cinnamon': 500, 'dalchini': 500, 'cloves': 1200, 'laung': 1200,
  'garam masala': 400, 'chat masala': 350, 'biryani masala': 300,
  'amchur': 300, 'dry mango powder': 300, 'hing': 1200, 'asafoetida': 1200,

  // Snacks & Beverages
  'tea': 400, 'chai': 400, 'coffee': 600, 'biscuits': 30, 'namkeen': 50,
  'chips': 30, 'papad': 100, 'pickle': 120, 'achaar': 120, 'sauce': 80,
  'ketchup': 80, 'mayonnaise': 150,

  // Personal care
  'soap': 45, 'shampoo': 200, 'toothpaste': 80, 'detergent': 100,
  'dishwash': 60, 'floor cleaner': 90,
};

const PLATFORMS = {
  blinkit: {
    name: 'Blinkit',
    color: '#F8D210',
    textColor: '#000',
    multiplier: 1.05,
    delivery_time: '10 mins',
    min_order: 99,
    available: 0.85
  },
  zepto: {
    name: 'Zepto',
    color: '#9B2FFF',
    textColor: '#fff',
    multiplier: 1.03,
    delivery_time: '10 mins',
    min_order: 99,
    available: 0.80
  },
  swiggy_instamart: {
    name: 'Swiggy Instamart',
    color: '#FC8019',
    textColor: '#fff',
    multiplier: 1.07,
    delivery_time: '15 mins',
    min_order: 149,
    available: 0.82
  },
  bigbasket: {
    name: 'BigBasket',
    color: '#84C225',
    textColor: '#fff',
    multiplier: 0.97,
    delivery_time: '2 hours',
    min_order: 500,
    available: 0.92
  },
  jiomart: {
    name: 'JioMart',
    color: '#0B6EFD',
    textColor: '#fff',
    multiplier: 0.95,
    delivery_time: '1-2 days',
    min_order: 0,
    available: 0.88
  }
};

const findBasePrice = (query) => {
  const q = query.toLowerCase().trim();
  if (BASE_PRICES[q]) return { price: BASE_PRICES[q], name: query };

  // Fuzzy match
  for (const [key, price] of Object.entries(BASE_PRICES)) {
    if (key.includes(q) || q.includes(key)) {
      return { price, name: key };
    }
  }

  // Default price range
  return { price: Math.floor(80 + Math.random() * 120), name: query };
};

const comparePrices = (query, quantity = 1, unit = 'kg') => {
  const { price: basePrice, name: itemName } = findBasePrice(query);
  const totalBase = basePrice * quantity;

  const results = Object.entries(PLATFORMS).map(([key, platform]) => {
    const isAvailable = Math.random() < platform.available;
    if (!isAvailable) {
      return { platform: key, ...platform, available: false, price: null };
    }

    // Add realistic variance ±8%
    const variance = 1 + (Math.random() * 0.16 - 0.08);
    const price = Math.round(totalBase * platform.multiplier * variance);
    const mrp = Math.round(price * (1 + Math.random() * 0.15));

    return {
      platform: key,
      name: platform.name,
      color: platform.color,
      textColor: platform.textColor,
      delivery_time: platform.delivery_time,
      min_order: platform.min_order,
      available: true,
      price,
      mrp,
      discount: mrp - price,
      discount_pct: Math.round(((mrp - price) / mrp) * 100)
    };
  });

  const availableResults = results.filter(r => r.available);
  if (availableResults.length > 0) {
    const minPrice = Math.min(...availableResults.map(r => r.price));
    availableResults.forEach(r => { if (r.price === minPrice) r.is_best = true; });
  }

  return {
    item: itemName,
    query,
    quantity,
    unit,
    results: results.sort((a, b) => {
      if (!a.available) return 1;
      if (!b.available) return -1;
      return a.price - b.price;
    })
  };
};

module.exports = { comparePrices };
