import { LoginFormSchema, RegisterFormSchema, loginFormSchema, registerFormSchema } from '@/validate/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useMemo, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { Button } from './Button'
import { Input } from './Input'
import { AuthSocialButton } from './AuthSocialButton'
import { BsGithub, BsGoogle, BsDiscord } from 'react-icons/bs';
interface AuthFormProps {
  variants: VARIANTS
  toggleVariants: () => void
}
export const AuthForm = ({ variants, toggleVariants }: AuthFormProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isRegister = useMemo(() => variants === 'Register', [variants])
  const { register, formState: { errors }, handleSubmit } = useForm<LoginFormSchema | RegisterFormSchema>({
    resolver: zodResolver(
      isRegister
        ? registerFormSchema
        : loginFormSchema
    ),
    mode: 'onChange'
  })
  const onSubmit = (value: LoginFormSchema) => {
    console.log(value)
  }


  const socialAction = (type: 'discord' | 'google' | 'github') => {
    console.log(type)
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

