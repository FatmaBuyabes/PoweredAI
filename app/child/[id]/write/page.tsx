'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, BookmarkPlus } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'

export default function WriteStoryPage() {
  const { id } = useParams<{ id: string }>()
  const { getChild, addStory, t, lang } = useApp()
  const router = useRouter()
  const child = getChild(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(false)

  if (!child) return null

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  function handleSave() {
    if (!title.trim() || !content.trim()) return
    addStory({
      childId: id,
      title: title.trim(),
      content: content.trim(),
      type: 'written',
      date: new Date().toISOString(),
      theme: 'adventure',
      language: lang,
    })
    setSaved(true)
    setTimeout(() => router.push(`/child/${id}`), 1000)
  }

  return (
    <div className="min-h-screen bg-[#FEFCF7]">
      <Navigation showBack backHref={`/child/${id}`} title={t.write.title} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <span className="text-3xl">{child.avatar}</span>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t.write.titlePlaceholder}
              className="flex-1 font-black text-xl text-gray-900 placeholder:text-gray-300 focus:outline-none bg-transparent"
            />
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t.write.contentPlaceholder}
            rows={8}
            className="w-full p-6 focus:outline-none text-gray-700 leading-loose resize-none text-[15px]"
            style={{ fontFamily: lang === 'ar' ? 'Cairo, sans-serif' : 'Nunito, sans-serif' }}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          />

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-400 font-medium">
              {wordCount} {t.write.wordCount}
            </span>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || saved}
              className="flex items-center gap-2 py-2.5 px-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              {saved ? (
                <><Check size={16} /> {t.write.saved}</>
              ) : (
                <><BookmarkPlus size={16} /> {t.write.save}</>
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
