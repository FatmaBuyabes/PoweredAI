'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, BookmarkPlus, Check, AlertCircle } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { generateStory } from '@/lib/openrouter'
import { Language, StoryTheme, STORY_THEME_META } from '@/lib/types'

const THEMES: StoryTheme[] = ['adventure', 'scifi', 'comedy', 'learning', 'islamic', 'fantasy']

const LOADING_MESSAGES = [
  '✨ Gathering story magic...',
  '📖 Writing the opening chapter...',
  '🎨 Painting the world...',
  '🦋 Adding wonderful details...',
  '⭐ Sprinkling some stardust...',
  '🌈 Almost ready...',
]

export default function GenerateStoryPage() {
  const { id } = useParams<{ id: string }>()
  const { getChild, addStory, t, lang } = useApp()
  const router = useRouter()
  const child = getChild(id)

  const [selectedTheme, setSelectedTheme] = useState<StoryTheme>('adventure')
  const [extraPrompt, setExtraPrompt] = useState('')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [storyLang, setStoryLang] = useState<Language>(lang)
  const [loading, setLoading] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ title: string; content: string } | null>(null)
  const [saved, setSaved] = useState(false)
  const loadingInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (loading) {
      setLoadingMsgIdx(0)
      loadingInterval.current = setInterval(() => {
        setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length)
      }, 4000)
    } else {
      if (loadingInterval.current) clearInterval(loadingInterval.current)
    }
    return () => { if (loadingInterval.current) clearInterval(loadingInterval.current) }
  }, [loading])

  if (!child) return null

  async function handleGenerate() {
    setLoading(true)
    setError('')
    setResult(null)
    setSaved(false)
    try {
      const story = await generateStory({
        childName: child!.name,
        age: child!.age,
        theme: selectedTheme,
        language: storyLang,
        extraPrompt: extraPrompt.trim() || undefined,
        length,
      })
      setResult(story)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.generate.error)
    } finally {
      setLoading(false)
    }
  }

  function handleSave() {
    if (!result) return
    addStory({
      childId: id,
      title: result.title,
      content: result.content,
      type: 'ai-generated',
      date: new Date().toISOString(),
      theme: selectedTheme,
      language: storyLang,
      storyPrompt: extraPrompt || undefined,
    })
    setSaved(true)
    setTimeout(() => router.push(`/child/${id}`), 1200)
  }

  const themeMeta = STORY_THEME_META[selectedTheme]

  const lengths: Array<{ value: 'short' | 'medium' | 'long'; label: string }> = [
    { value: 'short', label: t.generate.short },
    { value: 'medium', label: t.generate.medium },
    { value: 'long', label: t.generate.long },
  ]

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Navigation showBack backHref={`/child/${id}`} title={t.generate.title} />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-5"
        >
          {/* Child header */}
          <div className="flex items-center gap-3">
            <span className="text-4xl">{child.avatar}</span>
            <div>
              <p className="text-sm text-gray-500 font-medium">{t.generate.title}</p>
              <p className="font-black text-gray-900 text-lg">{child.name}</p>
            </div>
          </div>

          {/* Story Theme Picker */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Story Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(th => {
                const meta = STORY_THEME_META[th]
                const isSelected = selectedTheme === th
                return (
                  <motion.button
                    key={th}
                    type="button"
                    onClick={() => setSelectedTheme(th)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all border-2 overflow-hidden"
                    style={{
                      borderColor: isSelected ? 'transparent' : '#e5e7eb',
                      background: isSelected ? meta.gradient : 'white',
                      boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
                    }}
                  >
                    <span className="text-2xl">{meta.emoji}</span>
                    <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                      {lang === 'ar' ? meta.labelAr : meta.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Extra prompt */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.generate.customPrompt}</label>
            <textarea
              value={extraPrompt}
              onChange={e => setExtraPrompt(e.target.value)}
              placeholder={t.generate.customPlaceholder}
              rows={2}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-700 focus:border-purple-400 focus:outline-none resize-none text-sm"
            />
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.generate.length}</label>
            <div className="grid grid-cols-3 gap-2">
              {lengths.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setLength(value)}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    length === value
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'border-2 border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.generate.storyLanguage}</label>
            <div className="grid grid-cols-2 gap-2">
              {(['en', 'ar'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => setStoryLang(l)}
                  className={`py-2.5 rounded-2xl text-sm font-bold transition-all ${
                    storyLang === l
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'border-2 border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {l === 'en' ? 'English' : 'العربية'}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <motion.button
            onClick={handleGenerate}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl text-white font-black text-base shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: loading ? '#9ca3af' : themeMeta.gradient }}
          >
            {loading ? (
              <AnimatePresence mode="wait">
                <motion.span
                  key={loadingMsgIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={18} className="animate-spin flex-shrink-0" />
                  {LOADING_MESSAGES[loadingMsgIdx]}
                </motion.span>
              </AnimatePresence>
            ) : (
              <><Sparkles size={18} /> {t.generate.generate} {themeMeta.emoji}</>
            )}
          </motion.button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700"
          >
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4" style={{ background: themeMeta.gradient }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{themeMeta.emoji}</span>
                  <span className="text-white/80 text-sm font-bold">{lang === 'ar' ? themeMeta.labelAr : themeMeta.label}</span>
                </div>
                <h2 className="text-white font-black text-lg">{result.title}</h2>
              </div>
              <div
                className={`p-6 story-text text-gray-700 leading-loose whitespace-pre-wrap text-[15px] ${storyLang === 'ar' ? 'text-right' : ''}`}
                dir={storyLang === 'ar' ? 'rtl' : 'ltr'}
              >
                {result.content}
              </div>
              <div className="px-6 pb-5 flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> {t.generate.regenerate}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:bg-emerald-400"
                >
                  {saved ? <><Check size={16} /> {t.generate.saved}</> : <><BookmarkPlus size={16} /> {t.generate.saveToJournal}</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
