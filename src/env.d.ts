/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    prisma: readonly import('@prisma/client').PrismaClient
    accountService: readonly import('$domain/account/AccountService').AccountService
    categoryService: readonly import('$domain/category/CategoryService').CategoryService
  }
}
