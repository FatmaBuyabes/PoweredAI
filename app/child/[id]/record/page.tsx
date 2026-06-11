'use client'

import { useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Play, Pause, RotateCcw, BookmarkPlus, Check } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import Navigation from '@/components/Navigation'
import { blobToBase64 } from '@/lib/utils'

export default function RecordStoryPage() {
  const { id } = useParams<{ id: string }>()
  const { getChild, addStory, t, lang } = useApp()
  const router = useRouter()
  const child = getChild(id)

  const [phase, setPhase] = useState<'idle' | 'recording' | 'done'>('idle')
  const [title, setTitle] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [saved, setSaved] = useState(false)

  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(t => t.stop())
        setPhase('done')
      }
      recorder.start()
      mediaRef.current = recorder
      setDuration(0)
      setPhase('recording')
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
    } catch {
      alert('Microphone access denied. Please allow microphone access.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !audioUrl) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(v => !v)
  }, [isPlaying, audioUrl])

  const reset = useCallback(() => {
    if (audioRef.current) audioRef.current.pause()
    setPhase('idle')
    setAudioUrl(null)
    setAudioBlob(null)
    setDuration(0)
    setIsPlaying(false)
    setSaved(false)
  }, [])

  async function handleSave() {
    if (!audioBlob || !title.trim()) return
    const base64 = await blobToBase64(audioBlob)
    addStory({
      childId: id,
      title: title.trim(),
      content: '',
      type: 'recorded',
      date: new Date().toISOString(),
      theme: child!.theme,
      language: lang,
      audioBlob: base64,
    })
    setSaved(true)
    setTimeout(() => router.push(`/child/${id}`), 1000)
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (!child) return null

  return (
    <div className="min-h-screen bg-[#FEFCF7]">
      <Navigation showBack backHref={`/child/${id}`} title={t.record.title} />

      <main className="max-w-md mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center space-y-6"
        >
          <div>
            <div className="text-5xl mb-2">{child.avatar}</div>
            <p className="font-bold text-gray-700">{child.name}</p>
            <p className="text-sm text-gray-400">{t.record.subtitle}</p>
          </div>

          {phase === 'done' && (
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t.record.titlePlaceholder}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-center font-bold focus:border-rose-400 focus:outline-none"
            />
          )}

          <div className="flex flex-col items-center gap-4">
            <AnimatePresence mode="wait">
              {phase === 'recording' && (
                <motion.div
                  key="recording"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-28 h-28 rounded-full bg-red-100 absolute inset-0"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                    className="w-28 h-28 rounded-full bg-red-200 absolute inset-0"
                  />
                  <div className="w-28 h-28 rounded-full bg-red-500 flex items-center justify-center relative z-10">
                    <Mic size={36} className="text-white" />
                  </div>
                </motion.div>
              )}

              {phase === 'idle' && (
                <motion.div key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <div className="w-28 h-28 rounded-full bg-rose-100 flex items-center justify-center">
                    <Mic size={36} className="text-rose-500" />
                  </div>
                </motion.div>
              )}

              {phase === 'done' && (
                <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check size={36} className="text-emerald-500" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {phase !== 'idle' && (
              <div className="text-2xl font-black text-gray-700 tabular-nums">{formatTime(duration)}</div>
            )}

            {phase === 'idle' && (
              <button onClick={startRecording}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Mic size={18} /> {t.record.tapToRecord}
              </button>
            )}

            {phase === 'recording' && (
              <button onClick={stopRecording}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold px-8 py-3 rounded-2xl shadow-lg transition-all">
                <Square size={18} /> {t.record.stopRecording}
              </button>
            )}

            {phase === 'done' && audioUrl && (
              <div className="flex gap-3 w-full">
                <button onClick={togglePlay}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition-all">
                  {isPlaying ? <><Pause size={18} /></> : <><Play size={18} /> {t.record.playback}</>}
                </button>
                <button onClick={reset}
                  className="p-3 rounded-2xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                  <RotateCcw size={18} />
                </button>
              </div>
            )}
          </div>

          {phase === 'done' && (
            <button
              onClick={handleSave}
              disabled={!title.trim() || saved}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saved ? (
                <><Check size={18} /> {t.record.saved}</>
              ) : (
                <><BookmarkPlus size={18} /> {t.record.saveToJournal}</>
              )}
            </button>
          )}
        </motion.div>
      </main>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  )
}
