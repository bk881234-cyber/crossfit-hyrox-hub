import type { ReactNode } from 'react'

// Root layout — Next.js requires this file.
// All actual layout (html, body, fonts, providers) is handled in app/[locale]/layout.tsx
// which sets lang={locale} for proper i18n html attribute.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
