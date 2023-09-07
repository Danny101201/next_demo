import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(1, 'name must be provider'),
  email: z.string().email(),
  password: z.string().min(4),
  confirmPassword: z.string().min(4),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'password not match',
      path: ['confirmPassword']
    })
  }
})

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>