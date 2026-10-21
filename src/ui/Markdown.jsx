import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'

// Every block gets dir="auto", so a Hebrew line and a French line in one message each read the right way.
const block = (Tag, className) =>
  function Block({ node, ...props }) {
    return <Tag dir="auto" className={className} {...props} />
  }

const cell = 'border border-line px-3 py-2 text-start align-top'

const components = {
  p: block('p', 'my-2 leading-relaxed first:mt-0 last:mb-0'),
  h1: block('h3', 'mt-4 mb-2 text-xl font-bold'),
  h2: block('h4', 'mt-4 mb-2 text-lg font-bold'),
  h3: block('h5', 'mt-3 mb-1 font-bold'),
  ul: block('ul', 'my-2 list-disc ps-6'),
  ol: block('ol', 'my-2 list-decimal ps-6'),
  li: block('li', 'my-1'),
  blockquote: block('blockquote', 'my-2 border-s-4 border-line-strong ps-4 text-ink2'),
  th: block('th', `${cell} bg-surf2 font-semibold`),
  td: block('td', cell),
  table: ({ node, ...props }) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  pre: ({ node, ...props }) => <pre dir="ltr" className="my-3 overflow-x-auto rounded-ctl bg-surf2 p-3 text-sm" {...props} />,
  // A model cannot send the student to another site or load a picture from one.
  a: ({ children }) => <span>{children}</span>,
  img: () => null,
}

const REMARK = [remarkGfm, remarkMath]
const REHYPE = [[rehypeKatex, { throwOnError: false }]]

export default function Markdown({ text }) {
  if (!text) return null
  return (
    <ReactMarkdown remarkPlugins={REMARK} rehypePlugins={REHYPE} components={components} skipHtml>
      {text}
    </ReactMarkdown>
  )
}
