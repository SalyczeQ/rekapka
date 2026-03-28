'use server'

import { signIn } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function signUpAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!name || !email || !password || password.length < 6) {
    return { error: 'Name, email, and password (min 6 chars) are required.' }
  }

  // Check if user already exists
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (existing) {
    return { error: 'An account with this email already exists.' }
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await db.insert(users).values({
    email,
    name,
    passwordHash,
  })

  // Auto sign-in after registration
  await signIn('credentials', {
    email,
    password,
    redirectTo: '/app',
  })
}

export async function signInAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/app'

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo,
    })
  } catch (error: unknown) {
    // Auth.js throws a NEXT_REDIRECT on success — rethrow it
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    // Check for the redirect digest that Next.js uses
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as Record<string, unknown>).digest === 'string' &&
      ((error as Record<string, unknown>).digest as string).startsWith('NEXT_REDIRECT')
    ) {
      throw error
    }
    return { error: 'Invalid email or password.' }
  }
}

export async function signInWithGoogleAction() {
  await signIn('google', { redirectTo: '/app' })
}

export async function signOutAction() {
  const { signOut } = await import('@/lib/auth')
  await signOut({ redirectTo: '/login' })
}
