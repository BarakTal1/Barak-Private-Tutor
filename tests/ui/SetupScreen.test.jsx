import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { checkFile, ingestFile } from '../../src/ingest/index.js'
import { ParseError } from '../../src/ingest/errors.js'
import { transcribePages } from '../../src/ai/client.js'
import { MAX_FILE_BYTES } from '../../shared/limits.js'
import App from '../../src/App.jsx'
import { fmt, he } from '../../src/ui/he.js'
import { en } from '../../src/ui/en.js'
import { ingest } from '../helpers/lesson.js'
import { lessonRef, renderScreen } from '../helpers/render.jsx'

vi.mock('../../src/ingest/index.js', async (importOriginal) => ({
  ...(await importOriginal()),
  ingestFile: vi.fn(),
}))
vi.mock('../../src/ai/client.js', async (importOriginal) => ({
  ...(await importOriginal()),
  transcribePages: vi.fn(),
}))

const pdf = () => new File(['%PDF'], 'lesson.pdf', { type: 'application/pdf' })
const continueButton = () => screen.getByRole('button', { name: he.setup.next })
const input = () => document.querySelector('input[type="file"]')
const choose = (file) => userEvent.upload(input(), file)

beforeEach(() => {
  ingestFile.mockReset()
  transcribePages.mockReset()
})

describe('the file step', () => {
  test('Continue is disabled with no file and says why', () => {
    renderScreen(<App />)
    expect(continueButton()).toBeDisabled()
    expect(screen.getByText(he.setup.reasonNoFile)).toBeInTheDocument()
  })

  test('shows the title, the tagline and the size limit', () => {
    renderScreen(<App />)
    expect(screen.getByRole('heading', { level: 1, name: he.appName })).toBeInTheDocument()
    expect(screen.getByText(he.setup.tagline)).toBeInTheDocument()
    expect(screen.getByText(fmt(he.setup.dropHint, { size: MAX_FILE_BYTES / 1024 / 1024 }))).toBeInTheDocument()
  })

  test('a chosen file shows its name and a way to remove it', async () => {
    renderScreen(<App />)
    await choose(pdf())
    expect(screen.getByText('lesson.pdf')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: he.setup.removeFile }))
    expect(screen.queryByText('lesson.pdf')).not.toBeInTheDocument()
    expect(continueButton()).toBeDisabled()
  })

  test('dropping an .mp3 shows the not supported message and keeps Continue off', async () => {
    renderScreen(<App />)
    await choose(new File(['x'], 'song.mp3', { type: 'audio/mpeg' }))
    expect(screen.getByText(he.fileErrors.unsupported.media.title)).toBeInTheDocument()
    expect(screen.getByText(he.fileErrors.unsupported.media.body)).toBeInTheDocument()
    expect(continueButton()).toBeDisabled()
  })

  test('a file over the size limit shows the limit message', async () => {
    renderScreen(<App />)
    const big = pdf()
    Object.defineProperty(big, 'size', { value: MAX_FILE_BYTES + 1 })
    await choose(big)
    expect(screen.getByText(he.fileErrors.too_large.title)).toBeInTheDocument()
    expect(continueButton()).toBeDisabled()
  })

  test('the drop zone label points at the file input, so a click opens the picker', () => {
    renderScreen(<App />)
    const label = document.querySelector('[data-dropzone] label')
    expect(label).toHaveAttribute('for', input().id)
    expect(input().id).not.toBe('')
  })

  test('the drop zone shows the drag-over state and takes a dropped file', () => {
    renderScreen(<App />)
    const zone = document.querySelector('[data-dropzone]')
    fireEvent.dragOver(zone, { dataTransfer: { files: [] } })
    expect(screen.getByText(he.setup.dropOver)).toBeInTheDocument()
    fireEvent.dragLeave(zone)
    expect(screen.queryByText(he.setup.dropOver)).not.toBeInTheDocument()
    fireEvent.drop(zone, { dataTransfer: { files: [pdf()] } })
    expect(screen.getByText('lesson.pdf')).toBeInTheDocument()
  })

  test('the file is checked as soon as it is chosen, without reading it', async () => {
    renderScreen(<App />)
    await choose(pdf())
    expect(ingestFile).not.toHaveBeenCalled()
    expect(checkFile(pdf())).toEqual({ tier: 'pdf', kind: 'pdf' })
  })
})

