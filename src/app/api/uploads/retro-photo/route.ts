import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { requireRetroTeamMember } from '@/lib/auth/session'

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'])

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const retroId = formData.get('retroId') as string | null

  if (!file || !retroId) {
    return Response.json({ error: 'File and retroId are required' }, { status: 400 })
  }

  const member = await requireRetroTeamMember(retroId)
  if (member.error) {
    const status = member.error === 'Not authenticated' ? 401 : 403
    console.error('[upload] auth failed:', member.error, 'retroId:', retroId)
    return Response.json({ error: member.error }, { status })
  }

  if (!file.type.startsWith('image/')) {
    return Response.json({ error: 'Only image files are allowed' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: 'File must be under 5MB' }, { status: 400 })
  }

  const ext = (file.name.split('.').pop() ?? '').toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return Response.json({ error: 'Unsupported image format' }, { status: 400 })
  }

  const filename = `${retroId}-photo.${ext}`
  const dir = join(process.cwd(), 'public', 'uploads', 'retros')

  await mkdir(dir, { recursive: true })

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(join(dir, filename), buffer)
  } catch (err) {
    console.error('[upload] write failed:', err)
    return Response.json({ error: 'Failed to save file' }, { status: 500 })
  }

  const publicUrl = `/uploads/retros/${filename}`

  return Response.json({ url: publicUrl })
}
