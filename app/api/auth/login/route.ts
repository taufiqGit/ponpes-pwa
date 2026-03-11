import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple mock validation
    // Allow login if password is "password123" and identifier is valid
    if (password === 'password123') {
      const token = 'mock-jwt-token-xyz-123'
      const res = NextResponse.json({
        success: true,
        user: {
          id: '1',
          name: 'Santri User',
          email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
          role: 'student',
        },
        token,
      });
      res.cookies.set('auth_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      return res;
    }

    return NextResponse.json(
      { success: false, message: 'Identitas atau password salah.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
