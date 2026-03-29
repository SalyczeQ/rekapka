import { describe, it, expect } from 'vitest'
import { getAuthorColor, colorFromUserId, AUTHOR_COLORS } from '../colors'

describe('getAuthorColor', () => {
  it('returns colors for valid indices', () => {
    expect(getAuthorColor(0)).toBe(AUTHOR_COLORS[0])
    expect(getAuthorColor(5)).toBe(AUTHOR_COLORS[5])
  })

  it('wraps around the palette', () => {
    expect(getAuthorColor(10)).toBe(AUTHOR_COLORS[0])
    expect(getAuthorColor(11)).toBe(AUTHOR_COLORS[1])
    expect(getAuthorColor(25)).toBe(AUTHOR_COLORS[5])
  })
})

describe('colorFromUserId', () => {
  it('returns a color from the palette', () => {
    const color = colorFromUserId('user-123')
    expect(AUTHOR_COLORS).toContain(color)
  })

  it('returns the same color for the same ID', () => {
    const a = colorFromUserId('abc-def')
    const b = colorFromUserId('abc-def')
    expect(a).toBe(b)
  })

  it('handles different user IDs', () => {
    const colorA = colorFromUserId('user-aaa')
    const colorB = colorFromUserId('user-zzz')
    // They could collide, but both must be valid palette colors
    expect(AUTHOR_COLORS).toContain(colorA)
    expect(AUTHOR_COLORS).toContain(colorB)
  })

  it('handles empty string', () => {
    const color = colorFromUserId('')
    expect(AUTHOR_COLORS).toContain(color)
  })
})
