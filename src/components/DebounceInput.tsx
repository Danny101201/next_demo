import { useDebounce } from '@/hooks/useDebounce'
import React, { ChangeEvent, ComponentProps, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
interface DebounceInputProps
  extends Omit<ComponentProps<'input'>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  debounce?: number
}

export const DebounceInput = forwardRef<
  InputRefImperativeHandleProps,
  DebounceInputProps
>(({ value: initialValue, onChange, debounce = 1000, ...rest }, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [filterTitle, setFilterTitle] = useState<string>(initialValue)
  const deferValue = useDebounce({ value: filterTitle, delay: debounce })

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterTitle(e.target.value)
  }
  const clearInputValue = () => {
    setFilterTitle('')
  }
  const focusInput = () => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }
  useEffect(() => {
    if (deferValue === undefined) return
    onChange(deferValue)
  }, [deferValue])

  useImperativeHandle(ref, () => ({
    handleChangeValue,
    clearInputValue,
    focusInput,
    inputValue: filterTitle
  }))
  return (
    <input
      ref={inputRef}
      type="text"
      onChange={handleChangeValue}
      value={filterTitle}
      {...rest}
    />
  )
})

