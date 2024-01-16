import type { Account, PrismaClient } from '@prisma/client'

export type AccountData = Omit<Account, 'id'>

export class AccountService {
  readonly #prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma
  }

  list = async () =>
    this.#prisma.account.findMany({
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: [{ active: 'desc' }, { description: 'asc' }],
    })

  get = async (id: string) =>
    this.#prisma.account.findUnique({
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      where: { id },
    })

  create = async (data: AccountData) => this.#prisma.account.create({ data })

  update = async (id: string, data: AccountData) =>
    this.#prisma.account.update({
      where: { id },
      data,
    })

  delete = async (id: string) =>
    this.#prisma.account.delete({
      where: { id },
    })
}
