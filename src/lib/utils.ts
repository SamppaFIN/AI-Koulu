import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Yhdistä Tailwind-luokat ja ratkaise konfliktit.
 * Käytä aina tätä funktiota komponenttien className-propsien kokoamiseen.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
