export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const variants = {
    primary: 'bg-navy text-cream hover:bg-navy-2 disabled:bg-slate/45',
    secondary: 'border border-slate/35 bg-white text-navy hover:bg-cream',
    sage: 'bg-sage text-navy hover:bg-sage/85',
    danger: 'bg-wine text-white hover:bg-wine/90',
    ghost: 'bg-transparent text-navy hover:bg-beige/35',
  }
  const sizes = {
    xs: 'min-h-8 px-2.5 py-1 text-xs',
    sm: 'min-h-9 px-3 py-1.5 text-sm',
    md: 'min-h-11 px-4 py-2.5 text-sm',
    lg: 'min-h-12 px-5 py-3 text-base',
    icon: 'size-11 p-2.5',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[9px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
