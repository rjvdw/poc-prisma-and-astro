import { ValidationError } from '$lib/validation/ValidationError'

export type UserInput<T> = Partial<Record<keyof T, string | null>>

export type ValidationResult<T> =
  | { success: true; userInput: UserInput<T>; parsed: T }
  | { success: false; userInput: UserInput<T>; errors: ValidationError[] }

export type Parsers<T> = {
  [key in keyof T]: (value: string | null | undefined) => T[key]
}

export class Validator<T> {
  readonly #parsers: Parsers<T>

  constructor(parsers: Parsers<T>) {
    this.#parsers = parsers
  }

  parse(formData: FormData): ValidationResult<T> {
    const userInput: UserInput<T> = {}
    const parsed: Partial<T> = {}
    const validationErrors: ValidationError[] = []

    for (const field in this.#parsers) {
      try {
        const parser = this.#parsers[field]
        userInput[field] = formData.get(field) as string // TODO: Handle FormDataEntryValue instead of string
        parsed[field] = parser?.(userInput[field])
      } catch (err) {
        if (err instanceof ValidationError) {
          validationErrors.push(err)
        } else {
          throw err
        }
      }
    }

    if (validationErrors.length === 0) {
      return {
        success: true,
        userInput: userInput,
        parsed: parsed as T,
      }
    } else {
      return {
        success: false,
        userInput: userInput,
        errors: validationErrors,
      }
    }
  }
}
