import { validate as validateUuid } from 'uuid'

/**
 * Check if a value is a valid UUID.
 */
export function isValidUuid(uuid: string | undefined | null): uuid is string {
  return uuid !== undefined && uuid !== null && validateUuid(uuid)
}
