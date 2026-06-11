import { StoryTheme, STORY_THEME_META } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ThemeBadgeProps {
  theme: StoryTheme
  label?: string
  size?: 'sm' | 'md'
}

export default function ThemeBadge({ theme, label, size = 'sm' }: ThemeBadgeProps) {
  const meta = STORY_THEME_META[theme]
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full font-semibold',
      meta.bg, meta.text,
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      <span>{meta.emoji}</span>
      <span>{label ?? meta.label}</span>
    </span>
  )
}
