import '../globals.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-rx-bg min-h-screen">{children}</body>
    </html>
  )
}
