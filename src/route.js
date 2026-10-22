// Each screen of the app has its own address, so the browser back button and a reload work.
export const PHASE_PATHS = { setup: '/', report: '/report', lesson: '/lesson', done: '/complete' }

export const pathOf = (phase) => PHASE_PATHS[phase] ?? '/'

export function phaseOf(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/'
  return Object.keys(PHASE_PATHS).find((phase) => PHASE_PATHS[phase] === clean) ?? 'setup'
}
