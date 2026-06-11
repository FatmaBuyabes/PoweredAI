'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import ChildCard from '@/components/ChildCard'
import AddChildModal from '@/components/AddChildModal'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { children, getChildStories, t } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#FEFCF7]">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">✨</span>
            <h1 className="text-3xl font-black text-gray-900">{t.dashboard.title}</h1>
          </div>
          <p className="text-gray-500 font-medium ms-12">{t.dashboard.subtitle}</p>
        </motion.div>

        {children.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">{t.dashboard.noChildren}</h2>
            <p className="text-gray-400 mb-6">{t.dashboard.noChildrenSub}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus size={20} />
              {t.dashboard.addChild}
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {children.map((child, i) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  storyCount={getChildStories(child.id).length}
                  index={i}
                />
              ))}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: children.length * 0.08 }}
                onClick={() => setShowAddModal(true)}
                className="border-2 border-dashed border-gray-200 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-purple-300 hover:text-purple-400 hover:bg-purple-50/50 transition-all min-h-[180px]"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Plus size={24} />
                </div>
                <span className="font-bold text-sm">{t.dashboard.addChild}</span>
              </motion.button>
            </div>
          </>
        )}
      </main>

      {showAddModal && (
        <AddChildModal
          onClose={() => setShowAddModal(false)}
          onAdded={(id) => router.push(`/child/${id}`)}
        />
      )}
    </div>
  )
}
