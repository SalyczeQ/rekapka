interface RetroEvent {
  id: string
  title: string
  date: string
  location: string | null
  status: string
  completed_at: string | null
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function formatIcsDate(dateStr: string): string {
  // Convert ISO date or date string to ICS format YYYYMMDD
  const d = new Date(dateStr)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function formatIcsDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const hours = String(d.getUTCHours()).padStart(2, '0')
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')
  const seconds = String(d.getUTCSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

export function generateIcs(
  teamName: string,
  retros: RetroEvent[]
): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rekapka//Retro Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(teamName)} Retros`,
  ]

  for (const retro of retros) {
    const dtStart = formatIcsDate(retro.date)
    // All-day event: DTEND is the next day
    const endDate = new Date(retro.date)
    endDate.setUTCDate(endDate.getUTCDate() + 1)
    const dtEnd = formatIcsDate(endDate.toISOString())

    const dtstamp = retro.completed_at
      ? formatIcsDateTime(retro.completed_at)
      : formatIcsDateTime(new Date().toISOString())

    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${retro.id}@rekapka`)
    lines.push(`DTSTAMP:${dtstamp}`)
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`)
    lines.push(`DTEND;VALUE=DATE:${dtEnd}`)
    lines.push(`SUMMARY:${escapeIcsText(retro.title)}`)
    lines.push(`STATUS:${retro.status === 'completed' ? 'COMPLETED' : 'TENTATIVE'}`)
    if (retro.location) {
      lines.push(`LOCATION:${escapeIcsText(retro.location)}`)
    }
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')

  return lines.join('\r\n')
}
