import { AccountService } from '$domain/account/AccountService'
import { CategoryService } from '$domain/category/CategoryService'
import { PrismaClient } from '@prisma/client'
import { defineMiddleware } from 'astro:middleware'

const prisma = new PrismaClient()

export const onRequest = defineMiddleware(async ({ locals }, next) => {
  locals.prisma = prisma
  locals.accountService = new AccountService(prisma)
  locals.categoryService = new CategoryService(prisma)
  return next()
})
