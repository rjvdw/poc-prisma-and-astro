import { sequence } from 'astro:middleware'
import { onRequest as prisma } from './prisma'

export const onRequest = sequence(prisma)
