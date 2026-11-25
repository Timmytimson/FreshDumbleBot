import {once} from 'node:events'
import type {IncomingMessage, ServerResponse} from 'node:http'
import {context, reddit} from '@devvit/web/server'
import type {TriggerResponse} from '@devvit/web/shared'
import {
  getMatchingCategories,
  getRandomQuote,
  isBlocked,
  isOwnQuote,
} from './bot.ts'

type CommentEvent = {
  comment?: {id: string; body: string; author: string}
  author?: {name: string}
}

export async function onReq(
  reqMsg: IncomingMessage,
  rspMsg: ServerResponse,
): Promise<void> {
  let status = 200
  let body: object = {}
  try {
    if (reqMsg.method === 'POST' && reqMsg.url === '/internal/on/comment/create') {
      body = await onCommentCreate(await readJson<CommentEvent>(reqMsg))
    } else {
      status = 404
      body = {error: 'not found', status}
    }
  } catch (err) {
    status = 500
    const error = `server error; ${err instanceof Error ? err.stack : err}`
    console.error(error)
    body = {error, status}
  }
  const json = JSON.stringify(body)
  rspMsg.writeHead(status, {
    'Content-Length': Buffer.byteLength(json),
    'Content-Type': 'application/json',
  })
  rspMsg.end(json)
}

async function onCommentCreate(event: CommentEvent): Promise<TriggerResponse> {
  const comment = event.comment
  if (!comment) return {}

  const author = event.author?.name ?? comment.author
  if (!author || author === '[deleted]' || isBlocked(author)) return {}
  const self = [context.appName, await reddit.getCurrentUsername()]
  console.log(`comment by ${author}; self=${JSON.stringify(self)}`)
  if (self.some(n => n?.toLowerCase() === author.toLowerCase())) return {}
  if (isOwnQuote(comment.body)) return {}

  const categories = getMatchingCategories(comment.body)
  const quote = getRandomQuote(categories)
  if (!quote) return {}

  await reddit.submitComment({id: comment.id as `t1_${string}`, text: quote})
  return {}
}

async function readJson<T>(reqMsg: IncomingMessage): Promise<T> {
  const chunks: Uint8Array[] = []
  reqMsg.on('data', chunk => chunks.push(chunk))
  await once(reqMsg, 'end')
  return JSON.parse(`${Buffer.concat(chunks)}`)
}
