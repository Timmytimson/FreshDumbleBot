import quotes from '../../assets/quotes.json' with {type: 'json'}
import triggers from '../../assets/triggers.json' with {type: 'json'}

const BLOCKED_USERS = new Set(['GoodBot_BadBot', 'B0tRank'])

const compiled: [string, RegExp[]][] = Object.entries(
  triggers as Record<string, string[]>,
).map(([category, patterns]) => [
  category,
  patterns.map(p => new RegExp(p, 'i')),
])

export function isBlocked(username: string): boolean {
  return BLOCKED_USERS.has(username)
}

export function getMatchingCategories(text: string): string[] {
  return compiled
    .filter(([, regexes]) => regexes.some(r => r.test(text)))
    .map(([category]) => category)
}

export function getRandomQuote(
  categories: string[],
  random: () => number = Math.random,
): string | undefined {
  const pool = categories.flatMap(
    cat => (quotes as Record<string, string[]>)[cat] ?? [],
  )
  return pool[Math.floor(random() * pool.length)]
}

const allQuotes = new Set(
  Object.values(quotes as Record<string, string[]>).flat(),
)

export function isOwnQuote(text: string): boolean {
  return allQuotes.has(text.trim())
}
