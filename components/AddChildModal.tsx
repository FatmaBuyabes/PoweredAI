'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { AVATARS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AddChildModalProps {
  onClose: () => void
  onAdded: (childId: string) => void
}

export default function AddChildModal({ onClose, onAdded }: AddChildModalProps) {
  const { t, addChild } = useApp()
  const [name, setName] = useState('')
  const [age, setAge] = useState(6)
  const [avatar, setAvatar] = useState(AVATARS[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const child = addChild({ name: name.trim(), age, avatar })
    onAdded(child.id)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900">{t.addChild.title}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.addChild.name}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.addChild.namePlaceholder}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-gray-900 font-medium focus:border-purple-400 focus:outline-none transition-colors"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.addChild.age}</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setAge(a => Math.max(1, a - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center">−</button>
                <span className="text-2xl font-black text-purple-600 w-10 text-center">{age}</span>
                <button type="button" onClick={() => setAge(a => Math.min(15, a + 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center">+</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.addChild.avatar}</label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map(em => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setAvatar(em)}
                    className={cn(
                      'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all',
                      avatar === em ? 'bg-purple-100 ring-2 ring-purple-400 scale-110' : 'hover:bg-gray-100'
                    )}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                {t.addChild.cancel}
              </button>
              <button type="submit"
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                {t.addChild.save}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
