import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface UseLocalStorageProps<T> {
  key: string
  initialValue: T | (() => T)
}
export const useLocalStorage = <T>({ key, initialValue }: UseLocalStorageProps<T>) => {

  const [value, setValue] = useState<T | undefined>(() => {
    if (typeof window === "undefined") return initialValue
    const storageValue = window.localStorage.getItem(key)
    if (storageValue) return JSON.parse(storageValue)
    if (initialValue instanceof Function) {
      return initialValue()
    }
    return initialValue
  })
  useEffect(() => {
    if (value === undefined) return window.localStorage.removeItem(key)
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, initialValue, value])

  const removeValue = () => {
    setValue(undefined)
  }
  return [
    value,
    setValue,
    removeValue
  ] as [T, Dispatch<SetStateAction<T>>, () => void]

}