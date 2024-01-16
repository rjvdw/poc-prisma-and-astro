import { Validator, ValidationError } from '$lib/validation'
import type { CategoryData } from './CategoryService'

export const CategoryValidator = new Validator<CategoryData>({
  description(value) {
    if (typeof value === 'string' && value) {
      return value
    } else {
      throw new ValidationError('description', 'cannot be empty')
    }
  },
})
