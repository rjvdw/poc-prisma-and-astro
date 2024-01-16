export class ValidationError extends Error {
  readonly #field: string | null
  readonly #validationError: string

  constructor(validationError: string | Error)
  constructor(field: string, validationError: string | Error)
  constructor(arg1: string | Error, arg2?: string | Error) {
    if (arg1 instanceof Error) {
      super(arg1.message, { cause: arg1 })
      this.#field = null
      this.#validationError = arg1.message
    } else if (arg2 === undefined) {
      super(arg1)
      this.#field = null
      this.#validationError = arg1
    } else {
      const field = arg1 as string
      if (arg2 instanceof Error) {
        super(`${field} ${arg2.message}`, { cause: arg2 })
        this.#field = field
        this.#validationError = arg2.message
      } else {
        super(`${field} ${arg2}`)
        this.#field = field
        this.#validationError = arg2
      }
    }
  }

  get field(): string | null {
    return this.#field
  }

  get validationError(): string {
    return this.#validationError
  }

  static ofCaught(err: unknown): ValidationError
  static ofCaught(field: string, err: unknown): ValidationError
  static ofCaught(arg1: string | unknown, arg2?: unknown): ValidationError {
    let field: string | null
    let err: unknown
    if (arg2 === undefined) {
      field = null
      err = arg1
    } else {
      field = arg1 as string
      err = arg2
    }

    const validationError: string | Error = err instanceof Error ? err : String(err)

    return field === null ? new ValidationError(validationError) : new ValidationError(field, validationError)
  }
}

export function isValidationError(obj: unknown): obj is ValidationError {
  return obj instanceof ValidationError
}

export function isValidationErrors(obj: unknown): obj is ValidationError[] {
  return Array.isArray(obj) && obj.every(isValidationError)
}
