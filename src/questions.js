export const PROFILE_QUESTIONS = [
  {
    id: "genderStyle",
    title: "Profile",
    question: "Which style category fits you best?",
    type: "single",
    required: true,
    options: ["Menswear", "Womenswear", "Unisex"],
    mapValue: (label) => label.toLowerCase(),
  },
  {
    id: "age",
    title: "Profile",
    question: "How old are you?",
    type: "number",
    required: true,
    min: 12,
    max: 80,
    placeholder: "e.g. 18",
  },
  {
    id: "height",
    title: "Profile",
    question: "What is your height (cm)?",
    type: "number",
    required: true,
    min: 120,
    max: 230,
    placeholder: "e.g. 175",
  },
  {
    id: "weight",
    title: "Profile",
    question: "What is your weight (kg)?",
    type: "number",
    required: true,
    min: 35,
    max: 200,
    placeholder: "e.g. 72",
  },
  {
    id: "styleConfidence",
    title: "Profile",
    question: "How confident are you with styling? (1 = I need help, 5 = very confident)",
    type: "number",
    required: true,
    min: 1,
    max: 5,
    placeholder: "1–5",
  },

  // -----------------------
  // STYLE
  // -----------------------
  {
    id: "styleInterests",
    title: "Style",
    question: "Which styles are you into?",
    type: "multi",
    required: false,
    options: ["Minimal", "Smart casual", "Streetwear", "Sporty", "Classic", "Workwear"],
    mapValue: (label) => label.toLowerCase(),
  },
  // -----------------------
  // COLORS
  // -----------------------
  {
    id: "likedColors",
    title: "Colors",
    question: "Which colors do you like?",
    type: "multi",
    required: false,
    options: ["Black", "Navy", "Grey", "White", "Beige", "Brown", "Green", "Blue"],
    mapValue: (label) => label.toLowerCase(),
  },
  {
    id: "dislikedColors",
    title: "Colors",
    question: "Which colors do you dislike?",
    type: "multi",
    required: false,
    options: ["Bright yellow", "Neon green", "Orange", "Hot pink", "Purple"],
    mapValue: (label) => label.toLowerCase(),
  },
  {
    id: "colorContrast",
    title: "Colors",
    question: "Do you prefer low-contrast outfits or high-contrast outfits?",
    type: "single",
    required: true,
    options: ["Low contrast", "Balanced", "High contrast"],
    mapValue: (label) => label.toLowerCase().replace(/\s+/g, "_"),
  },

  {
    id: "currency",
    title: "Budget",
    question: "Which currency should we use?",
    type: "single",
    required: true,
    options: ["EUR", "DKK", "USD", "GBP"],
  },

  // -----------------------
  // BRANDS
  // -----------------------
  {
    id: "preferredBrands",
    title: "Brands",
    question: "Which brands do you prefer?",
    type: "multi",
    required: false,
    options: ["Zalando", "H&M", "Nike", "Uniqlo", "COS", "Adidas", "Zara"],
  },
  {
    id: "avoidBrands",
    title: "Brands",
    question: "Which brands do you want to avoid?",
    type: "multi",
    required: false,
    options: ["Shein", "Temu", "(None)"],
    mapValue: (label) => (label === "(None)" ? [] : label),
  },

]



export const STYLE_QUESTIONS = [

  // -----------------------
  // FIT & COMFORT
  // -----------------------
  {
    id: "fitPreference",
    title: "Fit & Comfort",
    question: "Which fit do you prefer most today?",
    type: "single",
    required: true,
    options: ["Slim", "Regular", "Relaxed", "Oversized"],
    mapValue: (label) => label.toLowerCase(),
  },
  {
    id: "avoidFits",
    title: "Fit & Comfort",
    question: "Which fits do you want to avoid?",
    type: "multi",
    required: false,
    options: ["Skinny", "Super slim", "Low rise", "Ultra oversized"],
    mapValue: (label) => label.toLowerCase(),
  },


  {
    id: "statementLevel",
    title: "Style",
    question: "How much do you want your outfit to stand out today? (1 = subtle, 5 = statement)",
    type: "number",
    required: true,
    min: 1,
    max: 5,
    placeholder: "1–5",
  },

 
  // -----------------------
  // BUDGET
  // -----------------------
  {
    id: "max_per_item",
    title: "Budget",
    question: "What’s your max budget per item?",
    type: "number",
    required: false,
    min: 0,
    max: 100000,
    placeholder: "e.g. 120",
  },
  
  // -----------------------
  // TODAY
  // -----------------------
  {
    id: "occasion",
    title: "Today",
    question: "What’s the occasion today?",
    type: "single",
    required: true,
    options: ["Office", "Casual", "Date", "Event", "Travel", "Outdoors"],
    mapValue: (label) => label.toLowerCase(),
  },
  {
    id: "activityLevel",
    title: "Today",
    question: "How active will you be?",
    type: "single",
    required: true,
    options: ["Sedentary", "Light walking", "Active"],
    mapValue: (label) =>
      label === "Light walking" ? "light_walking" : label.toLowerCase(),
  },

  {
    id: "bodyShape",
    title: "Fit & Comfort",
    question: "Which body shape is closest to you?",
    type: "single",
    required: false,
    options: ["Slim", "Athletic/broad shoulders", "Average", "Stocky", "Curvy/hips"],
    mapValue: (l) => l.toLowerCase().replace(/[^a-z]+/g, "_"),
  },

  {
    id: "fitGoal",
    title: "Fit & Comfort",
    question: "What do you want your outfit to do for you today?",
    type: "multi",
    required: false,
    options: [
      "Look taller",
      "Look slimmer",
      "Broader shoulders",
      "Hide belly",
      "Hide hips/thighs",
      "Show legs",
      "Comfort first"
    ],
    mapValue: (l) => l.toLowerCase().replace(/[^a-z]+/g, "_"),
  },

  {
    id: "confidenceItem",
    title: "Style",
    question: "What’s one item you always feel good wearing?",
    type: "single",
    required: false,
    options: ["Black jeans", "Blue jeans", "Straight trousers", "Hoodie", "Blazer", "Bomber jacket", "Sneakers", "Chelsea boots"],
    mapValue: (l) => l.toLowerCase().replace(/[^a-z]+/g, "_"),
  },

  {
    id: "shoeStyle",
    title: "Today",
    question: "Which shoes would you wear today if possible?",
    type: "single",
    required: false,
    options: ["Sneakers", "Boots", "Loafers", "Dress shoes", "Running shoes"],
    mapValue: (l) => l.toLowerCase().replace(/[^a-z]+/g, "_"),
  },

  {
    id: "styleLaneToday",
    title: "Style",
    question: "Pick ONE vibe for today (so everything matches).",
    type: "single",
    required: true,
    options: ["Minimal", "Smart casual", "Streetwear", "Sporty", "Classic", "Workwear"],
    mapValue: (l) => l.toLowerCase().replace(/\s+/g, "_"),
  },

  {
    id: "paletteMode",
    title: "Colors",
    question: "How do you want colors handled today?",
    type: "single",
    required: true,
    options: ["Mostly neutrals", "Neutrals + 1 accent", "More color"],
    mapValue: (l) => l.toLowerCase().replace(/[^a-z]+/g, "_"),
  }






];
