'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Settings, ArrowLeft, ArrowRight } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

interface NavigationProps {
  showBack?: boolean
  backHref?: string
  title?: string
}

export default function Navigation({ showBack, backHref, title }: NavigationProps) {
  const { t, lang, dir, setLanguage } = useApp()
  const router = useRouter()
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg"
      style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }}
    >
      {/* Rainbow bottom stripe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(to right, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #c77dff)' }}
      />

      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => backHref ? router.push(backHref) : router.back()}
              className="p-2 rounded-full bg-white/20 hover:bg-white/35 transition-colors text-white"
              aria-label={t.nav.back}
            >
              <BackIcon size={20} />
            </button>
          )}
          {!showBack && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl float">📖</span>
              <span className="font-black text-2xl text-white tracking-tight drop-shadow-sm">
                {t.appName}
              </span>
            </Link>
          )}
          {title && (
            <h1 className="font-black text-white text-lg truncate max-w-[180px] sm:max-w-xs drop-shadow-sm">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(lang === 'en' ? 'ar' : 'en')}
            className="px-3 py-1.5 rounded-full text-sm font-black bg-white/20 hover:bg-white/35 transition-colors text-white border border-white/30"
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <Link
            href="/settings"
            className="p-2 rounded-full bg-white/20 hover:bg-white/35 transition-colors text-white"
            aria-label={t.nav.settings}
          >
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </nav>
  )
}
