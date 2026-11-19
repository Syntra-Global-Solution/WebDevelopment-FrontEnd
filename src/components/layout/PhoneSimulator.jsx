export function PhoneSimulator({ children }) {
  return (
    <div className="phone-frame relative flex h-[min(820px,calc(100dvh-96px))] w-full max-w-[410px] flex-col overflow-hidden bg-cream sm:rounded-[28px] sm:border-[5px] sm:border-navy-2 sm:shadow-2xl">
      {children}
    </div>
  )
}
