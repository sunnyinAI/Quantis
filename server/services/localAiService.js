const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CATEGORY_BY_INGREDIENT = {
  tomato: 'sabzi',
  onion: 'sabzi',
  potato: 'sabzi',
  paneer: 'dairy',
  curd: 'dairy',
  dahi: 'dairy',
  milk: 'dairy',
  atta: 'atta_maida',
  rice: 'dal_chawal',
  dal: 'dal_chawal',
  moong: 'dal_chawal',
  chana: 'dal_chawal',
  poha: 'snacks',
  oats: 'beverages',
  capsicum: 'sabzi',
  bhindi: 'sabzi',
  spinach: 'sabzi',
  palak: 'sabzi',
  carrot: 'sabzi',
  peas: 'sabzi',
  egg: 'other',
  chicken: 'other',
};

const MEAL_LIBRARY = {
  vegetarian: {
    breakfast: [
      meal('Vegetable Poha', 'वेज पोहा', 'Maharashtrian', 20, ['poha', 'onion', 'potato', 'peas', 'lemon'], [
        'Rinse poha and keep aside for 5 minutes.',
        'Saute onion, potato and peas with mustard seeds and curry leaves.',
        'Mix in poha, haldi, salt and lemon. Serve hot.',
      ]),
      meal('Masala Oats', 'मसाला ओट्स', 'Modern Indian', 15, ['oats', 'onion', 'tomato', 'carrot', 'peas'], [
        'Cook onion, tomato and vegetables with basic masala.',
        'Add oats with water and simmer until soft.',
        'Finish with coriander and serve warm.',
      ]),
      meal('Besan Chilla', 'बेसन चीला', 'North Indian', 18, ['besan', 'onion', 'tomato', 'green chilli'], [
        'Make a smooth besan batter with salt and spices.',
        'Add chopped onion, tomato and chilli.',
        'Cook like a dosa on a hot tawa.',
      ]),
      meal('Idli with Coconut Chutney', 'इडली चटनी', 'South Indian', 25, ['idli batter', 'coconut', 'curd'], [
        'Steam idli batter until soft and fluffy.',
        'Blend chutney ingredients until smooth.',
        'Serve hot with chutney.',
      ]),
    ],
    lunch: [
      meal('Dal Chawal with Aloo Jeera', 'दाल चावल आलू जीरा', 'North Indian', 35, ['dal', 'rice', 'potato', 'cumin'], [
        'Pressure cook dal and rice separately.',
        'Saute boiled potatoes with jeera and masala.',
        'Serve dal, rice and aloo jeera together.',
      ]),
      meal('Rajma Rice', 'राजमा चावल', 'Punjabi', 40, ['rajma', 'rice', 'onion', 'tomato'], [
        'Soak and pressure cook rajma until tender.',
        'Prepare onion-tomato masala and simmer rajma in it.',
        'Serve with steamed rice.',
      ]),
      meal('Sambar Rice', 'सांभर राइस', 'South Indian', 40, ['toor dal', 'rice', 'tomato', 'drumstick'], [
        'Cook dal until soft.',
        'Make sambar with vegetables and tamarind.',
        'Serve with rice and a spoon of ghee.',
      ]),
      meal('Palak Paneer with Phulka', 'पालक पनीर फुल्का', 'North Indian', 35, ['spinach', 'paneer', 'atta', 'onion'], [
        'Blanch spinach and blend it into a puree.',
        'Cook onion masala and add puree with paneer cubes.',
        'Serve with soft phulkas.',
      ]),
    ],
    dinner: [
      meal('Veg Khichdi', 'वेज खिचड़ी', 'Comfort Indian', 30, ['rice', 'moong dal', 'carrot', 'peas'], [
        'Wash rice and dal together.',
        'Pressure cook with vegetables, haldi and salt.',
        'Top with ghee and serve with curd.',
      ]),
      meal('Paneer Bhurji with Roti', 'पनीर भुर्जी रोटी', 'North Indian', 25, ['paneer', 'onion', 'tomato', 'atta'], [
        'Saute onion and tomato with masala.',
        'Crumble paneer and cook for 5 minutes.',
        'Serve with fresh rotis.',
      ]),
      meal('Lemon Rice with Curd', 'नींबू चावल', 'South Indian', 20, ['rice', 'lemon', 'peanuts', 'curd'], [
        'Temper mustard seeds, curry leaves and peanuts.',
        'Mix into cooked rice with lemon juice and haldi.',
        'Serve with chilled curd.',
      ]),
      meal('Veg Pulao with Raita', 'वेज पुलाव रायता', 'North Indian', 30, ['rice', 'carrot', 'peas', 'curd'], [
        'Saute whole spices and vegetables.',
        'Cook rice with vegetables until fluffy.',
        'Pair with a simple curd raita.',
      ]),
    ],
  },
  vegan: {
    breakfast: [
      meal('Vegetable Upma', 'वेज उपमा', 'South Indian', 20, ['sooji', 'onion', 'carrot', 'peas'], [
        'Roast sooji lightly and keep aside.',
        'Cook vegetables with curry leaves and chilli.',
        'Add water, then stir in sooji until fluffy.',
      ]),
      meal('Masala Poha', 'मसाला पोहा', 'Maharashtrian', 18, ['poha', 'onion', 'potato', 'lemon'], [
        'Rinse poha and soften it.',
        'Cook potato and onion with spices.',
        'Toss poha in the pan and finish with lemon.',
      ]),
    ],
    lunch: [
      meal('Chole Rice', 'छोले चावल', 'Punjabi', 40, ['chana', 'rice', 'onion', 'tomato'], [
        'Pressure cook chana until soft.',
        'Cook a masala gravy and simmer chole in it.',
        'Serve with steamed rice.',
      ]),
      meal('Mixed Veg Curry with Roti', 'मिक्स वेज करी रोटी', 'North Indian', 35, ['carrot', 'peas', 'potato', 'atta'], [
        'Cook vegetables with onion-tomato masala.',
        'Add water and simmer until tender.',
        'Serve with rotis.',
      ]),
    ],
    dinner: [
      meal('Moong Dal Khichdi', 'मूंग दाल खिचड़ी', 'Comfort Indian', 28, ['moong dal', 'rice', 'ginger'], [
        'Wash dal and rice together.',
        'Cook with turmeric, ginger and salt.',
        'Serve hot with pickle or salad.',
      ]),
      meal('Jeera Rice and Aloo Matar', 'जीरा राइस आलू मटर', 'North Indian', 30, ['rice', 'potato', 'peas', 'cumin'], [
        'Cook jeera rice until fluffy.',
        'Saute aloo and matar with masala.',
        'Serve together.',
      ]),
    ],
  },
  jain: {
    breakfast: [
      meal('Sabudana Khichdi', 'साबूदाना खिचड़ी', 'Fasting Special', 25, ['sabudana', 'peanuts', 'potato', 'lemon'], [
        'Soak sabudana until soft.',
        'Cook potato and peanuts with mild spices.',
        'Mix sabudana and finish with lemon.',
      ]),
      meal('Makhana Kheer', 'मखाना खीर', 'North Indian', 20, ['makhana', 'milk', 'cardamom'], [
        'Roast makhana lightly.',
        'Simmer in milk with cardamom.',
        'Cook until creamy.',
      ]),
    ],
    lunch: [
      meal('Jain Veg Pulao', 'जैन वेज पुलाव', 'North Indian', 30, ['rice', 'beans', 'peas', 'capsicum'], [
        'Saute whole spices and vegetables without onion or garlic.',
        'Add rice and water.',
        'Cook until fluffy.',
      ]),
      meal('Lauki Chana Dal with Roti', 'लौकी चना दाल रोटी', 'North Indian', 35, ['lauki', 'chana dal', 'atta'], [
        'Pressure cook chana dal.',
        'Cook lauki with mild masala.',
        'Combine and serve with roti.',
      ]),
    ],
    dinner: [
      meal('Moong Khichdi', 'मूंग खिचड़ी', 'Comfort Indian', 25, ['moong dal', 'rice', 'ghee'], [
        'Cook rice and dal with turmeric.',
        'Temper with jeera and hing if desired.',
        'Serve warm.',
      ]),
      meal('Tomato Sev Sabzi with Phulka', 'टमाटर सेव सब्ज़ी', 'Gujarati', 20, ['tomato', 'sev', 'atta'], [
        'Cook tomatoes with mild spices.',
        'Add sev just before serving.',
        'Pair with phulka.',
      ]),
    ],
  },
  eggetarian: {
    breakfast: [
      meal('Egg Bhurji Toast', 'एग भुर्जी टोस्ट', 'Modern Indian', 15, ['egg', 'onion', 'tomato', 'bread'], [
        'Saute onion and tomato.',
        'Add whisked eggs and scramble gently.',
        'Serve with toasted bread.',
      ]),
      meal('Vegetable Poha', 'वेज पोहा', 'Maharashtrian', 20, ['poha', 'onion', 'potato', 'peas'], [
        'Cook vegetables with mustard seeds.',
        'Fold in poha with spices and lemon.',
        'Serve hot.',
      ]),
    ],
    lunch: [
      meal('Egg Curry with Rice', 'एग करी चावल', 'North Indian', 30, ['egg', 'rice', 'onion', 'tomato'], [
        'Boil eggs and prepare onion-tomato gravy.',
        'Simmer eggs in the gravy.',
        'Serve with steamed rice.',
      ]),
      meal('Dal Rice with Omelette', 'दाल चावल ऑमलेट', 'Home Style', 25, ['dal', 'rice', 'egg'], [
        'Cook dal and rice.',
        'Prepare a simple masala omelette.',
        'Serve together.',
      ]),
    ],
    dinner: [
      meal('Egg Fried Rice', 'एग फ्राइड राइस', 'Indo-Chinese', 20, ['rice', 'egg', 'capsicum', 'peas'], [
        'Scramble eggs and set aside.',
        'Stir-fry vegetables and cooked rice.',
        'Mix in eggs and season lightly.',
      ]),
      meal('Paneer Bhurji with Roti', 'पनीर भुर्जी रोटी', 'North Indian', 25, ['paneer', 'onion', 'tomato', 'atta'], [
        'Cook onion and tomato masala.',
        'Add crumbled paneer and spices.',
        'Serve with rotis.',
      ]),
    ],
  },
  non_vegetarian: {
    breakfast: [
      meal('Egg Bhurji Paratha', 'एग भुर्जी पराठा', 'North Indian', 20, ['egg', 'onion', 'tomato', 'atta'], [
        'Cook egg bhurji with mild masala.',
        'Roll fresh parathas.',
        'Serve together.',
      ]),
      meal('Poha', 'पोहा', 'Maharashtrian', 18, ['poha', 'onion', 'potato'], [
        'Soften poha.',
        'Cook vegetables with spices.',
        'Mix poha and serve.',
      ]),
    ],
    lunch: [
      meal('Chicken Curry with Rice', 'चिकन करी चावल', 'North Indian', 45, ['chicken', 'onion', 'tomato', 'rice'], [
        'Cook onion-tomato masala.',
        'Add chicken and simmer until tender.',
        'Serve with rice.',
      ]),
      meal('Egg Curry with Jeera Rice', 'एग करी जीरा राइस', 'North Indian', 30, ['egg', 'rice', 'onion', 'tomato'], [
        'Prepare egg curry gravy.',
        'Cook jeera rice.',
        'Serve hot.',
      ]),
    ],
    dinner: [
      meal('Chicken Pulao', 'चिकन पुलाव', 'Awadhi', 40, ['chicken', 'rice', 'onion'], [
        'Saute spices and onion.',
        'Add chicken, then rice and water.',
        'Cook until rice is fluffy.',
      ]),
      meal('Dal Tadka with Egg Bhurji', 'दाल तड़का एग भुर्जी', 'Home Style', 30, ['dal', 'egg', 'onion', 'tomato'], [
        'Prepare dal tadka.',
        'Cook quick egg bhurji on the side.',
        'Serve with roti or rice.',
      ]),
    ],
  },
};

