import { useEffect, useRef } from 'react'
import { useSettings } from './ai/SettingsProvider.jsx'
import { useLesson } from './lesson/LessonProvider.jsx'
import { pathOf, phaseOf } from './route.js'
import CompleteScreen from './ui/CompleteScreen.jsx'
import LessonScreen from './ui/LessonScreen.jsx'
import ReportScreen from './ui/ReportScreen.jsx'
import SettingsPanel from './ui/SettingsPanel.jsx'
import SetupScreen from './ui/SetupScreen.jsx'

// Keeps the address bar and the screen in step. The screen decides the address. The browser
// back and forward buttons ask the lesson to move to the screen of the new address, if it can.
function useRoute() {
  const { state, dispatch } = useLesson()
  const first = useRef(true)
  useEffect(() => {
    const path = pathOf(state.phase)
    if (window.location.pathname === path) {
      first.current = false
      return
    }
    // The first address is replaced, so a reload on a screen without data does not leave a dead entry.
    window.history[first.current ? 'replaceState' : 'pushState'](null, '', path)
    first.current = false
  }, [state.phase])
  useEffect(() => {
    const onPop = () => dispatch({ type: 'navigate', phase: phaseOf(window.location.pathname) })
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [dispatch])
}

export default function App() {
  const { state } = useLesson()
  const { panelOpen, closePanel } = useSettings()
  useRoute()
  return (
    <>
      {state.phase === 'setup' && <SetupScreen />}
      {state.phase === 'report' && <ReportScreen />}
      {state.phase === 'lesson' && <LessonScreen />}
      {state.phase === 'done' && <CompleteScreen />}
      {panelOpen && <SettingsPanel onClose={closePanel} />}
    </>
  )
}
