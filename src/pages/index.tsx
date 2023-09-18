import { AuthForm } from '@/components/AuthForm'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { authOptions } from './api/auth/[...nextauth]'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function AuthPage() {
  const [variants, setVariants] = useState<VARIANTS>('Login')
  // const [variants, setVariants, removeValue] = useLocalStorage<VARIANTS>({ key: 'Login_key', initialValue: 'Register' })
  console.log(variants)
  const toggleVariants = () => {
    if (variants === 'Login') setVariants('Register')
    if (variants === 'Register') setVariants('Login')
  }
  return (
    <div className='min-h-full flex justify-center flex-col bg-gray-100 py-12 sm:py-6 lg:px-8 h-screen'>
      <div className='sm:mx-auto sm:w-full sm: max-w-md '>
        <Image
          alt='Logo'
          src={'/image/logo.png'}
          width={'48'}
          height={'48'}
          className='mx-auto'
          style={{ aspectRatio: 1 }}
        />
        <h2
          className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'
        >
          {variants == 'Login'
            ? 'sign in to your account'
            : 'register account'
          }

        </h2>
      </div>
      <AuthForm variants={variants} toggleVariants={toggleVariants} />
    </div>
  )
}

export default AuthPage
