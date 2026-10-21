// The frame of a page: one centered column that works on a phone.
export default function Screen({ children, className = '' }) {
  return (
    <main className={`mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10 ${className}`}>
      {children}
    </main>
  )
}
