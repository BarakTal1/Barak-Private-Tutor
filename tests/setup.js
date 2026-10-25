import '@testing-library/jest-dom/vitest'

// The tests read Hebrew text. A browser in Hebrew starts the app in Hebrew.
Object.defineProperty(navigator, 'language', { value: 'he-IL', configurable: true })
