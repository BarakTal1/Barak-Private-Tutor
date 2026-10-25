import { act, render, screen } from '@testing-library/react'
import { he } from '../../src/ui/he.js'
import { en } from '../../src/ui/en.js'
import { LanguageProvider, getLanguage, stringsFor, useLanguage, useStrings } from '../../src/ui/i18n.jsx'

const KEY = 'tmtf.lang.v1'

function setBrowserLanguage(value) {
  Object.defineProperty(navigator, 'language', { value, configurable: true })
}

beforeEach(() => {
  localStorage.clear()
  setBrowserLanguage('he-IL')
})

afterEach(() => {
  vi.restoreAllMocks()
  setBrowserLanguage('he-IL')
})

describe('getLanguage', () => {
  test.each(['he', 'he-IL', 'HE', 'iw'])('a browser in %s starts in Hebrew', (value) => {
    setBrowserLanguage(value)
    expect(getLanguage()).toBe('he')
  })

  test.each(['en-US', 'fr'])('a browser in %s starts in English', (value) => {
    setBrowserLanguage(value)
    expect(getLanguage()).toBe('en')
  })

  test('a saved choice beats the browser language', () => {
    localStorage.setItem(KEY, 'en')
    expect(getLanguage()).toBe('en')
  })

  test('a saved value that is not a language is ignored', () => {
    localStorage.setItem(KEY, 'fr')
    expect(getLanguage()).toBe('he')
  })

  test('blocked storage still gives a language', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(getLanguage()).toBe('he')
  })
})

test('stringsFor gives the dictionary of the language', () => {
  expect(stringsFor('he')).toBe(he)
  expect(stringsFor('en')).toBe(en)
})

function Probe() {
  const { language, setLanguage, dir } = useLanguage()
  const strings = useStrings()
  return (
    <>
      <p data-testid="state">{`${language}/${dir}`}</p>
      <p data-testid="title">{strings.appName}</p>
      <button onClick={() => setLanguage('en')}>to-en</button>
      <button onClick={() => setLanguage('he')}>to-he</button>
    </>
  )
}

test('useStrings works without a provider and gives the dictionary of the saved language', () => {
  localStorage.setItem(KEY, 'en')
  render(<Probe2 />)
  expect(screen.getByTestId('bare')).toHaveTextContent(en.appName)
})

function Probe2() {
  return <p data-testid="bare">{useStrings().appName}</p>
}

describe('LanguageProvider', () => {
  test('sets lang and dir on the document at the start', () => {
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(document.documentElement.lang).toBe('he')
    expect(document.documentElement.dir).toBe('rtl')
  })

  test('setLanguage changes the strings, the document and the saved choice', async () => {
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('title')).toHaveTextContent(he.appName)
    await act(async () => screen.getByText('to-en').click())
    expect(screen.getByTestId('title')).toHaveTextContent(en.appName)
    expect(screen.getByTestId('state')).toHaveTextContent('en/ltr')
    expect(document.documentElement.lang).toBe('en')
    expect(document.documentElement.dir).toBe('ltr')
    expect(localStorage.getItem(KEY)).toBe('en')
  })

  test('setLanguage works when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    await act(async () => screen.getByText('to-en').click())
    expect(screen.getByTestId('state')).toHaveTextContent('en/ltr')
  })

  test('code outside React sees the current language', async () => {
    render(<LanguageProvider><Probe /></LanguageProvider>)
    await act(async () => screen.getByText('to-en').click())
    expect(getLanguage()).toBe('en')
  })

  test('after the provider is removed, getLanguage reads the saved choice again', async () => {
    const view = render(<LanguageProvider><Probe /></LanguageProvider>)
    await act(async () => screen.getByText('to-en').click())
    view.unmount()
    localStorage.setItem(KEY, 'he')
    expect(getLanguage()).toBe('he')
  })
})
