// frontend/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This helper lets us combine Tailwind classes safely
// Example: cn("bg-red-500", isSadhaMode && "bg-gray-500")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}