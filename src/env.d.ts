/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    prisma: readonly import('@prisma/client').PrismaClient
  }
}
