import { Child, Story, AppSettings } from './types'

const KEYS = {
  children: 'storyai_children',
  stories: 'storyai_stories',
  settings: 'storyai_settings',
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  getChildren: (): Child[] => safeGet<Child[]>(KEYS.children, []),
  saveChildren: (children: Child[]) => safeSet(KEYS.children, children),

  getStories: (): Story[] => safeGet<Story[]>(KEYS.stories, []),
  saveStories: (stories: Story[]) => safeSet(KEYS.stories, stories),

  getSettings: (): AppSettings => safeGet<AppSettings>(KEYS.settings, DEFAULT_SETTINGS),
  saveSettings: (settings: AppSettings) => safeSet(KEYS.settings, settings),
}
