import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// In-memory user store (survives restarts on same instance, good for MVP)
// To persist across deployments, swap this for a real DB or Vercel KV
const users = new Map()

export async function POST(req) {
  try {
    const { action, email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const emailKey = email.toLowerCase().trim()

    if (action === 'register') {
      if (users.has(emailKey)) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      const hashed = await bcrypt.hash(password, 12)
      const user   = {
        id:        `user_${Date.now()}`,
        name:      name || email.split('@')[0],
        email:     emailKey,
        role:      'customer',
        createdAt: new Date().toISOString(),
      }
      users.set(emailKey, { ...user, password: hashed })
      return NextResponse.json({ user })
    }

    // action === 'login'
    const stored = users.get(emailKey)
    if (!stored) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 401 })
    }
    const match = await bcrypt.compare(password, stored.password)
    if (!match) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }
    const { password: _, ...user } = stored
    return NextResponse.json({ user })

  } catch (err) {
    console.error('Auth users error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
