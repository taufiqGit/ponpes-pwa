import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FormatTanggalOptions = Intl.DateTimeFormatOptions & {
  locale?: string
}

export function formatTanggal(
  value: Date | string | number | null | undefined,
  options: FormatTanggalOptions = {}
) {
  if (!value) return ''

  const { locale = 'id-ID', ...dateTimeFormatOptions } = options
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...dateTimeFormatOptions,
  }).format(date)
}
