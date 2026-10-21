import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApiClientError, requestPlan } from '../../src/ai/client.js'
import App from '../../src/App.jsx'
import { describeWarning } from '../../src/ui/messages.js'
import { fmt, he } from '../../src/ui/he.js'
import { ingest as baseIngest, plan } from '../helpers/lesson.js'
import { lessonRef, renderScreen } from '../helpers/render.jsx'

vi.mock('../../src/ai/client.js', async (importOriginal) => ({
  ...(await importOriginal()),
  requestPlan: vi.fn(),
}))

const mixed = {
  ...baseIngest,
  pages: [
    { page: 1, method: 'text' },
    { page: 2, method: 'vision' },
    { page: 3, method: 'skipped', note: 'vision_off' },
    { page: 4, method: 'failed', note: 'empty' },
  ],
  warnings: [
    { code: 'vision_off', params: { pages: [3] } },
    { code: 'pages_capped', params: { read: 4, total: 90 } },
  ],
}

function renderReport(ingest = mixed, teacherPrompt = 'Be Socratic') {
  renderScreen(<App />)
  act(() => lessonRef.current.dispatch({ type: 'ingested', ingest, teacherPrompt }))
}
const start = () => screen.getByRole('button', { name: new RegExp(he.report.start) })

beforeEach(() => {
  requestPlan.mockReset()
})

describe('the report', () => {
  test('shows the title and a summary with the file name and the number of pages', () => {
    renderReport()
    expect(screen.getByRole('heading', { name: he.report.title })).toBeInTheDocument()
    expect(screen.getByText('triangles.pdf').parentElement).toHaveTextContent(`triangles.pdf · ${fmt(he.report.pages, { count: 4 })}`)
    expect(screen.getByText('triangles.pdf').tagName).toBe('BDI')
  })

  test('shows one chip for each page with the right method', () => {
    renderReport()
    const list = screen.getByRole('list', { name: he.report.title })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(4)
    expect(items[0].textContent).toMatch(new RegExp(`${fmt(he.report.page, { number: 1 })}\\s*${he.report.chipText}`))
    expect(items[1]).toHaveTextContent(he.report.chipVision)
    expect(items[2]).toHaveTextContent(he.report.chipSkipped)
    expect(items[3]).toHaveTextContent(he.report.chipFailed)
  })

  test('shows every warning in Hebrew', () => {
    renderReport()
    for (const warning of mixed.warnings) expect(screen.getByText(describeWarning(warning))).toBeInTheDocument()
  })

  test('shows no warning block when there are no warnings', () => {
    renderReport({ ...mixed, warnings: [] })
    expect(screen.queryByRole('note')).not.toBeInTheDocument()
  })

  test('the preview shows a table and a heading as they look, not as Markdown signs', () => {
    const rich = { ...mixed, passages: [{ ...mixed.passages[0], text: '# כותרת\n\n| א | ב |\n| --- | --- |\n| 1 | 2 |' }] }
    renderReport(rich)
    const preview = screen.getByRole('region', { name: he.report.previewTitle })
    expect(within(preview).getByRole('table')).toBeInTheDocument()
    expect(preview.textContent).not.toContain('| ---')
  })

  test('the preview shows the start of the text with dir auto and is cut at 1500 characters', () => {
    const long = { ...mixed, passages: [{ ...mixed.passages[0], text: 'א'.repeat(2000) }] }
    renderReport(long)
    const preview = screen.getByRole('region', { name: he.report.previewTitle })
    expect(preview).toHaveAttribute('dir', 'auto')
    expect(preview.textContent.length).toBeLessThan(1600)
    expect(preview.textContent.endsWith('…')).toBe(true)
  })

  test('the preview of a short text has no ellipsis', () => {
    renderReport()
    expect(screen.getByRole('region', { name: he.report.previewTitle }).textContent).not.toContain('…')
  })

  test('shows the prompt of the teacher, or a line when there is none', () => {
    renderReport(mixed, 'Be Socratic')
    expect(screen.getByText('Be Socratic')).toBeInTheDocument()
  })

  test('shows a line when the teacher wrote no prompt', () => {
    renderReport(mixed, '')
    expect(screen.getByText(he.report.noPrompt)).toBeInTheDocument()
  })

  test('Back returns to the setup screen', async () => {
    renderReport()
    await userEvent.click(screen.getByRole('button', { name: he.report.back }))
    expect(lessonRef.current.state.phase).toBe('setup')
  })
})

describe('building the lesson plan', () => {
  test('Start lesson sends the settings, the prompt and the passages and then opens the lesson', async () => {
    requestPlan.mockResolvedValue(plan)
    renderReport()
    await userEvent.click(start())
    await waitFor(() => expect(lessonRef.current.state.phase).toBe('lesson'))
    expect(requestPlan.mock.calls[0][0]).toMatchObject({
      teacherPrompt: 'Be Socratic',
      passages: mixed.passages,
      settings: { key: 'test-key' },
    })
    expect(lessonRef.current.state.plan).toEqual(plan)
  })

  test('shows the planning state with Barak while the plan is built', async () => {
    requestPlan.mockReturnValue(new Promise(() => {}))
    renderReport()
    await userEvent.click(start())
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent(he.report.planning)
    expect(within(status).getByRole('img')).toHaveAttribute('data-tutor', 'think')
    expect(lessonRef.current.state.phase).toBe('report')
  })

  test('shows the waking message after 4 seconds of waiting', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    requestPlan.mockReturnValue(new Promise(() => {}))
    renderReport()
    await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).click(start())
    expect(screen.queryByText(he.report.planningSlow)).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(4000))
    expect(screen.getByText(he.report.planningSlow)).toBeInTheDocument()
    vi.useRealTimers()
  })

  test('a plan failure shows the banner with Retry and keeps the report', async () => {
    requestPlan.mockRejectedValueOnce(new ApiClientError('rate_limited', 'x')).mockResolvedValueOnce(plan)
    renderReport()
    await userEvent.click(start())
    expect(await screen.findByText(he.apiErrors.rate_limited.title)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: he.report.title })).toBeInTheDocument()
    expect(lessonRef.current.state.phase).toBe('report')
    await userEvent.click(screen.getByRole('button', { name: he.common.retry }))
    await waitFor(() => expect(lessonRef.current.state.phase).toBe('lesson'))
  })

  test('a wrong key offers the settings', async () => {
    requestPlan.mockRejectedValue(new ApiClientError('bad_key', 'x'))
    renderReport()
    await userEvent.click(start())
    await userEvent.click(await screen.findByRole('button', { name: he.common.toSettings }))
    expect(screen.getByRole('dialog', { name: he.settings.title })).toBeInTheDocument()
  })

  test('leaving the screen while the plan is built stops the request', async () => {
    let signal
    requestPlan.mockImplementation(({ signal: s }) => {
      signal = s
      return new Promise(() => {})
    })
    renderReport()
    await userEvent.click(start())
    expect(signal.aborted).toBe(false)
    act(() => lessonRef.current.dispatch({ type: 'reset' }))
    expect(signal.aborted).toBe(true)
  })
})
