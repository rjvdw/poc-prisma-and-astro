import type { Category, PrismaClient } from '@prisma/client'

export type CategoryData = Omit<Category, 'id'>

export class CategoryService {
  readonly #prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma
  }

  list = async () =>
    this.#prisma.category.findMany({
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: [{ description: 'asc' }],
    })

  get = async (id: string) =>
    this.#prisma.category.findUnique({
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      where: { id },
    })

  create = async (data: CategoryData) => this.#prisma.category.create({ data })

  update = async (id: string, data: CategoryData) =>
    this.#prisma.category.update({
      where: { id },
      data,
    })

  delete = async (id: string) =>
    this.#prisma.category.delete({
      where: { id },
    })
}
