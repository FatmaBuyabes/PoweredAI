'use client'

import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'

export default function SettingsPage() {
  const { t, lang, setLanguage } = useApp()

  return (
    <div className="min-h-screen bg-[#FEFCF7]">
      <Navigation showBack backHref="/" title={t.settings.title} />

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">{t.settings.language}</label>
          <div className="grid grid-cols-2 gap-3">
            {(['en', 'ar'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`py-4 rounded-2xl font-bold text-sm transition-all ${
                  lang === l
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'border-2 border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {l === 'en' ? t.settings.english : t.settings.arabic}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
