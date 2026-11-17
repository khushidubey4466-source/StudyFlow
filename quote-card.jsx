'use client'

import { useState } from 'react'
import { Quote, RefreshCw } from 'lucide-react'
import { QUOTES, getDailyQuoteIndex } from '@/lib/quotes'

export function QuoteCard() {
  const [index, setIndex] = useState(() => getDailyQuoteIndex())
  const quote = QUOTES[index]

  return (
    <section
      aria-label="Motivational quote"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-500 to-lavender p-6 text-primary-foreground shadow-xl shadow-primary/20"
    >
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" aria-hidden="true" />
      <div className="absolute -bottom-12 -left-6 size-32 rounded-full bg-white/10" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Quote className="size-3.5" aria-hidden="true" />
            Daily motivation
          </span>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % QUOTES.length)}
            className="rounded-full bg-white/15 p-2 transition-all hover:rotate-180 hover:bg-white/25"
            aria-label="Show another quote"
          >
            <RefreshCw className="size-4 transition-transform" />
          </button>
        </div>
        <blockquote key={index} className="mt-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-lg font-semibold leading-relaxed text-pretty">“{quote.text}”</p>
          <footer className="mt-3 text-sm text-white/80">— {quote.author}</footer>
        </blockquote>
      </div>
    </section>
  )
}
