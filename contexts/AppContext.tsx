'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { Child, Story, AppSettings, Language } from '@/lib/types'
import { storage } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { translations } from '@/lib/i18n'

interface AppContextValue {
  children: Child[]
  stories: Story[]
  settings: AppSettings
  addChild: (data: { name: string; age: number; avatar: string }) => Child
  updateChild: (id: string, updates: Partial<Child>) => void
  deleteChild: (id: string) => void
  getChild: (id: string) => Child | undefined
  getChildStories: (childId: string) => Story[]
  addStory: (story: Omit<Story, 'id'>) => Story
  deleteStory: (id: string) => void
  toggleFavorite: (id: string) => void
  getStory: (id: string) => Story | undefined
  updateSettings: (updates: Partial<AppSettings>) => void
  t: typeof translations.en | typeof translations.ar
  lang: Language
  dir: 'ltr' | 'rtl'
  setLanguage: (lang: Language) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children: childrenNodes }: { children: ReactNode }) {
  const [childrenList, setChildrenList] = useState<Child[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setChildrenList(storage.getChildren())
    setStories(storage.getStories())
    setSettings(storage.getSettings())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = settings.language
  }, [settings.language, mounted])

  const addChild = useCallback((data: { name: string; age: number; avatar: string }): Child => {
    const child: Child = { id: generateId(), createdAt: new Date().toISOString(), ...data }
    setChildrenList(prev => {
      const next = [...prev, child]
      storage.saveChildren(next)
      return next
    })
    return child
  }, [])

  const updateChild = useCallback((id: string, updates: Partial<Child>) => {
    setChildrenList(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...updates } : c))
      storage.saveChildren(next)
      return next
    })
  }, [])

  const deleteChild = useCallback((id: string) => {
    setChildrenList(prev => {
      const next = prev.filter(c => c.id !== id)
      storage.saveChildren(next)
      return next
    })
    setStories(prev => {
      const next = prev.filter(s => s.childId !== id)
      storage.saveStories(next)
      return next
    })
  }, [])

  const getChild = useCallback((id: string) => childrenList.find(c => c.id === id), [childrenList])

  const getChildStories = useCallback(
    (childId: string) => stories.filter(s => s.childId === childId).sort((a, b) => b.date.localeCompare(a.date)),
    [stories]
  )

  const addStory = useCallback((storyData: Omit<Story, 'id'>): Story => {
    const story: Story = { id: generateId(), ...storyData }
    setStories(prev => {
      const next = [...prev, story]
      storage.saveStories(next)
      return next
    })
    return story
  }, [])

  const deleteStory = useCallback((id: string) => {
    setStories(prev => {
      const next = prev.filter(s => s.id !== id)
      storage.saveStories(next)
      return next
    })
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setStories(prev => {
      const next = prev.map(s => s.id === id ? { ...s, favorite: !s.favorite } : s)
      storage.saveStories(next)
      return next
    })
  }, [])

  const getStory = useCallback((id: string) => stories.find(s => s.id === id), [stories])

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates }
      storage.saveSettings(next)
      return next
    })
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    updateSettings({ language: lang })
  }, [updateSettings])

  const lang = settings.language
  const t = translations[lang]
  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <AppContext.Provider value={{
      children: childrenList,
      stories,
      settings,
      addChild,
      updateChild,
      deleteChild,
      getChild,
      getChildStories,
      addStory,
      deleteStory,
      toggleFavorite,
      getStory,
      updateSettings,
      t,
      lang,
      dir,
      setLanguage,
    }}>
      {childrenNodes}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
