import { Metadata } from 'next'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { LoginForm } from '@/components/login-form'
import { RedirectIfAuthed } from '@/components/auth-guard'

export const metadata: Metadata = {
  title: 'Login - Santri App',
  description: 'Masuk ke portal Santri App untuk memantau perkembangan putra/putri Anda.',
}

export default function LoginPage() {
  return (
    <RedirectIfAuthed>
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Logo */}
        <div className="p-4 flex items-center justify-center border-b bg-white">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Santri App Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold text-gray-900">An-Nashriyyah</span>
          </div>
        </div>

        {/* Banner Image */}
        <div className="relative h-48 w-full bg-green-100">
          <Image
            src="/hero-section.png"
            alt="Pesantren Building"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-medium text-gray-700">
              Pantau Perkembangan Putra/Putri Anda
            </h2>
          </div>

          {/* "Tabs" look-alike header */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-green-600">
                Email / Phone
              </div>
            </div>
          </div>
          
          {/* Login Form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Santri App. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </div>
    </RedirectIfAuthed>
  )
}
