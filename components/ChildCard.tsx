'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Trash2 } from 'lucide-react'
import { Child, CHILD_CARD_GRADIENTS } from '@/lib/types'
import { useApp } from '@/contexts/AppContext'
import { childCardStyle } from '@/lib/utils'

interface ChildCardProps {
  child: Child
  storyCount: number
  index: number
}

export default function ChildCard({ child, storyCount, index }: ChildCardProps) {
  const { t, deleteChild } = useApp()
  const { gradient, shadow } = childCardStyle(child.id, CHILD_CARD_GRADIENTS)

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (window.confirm(`Delete ${child.name}'s profile and all their stories?`)) {
      deleteChild(child.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative"
    >
      <Link href={`/child/${child.id}`} className="block">
        <div
          className="rounded-[2rem] p-5 border-4 border-white/40"
          style={{ background: gradient, boxShadow: shadow }}
        >
          <div className="flex items-start justify-between mb-3">
            <motion.div
              className="text-6xl filter drop-shadow-md"
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              {child.avatar}
            </motion.div>
            <span className="bg-white/25 text-white text-xs font-black px-2.5 py-1 rounded-full border border-white/30">
              ✨ StoryAI
            </span>
          </div>

          <h3 className="text-2xl font-black text-white drop-shadow-sm mb-0.5 tracking-tight">
            {child.name}
          </h3>
          <p className="text-white/90 text-sm font-bold">
            {t.dashboard.age} {child.age} {t.dashboard.years}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-white/80 text-xs font-bold bg-black/10 px-2.5 py-1 rounded-full">
              {storyCount} {storyCount === 1 ? t.dashboard.story : t.dashboard.stories}
            </span>
            <div className="bg-white/25 hover:bg-white/40 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors border border-white/30">
              <BookOpen size={12} />
              {t.dashboard.enterJournal}
            </div>
          </div>
        </div>
      </Link>

      <button
        onClick={handleDelete}
        className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 p-1.5 bg-black/20 hover:bg-red-500 rounded-full text-white transition-all"
        aria-label="Delete child"
      >
        <Trash2 size={12} />
      </button>
    </motion.div>
  )
}
