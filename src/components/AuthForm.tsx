import { LoginFormSchema, RegisterFormSchema, loginFormSchema, registerFormSchema } from '@/validate/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useMemo, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Button } from './Button'
import { Input } from './Input'
import { AuthSocialButton } from './AuthSocialButton'
import { BsGithub, BsGoogle, BsDiscord } from 'react-icons/bs';
import { RegisterSchema } from '@/pages/api/register'
import { toast } from 'react-toastify'
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/router'

interface AuthFormProps {
  variants: VARIANTS
  toggleVariants: () => void
}

export const AuthForm = ({ variants, toggleVariants }: AuthFormProps) => {
  const session = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const formSchemaTypeGuard = (value: LoginFormSchema | RegisterFormSchema): value is RegisterFormSchema => {
    return value.hasOwnProperty('confirmPassword')
  }
  const isRegister = useMemo(() => variants === 'Register', [variants])
  const { register, formState: { errors }, handleSubmit } = useForm<LoginFormSchema | RegisterFormSchema>({
    resolver: zodResolver(
      isRegister
        ? registerFormSchema
        : loginFormSchema
    ),
    mode: 'onChange'
  })

  const onSubmit = async (value: LoginFormSchema | RegisterFormSchema) => {
    try {
      setIsLoading(true)
      if (variants === 'Login') {
        const callBack = await signIn('credentials', {
          email: value.email,
          password: value.password,
          redirect: false
        })
        if (callBack?.error) {
          toast.error(callBack.error)
        }
        if (callBack?.ok) {
          toast.success('success login')
          router.push('/posts')
        }
      }
      if (formSchemaTypeGuard(value) && variants === 'Register') {
        const { message } = await axios.post<{ message: string }, AxiosResponse<{ message: string }>, RegisterSchema>('/api/register', {
          name: value.name,
          email: value.email,
          password: value.password,
        }).then(res => res.data)
        toast.success(message)

      }
    } catch (e) {
      if (e instanceof AxiosError) {
        const message = e.response?.data.message
        toast.error(message)
        return
      }
      console.log(e)
    } finally {
      setIsLoading(false)

    }
  }


  const socialAction = (type: 'discord' | 'google' | 'github') => {
    signIn('github', {
      redirect: false
    })
  }
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isRegister && (
            <Input
              disabled={isLoading}
              label='name'
              id='name'
              register={register}
              error={(errors as FieldErrors<RegisterFormSchema>).name}
            />
          )}
          <Input
            disabled={isLoading}
            label='email'
            id='email'
            register={register}
            error={errors.email}
          />
          <Input
            disabled={isLoading}
            label='password'
            id='password'
            register={register}
            error={errors.password}
          />
          {isRegister && (
            <Input

              disabled={isLoading}
              label='confirmPassword'
              id='confirmPassword'
              register={register}
              error={(errors as FieldErrors<RegisterFormSchema>).confirmPassword}
            />
          )}
          <Button

            disabled={isLoading}
            type='submit'
            fullWidth
          >submit</Button >
        </form>


        <div className="mt-6">
          <div className="relative">
            <div
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
            <AuthSocialButton
              icon={BsDiscord}
              onClick={() => socialAction('discord')}
            />
          </div>
        </div>
        <div
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>

            {variants === 'Login' ? 'New to Messenger?' : 'Already have an account?'}
          </div>
          <div
            onClick={toggleVariants}
            className="underline cursor-pointer"
          >
            {variants === 'Login' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

