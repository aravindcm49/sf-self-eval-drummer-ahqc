import * as React from 'react'
import { cn } from '../../lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-slate-950/60 text-slate-100 shadow-2xl backdrop-blur-[2px]',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

export { Card }
