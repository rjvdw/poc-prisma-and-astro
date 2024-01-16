import type { PrismaClient, Transaction } from '@prisma/client'

export type TransactionData = Omit<Transaction, 'id'>

export class TransactionService {
  readonly #prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma
  }

  list = async () =>
    this.#prisma.transaction.findMany({
      include: {
        account: true,
        category: true,
      },
      orderBy: [{ date: 'desc' }],
    })

  get = async (id: string) =>
    this.#prisma.transaction.findUnique({
      include: {
        account: true,
        category: true,
      },
      where: { id },
    })

  create = async (data: TransactionData) => this.#prisma.transaction.create({ data })

  update = async (id: string, data: TransactionData) =>
    this.#prisma.transaction.update({
      where: { id },
      data,
    })

  delete = async (id: string) =>
    this.#prisma.transaction.delete({
      where: { id },
    })
}
