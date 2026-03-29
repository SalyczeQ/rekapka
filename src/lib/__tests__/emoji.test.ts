import { describe, it, expect } from 'vitest'
import { replaceEmojiShortcodes, getEmojiSuggestions } from '../emoji'

describe('replaceEmojiShortcodes', () => {
  it('replaces known shortcodes', () => {
    expect(replaceEmojiShortcodes(':fire:')).toBe('\u{1F525}')
    expect(replaceEmojiShortcodes(':rocket:')).toBe('\u{1F680}')
  })

  it('replaces multiple shortcodes in text', () => {
    const result = replaceEmojiShortcodes('Great :fire: work :star:!')
    expect(result).toBe('Great \u{1F525} work \u{2B50}!')
  })

  it('leaves unknown shortcodes unchanged', () => {
    expect(replaceEmojiShortcodes(':unknown_code:')).toBe(':unknown_code:')
  })

  it('leaves text without shortcodes unchanged', () => {
    expect(replaceEmojiShortcodes('no emoji here')).toBe('no emoji here')
  })

  it('handles empty string', () => {
    expect(replaceEmojiShortcodes('')).toBe('')
  })

  it('handles adjacent shortcodes', () => {
    const result = replaceEmojiShortcodes(':heart::star:')
    expect(result).toBe('\u{2764}\u{FE0F}\u{2B50}')
  })
})

describe('getEmojiSuggestions', () => {
  it('returns matching suggestions', () => {
    const results = getEmojiSuggestions('fire')
    expect(results).toEqual([{ code: 'fire', emoji: '\u{1F525}' }])
  })

  it('returns partial matches', () => {
    const results = getEmojiSuggestions('thu')
    const codes = results.map((r) => r.code)
    expect(codes).toContain('thumbsup')
    expect(codes).toContain('thumbsdown')
  })

  it('limits results to 8', () => {
    const results = getEmojiSuggestions('')
    expect(results.length).toBeLessThanOrEqual(8)
  })

  it('returns empty for no matches', () => {
    expect(getEmojiSuggestions('zzzzzzz')).toEqual([])
  })

  it('is case insensitive', () => {
    const results = getEmojiSuggestions('FIRE')
    expect(results).toEqual([{ code: 'fire', emoji: '\u{1F525}' }])
  })
})
