import { LOCALE } from 'src/locale'

export function formatCurrency(bedrag: number, valuta?: string): string {
  if (valuta) {
    return bedrag.toLocaleString(LOCALE, {
      style: 'currency',
      currency: valuta,
    })
  } else {
    return bedrag.toLocaleString(LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
}
