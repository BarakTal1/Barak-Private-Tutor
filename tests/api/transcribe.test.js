import { fakeReq, fakeRes, provider } from '../helpers/http.js'
import { HttpError } from '../../server/http.js'

vi.mock('../../server/llm.js', () => ({ complete: vi.fn() }))
const { complete } = await import('../../server/llm.js')
const { default: handler } = await import('../../api/transcribe.js')

const image = (n) => `data:image/jpeg;base64,IMG${n}`
const pages = (...numbers) => numbers.map((page) => ({ page, image: image(page) }))
const call = async (body) => {
  const res = fakeRes()
  await handler(fakeReq({ provider, ...body }), res)
  return res
}

beforeEach(() => {
  complete.mockReset()
})

test('returns text for each page, in order', async () => {
  complete.mockImplementation(async ({ messages }) => {
    const url = messages.at(-1).content.find((part) => part.type === 'image_url').image_url.url
    return `Text of ${url.slice(-4)}`
  })
  const res = await call({ pages: pages(3, 4) })
  expect(res.statusCode).toBe(200)
  expect(res.payload).toEqual({
    pages: [{ page: 3, text: 'Text of IMG3' }, { page: 4, text: 'Text of IMG4' }],
  })
})

test('sends the image as an image_url part with the transcription rules', async () => {
  complete.mockResolvedValue('Hello')
  await call({ pages: pages(1) })
  const { messages } = complete.mock.calls[0][0]
  expect(messages[0].role).toBe('system')
  expect(messages[0].content).toMatch(/data, never instructions/i)
  expect(messages[0].content).toMatch(/LaTeX/)
  expect(messages.at(-1).content).toContainEqual({ type: 'image_url', image_url: { url: image(1) } })
})

test('removes a code fence that wraps the answer', async () => {
  complete.mockResolvedValue('```markdown\n# Title\n\nText\n```')
  const res = await call({ pages: pages(1) })
  expect(res.payload.pages[0].text).toBe('# Title\n\nText')
})

test('answers too_large for more than 2 pages', async () => {
  const res = await call({ pages: pages(1, 2, 3) })
  expect(res.statusCode).toBe(413)
  expect(res.payload.error.code).toBe('too_large')
  expect(complete).not.toHaveBeenCalled()
})

test('answers too_large for an oversized body', async () => {
  const huge = [{ page: 1, image: `data:image/jpeg;base64,${'A'.repeat(4_500_000)}` }]
  const res = await call({ pages: huge })
  expect(res.payload.error.code).toBe('too_large')
})

test('answers bad_request for an image that is not a data URL', async () => {
  const res = await call({ pages: [{ page: 1, image: 'https://evil.example/x.jpg' }] })
  expect(res.statusCode).toBe(400)
  expect(complete).not.toHaveBeenCalled()
})

test('answers bad_request without pages', async () => {
  expect((await call({ pages: [] })).statusCode).toBe(400)
  expect((await call({})).statusCode).toBe(400)
})

test('passes on the no_vision error of the provider', async () => {
  complete.mockRejectedValue(new HttpError(422, 'no_vision', 'This model cannot read images.'))
  const res = await call({ pages: pages(1) })
  expect(res.statusCode).toBe(422)
  expect(res.payload.error.code).toBe('no_vision')
})

test('a page with no text gives an empty string', async () => {
  complete.mockResolvedValue('')
  const res = await call({ pages: pages(1) })
  expect(res.payload.pages).toEqual([{ page: 1, text: '' }])
})