describe('the prompt step', () => {
  test('an empty prompt is allowed', async () => {
    renderScreen(<App />)
    await choose(pdf())
    expect(continueButton()).toBeEnabled()
  })

  test('"try an example" fills the prompt', async () => {
    renderScreen(<App />)
    await userEvent.click(screen.getByRole('button', { name: he.setup.tryExample }))
    expect(screen.getByLabelText(he.setup.promptLabel)).toHaveValue(he.setup.promptExample)
  })

  test('the prompt direction follows the text', () => {
    renderScreen(<App />)
    expect(screen.getByLabelText(he.setup.promptLabel)).toHaveAttribute('dir', 'auto')
  })
})

describe('the API key', () => {
  test('Continue is disabled with no key and says "Add your API key"', async () => {
    renderScreen(<App />, { key: '' })
    await choose(pdf())
    expect(continueButton()).toBeDisabled()
    expect(screen.getByText(he.setup.reasonNoKey, { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByText(he.setup.noKeyTitle)).toBeInTheDocument()
  })

  test('the empty state opens the settings', async () => {
    renderScreen(<App />, { key: '' })
    await userEvent.click(screen.getByRole('button', { name: he.setup.openSettings }))
    expect(screen.getByRole('dialog', { name: he.settings.title })).toBeInTheDocument()
  })

  test('the key field is a password input and its value is not shown in the page text', async () => {
    renderScreen(<App />, { key: 'top-secret-key' })
    await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
    const field = screen.getByLabelText(he.settings.key)
    expect(field).toHaveAttribute('type', 'password')
    expect(document.body.textContent).not.toContain('top-secret-key')
  })
})

describe('reading the file', () => {
  test('passes the provider and a transcribe function and then goes to the report', async () => {
    ingestFile.mockResolvedValue(ingest)
    transcribePages.mockResolvedValue([{ page: 1, text: 'Hello' }])
    renderScreen(<App />)
    await choose(pdf())
    await userEvent.type(screen.getByLabelText(he.setup.promptLabel), 'Be kind')
    await userEvent.click(continueButton())
    await waitFor(() => expect(lessonRef.current.state.phase).toBe('report'))
    expect(lessonRef.current.state).toMatchObject({ teacherPrompt: 'Be kind', fileName: ingest.fileName })
    const [file, deps] = ingestFile.mock.calls[0]
    expect(file.name).toBe('lesson.pdf')
    expect(deps.provider).toMatchObject({ model: expect.any(String), vision: expect.any(Boolean) })
    await deps.transcribe([{ page: 1, image: 'data:image/jpeg;base64,AA' }])
    expect(transcribePages.mock.calls[0][0]).toMatchObject({ pages: [{ page: 1, image: 'data:image/jpeg;base64,AA' }] })
  })

  test('shows a spinner and the page counter while the file is read', async () => {
    let report
    ingestFile.mockImplementation((file, { onProgress }) => {
      report = onProgress
      return new Promise(() => {})
    })
    renderScreen(<App />)
    await choose(pdf())
    await userEvent.click(continueButton())
    expect(screen.getByRole('status')).toBeInTheDocument()
    act(() => report({ stage: 'reading', done: 2, total: 5 }))
    expect(screen.getByText(fmt(he.setup.readingPages, { done: 2, total: 5 }))).toBeInTheDocument()
    act(() => report({ stage: 'vision', done: 1, total: 3 }))
    expect(screen.getByText(fmt(he.setup.readingVision, { done: 1, total: 3 }))).toBeInTheDocument()
    expect(continueButton()).toBeDisabled()
  })

  test('an ingest error shows the banner with the fix text and keeps the file', async () => {
    ingestFile.mockRejectedValue(new ParseError('nothing_readable', 'x', { visionOff: true }))
    renderScreen(<App />)
    await choose(pdf())
    await userEvent.click(continueButton())
    expect(await screen.findByText(he.fileErrors.nothing_readable.title)).toBeInTheDocument()
    expect(screen.getByText(he.fileErrors.nothing_readable.bodyVisionOff)).toBeInTheDocument()
    expect(screen.getByText('lesson.pdf')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: he.common.toSettings }))
    expect(screen.getByRole('dialog', { name: he.settings.title })).toBeInTheDocument()
  })

  test('a server error while reading shows its text and Retry reads again', async () => {
    const { ApiClientError } = await import('../../src/ai/client.js')
    ingestFile.mockRejectedValueOnce(new ApiClientError('rate_limited', 'x')).mockResolvedValueOnce(ingest)
    renderScreen(<App />)
    await choose(pdf())
    await userEvent.click(continueButton())
    expect(await screen.findByText(he.apiErrors.rate_limited.title)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: he.common.retry }))
    await waitFor(() => expect(lessonRef.current.state.phase).toBe('report'))
  })
})

