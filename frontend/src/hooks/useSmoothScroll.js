import { useEffect } from 'react'

export default function useSmoothScroll(isActive, duration = 1200) {
  useEffect(() => {
    if (!isActive) return

    let isScrolling = false

    const smoothScrollTo = (targetY) => {
      const startY = window.scrollY
      const distance = targetY - startY
      const startTime = performance.now()

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      }

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = easeInOutCubic(progress)

        window.scrollTo(0, startY + distance * easeProgress)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          isScrolling = false
        }
      }

      requestAnimationFrame(animate)
    }

    const handleWheel = (e) => {
      if (isScrolling) {
        e.preventDefault()
        return
      }

      const currentScroll = window.scrollY
      const windowHeight = window.innerHeight

      if (e.deltaY > 0 && currentScroll < windowHeight / 2) {
        e.preventDefault()
        isScrolling = true
        smoothScrollTo(windowHeight)
      } else if (e.deltaY < 0 && currentScroll > windowHeight / 2) {
        e.preventDefault()
        isScrolling = true
        smoothScrollTo(0)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [isActive, duration])
}
