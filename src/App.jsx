import { useSettings } from './ai/SettingsProvider.jsx'
import { useLesson } from './lesson/LessonProvider.jsx'
import CompleteScreen from './ui/CompleteScreen.jsx'
import LessonScreen from './ui/LessonScreen.jsx'
import ReportScreen from './ui/ReportScreen.jsx'
import SettingsPanel from './ui/SettingsPanel.jsx'
import SetupScreen from './ui/SetupScreen.jsx'

export default function App() {
  const { state } = useLesson()
  const { panelOpen, closePanel } = useSettings()
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
