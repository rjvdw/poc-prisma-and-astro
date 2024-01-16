export class GetResourceError extends Error {
  readonly #code: number

  constructor(message: string, code = 500) {
    super(message)
    this.#code = code
  }

  get code(): number {
    return this.#code
  }
}

export async function getResourceById<ID, T>(
  id: ID | undefined,
  get: (id: ID) => Promise<T | null>,
  isIdValid: (id: ID | undefined) => id is ID,
): Promise<T | GetResourceError> {
  if (!isIdValid(id)) {
    return new GetResourceError('invalid id', 400)
  }

  try {
    const data = await get(id)

    if (data === null) {
      return new GetResourceError('not found', 404)
    }

    return data
  } catch (err) {
    console.error(err)
    return new GetResourceError('unexpected error')
  }
}
