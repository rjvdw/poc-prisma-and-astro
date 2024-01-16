import { ValidationError } from '$lib/validation/ValidationError'

export type UserInput<T> = Partial<Record<keyof T, string | null>>

export type ValidationResult<T> =
  | { success: true; userInput: UserInput<T>; parsed: T }
  | { success: false; userInput: UserInput<T>; errors: ValidationError[] }

export type Parsers<T, C> = {
  [key in keyof T]: (value: string | null | undefined, config: C) => T[key]
}

export type After<T, C> = (
  params: {
    userInput: UserInput<T>
    parsed: Partial<T>
    validationErrors: ValidationError[]
  },
  config: C,
) => void

export class Validator<T, C = void> {
  readonly #parsers: Parsers<T, C>
  readonly #after: After<T, C> | undefined

  /**
   * @param parsers Methods to parse the input per form field. Should throw a ValidationError if parsing fails.
   * @param after Postprocessing of the user input, parsed results and validation errors.
   */
  constructor(parsers: Parsers<T, C>, after?: After<T, C>) {
    this.#parsers = parsers
    this.#after = after
  }

  parse(formData: FormData, parseConfig: C): ValidationResult<T> {
    const userInput: UserInput<T> = {}
    const parsed: Partial<T> = {}
    const validationErrors: ValidationError[] = []

    for (const field in this.#parsers) {
      try {
        const parser = this.#parsers[field]
        userInput[field] = formData.get(field) as string // TODO: Handle FormDataEntryValue instead of string
        parsed[field] = parser?.(userInput[field], parseConfig)
      } catch (err) {
        if (err instanceof ValidationError) {
          validationErrors.push(err)
        } else {
          throw err
        }
      }
    }

    this.#after?.({ userInput, parsed, validationErrors }, parseConfig)

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
