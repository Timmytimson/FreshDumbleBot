import assert from 'node:assert/strict'
import {test} from 'node:test'
import {getMatchingCategories, getRandomQuote, isBlocked} from './bot.ts'

test('matches categories case-insensitively', () => {
  assert.deepEqual(getMatchingCategories('Wo ist mein HÖRGERÄT?'), ['hoergeraet'])
  assert.deepEqual(getMatchingCategories('Hi Dumbledore'), ['freshdumbledore'])
})

test('word boundaries avoid false positives', () => {
  assert.deepEqual(getMatchingCategories('Das Alter ist eine Zahl, Postbote'), ['alt'])
  assert.deepEqual(getMatchingCategories('nichts relevantes'), [])
})

test('multiple categories', () => {
  const cats = getMatchingCategories('Meine Oma ist alt')
  assert.ok(cats.includes('oma') && cats.includes('alt'))
})

test('random quote comes from the category', () => {
  assert.equal(getRandomQuote(['snape'], () => 0)?.startsWith('Snape, du dreckige'), true)
  assert.equal(getRandomQuote([]), undefined)
})

test('blocked users', () => {
  assert.equal(isBlocked('B0tRank'), true)
  assert.equal(isBlocked('someone'), false)
})
