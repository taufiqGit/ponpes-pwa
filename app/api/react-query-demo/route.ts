import { NextResponse } from 'next/server'

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json({
    message: 'Integrasi TanStack React Query aktif',
    timestamp: new Date().toISOString(),
    source: 'api/react-query-demo',
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const note = typeof body?.note === 'string' ? body.note : 'tanpa catatan'

  await new Promise((resolve) => setTimeout(resolve, 600))

  return NextResponse.json({
    ok: true,
    echoedNote: note,
    savedAt: new Date().toISOString(),
  })
}
