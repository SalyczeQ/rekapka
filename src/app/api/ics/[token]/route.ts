import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/types'
import { generateIcs } from '@/lib/ics/generate-ics'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token || token.length < 10) {
      return Response.json({ error: 'Invalid token' }, { status: 400 })
    }

    // Use service-level client without cookies since ICS feeds are unauthenticated
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
      }
    )

    // Look up team by ics_token
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('ics_token', token)
      .single()

    if (teamError || !team) {
      return new Response('Calendar not found', { status: 404 })
    }

    // Get all retros for this team
    const { data: retros, error: retrosError } = await supabase
      .from('retros')
      .select('id, title, date, location, status, completed_at')
      .eq('team_id', team.id)
      .order('date', { ascending: false })

    if (retrosError) {
      return new Response('Failed to fetch retros', { status: 500 })
    }

    const icsContent = generateIcs(team.name, retros ?? [])

    return new Response(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${team.name}-retros.ics"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch {
    return new Response('Internal server error', { status: 500 })
  }
}
