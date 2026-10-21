import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadSettings, saveSettings } from './settings.js'

const SettingsContext = createContext(null)

// Holds the provider, the model and the API key, and whether the settings panel is open.
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)
  const [panelOpen, setPanelOpen] = useState(false)
  const openPanel = useCallback(() => setPanelOpen(true), [])
  const closePanel = useCallback(() => setPanelOpen(false), [])
  useEffect(() => saveSettings(settings), [settings])
  const value = useMemo(
    () => ({ settings, update: setSettings, panelOpen, openPanel, closePanel }),
    [settings, panelOpen, openPanel, closePanel],
  )
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used inside SettingsProvider')
  return context
}
