import { createContext, useContext, useEffect, useReducer } from 'react'
import { loadLesson, saveLesson } from './persist.js'
import { initialState, reducer } from './reducer.js'

const LessonContext = createContext(null)

export function LessonProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadLesson() ?? initialState())
  useEffect(() => saveLesson(state), [state])
  return <LessonContext.Provider value={{ state, dispatch }}>{children}</LessonContext.Provider>
}

export function useLesson() {
  const context = useContext(LessonContext)
  if (!context) throw new Error('useLesson must be used inside LessonProvider')
  return context
}
