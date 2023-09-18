import { PrismaClient } from '@prisma/client'
import { beforeEach, vi } from 'vitest'
import { mockDeep } from 'vitest-mock-extended'
vi.mock('../db')
beforeEach(() => {
  vi.resetAllMocks()
})

export const prismaMock = mockDeep<PrismaClient>()