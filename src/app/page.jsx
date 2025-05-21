'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/config/routes'

export default function Home() {
  const router = useRouter()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      router.push(ROUTES.LOGIN)
    } else {
      router.push(ROUTES.HOME)
    }
  }, [user, router])

  return null
} 