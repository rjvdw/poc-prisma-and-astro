import { AccountService } from '$domain/account/AccountService'
import { CategoryService } from '$domain/category/CategoryService'
import { TransactionService } from '$domain/transaction/TransactionService'
import { PrismaClient } from '@prisma/client'
import { defineMiddleware } from 'astro:middleware'

const prisma = new PrismaClient()

export const onRequest = defineMiddleware(async ({ locals }, next) => {
  locals.prisma = prisma
  locals.accountService = new AccountService(prisma)
  locals.categoryService = new CategoryService(prisma)
  locals.transactionService = new TransactionService(prisma)
  return next()
})
