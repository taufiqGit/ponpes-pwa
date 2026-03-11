import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const token = body?.token
    const rememberMe = Boolean(body?.rememberMe)

    if (typeof token !== 'string' || token.length === 0) {
      return NextResponse.json({ message: 'Token tidak valid' }, { status: 400 })
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 })
  }
}
