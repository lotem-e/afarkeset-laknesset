import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// cn() merges class names: it joins them ( clsx ) and resolves
// Tailwind conflicts ( twMerge ) - e.g. "p-2 p-4" becomes "p-4".
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
