import { useCallback, useEffect, useRef } from 'react'
import { streamTurn } from '../ai/client.js'
import { useSettings } from '../ai/SettingsProvider.jsx'
import { useLesson } from '../lesson/LessonProvider.jsx'
import { reducer } from '../lesson/reducer.js'
import { currentStep, turnInput } from '../lesson/selectors.js'

// Runs the turns of the tutor: it sends one request, streams the answer into the lesson state
// and tells the state how the turn ended. The attempt of a student is counted when the student
// sends it (in the reducer), so Retry and Continue ask again without counting a second attempt.
// A turn is not stopped when the screen unmounts: React strict mode mounts a screen twice in
// development, and that would stop the first turn. The screen calls stop() when it really leaves.
export function useTutor() {
  const { state, dispatch } = useLesson()
  const { settings } = useSettings()
  const latest = useRef({ state, settings })
  const request = useRef(null)
  useEffect(() => {
    latest.current = { state, settings }
  })

  // `snapshot` is the lesson state that the request is built from.
  const turn = useCallback(
    async (snapshot, studentText, kind) => {
      const controller = new AbortController()
      request.current = controller
      dispatch({ type: 'tutorStarted', stepId: currentStep(snapshot).id })
      try {
        const control = await streamTurn({
          settings: latest.current.settings,
          payload: turnInput(snapshot, studentText, kind),
          signal: controller.signal,
          onText: (text) => dispatch({ type: 'tutorDelta', text }),
        })
        dispatch(controller.signal.aborted ? { type: 'tutorStopped' } : { type: 'tutorFinished', control })
      } catch (err) {
        dispatch({ type: 'failed', error: { code: err.code ?? 'provider_error', message: err.message } })
      }
    },
    [dispatch],
  )

  // Asks again for the last thing the student did (an answer or a hint), or begins the step.
  const rerun = useCallback(
    (snapshot) => {
      const last = snapshot.messages.at(-1)
      if (last?.role !== 'student') return turn(snapshot, null, 'answer')
      return last.kind === 'hint' ? turn(snapshot, null, 'hint') : turn(snapshot, last.text, 'answer')
    },
    [turn],
  )

  return {
    begin: useCallback(() => turn(latest.current.state, null, 'answer'), [turn]),
    send: useCallback(
      (text) => {
        // One turn at a time: a second stream would write into the first one and replace its Stop.
        if (latest.current.state.streaming) return undefined
        const action = { type: 'studentSent', text }
        const after = reducer(latest.current.state, action)
        dispatch(action)
        return turn(after, text, 'answer')
      },
      [dispatch, turn],
    ),
    hint: useCallback(() => {
      const action = { type: 'hintRequested' }
      const after = reducer(latest.current.state, action)
      if (after === latest.current.state) return undefined
      dispatch(action)
      return turn(after, null, 'hint')
    }, [dispatch, turn]),
    retry: useCallback(() => rerun(latest.current.state), [rerun]),
    resume: useCallback(() => {
      const after = reducer(latest.current.state, { type: 'stoppedDiscarded' })
      dispatch({ type: 'stoppedDiscarded' })
      return rerun(after)
    }, [dispatch, rerun]),
    stop: useCallback(() => request.current?.abort(), []),
  }
}
