import { fmt } from '../ui/he.js'
import { getLanguage, stringsFor } from '../ui/i18n.jsx'

// Labels of the places in a file. The Source panel shows them. They follow the language of the app
// at the moment that the file is read, and they are not changed after that.
const labels = () => stringsFor(getLanguage()).labels

export const pageLabel = (number) => fmt(labels().page, { n: number })
export const slideLabel = (number) => fmt(labels().slide, { n: number })
export const sheetLabel = (name) => fmt(labels().sheet, { name })
export const chapterLabel = (number) => fmt(labels().chapter, { n: number })
