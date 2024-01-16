const IBAN_REGEX = /(?<countryCode>[A-Z]{2})(?<checksum>[0-9]{2})(?<bankCode>[A-Z]{4})(?<accountNumber>\d+)/
const IBAN_MODULUS = 97

// TODO: Implement unit tests, using <https://www.iban.com/testibans>

export type IBAN = {
  readonly valid: boolean
  readonly original: string
  readonly formatted: string
}

export function parseIban(iban: string): IBAN {
  const original = iban.toUpperCase().replace(/\s+/g, '')
  const match = IBAN_REGEX.exec(original)
  let valid = false
  let formatted = iban

  if (match) {
    const countryCode = match.groups?.countryCode!
    const checksum = Number(match.groups?.checksum!)
    const bank = match.groups?.bankCode!
    const account = match.groups?.accountNumber!

    if (countryCode === 'NL') {
      let verification = 0
      verification = (verification + encode(bank)) % IBAN_MODULUS
      verification = (verification * 1e10 + Number(account)) % IBAN_MODULUS
      verification = (verification * 1e4 + encode(countryCode)) % IBAN_MODULUS
      verification = (verification * 1e2 + checksum) % IBAN_MODULUS

      valid = verification === 1
    } else {
      console.warn('validation for IBAN with country code %s not implemented', countryCode)
      valid = true
    }

    formatted = [countryCode, checksum.toString().padStart(2, '0'), bank, ...formatInGroups(account)].join(' ')
  }

  return {
    valid,
    original,
    formatted,
  }
}

export function formatIban(iban: string | IBAN): string {
  if (typeof iban === 'string') {
    return parseIban(iban).formatted
  }
  return iban.formatted
}

function encode(text: string): number {
  let encoded = 0
  for (const b of new TextEncoder().encode(text)) {
    encoded = 100 * encoded + b - 55
  }
  return encoded
}

function* formatInGroups(txt: string, groupSize = 4): Generator<string, void, void> {
  for (let i = 0; i < txt.length; i += groupSize) {
    yield txt.substring(i, i + groupSize)
  }
}
