const Anthropic = require('@anthropic-ai/sdk');
const {
  buildLocalAssistantReply,
  chunkByWords,
  generateFallbackMealPlan,
} = require('./localAiService');

let client;

const hasAnthropicConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY?.trim());

const getClient = () => {
  if (!hasAnthropicConfigured()) {
    return null;
  }

  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  return client;
};

const HUNDI_SYSTEM_PROMPT = `You are Kharcha Assistant — a smart, friendly household helper for Indian families.

Your personality:
- Warm, helpful, and practical like a knowledgeable neighbour
- Use a mix of English and Hindi naturally (Hinglish is fine)
- Address users respectfully

Your expertise:
- Indian cooking, recipes, regional cuisines (North/South/East/West India)
- Grocery shopping, price tips, seasonal buying
- Budget management in Indian Rupees (₹)
- Pantry management, food storage, expiry dates
- Indian festivals and seasonal food traditions

Rules:
- Always use ₹ for prices
- Use Indian units: kg, gram, litre, ml, dozen, pao
- Keep responses concise and practical
- If asked for recipes, give clear steps with Indian ingredients
- If asked about budget, give actionable Indian-context advice
- Respond in the same language the user uses (if Hindi, reply in Hindi)

Context you have:
{{CONTEXT}}`;

const generateMealPlan = async (pantryItems, preferences, weekStart) => {
  if (!hasAnthropicConfigured()) {
    return generateFallbackMealPlan(pantryItems, preferences, weekStart);
  }

  const claude = getClient();
  const pantryList = pantryItems.length > 0
    ? pantryItems.map((item) => `${item.name} (${item.quantity} ${item.unit})`).join(', ')
    : 'No items tracked yet';

  const prompt = `Generate a 7-day Indian meal plan for a family.

Pantry available: ${pantryList}
Dietary preference: ${preferences.dietary || 'vegetarian'}
Family size: ${preferences.family_size || 2}
Weekly budget: ₹${preferences.budget || 3000}
Week starting: ${weekStart}

Return ONLY a valid JSON object in this exact format:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "meals": {
        "breakfast": {
          "name": "Dish Name",
          "name_hi": "Hindi name",
          "cuisine": "North Indian",
          "time_mins": 20,
          "ingredients": ["item1", "item2"],
          "recipe_steps": ["Step 1", "Step 2"],
          "uses_pantry": true
        },
        "lunch": { ... same structure ... },
        "dinner": { ... same structure ... }
      }
    }
  ],
  "shopping_list": [
    { "name": "item", "quantity": 1, "unit": "kg", "category": "sabzi" }
  ],
  "estimated_cost": 2500
}

Make it authentic Indian food — variety across the week, include regional dishes, festival-appropriate if relevant. Use pantry items where possible.`;

  const response = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('Failed to parse meal plan response');
  }

  return JSON.parse(jsonMatch[0]);
};

const chatStream = async (messages, context, res) => {
  if (!hasAnthropicConfigured()) {
    const reply = buildLocalAssistantReply(messages, context);
    return chunkByWords(reply, res);
  }

  const claude = getClient();
  const systemPrompt = HUNDI_SYSTEM_PROMPT.replace(
    '{{CONTEXT}}',
    context.rawContext || 'No additional context',
  );

  const stream = claude.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  let fullText = '';

  for await (const event of await stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
      fullText += event.delta.text;
      res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
  return fullText;
};

module.exports = {
  chatStream,
  generateMealPlan,
  hasAnthropicConfigured,
};
