import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * The Industrial Governance type scale ships as `text-<name>` utilities
 * (`text-body-md`, `text-headline-sm`, …). tailwind-merge cannot tell those apart
 * from text-colour utilities, so it classified them as colours and silently
 * dropped the type utility whenever a colour was merged alongside it — every
 * `cn()`-merged element fell back to the browser default 16px. Declaring the
 * scale as font sizes keeps both the size and the colour.
 */
const TYPE_SCALE = [
  "headline-lg",
  "headline-md",
  "headline-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "label-section",
  "label-md",
  "label-sm",
  "tabular-numeric",
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TYPE_SCALE }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
