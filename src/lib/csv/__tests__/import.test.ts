import { describe, it, expect } from 'vitest'
import { parseCsvImport } from '../import'

describe('parseCsvImport', () => {
  it('parses basic CSV', () => {
    const csv = `category,text,tags
Good,Great teamwork,frontend
Bad,Slow deploys,devops`
    const result = parseCsvImport(csv)
    expect(result).toEqual([
      { category: 'Good', text: 'Great teamwork', tags: ['frontend'] },
      { category: 'Bad', text: 'Slow deploys', tags: ['devops'] },
    ])
  })

  it('handles multiple tags', () => {
    const csv = `category,text,tags
Good,Nice,"tag1,tag2,tag3"`
    const result = parseCsvImport(csv)
    expect(result[0].tags).toEqual(['tag1', 'tag2', 'tag3'])
  })

  it('handles missing tags column', () => {
    const csv = `category,text
Good,Nice work`
    const result = parseCsvImport(csv)
    expect(result).toEqual([{ category: 'Good', text: 'Nice work', tags: [] }])
  })

  it('handles quoted fields with commas', () => {
    const csv = `category,text,tags
Good,"Work was great, really",`
    const result = parseCsvImport(csv)
    expect(result[0].text).toBe('Work was great, really')
  })

  it('handles escaped quotes', () => {
    const csv = `category,text,tags
Good,"He said ""hello""",`
    const result = parseCsvImport(csv)
    expect(result[0].text).toBe('He said "hello"')
  })

  it('returns empty for header-only CSV', () => {
    expect(parseCsvImport('category,text,tags')).toEqual([])
  })

  it('returns empty for empty string', () => {
    expect(parseCsvImport('')).toEqual([])
  })

  it('returns empty when required columns missing', () => {
    const csv = `name,description
foo,bar`
    expect(parseCsvImport(csv)).toEqual([])
  })

  it('handles Windows line endings', () => {
    const csv = "category,text,tags\r\nGood,Nice,\r\n"
    const result = parseCsvImport(csv)
    expect(result.length).toBe(1)
    expect(result[0].category).toBe('Good')
  })

  it('handles case-insensitive headers', () => {
    const csv = `Category,TEXT,Tags
Good,Nice,tag1`
    const result = parseCsvImport(csv)
    expect(result[0]).toEqual({ category: 'Good', text: 'Nice', tags: ['tag1'] })
  })
})
