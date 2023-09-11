import { z } from "zod";

export const registerFormSchema = z.object({
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
  confirmPassword: z.string({
    required_error: 'confirmPassword is require',
    invalid_type_error: 'invalidate confirmPassword type'
  }).min(4, { message: 'confirmPassword must be at least 4 characters' }),
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
  email: z.string({
    required_error: 'email is require',
  }).email('invalidate email type'),
  password: z.string({
    required_error: 'password is require',
    invalid_type_error: 'invalidate password type'
  }).min(4, { message: 'password must be at least 4 characters' }),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>