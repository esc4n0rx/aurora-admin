// components/ui/search-input.tsx
"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  onSearch?: (value: string) => void
  onClear?: () => void
  debounceMs?: number
  showClearButton?: boolean
}

export function SearchInput({ 
  onSearch, 
  onClear, 
  debounceMs = 300, 
  showClearButton = true,
  className,
  ...props 
}: SearchInputProps) {
  const [value, setValue] = React.useState("")
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const memoizedOnSearch = React.useCallback((searchValue: string) => {
    if (onSearch) {
      onSearch(searchValue)
    }
  }, [onSearch])

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      memoizedOnSearch(value)
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, memoizedOnSearch, debounceMs])

  const handleClear = () => {
    setValue("")
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn("pl-10", showClearButton && value && "pr-10", className)}
      />
      {showClearButton && value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}