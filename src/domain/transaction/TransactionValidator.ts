import { parseIban } from '$lib/iban'
import { parseDecimal } from '$lib/number'
import { Validator, ValidationError } from '$lib/validation'
import type { Account, Category } from '@prisma/client'
import type { TransactionData } from './TransactionService'

export type TransactionValidationConfig = {
  accounts: Account[]
  categories: Category[]
}

export const TransactionValidator = new Validator<TransactionData, TransactionValidationConfig>(
  {
    accountId(value, { accounts }) {
      if (typeof value === 'string' && value) {
        for (const account of accounts) {
          if (account.id === value) {
            return value
          }
        }
        throw new ValidationError('account', 'must exist')
      } else {
        throw new ValidationError('account', 'cannot be empty')
      }
    },

    counterparty(value) {
      if (typeof value === 'string' && value) {
        return value
      } else {
        throw new ValidationError('counterparty', 'cannot be empty')
      }
    },

    counterpartyIban(value) {
      if (typeof value === 'string' && value) {
        const parsed = parseIban(value)
        if (!parsed.valid) {
          throw new ValidationError('counterparty iban', 'must be a valid iban')
        }
        return parsed.original
      } else {
        return ''
      }
    },

    amount(value) {
      if (typeof value === 'string' && value) {
        return parseDecimal(value)
      } else {
        throw new ValidationError('amount', 'cannot be empty')
      }
    },

    originalCurrency(value) {
      if (typeof value === 'string' && value) {
        if (value.length !== 3) {
          throw new ValidationError('original currency', 'must be a valid iso code')
        }
        return value.toUpperCase()
      } else {
        return null
      }
    },

    originalAmount(value) {
      if (typeof value === 'string' && value) {
        return parseDecimal(value)
      } else {
        return null
      }
    },

    date(value) {
      if (typeof value === 'string' && value) {
        return new Date(Date.parse(value))
      } else {
        throw new ValidationError('date', 'cannot be empty')
      }
    },

    description(value) {
      if (typeof value === 'string' && value) {
        return value
      } else {
        return null
      }
    },

    categoryId(value, { categories }) {
      if (typeof value === 'string' && value) {
        for (const category of categories) {
          if (category.id === value) {
            return value
          }
        }
        throw new ValidationError('category', 'must exist')
      } else {
        return null
      }
    },
  },
  ({ parsed, validationErrors }) => {
    if (parsed.originalCurrency && !parsed.originalAmount) {
      validationErrors.push(new ValidationError('original amount', 'cannot be empty if original currency is specified'))
    }

    if (parsed.originalAmount && !parsed.originalCurrency) {
      validationErrors.push(new ValidationError('original currency', 'cannot be empty if original amount is specified'))
    }
  },
)
