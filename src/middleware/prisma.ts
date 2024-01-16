import { PrismaClient } from '@prisma/client'
import { defineMiddleware } from 'astro:middleware'

const prisma = new PrismaClient()

export const onRequest = defineMiddleware(async ({ locals }, next) => {
  locals.prisma = prisma
  return next()
})
