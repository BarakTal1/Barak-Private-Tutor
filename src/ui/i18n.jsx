import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { en } from './en.js'
import { he } from './he.js'

export const LANGUAGES = ['he', 'en']
export const LANGUAGE_NAMES = { he: 'עברית', en: 'English' }

const STORAGE_KEY = 'tmtf.lang.v1'
const DICTIONARIES = { he, en }
const DIRECTIONS = { he: 'rtl', en: 'ltr' }

export const stringsFor = (language) => DICTIONARIES[language] ?? he

function saved() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.includes(value) ? value : null
  } catch {
    return null
  }
}

function fromBrowser() {
  const code = String(globalThis.navigator?.language ?? '').toLowerCase()
  // "iw" is the old code of Hebrew that some browsers still report.
  return code.startsWith('he') || code.startsWith('iw') ? 'he' : 'en'
}

// The language that the provider shows now. Code outside React (labels, messages) reads it here.
let current = null

// The saved choice, else the language of the browser.
export function getLanguage() {
  return current ?? saved() ?? fromBrowser()
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    current = saved() ?? fromBrowser()
    return current
  })

  const setLanguage = useCallback((next) => {
    if (!LANGUAGES.includes(next)) return
    current = next
    setLanguageState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be blocked. The choice then lasts until the page closes.
    }
  }, [])

  useEffect(() => {
    current = language
    document.documentElement.lang = language
    document.documentElement.dir = DIRECTIONS[language]
  }, [language])

  // After the provider is gone, getLanguage reads the saved choice again.
  useEffect(
    () => () => {
      current = null
    },
    [],
  )

  const value = useMemo(
    () => ({ language, setLanguage, dir: DIRECTIONS[language], strings: stringsFor(language) }),
    [language, setLanguage],
  )
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

function useContextValue() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('LanguageProvider is missing.')
  return value
}

export function useLanguage() {
  const { language, setLanguage, dir } = useContextValue()
  return { language, setLanguage, dir }
}

// The direction of the current language: 'rtl' or 'ltr'. It works without a provider, like useStrings.
export function useDirection() {
  return useContext(LanguageContext)?.dir ?? DIRECTIONS[getLanguage()]
}

// The dictionary of the current language. Components keep the local name `he` for it.
// Outside a provider (a small test of one component) it reads the language once, without updates.
export function useStrings() {
  return useContext(LanguageContext)?.strings ?? stringsFor(getLanguage())
}
