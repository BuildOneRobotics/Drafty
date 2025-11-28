import { useState, useEffect } from 'react'

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isPhone, setIsPhone] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isPhoneDevice = /iphone|android|mobile|phone/.test(userAgent) && window.innerWidth < 768
      const isMobileDevice = window.innerWidth < 768
      
      setIsPhone(isPhoneDevice)
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return { isMobile, isPhone }
}
