import { parseIban } from '$lib/iban'
import { Validator, ValidationError } from '$lib/validation'
import type { AccountData } from './AccountService'

export const AccountValidator = new Validator<AccountData>({
  description(value) {
    if (typeof value === 'string' && value) {
      return value
    } else {
      throw new ValidationError('description', 'cannot be empty')
    }
  },

  iban(value) {
    if (typeof value === 'string' && value) {
      const parsed = parseIban(value)
      if (!parsed.valid) {
        throw new ValidationError('iban', 'must be a valid iban')
      }
      return parsed.original
    } else {
      return ''
    }
  },

  currency(value) {
    if (typeof value === 'string' && value) {
      if (value.length !== 3) {
        throw new ValidationError('currency', 'must be a valid iso code')
      }
      return value.toUpperCase()
    } else {
      throw new ValidationError('currency', 'cannot be empty')
    }
  },

  active(value) {
    return value === '1'
  },
})
