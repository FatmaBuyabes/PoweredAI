'use client'

import { useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Trash2, Play, Pause, Sparkles, PenLine, Mic, Heart } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { formatDate } from '@/lib/utils'
import { STORY_THEME_META } from '@/lib/types'

export default function StoryViewPage() {
  const { id, storyId } = useParams<{ id: string; storyId: string }>()
  const { getChild, getStory, deleteStory, toggleFavorite, t, lang } = useApp()
  const router = useRouter()
  const child = getChild(id)
  const story = getStory(storyId)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  if (!child || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Story not found.</p>
      </div>
    )
  }

  const meta = STORY_THEME_META[story.theme]
  const storyDir = story.language === 'ar' ? 'rtl' : 'ltr'

  const typeIcon = story.type === 'ai-generated' ? Sparkles : story.type === 'written' ? PenLine : Mic
  const TypeIcon = typeIcon
  const typeLabel =
    story.type === 'ai-generated' ? t.storyView.typeAI : story.type === 'written' ? t.storyView.typeWritten : t.storyView.typeRecorded

  function handleDelete() {
    deleteStory(story!.id)
    router.push(`/child/${id}`)
  }

  function togglePlay() {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(v => !v)
  }

  return (
    <div className="min-h-screen bg-[#FEFCF7]">
      <Navigation showBack backHref={`/child/${id}`} title={child.name} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 pt-6 pb-8" style={{ background: meta.gradient }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold`}>
                  <TypeIcon size={12} /> {typeLabel}
                </span>
                <span className="text-white/70 text-xs font-medium">{formatDate(story.date, lang)}</span>
              </div>
              <button
                onClick={() => toggleFavorite(story.id)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110"
                aria-label={story.favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={18}
                  className={story.favorite ? 'text-white fill-white' : 'text-white/70'}
                />
              </button>
            </div>
            <h1 className="text-2xl font-black text-white mt-4">{story.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl">{child.avatar}</span>
              <span className="text-white/80 text-sm font-medium">{child.name}</span>
            </div>
          </div>

          <div className="p-6">
            {story.type === 'recorded' && story.audioBlob ? (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm text-center">{t.storyView.listening}</p>
                <div className="flex justify-center">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                </div>
                <audio ref={audioRef} src={story.audioBlob} onEnded={() => setIsPlaying(false)} className="w-full mt-4" controls />
              </div>
            ) : (
              <div
                className={`story-text text-gray-700 leading-loose whitespace-pre-wrap text-[15px] ${story.language === 'ar' ? 'text-right' : ''}`}
                dir={storyDir}
                style={{ fontFamily: story.language === 'ar' ? 'Cairo, sans-serif' : 'Nunito, sans-serif' }}
              >
                {story.content}
              </div>
            )}
          </div>

          <div className="px-6 pb-6 border-t border-gray-50 pt-4">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 text-red-400 hover:text-red-600 text-sm font-semibold transition-colors"
              >
                <Trash2 size={16} /> {t.storyView.delete}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">{t.storyView.deleteConfirm}</p>
                <button onClick={handleDelete}
                  className="px-4 py-1.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">
                  {t.storyView.confirmYes}
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-1.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors">
                  {t.storyView.confirmNo}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