describe('the settings panel', () => {
  test('opens from the settings button and closes with Escape', async () => {
    renderScreen(<App />)
    await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
    expect(screen.getByRole('dialog', { name: he.settings.title })).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('the panel is attached to the end side of the page', async () => {
    renderScreen(<App />)
    await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
    expect(screen.getByRole('dialog').className).toMatch(/\bend-0\b/)
  })

  test('choosing a provider fills its address and model', async () => {
    renderScreen(<App />)
    await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
    await userEvent.click(screen.getByRole('button', { name: 'Groq' }))
    expect(screen.getByLabelText(he.settings.baseUrl)).toHaveValue('https://api.groq.com/openai/v1')
    expect(screen.getByLabelText(he.settings.model)).toHaveValue('llama-3.3-70b-versatile')
  })

  test('the vision switch and the key are saved for the next visit', async () => {
    renderScreen(<App />, { key: '' })
    await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
    await userEvent.type(screen.getByLabelText(he.settings.key), 'abc-123')
    await userEvent.click(screen.getByRole('switch', { name: new RegExp(he.settings.vision) }))
    const raw = sessionStorage.getItem('tmtf.key.v1')
    expect(raw).toBe('abc-123')
    expect(JSON.parse(localStorage.getItem('tmtf.settings.v1')).provider.vision).toBe(false)
  })

  test('the show button reveals the key', async () => {
    renderScreen(<App />)
    await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
    await userEvent.click(screen.getByRole('button', { name: he.settings.showKey }))
    expect(screen.getByLabelText(he.settings.key)).toHaveAttribute('type', 'text')
  })

  test('a custom provider can be typed in', async () => {
    renderScreen(<App />)
    await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
    await userEvent.click(screen.getByRole('button', { name: he.settings.custom }))
    await userEvent.type(screen.getByLabelText(he.settings.baseUrl), 'https://api.example.com/v1')
    await userEvent.type(screen.getByLabelText(he.settings.model), 'my-model')
    expect(JSON.parse(localStorage.getItem('tmtf.settings.v1')).provider).toMatchObject({
      baseUrl: 'https://api.example.com/v1',
      model: 'my-model',
    })
  })

  test('Continue says to choose a model when the model is empty', async () => {
    renderScreen(<App />)
    await userEvent.click(screen.getByRole('button', { name: he.setup.settings }))
    await userEvent.click(screen.getByRole('button', { name: he.settings.custom }))
    await userEvent.click(screen.getByRole('button', { name: he.common.save }))
    await choose(pdf())
    expect(screen.getByText(he.setup.reasonNoModel)).toBeInTheDocument()
  })
})

describe('language', () => {
  test('the setup screen is in English when the saved language is English', () => {
    localStorage.setItem('tmtf.lang.v1', 'en')
    renderScreen(<App />, { reset: false })
    expect(screen.getByText(en.setup.fileStep)).toBeInTheDocument()
    expect(screen.queryByText(he.setup.fileStep)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: en.setup.next })).toBeInTheDocument()
  })

  test('the setup screen is in Hebrew by default in the tests', () => {
    renderScreen(<App />)
    expect(screen.getByText(he.setup.fileStep)).toBeInTheDocument()
  })
})