function meal(name, name_hi, cuisine, time_mins, ingredients, recipe_steps) {
  return { name, name_hi, cuisine, time_mins, ingredients, recipe_steps };
}

function chunkByWords(text, res) {
  const chunks = text.split(/(\s+)/).filter(Boolean);
  for (const chunk of chunks) {
    res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  return text;
}

function normaliseDiet(dietary) {
  if (!dietary) return 'vegetarian';
  return MEAL_LIBRARY[dietary] ? dietary : 'vegetarian';
}

function pantryNames(pantryItems) {
  return pantryItems.map((item) => String(item.name || '').toLowerCase());
}

function ingredientInPantry(ingredient, pantry) {
  const needle = ingredient.toLowerCase();
  return pantry.some((item) => item.includes(needle) || needle.includes(item));
}

function chooseMeal(list, pantry, index) {
  const scored = list
    .map((item) => ({
      item,
      score: item.ingredients.reduce(
        (sum, ingredient) => sum + (ingredientInPantry(ingredient, pantry) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[index % scored.length].item;
}

function dayOffset(date, offset) {
  const d = new Date(date);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

function categoryForIngredient(ingredient) {
  const key = ingredient.toLowerCase();
  return CATEGORY_BY_INGREDIENT[key] || 'other';
}

function uniqueShoppingList(days, pantry) {
  const seen = new Set();
  const results = [];

  for (const day of days) {
    for (const key of ['breakfast', 'lunch', 'dinner']) {
      const mealItem = day.meals[key];
      for (const ingredient of mealItem.ingredients) {
        if (ingredientInPantry(ingredient, pantry)) continue;
        const slug = ingredient.toLowerCase();
        if (seen.has(slug)) continue;
        seen.add(slug);
        results.push({
          name: ingredient,
          quantity: 1,
          unit: ['rice', 'dal', 'atta', 'paneer', 'chicken'].includes(slug)
            ? 'kg'
            : 'piece',
          category: categoryForIngredient(ingredient),
        });
      }
    }
  }

  return results.slice(0, 14);
}

function estimateCost(days, preferences, pantry) {
  const missingIngredients = uniqueShoppingList(days, pantry).length;
  const base = preferences.budget || 2500;
  const familyFactor = Math.max(1, preferences.family_size || 2);
  return Math.min(base, 900 + missingIngredients * 110 + familyFactor * 180);
}

function fallbackRecipeSuggestions(pantryItems) {
  const pantry = pantryNames(pantryItems);
  const suggestions = [];

  if (ingredientInPantry('rice', pantry) && ingredientInPantry('dal', pantry)) {
    suggestions.push('Make a simple dal-chawal or veg khichdi tonight.');
  }
  if (ingredientInPantry('paneer', pantry)) {
    suggestions.push('Paneer bhurji or paneer pulao will use paneer quickly.');
  }
  if (ingredientInPantry('potato', pantry) && ingredientInPantry('onion', pantry)) {
    suggestions.push('Aloo jeera, poha, or masala sandwich are easy pantry wins.');
  }
  if (ingredientInPantry('egg', pantry)) {
    suggestions.push('Egg bhurji or egg fried rice is a quick protein option.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Start with a simple rice, dal and seasonal sabzi combination.');
    suggestions.push('Poha, upma or besan chilla are low-effort breakfasts.');
  }

  return suggestions.slice(0, 3);
}

function buildBudgetTips(monthlyBudget, spentThisMonth) {
  const remaining = Math.max(0, monthlyBudget - spentThisMonth);
  const usage = monthlyBudget ? Math.round((spentThisMonth / monthlyBudget) * 100) : 0;

  return {
    remaining,
    usage,
    tips: [
      'Compare mandi prices for tomatoes, onions and leafy veg before placing an app order.',
      'Shift staples like rice, atta and dal to weekly bulk buys instead of quick-commerce purchases.',
      'Use pantry-first meal planning for 2 dinners this week to reduce waste.',
      'Track subscriptions and utility bills separately so grocery spend stays clear.',
    ],
  };
}

function isHindi(text) {
  return /[\u0900-\u097F]/.test(text);
}

function buildLocalAssistantReply(messages, context) {
  const userMessage = messages[messages.length - 1]?.content || '';
  const message = userMessage.toLowerCase();
  const pantryItems = context.pantryItems || [];
  const pantryList = pantryItems.slice(0, 8).map((item) => item.name).join(', ');
  const expiringSoon = pantryItems
    .filter((item) => item.expiry_date)
    .sort((a, b) => String(a.expiry_date).localeCompare(String(b.expiry_date)))
    .slice(0, 3)
    .map((item) => item.name);
  const inHindi = isHindi(userMessage);
  const budget = buildBudgetTips(context.monthlyBudget || 0, context.spentThisMonth || 0);

  if (message.includes('recipe') || message.includes('cook') || message.includes('meal') || message.includes('खाना') || message.includes('रेसिपी')) {
    const suggestions = fallbackRecipeSuggestions(pantryItems);
    if (inHindi) {
      return `आपके pantry में ${pantryList || 'अभी बहुत कम items'} हैं। अभी आप यह try कर सकते हैं:\n\n1. ${suggestions[0]}\n2. ${suggestions[1] || 'पोहे या उपमा जैसा quick breakfast बनाइए।'}\n3. ${suggestions[2] || 'दाल-चावल + एक seasonal sabzi सबसे practical option है।'}\n\n${expiringSoon.length ? `जल्दी use करें: ${expiringSoon.join(', ')}.` : 'Expiry वाले items pantry में add करते रहें ताकि मैं और precise suggestions दे सकूं।'}`;
    }

    return `Based on your pantry, try these next:\n\n1. ${suggestions[0]}\n2. ${suggestions[1] || 'Poha or upma is a fast breakfast option.'}\n3. ${suggestions[2] || 'Dal-chawal with one seasonal sabzi is the safest low-cost dinner.'}\n\n${expiringSoon.length ? `Use these soon: ${expiringSoon.join(', ')}.` : 'Add pantry expiry dates to get tighter recipe suggestions.'}`;
  }

  if (message.includes('budget') || message.includes('save') || message.includes('expense') || message.includes('खर्च') || message.includes('बजट')) {
    if (inHindi) {
      return `इस महीने आपका budget ₹${context.monthlyBudget || 0} है और अभी तक ₹${context.spentThisMonth || 0} spend हुआ है। लगभग ${budget.usage}% उपयोग हो चुका है, ₹${budget.remaining} बाकी है.\n\nFocus tips:\n- ${budget.tips[0]}\n- ${budget.tips[1]}\n- ${budget.tips[2]}\n- ${budget.tips[3]}`;
    }

    return `Your monthly budget is ₹${context.monthlyBudget || 0} and you have spent ₹${context.spentThisMonth || 0} so far. That is about ${budget.usage}% used, with ₹${budget.remaining} left.\n\nFocus next:\n- ${budget.tips[0]}\n- ${budget.tips[1]}\n- ${budget.tips[2]}\n- ${budget.tips[3]}`;
  }

  if (message.includes('price') || message.includes('cheap') || message.includes('mandi') || message.includes('दाम') || message.includes('सस्ता')) {
    if (inHindi) {
      return `Price comparison के लिए सबसे अच्छा flow यह है:\n- पहले Prices tab में item search करें.\n- फिर Mandi tab में उसी commodity का modal price check करें.\n- Quick-commerce में leafy veg और tomatoes पर markup ज़्यादा मिलता है.\n- Staples bulk में लेना usually सस्ता पड़ता है.\n\nअगर आप चाहें तो next message में item name भेजें, मैं buying strategy बता दूँगा.`;
    }

    return `For price decisions, use this flow:\n- Search the item in the Prices tab first.\n- Check the same commodity in the Mandi tab for modal wholesale rates.\n- Leafy vegetables and tomatoes usually show the biggest convenience markup.\n- Staples like rice, atta and dal are better as bulk buys than urgent orders.\n\nSend me a specific item next and I’ll suggest the smarter buying route.`;
  }

  if (inHindi) {
    return `मैं grocery planning, pantry use, budget control और meal ideas में help कर सकता हूँ.\n\nअभी आपके pantry में: ${pantryList || 'tracked items नहीं हैं'}.\nइस महीने spend: ₹${context.spentThisMonth || 0} / ₹${context.monthlyBudget || 0}.\n\nआप मुझसे पूछ सकते हैं:\n- आज क्या पकाऊँ?\n- कहाँ सस्ता मिलेगा?\n- grocery budget कैसे control करूँ?`;
  }

  return `I can help with pantry-first recipes, grocery savings and household budgeting.\n\nRight now I can see: ${pantryList || 'no tracked pantry items yet'}.\nThis month you have spent ₹${context.spentThisMonth || 0} out of ₹${context.monthlyBudget || 0}.\n\nTry asking:\n- What should I cook tonight?\n- Is this item better from mandi or delivery?\n- How do I cut grocery spend this month?`;
}

function generateFallbackMealPlan(pantryItems, preferences, weekStart) {
  const diet = normaliseDiet(preferences.dietary);
  const library = MEAL_LIBRARY[diet];
  const pantry = pantryNames(pantryItems);

  const days = Array.from({ length: 7 }, (_, index) => {
    const breakfast = chooseMeal(library.breakfast, pantry, index);
    const lunch = chooseMeal(library.lunch, pantry, index + 1);
    const dinner = chooseMeal(library.dinner, pantry, index + 2);

    return {
      date: dayOffset(weekStart, index),
      day_name: DAY_NAMES[new Date(dayOffset(weekStart, index)).getDay()],
      meals: {
        breakfast: {
          ...breakfast,
          uses_pantry: breakfast.ingredients.some((ingredient) => ingredientInPantry(ingredient, pantry)),
        },
        lunch: {
          ...lunch,
          uses_pantry: lunch.ingredients.some((ingredient) => ingredientInPantry(ingredient, pantry)),
        },
        dinner: {
          ...dinner,
          uses_pantry: dinner.ingredients.some((ingredient) => ingredientInPantry(ingredient, pantry)),
        },
      },
    };
  });

  return {
    days,
    shopping_list: uniqueShoppingList(days, pantry),
    estimated_cost: estimateCost(days, preferences, pantry),
    generated_by: 'local-fallback',
  };
}

module.exports = {
  buildLocalAssistantReply,
  chunkByWords,
  generateFallbackMealPlan,
};
