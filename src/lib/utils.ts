import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeList(list: string[]) {
  return encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(list))))
}

export function decodeList(q: string | null): string[] {
  if (!q) return []
  try {
    return JSON.parse(
      decodeURIComponent(atob(decodeURIComponent(q)))
    )
  } catch {
    return []
  }
}

export function encodeName(name: string) {
  return encodeURIComponent(btoa(encodeURIComponent(name)))
}

export function decodeName(q: string | null) {
  if (!q) return ''
  try {
    return decodeURIComponent(atob(decodeURIComponent(q)))
  } catch {
    return ''
  }
}