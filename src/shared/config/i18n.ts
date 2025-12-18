import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enCommon from '../locales/en/common.json'
import enAuth from '../locales/en/auth.json'
import enComplaints from '../locales/en/complaints.json'
import enCitizens from '../locales/en/citizens.json'
import enDashboard from '../locales/en/dashboard.json'
import enGovernmentAgency from '../locales/en/governmentAgency.json'
import enNavigation from '../locales/en/navigation.json'

import arCommon from '../locales/ar/common.json'
import arAuth from '../locales/ar/auth.json'
import arComplaints from '../locales/ar/complaints.json'
import arCitizens from '../locales/ar/citizens.json'
import arDashboard from '../locales/ar/dashboard.json'
import arGovernmentAgency from '../locales/ar/governmentAgency.json'
import arNavigation from '../locales/ar/navigation.json'

// RTL languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur']

export const isRTL = (lang: string): boolean => {
  return RTL_LANGUAGES.includes(lang)
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        complaints: enComplaints,
        citizens: enCitizens,
        dashboard: enDashboard,
        governmentAgency: enGovernmentAgency,
        navigation: enNavigation,
      },
      ar: {
        common: arCommon,
        auth: arAuth,
        complaints: arComplaints,
        citizens: arCitizens,
        dashboard: arDashboard,
        governmentAgency: arGovernmentAgency,
        navigation: arNavigation,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'complaints', 'citizens', 'dashboard', 'governmentAgency', 'navigation'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
