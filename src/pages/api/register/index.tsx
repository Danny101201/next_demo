
import { prisma } from '@/server/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ZodError, z } from 'zod'
import bcrypt from 'bcrypt'
const registerSchema = z.object({
  name: z.string({
    required_error: 'name is require',
    invalid_type_error: 'invalidate name type'
  }).min(1, 'name must be provider'),
  email: z.string({
    required_error: 'email is require',
  }).email('invalidate email type'),
  password: z.string({
    required_error: 'password is require',
    invalid_type_error: 'invalidate password type'
  }).min(4, { message: 'password must be at least 4 characters' }),
})
export type RegisterSchema = z.infer<typeof registerSchema>
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

    if (req.method === 'POST') {

      const {
        email,
        name,
        password
      } = registerSchema.parse(req.body)
      const duplicateUser = await prisma.user.findFirst({
        where: {
          email
        }
      })
      if (duplicateUser) return res.status(400).json({ message: 'email have been register' })

      const hashedPassword = await bcrypt.hash(password, 12)
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword
        }
      })
      return res.status(201).json({ message: 'success register' })
    }
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e)
      const { message } = e.errors[0]
      return res.status(400).json({ message })
    }
    return res.status(500).json({ message: 'server error' })
  }
}
