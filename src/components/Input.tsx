import React, { ComponentProps, HTMLInputTypeAttribute, useState } from 'react'
import { FieldError, FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import clsx from "clsx";
interface InputProps<TForm extends FieldValues> extends ComponentProps<'input'> {
  label: string,
  id: Path<TForm>,
  register: UseFormRegister<TForm>,
  error: FieldError | undefined,
  type?: HTMLInputTypeAttribute
  require?: boolean
  disabled?: boolean
}
export const Input = <TForm extends FieldValues>({
  register,
  id,
  label,
  error,
  disabled,
  require,
  type = 'text',
  ...rest }: InputProps<TForm>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  return (
    <div>
      <label
        htmlFor={id}
        className="
          text-sm 
          font-medium 
          leading-6 
          text-gray-900
          flex
          items-center        
        "
      >
        {label}
        {require && <span className='text-red-500'>*</span>}
      </label>
      <div className="mt-2 relative">
        <input
          type={setInputType(type, showPassword)}
          className={clsx(
            `
            form-input
            block 
            w-full 
            rounded-md 
            border-0 
            py-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            sm:text-sm 
            sm:leading-6`,
            disabled && 'opacity-50 cursor-default',
            error?.message ? ' focus:ring-rose-500' : 'focus:ring-sky-500',
          )}
          {...register(id)}
          {...rest}
        />
        {error && <p className='text-red-500'>{error.message}</p>}
        {type === 'password' && (
          <PasswordToggler
            showPassword={showPassword}
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
          />
        )}
      </div>
    </div>
  )
}

const setInputType = (
  type: HTMLInputTypeAttribute,
  showPassword: boolean
) => {
  if (type !== 'password') return type
  return showPassword ? 'text' : 'password'
}

interface PasswordTogglerProps {
  showPassword: boolean,
  onMouseDown: () => void
  onMouseUp: () => void
}
const PasswordToggler = ({ showPassword, onMouseDown, onMouseUp }: PasswordTogglerProps) => {
  return (
    <div className='absolute top-0 right-0 translate-y-[50%] pr-2' onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      {showPassword ? (
        <AiFillEye className='text-gray-500 hover:text-gray-600 cursor-pointer ' />
      ) : (
        <AiFillEyeInvisible className='text-gray-500 hover:text-gray-600 cursor-pointer ' />
      )}
    </div>
  )
}