'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, PenLine, Mic, Heart } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { CHILD_CARD_GRADIENTS, STORY_THEME_META, Story } from '@/lib/types'
import { childCardStyle } from '@/lib/utils'

const BOOKS_PER_SHELF = 4

function BookItem({ story, onToggleFavorite }: { story: Story; onToggleFavorite: (id: string) => void }) {
  const meta = STORY_THEME_META[story.theme]
  const typeEmoji = story.type === 'ai-generated' ? '✨' : story.type === 'written' ? '✍️' : '🎙️'

  return (
    <div className="relative group flex flex-col items-center">
      {/* Favorite bookmark ribbon */}
      {story.favorite && (
        <div
          className="absolute -top-0 right-3 z-20 w-5 h-7"
          style={{
            background: '#f43f5e',
            clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)',
          }}
        />
      )}

      <Link href={`/child/${story.childId}/story/${story.id}`} className="block">
        <motion.div
          whileHover={{ y: -10, scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="relative rounded-t-md overflow-hidden"
          style={{
            width: 78,
            height: 128,
            background: meta.gradient,
            boxShadow: '-4px 4px 12px rgba(0,0,0,0.3), inset -3px 0 6px rgba(0,0,0,0.12)',
          }}
        >
          {/* Spine highlight */}
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-white/30 rounded-tl-md" />
          {/* Right page edge */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/15" />
          {/* Top gloss */}
          <div className="absolute top-0 left-0 right-0 h-5 bg-white/15" />

          {/* Book content */}
          <div className="absolute inset-0 flex flex-col items-center justify-between pt-5 pb-3 px-2">
            <span className="text-3xl drop-shadow-sm">{meta.emoji}</span>
            <div className="text-center w-full">
              <p className="text-white text-[9px] font-black leading-tight line-clamp-3 drop-shadow px-0.5">
                {story.title}
              </p>
              <span className="text-white/60 text-[9px] mt-1 block">{typeEmoji}</span>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Heart toggle */}
      <button
        onClick={() => onToggleFavorite(story.id)}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-30 bg-black/20 rounded-full p-1 hover:bg-black/40"
        aria-label="Toggle favorite"
      >
        <Heart
          size={12}
          className={story.favorite ? 'text-rose-400 fill-rose-400' : 'text-white'}
        />
      </button>
    </div>
  )
}

function Shelf({ books, onToggleFavorite }: { books: Story[]; onToggleFavorite: (id: string) => void }) {
  return (
    <div className="mb-2">
      {/* Books row */}
      <div className="flex gap-3 px-4 pb-0 items-end min-h-[140px]">
        {books.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <BookItem story={story} onToggleFavorite={onToggleFavorite} />
          </motion.div>
        ))}
      </div>
      {/* Wooden shelf plank */}
      <div
        className="h-4 rounded-sm mx-1"
        style={{
          background: 'linear-gradient(180deg, #c17a3a 0%, #a0602a 40%, #8b5020 100%)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.35)',
        }}
      />
      {/* Shelf shadow */}
      <div
        className="h-1.5 mx-3 rounded-b-sm opacity-40"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3), transparent)' }}
      />
    </div>
  )
}

export default function ChildJournalPage() {
  const { id } = useParams<{ id: string }>()
  const { getChild, getChildStories, toggleFavorite, t } = useApp()
  const child = getChild(id)
  const stories = getChildStories(id)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500">Child not found</p>
          <Link href="/" className="text-purple-500 font-bold mt-2 inline-block">← Go home</Link>
        </div>
      </div>
    )
  }

  const { gradient, shadow } = childCardStyle(child.id, CHILD_CARD_GRADIENTS)

  const actions = [
    { href: `/child/${id}/generate`, icon: Sparkles, label: t.journal.generateStory, bg: 'linear-gradient(135deg,#a855f7,#ec4899)' },
    { href: `/child/${id}/write`, icon: PenLine, label: t.journal.writeStory, bg: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
    { href: `/child/${id}/record`, icon: Mic, label: t.journal.recordStory, bg: 'linear-gradient(135deg,#f43f5e,#fb923c)' },
  ]

  const displayed = filter === 'favorites' ? stories.filter(s => s.favorite) : stories
  const favCount = stories.filter(s => s.favorite).length

  // Group into rows of BOOKS_PER_SHELF
  const shelves: Story[][] = []
  for (let i = 0; i < displayed.length; i += BOOKS_PER_SHELF) {
    shelves.push(displayed.slice(i, i + BOOKS_PER_SHELF))
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Navigation showBack backHref="/" title={child.name} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Child header card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] p-6 mb-6"
          style={{ background: gradient, boxShadow: shadow }}
        >
          <div className="flex items-center gap-4">
            <motion.span
              className="text-6xl filter drop-shadow-sm"
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              {child.avatar}
            </motion.span>
            <div>
              <h1 className="text-2xl font-black text-white">{child.name}</h1>
              <p className="text-white/80 font-bold">
                {t.dashboard.age} {child.age} {t.dashboard.years}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {actions.map(({ href, icon: Icon, label, bg }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={href}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 block text-center"
                style={{ background: bg }}
              >
                <Icon size={22} />
                <span className="text-xs font-bold leading-tight">{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bookshelf section */}
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 px-1">
            <span className="text-lg">📚</span>
            <h2 className="font-black text-gray-800">{t.journal.title}</h2>
            <div className="ms-auto flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                  filter === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                All ({stories.length})
              </button>
              <button
                onClick={() => setFilter('favorites')}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                  filter === 'favorites' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Heart size={11} className={filter === 'favorites' ? 'fill-white' : ''} />
                {favCount}
              </button>
            </div>
          </div>

          {displayed.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl border border-gray-100"
            >
              <div className="text-4xl mb-3">{filter === 'favorites' ? '💛' : '📚'}</div>
              <p className="text-gray-500 font-medium">
                {filter === 'favorites' ? 'No favorites yet' : t.journal.noStories}
              </p>
              <p className="text-gray-400 text-sm">
                {filter === 'favorites'
                  ? 'Tap ♡ on a book to add it here'
                  : `${t.journal.noStoriesSub} ${child.name}!`}
              </p>
            </motion.div>
          ) : (
            /* Bookshelf */
            <div
              className="rounded-2xl overflow-hidden pt-4"
              style={{
                background: 'linear-gradient(180deg, #fdf0dc 0%, #fae5c0 100%)',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {shelves.map((row, si) => (
                <Shelf key={si} books={row} onToggleFavorite={toggleFavorite} />
              ))}
              {/* Shelf floor */}
              <div className="h-3" style={{ background: 'linear-gradient(180deg, #8b5020, #6b3a14)' }} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
