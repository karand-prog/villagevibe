export type AnalyticsEvent = {
  name: string
  properties?: Record<string, any>
}

export function track(event: AnalyticsEvent) {
  try {
    // Basic console tracking; integrate real analytics later
    // eslint-disable-next-line no-console
    console.log('[analytics]', event.name, event.properties || {})
    if (typeof window !== 'undefined') {
      const queue = (window as any).__vv_events || []
      queue.push({ ts: Date.now(), ...event })
      ;(window as any).__vv_events = queue
    }
  } catch {}
}

export function trackClick(name: string, properties?: Record<string, any>) {
  track({ name, properties })
}

export function trackSubmit(name: string, properties?: Record<string, any>) {
  track({ name, properties })
}
