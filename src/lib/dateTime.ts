import { LOCALE } from 'src/locale'

export function formatDate(date: Date, style?: Intl.DateTimeFormatOptions['dateStyle']): string {
  return date.toLocaleDateString(LOCALE, {
    dateStyle: style,
  })
}
