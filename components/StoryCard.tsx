'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, PenLine, Mic, Heart } from 'lucide-react'
import { Story, STORY_THEME_META } from '@/lib/types'
import { useApp } from '@/contexts/AppContext'
import { formatDate, truncate } from '@/lib/utils'

interface StoryCardProps {
  story: Story
  index: number
}

const TYPE_META = {
  'ai-generated': { Icon: Sparkles, color: 'text-purple-500 bg-purple-50' },
  written: { Icon: PenLine, color: 'text-blue-500 bg-blue-50' },
  recorded: { Icon: Mic, color: 'text-rose-500 bg-rose-50' },
}

export default function StoryCard({ story, index }: StoryCardProps) {
  const { t, lang, toggleFavorite } = useApp()
  const meta = STORY_THEME_META[story.theme]
  const typeMeta = TYPE_META[story.type]
  const TypeIcon = typeMeta.Icon

  const typeLabel =
    story.type === 'ai-generated'
      ? t.journal.aiGenerated
      : story.type === 'written'
      ? t.journal.written
      : t.journal.recorded

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative"
    >
      <Link href={`/child/${story.childId}/story/${story.id}`} className="block group">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group-hover:border-gray-200 pe-12">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl ${typeMeta.color} flex-shrink-0`}>
              <TypeIcon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
                  {meta.emoji} {typeLabel}
                </span>
                <span className="text-xs text-gray-400">{formatDate(story.date, lang)}</span>
              </div>
              <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                {story.title}
              </h4>
              {story.type !== 'recorded' && story.content && (
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {truncate(story.content, 100)}
                </p>
              )}
              {story.type === 'recorded' && (
                <p className="text-sm text-gray-400 mt-1 italic flex items-center gap-1">
                  <Mic size={12} /> Audio story
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>

      <button
        onClick={e => { e.preventDefault(); toggleFavorite(story.id) }}
        className="absolute top-3 end-3 p-1.5 rounded-full transition-all hover:scale-110"
        aria-label={story.favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          size={18}
          className={story.favorite ? 'text-rose-500 fill-rose-500' : 'text-gray-300 hover:text-rose-400'}
        />
      </button>
    </motion.div>
  )
}
