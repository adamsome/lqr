'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '@/app/lib/utils'
import { useWindowSize } from 'react-use'

type TabsContextValue = {
  listRef: React.RefObject<HTMLDivElement>
  style: React.CSSProperties
  animate: boolean
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

export const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context)
    throw new Error(
      'No TabsContext.Provider found when calling useTabsContext.',
    )
  return context
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ defaultValue, onValueChange, ...props }, ref) => {
  const listRef =
    React.useRef<React.ElementRef<typeof TabsPrimitive.List>>(null)

  const { width } = useWindowSize()
  const [animate, setAnimate] = React.useState(false)
  const [selected, setSelected] = React.useState(defaultValue)
  const [style, setStyle] = React.useState<React.CSSProperties>({
    width: 0,
    transform: 'translateX(0)',
  })

  React.useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>(
      '[aria-selected="true"]',
    )
    setStyle({
      width: active?.offsetWidth ?? 0,
      transform: `translateX(${active?.offsetLeft ?? 0}px)`,
    })
  }, [selected, width])

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 1)
    return () => clearTimeout(timer)
  }, [])

  const handleValueChange = (value: string) => {
    setSelected(value)
    onValueChange?.(value)
  }

  return (
    <TabsContext.Provider value={{ listRef, style, animate }}>
      <TabsPrimitive.Root
        ref={ref}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
      />
    </TabsContext.Provider>
  )
})
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsAnimated = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('relative z-0 inline-block', className)} {...props} />
)
TabsAnimated.displayName = 'TabsAnimated'

const TabsAnimatedUnderline = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { style, animate } = useTabsContext()
  return (
    <div
      style={style}
      className={cn(
        'bg-accent-foreground dark:bg-primary absolute bottom-0 left-0 -z-10 h-0.5 will-change-[transform,width]',
        animate && 'transition-[transform_150ms,width_100ms]',
        className,
      )}
      {...props}
    />
  )
}
TabsAnimated.displayName = 'TabsAnimatedUnderline'

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { listRef } = useTabsContext()
  React.useImperativeHandle(ref, () => listRef.current!, [listRef])
  return (
    <TabsPrimitive.List
      ref={listRef}
      className={cn(
        'text-muted-foreground/75 inline-flex items-center gap-1',
        className,
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center px-3 pb-1',
      'whitespace-nowrap text-sm font-medium transition-colors',
      'ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:text-accent-foreground',
      'data-[state=inactive]:hover:text-muted-foreground',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export {
  Tabs,
  TabsAnimated,
  TabsAnimatedUnderline,
  TabsList,
  TabsContent,
  TabsTrigger,
}
