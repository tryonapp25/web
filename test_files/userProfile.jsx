import React, { useState } from "react";
import styles from "../styles/UserProfile.module.css";
import QuestionFlow from "./questionFlow";
import http from "../src/http/http";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  // -----------------------
  // PROFILE
  // -----------------------
  {
    id: "gender_style",
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
    min: 10,
    max: 110,
    placeholder: "e.g. 28",
  },
  {
    id: "height_cm",
    title: "Profile",
    question: "What is your height (cm)?",
    type: "number",
    required: true,
    min: 120,
    max: 230,
    placeholder: "e.g. 175",
  },
  {
    id: "weight_kg",
    title: "Profile",
    question: "What is your weight (kg)?",
    type: "number",
    required: true,
    min: 35,
    max: 200,
    placeholder: "e.g. 72",
  },

  // Sizes
  {
    id: "sizes_top",
    title: "Sizes",
    question: "What is your top size?",
    type: "single",
    required: true,
    options: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "sizes_bottom",
    title: "Sizes",
    question: "What is your bottom size?",
    type: "single",
    required: true,
    options: ["28", "29", "30", "31", "32", "33", "34", "36", "38"],
  },
  {
    id: "sizes_shoes_eu",
    title: "Sizes",
    question: "What is your shoe size (EU)?",
    type: "number",
    required: true,
    min: 30,
    max: 52,
    placeholder: "e.g. 42",
  },

  // Body preferences
  {
    id: "fit_preference",
    title: "Fit & Comfort",
    question: "Which fit do you prefer most?",
    type: "single",
    required: true,
    options: ["Slim", "Regular", "Relaxed", "Oversized"],
    mapValue: (label) => label.toLowerCase(),
  },
  {
    id: "avoid_fits",
    title: "Fit & Comfort",
    question: "Which fits do you want to avoid?",
    type: "multi",
    required: false,
    options: ["Skinny", "Super slim", "Low rise", "Ultra oversized"],
    mapValue: (label) => label.toLowerCase(),
  },
  {
    id: "comfort_priority",
    title: "Fit & Comfort",
    question: "Is comfort your top priority?",
    type: "single",
    required: true,
    options: ["Yes", "No"],
    mapValue: (label) => label === "Yes",
  },

  // Style interests
  {
    id: "style_interests",
    title: "Style",
    question: "Which styles are you into?",
    type: "multi",
    required: false,
    options: ["Minimal", "Smart casual", "Streetwear", "Sporty", "Classic", "Workwear"],
    mapValue: (label) => label.toLowerCase(),
  },

  // Color preferences
  {
    id: "liked_colors",
    title: "Colors",
    question: "Which colors do you like?",
    type: "multi",
    required: false,
    options: ["Black", "Navy", "Grey", "White", "Beige", "Brown", "Green", "Blue"],
    mapValue: (label) => label.toLowerCase(),
  },
  {
    id: "disliked_colors",
    title: "Colors",
    question: "Which colors do you dislike?",
    type: "multi",
    required: false,
    options: ["Bright yellow", "Neon green", "Orange", "Hot pink", "Purple"],
    mapValue: (label) => label.toLowerCase(),
  },

  // Brand preferences
  {
    id: "preferred_brands",
    title: "Brands",
    question: "Which brands do you prefer?",
    type: "multi",
    required: false,
    options: ["Zalando", "H&M", "Nike", "Uniqlo", "COS", "Adidas", "Zara"],
  },
  {
    id: "avoid_brands",
    title: "Brands",
    question: "Which brands do you want to avoid?",
    type: "multi",
    required: false,
    options: ["Shein", "Temu", "(None)"],
    mapValue: (label) => (label === "(None)" ? [] : label),
  },

  // Budget
  {
    id: "currency",
    title: "Budget",
    question: "Which currency should we use?",
    type: "single",
    required: true,
    options: ["EUR", "DKK", "USD", "GBP"],
  },
  {
    id: "max_per_item",
    title: "Budget",
    question: "What’s your max budget per item?",
    type: "number",
    required: true,
    min: 0,
    max: 100000,
    placeholder: "e.g. 120",
  },
  {
    id: "max_outfit",
    title: "Budget",
    question: "What’s your max budget per outfit?",
    type: "number",
    required: true,
    min: 0,
    max: 100000,
    placeholder: "e.g. 300",
  },

  // -----------------------
  // TODAY CONTEXT
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
    id: "activity_level",
    title: "Today",
    question: "How active will you be?",
    type: "single",
    required: true,
    options: ["Sedentary", "Light walking", "Active"],
    mapValue: (label) =>
      label === "Light walking"
        ? "light_walking"
        : label.toLowerCase(),
  },
  {
    id: "formality_level",
    title: "Today",
    question: "How formal should the outfit be? (1 = casual, 5 = formal)",
    type: "number",
    required: true,
    min: 1,
    max: 5,
    placeholder: "1–5",
  },
  {
    id: "country",
    title: "Location",
    question: "Which country are you in today? (2-letter code)",
    type: "single",
    required: true,
    options: ["DK", "SE", "NO", "DE", "NL", "UK", "US"],
  },
  {
    id: "city",
    title: "Location",
    question: "Which city are you in today?",
    type: "single",
    required: true,
    options: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Other"],
  },

  // Weather
  {
    id: "temperature_c",
    title: "Weather",
    question: "What’s the temperature (°C)?",
    type: "number",
    required: true,
    min: -30,
    max: 50,
    placeholder: "e.g. 6",
  },
  {
    id: "condition",
    title: "Weather",
    question: "What’s the weather condition?",
    type: "single",
    required: true,
    options: ["Clear", "Cloudy", "Rain", "Snow", "Windy", "Mixed"],
    mapValue: (label) => label.toLowerCase(),
  },
  {
    id: "wind",
    title: "Weather",
    question: "Is it windy?",
    type: "single",
    required: true,
    options: ["Yes", "No"],
    mapValue: (label) => label === "Yes",
  },

  {
    id: "time_of_day",
    title: "Today",
    question: "What time of day is it?",
    type: "single",
    required: true,
    options: ["Day", "Evening", "Night"],
    mapValue: (label) => label.toLowerCase(),
  },

  // -----------------------
  // CONSTRAINTS
  // -----------------------
  {
    id: "must_have",
    title: "Constraints",
    question: "Any must-have items?",
    type: "multi",
    required: false,
    options: ["Water resistant outerwear", "Warm layers", "Comfortable shoes", "Umbrella-friendly"],
    mapValue: (label) =>
      label === "Water resistant outerwear"
        ? "water_resistant_outerwear"
        : label.toLowerCase().replace(/\s+/g, "_"),
  },
  {
    id: "avoid",
    title: "Constraints",
    question: "Anything you want to avoid?",
    type: "multi",
    required: false,
    options: ["Heavy logo", "Loud patterns", "Bright colors", "Tight fit"],
    mapValue: (label) =>
      label.toLowerCase().replace(/\s+/g, "_"),
  },
];


export default function UserProfile() {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  async function onFinish(answers) {
    // Build your backend payload however you want
    const payload = {
      user_id: "user_001",
      profile: {
        fit_preference: answers.fit_preference,
        gender_style: answers.gender_style,
        liked_colors: answers.liked_colors || [],
        budget: { max_per_item: answers.budget_max },
      },
    };

    try {
      setIsSending(true);
      const res = await http.post(`/user/generate-serpApi-query`, {
        data: JSON.stringify(payload),
      });

      if (res?.data?.success) {
        navigate("/recommendationsPage", {
          state: { recommendations: res.data.data, usage: res.data.usage },
        });
      } else {
        alert("Request failed.");
      }
    } catch (err) {
      alert(err?.message || "Something went wrong.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.phone}>
        <QuestionFlow
          title="UserProfile"
          questions={QUESTIONS}
          onFinish={onFinish}
          loading={isSending}
          durationSec={120} // 2:00 like screenshot (optional)
        />
      </div>
    </div>
  );
}
