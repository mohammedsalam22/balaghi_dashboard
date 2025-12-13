import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import i18n, { isRTL } from '../config/i18n'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  direction: 'ltr' | 'rtl'
  changeLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Get saved preference from localStorage or detect from browser
    const savedLang = localStorage.getItem('i18nextLng') as Language
    if (savedLang === 'ar' || savedLang === 'en') {
      return savedLang
    }
    // Check browser language
    const browserLang = navigator.language.split('-')[0]
    return browserLang === 'ar' ? 'ar' : 'en'
  })

  const direction = isRTL(language) ? 'rtl' : 'ltr'

  useEffect(() => {
    // Change i18n language
    i18n.changeLanguage(language)
    
    // Update document direction
    document.documentElement.dir = direction
    document.documentElement.lang = language
    
    // Update body direction for RTL support
    document.body.dir = direction
  }, [language, direction])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
    // Dispatch custom event for ThemeContext to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
  }

  return (
    <LanguageContext.Provider value={{ language, direction, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
