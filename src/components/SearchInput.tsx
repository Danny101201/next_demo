import React, { ComponentProps, useMemo, useRef } from 'react'
import { DebounceInput } from './DebounceInput'
import { AiFillCloseCircle } from 'react-icons/ai'

interface SearchInputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  onChange: (value: string) => void,
  value: string
}
export const SearchInput = ({ onChange, value, ...rest }: SearchInputProps) => {
  const inputRef = useRef<InputRefImperativeHandleProps | null>(null)
  const handleClearInput = () => {
    inputRef.current?.clearInputValue()
  }
  const hasInputValue = useMemo(() => !['', undefined, null].includes(value), [value])
  return (
    <div className="flex items-center justify-between gap-[1rem] rounded-[0.4rem] border border-gray-300 bg-white p-1 px-[1rem] shadow-sm">
      <div className="flex-1">
        <DebounceInput
          ref={inputRef}
          onChange={onChange}
          type="text"
          value={value}
          className="w-full border-none outline-none "
          {...rest}
        />
      </div>

      {hasInputValue && (
        <AiFillCloseCircle
          onClick={handleClearInput}
          className="cursor-pointer"
        />
      )}

      {/* {hasInputValue && (
        <CloseIcon
          boxSize={3}
          className="cursor-pointer"
          color={'gray.300'}
          _hover={{ color: 'gray.500' }}
          onClick={handleClose}
          data-testid="close-element"
        />
      )} */}
    </div>
  )
}
