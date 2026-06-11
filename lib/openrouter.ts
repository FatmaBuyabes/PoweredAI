import { StoryTheme, Language } from './types'

const OPENROUTER_KEY = process.env.NEXT_PUBLIC_OPENROUTER_KEY ?? ''
const OPENROUTER_MODEL = process.env.NEXT_PUBLIC_OPENROUTER_MODEL ?? 'openai/gpt-oss-120b:free'

interface GenerateStoryParams {
  childName: string
  age: number
  theme: StoryTheme
  language: Language
  extraPrompt?: string
  length?: 'short' | 'medium' | 'long'
}

const LENGTH_GUIDE = {
  short: '150-200 words',
  medium: '250-300 words',
  long: '350-400 words',
}

function buildPrompt(params: GenerateStoryParams): string {
  const { childName, age, theme, language, extraPrompt, length = 'medium' } = params
  const langInstruction =
    language === 'ar'
      ? 'اكتب القصة كاملةً باللغة العربية الفصحى البسيطة المناسبة للأطفال.'
      : 'Write the story entirely in English.'

  const themePrompts: Record<StoryTheme, string> = {
    adventure: `Create an exciting, imaginative adventure story where ${childName} (age ${age}) is the brave hero. Include elements of discovery, courage, and friendship. Make it thrilling with a clear beginning, challenge, and satisfying resolution.`,
    scifi: `Create a fun, imaginative science fiction story for ${childName} (age ${age}). Include cool futuristic technology, space travel, friendly robots or aliens, and a sense of wonder about the universe. Keep it age-appropriate and exciting.`,
    comedy: `Create a laugh-out-loud funny story for ${childName} (age ${age}). Use silly situations, funny misunderstandings, playful characters, and unexpected twists that will make a child giggle. Keep the humour lighthearted and kind.`,
    learning: `Create an engaging educational story where ${childName} (age ${age}) is a curious learner who discovers something fascinating. Weave in educational content (science, nature, history, or problem-solving) naturally. The lesson should feel fun, not like a textbook.`,
    islamic: `Create a warm, inspiring Islamic story for ${childName} (age ${age}). Beautifully incorporate Islamic values such as kindness (رحمة), honesty (صدق), gratitude to Allah (شكر), and good character. You may reference prophets' stories, beautiful duas, or Islamic teachings in a gentle, age-appropriate way. The tone should be uplifting and full of hope.`,
    fantasy: `Create a magical fantasy story for ${childName} (age ${age}). Include enchanted worlds, wizards, mythical creatures, or magical powers. The story should feel wondrous and imaginative, with a heartwarming message about bravery or kindness.`,
  }

  return `${themePrompts[theme]}

${extraPrompt ? `Additional request from the parent: "${extraPrompt}"` : ''}

${langInstruction}
Length: ${LENGTH_GUIDE[length]}.

Format your response as:
Title: [Creative story title]

[Story text here]`
}

export async function generateStory(params: GenerateStoryParams): Promise<{ title: string; content: string }> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://storyai-app.vercel.app',
      'X-Title': 'StoryAI',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'user', content: buildPrompt(params) }],
      temperature: 0.85,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  const text: string = data.choices?.[0]?.message?.content || ''

  // Model sometimes wraps title in markdown bold: **Title: ...** or just Title: ...
  const titleMatch = text.match(/^\*{0,2}Title:\s*(.+?)\*{0,2}\s*$/m)
  const title = titleMatch ? titleMatch[1].trim().replace(/\*+/g, '') : 'My Story'

  // Greedy .* so the whole title line is removed (lazy .+? would only remove one char)
  let content = text.replace(/^\*{0,2}Title:.*$/m, '').trim()

  // Strip repeated title heading at the start of content (e.g. **Title Text** or # Title Text)
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  content = content.replace(new RegExp(`^[#*\\s]*${escapedTitle}[#*\\s]*\n?`), '').trim()

  return { title, content }
}
