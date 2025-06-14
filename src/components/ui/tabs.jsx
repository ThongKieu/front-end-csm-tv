"use client"

import { Fragment } from 'react'
import { Tab } from '@headlessui/react'
import { cn } from '@/lib/utils'

export function Tabs({ children, className, ...props }) {
  return (
    <Tab.Group {...props}>
      <div className={cn('', className)}>{children}</div>
    </Tab.Group>
  )
}

export function TabsList({ children, className }) {
  return (
    <Tab.List className={cn('flex space-x-1 rounded-xl bg-gray-100 p-1', className)}>
      {children}
    </Tab.List>
  )
}

export function TabsTrigger({ children, className }) {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button
          className={cn(
            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
            selected
              ? 'bg-white text-blue-700 shadow'
              : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
          )}
        >
          {children}
        </button>
      )}
    </Tab>
  )
}

export function TabsContent({ children, className }) {
  return (
    <Tab.Panel
      className={cn(
        'rounded-xl bg-white p-3',
        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
        className
      )}
    >
      {children}
    </Tab.Panel>
  )
} 