import { Prisma } from '@prisma/client'

export function isFailedUniqueConstraint(
  err: unknown,
  fields: string | string[],
): err is Prisma.PrismaClientKnownRequestError {
  if (!Array.isArray(fields)) {
    fields = [fields]
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      if (Array.isArray(err.meta?.target) && fields.length === err.meta.target.length) {
        const target = err.meta.target.toSorted()
        return fields.toSorted().every((v, i) => v === target[i])
      }
    }
  }

  return false
}
