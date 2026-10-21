import { useSettings } from './ai/SettingsProvider.jsx'
import { useLesson } from './lesson/LessonProvider.jsx'
import SettingsPanel from './ui/SettingsPanel.jsx'
import SetupScreen from './ui/SetupScreen.jsx'

export default function App() {
  const { state } = useLesson()
  const { panelOpen, closePanel } = useSettings()
  return (
    <>
      {state.phase === 'setup' && <SetupScreen />}
      {panelOpen && <SettingsPanel onClose={closePanel} />}
    </>
  )
}
