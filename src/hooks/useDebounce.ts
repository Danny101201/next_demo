import { useEffect, useState } from "react"

interface UseDebounceProps<Tdata> {
  delay?: number
  value: Tdata
}
export const useDebounce = <Tdata>({
  value,
  delay = 1000
}: UseDebounceProps<Tdata>) => {
  const [deferValue, setDeferValue] = useState<Tdata>()
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferValue(value)
    }, delay)
  }, [value, delay])
  return deferValue
}