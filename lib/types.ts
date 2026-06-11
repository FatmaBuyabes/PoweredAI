export type StoryTheme = 'adventure' | 'scifi' | 'comedy' | 'learning' | 'islamic' | 'fantasy'
export type Language = 'en' | 'ar'
export type StoryType = 'ai-generated' | 'written' | 'recorded'

export interface Child {
  id: string
  name: string
  age: number
  avatar: string
  createdAt: string
}

export interface Story {
  id: string
  childId: string
  title: string
  content: string
  type: StoryType
  date: string
  audioBlob?: string
  theme: StoryTheme
  language: Language
  storyPrompt?: string
  favorite?: boolean
}

export interface AppSettings {
  language: Language
}

export const STORY_THEME_META: Record<StoryTheme, {
  label: string; labelAr: string; emoji: string
  gradient: string; bg: string; text: string; border: string
}> = {
  adventure: {
    label: 'Adventure',   labelAr: 'مغامرة',
    emoji: '🗺️',
    gradient: 'linear-gradient(135deg, #fb923c, #fcd34d)',
    bg: 'bg-orange-50',   text: 'text-orange-700',  border: 'border-orange-200',
  },
  scifi: {
    label: 'Sci-Fi',      labelAr: 'خيال علمي',
    emoji: '🚀',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200',
  },
  comedy: {
    label: 'Comedy',      labelAr: 'كوميديا',
    emoji: '😄',
    gradient: 'linear-gradient(135deg, #f59e0b, #fb923c)',
    bg: 'bg-yellow-50',   text: 'text-yellow-700',  border: 'border-yellow-200',
  },
  learning: {
    label: 'Learning',    labelAr: 'تعليم',
    emoji: '📚',
    gradient: 'linear-gradient(135deg, #a855f7, #60a5fa)',
    bg: 'bg-purple-50',   text: 'text-purple-700',  border: 'border-purple-200',
  },
  islamic: {
    label: 'Islamic',     labelAr: 'إسلامي',
    emoji: '🌙',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200',
  },
  fantasy: {
    label: 'Fantasy',     labelAr: 'خيال',
    emoji: '🧙',
    gradient: 'linear-gradient(135deg, #ec4899, #a855f7)',
    bg: 'bg-pink-50',     text: 'text-pink-700',    border: 'border-pink-200',
  },
}

// Deterministic card colors for children (no longer tied to a story theme)
export const CHILD_CARD_GRADIENTS = [
  { gradient: 'linear-gradient(135deg, #fb923c, #fcd34d)', shadow: '0 8px 24px rgba(251,146,60,0.4)' },
  { gradient: 'linear-gradient(135deg, #a855f7, #60a5fa)', shadow: '0 8px 24px rgba(168,85,247,0.4)' },
  { gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', shadow: '0 8px 24px rgba(16,185,129,0.4)' },
  { gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', shadow: '0 8px 24px rgba(236,72,153,0.4)' },
  { gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', shadow: '0 8px 24px rgba(59,130,246,0.4)' },
  { gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', shadow: '0 8px 24px rgba(245,158,11,0.4)' },
]

export const AVATARS = ['🦁', '🐯', '🦊', '🐻', '🦝', '🦋', '🦄', '🐬', '🦅', '🐙', '🐸', '🦕', '🐲', '🦌', '🐺', '🦜']

