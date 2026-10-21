// A tiny fake model server that speaks the OpenAI chat format. It lets you try the whole app
// without an API key: node scripts/fake-provider.mjs, then use http://localhost:4010/v1 as the
// server address in the settings (any key and any model name work).
import http from 'node:http'

const PORT = Number(process.env.PORT ?? 4010)
const CHUNK_DELAY_MS = 40

const readBody = (req) =>
  new Promise((resolve) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')))
  })

function planFor(userText) {
  const ids = [...userText.matchAll(/^\[(p\d+)\] /gm)].map((match) => match[1])
  const titles = ['מה זה משולש', 'הצלע הארוכה ביותר', 'משפט פיתגורס']
  return {
    title: 'שיעור לדוגמה',
    language: 'עברית',
    audience: 'כיתה ז׳',
    estimatedMinutes: 6,
    steps: titles.map((title, index) => ({
      id: `s${index + 1}`,
      title,
      goal: `להבין: ${title}`,
      passageIds: ids.length ? [ids[index % ids.length]] : [],
      checkQuestion: `מה היית אומר על "${title}"?`,
      keyPoints: [`הנקודה המרכזית של "${title}"`],
    })),
  }
}

function tutorReply(system, last) {
  const control = (verdict, advance) => `\n<<STATE {"verdict":"${verdict}","advance":${advance}}>>`
  if (/Begin this step now/.test(last)) {
    return `שלום! נתחיל בצעד הבא. **נקודה חשובה:** כל משולש יש לו שלוש צלעות. הנוסחה היא $a^2+b^2=c^2$.\n\nמה אתם חושבים על זה?${control('partial', false)}`
  }
  if (/pressed the Hint button/.test(last)) {
    return `רמז: חשבו על מה שקראנו בקובץ, ונסו לנסח במילים שלכם.${control('partial', false)}`
  }
  if (/אל תשכחו|נכון|כן/.test(last)) return `בדיוק כך! עברנו לשלב הבא.${control('correct', true)}`
  if (/The student has tried several times/.test(system)) {
    return `בואו נבין את זה ביחד: התשובה היא בקטע שקראנו. נמשיך הלאה.${control('wrong', true)}`
  }
  return `כמעט! נסו שוב, והסתכלו על המקור.${control('wrong', false)}`
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST' || !req.url.endsWith('/chat/completions')) {
    res.writeHead(404).end()
    return
  }
  const body = await readBody(req)
  const [system, ...rest] = body.messages
  const last = rest.at(-1)
  const lastText = typeof last.content === 'string' ? last.content : ''
  const hasImage = Array.isArray(last.content)
  const answer = hasImage
    ? 'טקסט שנקרא מתוך התמונה. זהו עמוד סרוק לדוגמה.'
    : /lesson designer/.test(system.content)
      ? JSON.stringify(planFor(lastText.concat(rest.map((m) => m.content).join('\n'))))
      : tutorReply(system.content, lastText)

  if (!body.stream) {
    res.setHeader('Content-Type', 'application/json').end(JSON.stringify({ choices: [{ message: { content: answer } }] }))
    return
  }
  res.writeHead(200, { 'Content-Type': 'text/event-stream' })
  const pieces = answer.match(/[\s\S]{1,6}/g)
  for (const piece of pieces) {
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: piece } }] })}\n\n`)
    await new Promise((resolve) => setTimeout(resolve, CHUNK_DELAY_MS))
  }
  res.end('data: [DONE]\n\n')
})

server.listen(PORT, () => console.log(`Fake model server on http://localhost:${PORT}/v1`))
