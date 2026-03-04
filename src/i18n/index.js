import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import LocizeBackend from 'i18next-locize-backend';

import en from './locales/en.json';
import da from './locales/da.json';

const resources = {
  en: { translation: en },
  da: { translation: da }
};

const locizeProjectId = import.meta.env.VITE_LOCIZE_PROJECTID || null;
const locizeApiKey = import.meta.env.VITE_LOCIZE_APIKEY || undefined;
const locizeReferenceLng = import.meta.env.VITE_LOCIZE_REFERENCE_LNG || 'en';
const locizeVersion = import.meta.env.VITE_LOCIZE_VERSION || 'latest';

// Core i18n setup
i18n.use(LanguageDetector).use(initReactI18next);

// If a Locize project is configured via env, use the backend so translations are
// loaded from Locize and missing keys can be pushed (if api key provided).
if (locizeProjectId) {
  i18n.use(LocizeBackend);
}

const baseInitOptions = {
  resources,
  fallbackLng: 'en',
  supportedLngs: ['en', 'da'],
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  }
};

const locizeOptions = locizeProjectId
  ? {
      backend: {
        projectId: locizeProjectId,
        apiKey: locizeApiKey,
        referenceLng: locizeReferenceLng,
        version: locizeVersion
      },
      // when using locize we allow saving missing keys so they appear in the
      // Locize project for translators (only when apiKey is present).
      saveMissing: !!locizeApiKey
    }
  : {};

// Merge options and initialize
i18n.init(Object.assign({}, baseInitOptions, locizeOptions));

export default i18n;
