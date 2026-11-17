'use client'

import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { ProgressBar } from './progress-bar'
import { getSubjectColor } from '@/lib/subject-colors'
import { sortTasks } from '@/lib/use-planner'
import { addDays, formatDuration, formatTime, getWeekDays, startOfWeek, toDateKey, todayKey } from '@/lib/date-utils'

export function CalendarView({ tasks, subjects, onToggle, onEdit, onAddTask }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const days = getWeekDays(weekStart)
  const today = todayKey()
  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]))

  const weekKeys = days.map(toDateKey)
  const weekTasks = tasks.filter((t) => weekKeys.includes(t.date))
  const weekDone = weekTasks.filter((t) => t.completed).length
  const weekMinutes = weekTasks.reduce((sum, t) => sum + (Number(t.duration) || 0), 0)

  const rangeLabel = `${days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  const isCurrentWeek = weekKeys.includes(today)

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly calendar</h1>
          <p className="mt-1 text-muted-foreground">{rangeLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekStart((d) => addDays(d, -7))}
            className="rounded-xl border border-border bg-card p-2.5 transition-colors hover:bg-muted"
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(startOfWeek(new Date()))}
            disabled={isCurrentWeek}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-50"
          >
            This week
          </button>
          <button
            type="button"
            onClick={() => setWeekStart((d) => addDays(d, 7))}
            className="rounded-xl border border-border bg-card p-2.5 transition-colors hover:bg-muted"
            aria-label="Next week"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <section aria-label="Week summary" className="grid gap-4 rounded-3xl border border-border bg-card p-5 sm:grid-cols-3 sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Tasks completed</p>
          <p className="text-2xl font-bold">
            {weekDone}
            <span className="text-base font-medium text-muted-foreground"> / {weekTasks.length}</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Planned study time</p>
          <p className="text-2xl font-bold">{formatDuration(weekMinutes)}</p>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Week progress</p>
          <ProgressBar value={weekTasks.length ? (weekDone / weekTasks.length) * 100 : 0} label="Week progress" />
        </div>
      </section>

      <ol className="grid gap-3 md:grid-cols-7">
        {days.map((date, i) => {
          const key = weekKeys[i]
          const dayTasks = sortTasks(tasks.filter((t) => t.date === key))
          const isToday = key === today
          const done = dayTasks.filter((t) => t.completed).length
          return (
            <li
              key={key}
              style={{ animationDelay: `${i * 50}ms` }}
              className={`flex min-h-40 flex-col rounded-2xl border p-3 animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 ${
                isToday ? 'border-primary/40 bg-accent/60 ring-2 ring-primary/20' : 'border-border bg-card'
              }`}
            >
              <div className="mb-3 flex items-center justify-between md:flex-col md:items-start md:gap-1">
                <div className="flex items-center gap-2 md:flex-col md:items-start md:gap-0">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span
                    className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                      isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
                {dayTasks.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {done}/{dayTasks.length} done
                  </span>
                )}
              </div>

              <ul className="flex flex-1 flex-col gap-1.5">
                {dayTasks.map((t) => {
                  const color = getSubjectColor(subjectById[t.subjectId]?.color)
                  return (
                    <li key={t.id} className={`flex items-start gap-1.5 rounded-lg border p-1.5 ${color.soft} ${color.border}`}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={t.completed}
                        aria-label={`Mark "${t.title}" as ${t.completed ? 'not done' : 'done'}`}
                        onClick={() => onToggle(t.id)}
                        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-all ${
                          t.completed ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-card'
                        }`}
                      >
                        {t.completed && <Check className="size-3" strokeWidth={3} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(t)}
                        className="min-w-0 flex-1 text-left"
                        aria-label={`Edit "${t.title}"`}
                      >
                        <span className={`block text-xs font-medium leading-snug ${color.text} ${t.completed ? 'line-through opacity-60' : ''}`}>
                          {t.title}
                        </span>
                        {t.time && <span className="block text-[11px] text-muted-foreground">{formatTime(t.time)}</span>}
                      </button>
                    </li>
                  )
                })}
              </ul>

              <button
                type="button"
                onClick={() => onAddTask({ date: key })}
                className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-card hover:text-primary"
                aria-label={`Add task on ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
              >
                <Plus className="size-3.5" aria-hidden="true" />
                Add
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
