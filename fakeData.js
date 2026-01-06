const user_profile = {
  "user_id": "user_001",
  "profile": {
    "gender_style": "menswear",
    "age": 28,
    "height_cm": 175,
    "weight_kg": 72,

    "sizes": {
      "top": "M",
      "bottom": "32",
      "shoes_eu": 42
    },

    "body_preferences": {
      "fit_preference": "regular",
      "avoid_fits": ["skinny"],
      "comfort_priority": true
    },

    "style_interests": [
      "minimal",
      "smart casual"
    ],

    "color_preferences": {
      "liked": ["black", "navy", "grey", "white"],
      "disliked": ["bright yellow", "neon green"]
    },

    "brand_preferences": {
      "preferred": ["Uniqlo", "COS", "Arket"],
      "avoid": []
    },

    "budget": {
      "currency": "EUR",
      "max_per_item": 120,
      "max_outfit": 300
    }
  },

  "today_context": {
    "occasion": "office",
    "activity_level": "light_walking",
    "formality_level": 4,

    "location": {
      "country": "DK",
      "city": "Copenhagen"
    },

    "weather": {
      "temperature_c": 6,
      "condition": "rain",
      "wind": true
    },

    "time_of_day": "day"
  },

  "constraints": {
    "must_have": [
      "water_resistant_outerwear"
    ],
    "avoid": [
      "heavy_logo",
      "loud_patterns"
    ]
  }
}

const googleSearch = `q=mens water resistant coat black zalando`


const prompt = `
You are a fashion search query generator for SerpApi Google Shopping.

Input: a user_profile JSON.
Output: JSON only (no markdown, no explanations).

Goal: generate Google Shopping search queries that match the user’s style, fit, colors, budget, and today_context as ONE complete outfit.

Constraints:

  Do NOT invent products, prices, or retailers.

  Generate search queries only (keywords for q=).

  Prefer minimal and smart casual styles when present.

  Avoid loud patterns and heavy logos.

  Respect fit_preference and avoid_fits.

  Include size tokens where useful (top size, waist, shoe EU size).

  Respect budget.max_per_item and include it as max_price in serpapi_defaults.

  Use location.country for gl and English for hl.

  Must satisfy all constraints.must_have (for example: water-resistant outerwear).

Output rules (IMPORTANT):

  Return exactly ONE full outfit.

  Use ONE category named "full_outfit" only.

  Inside "queries", include exactly 4 queries in this order:

  outerwear / jacket

  top

  bottom

  shoes

The 4 queries together must form one wearable outfit, not alternatives.

  Inside "fallbacks", include exactly 4 generic fallback queries (one per item).

  Do NOT return multiple categories.

  Do NOT return multiple outfits.

  Return JSON with this exact shape:
  {
    "serpapi_defaults": {
      "engine": "google_shopping",
      "gl": "...",
      "hl": "en",
      "max_price": <number>
    },
    "categories": [
      {
      "category": "full_outfit",
      "queries": ["...", "...", "...", "..."],
      "fallbacks": ["...", "...", "...", "..."]
      }
    ],
  }

Now generate the output for this user_profile:
<PASTE USER_PROFILE JSON HERE>
`