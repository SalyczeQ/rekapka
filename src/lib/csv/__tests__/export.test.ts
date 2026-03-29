import { describe, it, expect } from 'vitest'
import { generateCsv } from '../export'

describe('generateCsv', () => {
  it('generates CSV with headers', () => {
    const csv = generateCsv([])
    expect(csv).toBe('Category,Text,Author,Votes,Tags,Discussed,Group')
  })

  it('generates rows from cards', () => {
    const csv = generateCsv([
      {
        category: 'Good',
        text: 'Nice work',
        author: 'Alice',
        votes: 3,
        tags: 'frontend',
        discussed: true,
        group_label: 'Team',
      },
    ])
    const lines = csv.split('\n')
    expect(lines).toHaveLength(2)
    expect(lines[1]).toBe('Good,Nice work,Alice,3,frontend,Yes,Team')
  })

  it('escapes commas in fields', () => {
    const csv = generateCsv([
      {
        category: 'Good',
        text: 'Work was great, really',
        author: 'Bob',
        votes: 0,
        tags: '',
        discussed: false,
        group_label: '',
      },
    ])
    expect(csv).toContain('"Work was great, really"')
  })

  it('escapes double quotes in fields', () => {
    const csv = generateCsv([
      {
        category: 'Good',
        text: 'He said "hello"',
        author: 'Bob',
        votes: 0,
        tags: '',
        discussed: false,
        group_label: '',
      },
    ])
    expect(csv).toContain('"He said ""hello"""')
  })

  it('escapes newlines in fields', () => {
    const csv = generateCsv([
      {
        category: 'Good',
        text: 'Line1\nLine2',
        author: 'Bob',
        votes: 0,
        tags: '',
        discussed: false,
        group_label: '',
      },
    ])
    expect(csv).toContain('"Line1\nLine2"')
  })

  it('formats discussed as Yes/No', () => {
    const csv = generateCsv([
      { category: 'A', text: 'T', author: 'X', votes: 0, tags: '', discussed: true, group_label: '' },
      { category: 'B', text: 'T', author: 'X', votes: 0, tags: '', discussed: false, group_label: '' },
    ])
    const lines = csv.split('\n')
    expect(lines[1]).toContain(',Yes,')
    expect(lines[2]).toContain(',No,')
  })
})
