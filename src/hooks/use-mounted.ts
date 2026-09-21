import { useSyncExternalStore } from 'react'

const subscribers = new Set<() => void>()
let isMounted = false

function subscribe(callback: () => void) {
  subscribers.add(callback)
  if (typeof window !== 'undefined' && !isMounted) {
    Promise.resolve().then(() => {
      if (!isMounted) {
        isMounted = true
        subscribers.forEach((cb) => cb())
      }
    })
  }
  return () => {
    subscribers.delete(callback)
  }
}

export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => isMounted,
    () => false
  )
}
