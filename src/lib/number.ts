import { Decimal } from '@prisma/client/runtime/library'

export function parseDecimal(decimal: string): Decimal {
  let normalized = decimal.replace(/\s/g, '').replace(/,/g, '.')
  const match = normalized.match(/^(.*)\.([0-9]{1,2})$/)
  if (match) {
    normalized = match[1]!.replace(/\./g, '') + '.' + match[2]!
  } else {
    normalized = normalized.replace(/\./g, '')
  }

  return new Decimal(normalized)
}
