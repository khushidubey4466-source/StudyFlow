'use client'

import { Check, Clock, Pencil, Trash2, CalendarDays } from 'lucide-react'
import { getSubjectColor } from '@/lib/subject-colors'
import { formatDuration, formatShortDate, formatTime } from '@/lib/date-utils'

const PRIORITY_STYLES = {
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export function TaskItem({ task, subject, onToggle, onEdit, onDelete, showDate = false }) {
  const color = getSubjectColor(subject?.color)

  return (
    <li
      className={`group relative flex items-start gap-3 rounded-2xl border bg-card p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-1 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5 ${
        task.completed ? 'border-border/60 bg-muted/40' : 'border-border'
      }`}
    >
      <span className={`absolute inset-y-4 left-0 w-1 rounded-r-full ${color.bar}`} aria-hidden="true" />

      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`}
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
          task.completed
            ? 'scale-100 border-primary bg-primary text-primary-foreground'
            : 'border-input bg-card hover:border-primary hover:bg-accent'
        }`}
      >
        <Check
          className={`size-4 transition-all duration-200 ${task.completed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
          strokeWidth={3}
        />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`font-medium leading-snug transition-colors ${
            task.completed ? 'text-muted-foreground line-through decoration-2' : 'text-foreground'
          }`}
        >
          {task.title}
        </p>
        {task.notes && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.notes}</p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
          {subject && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${color.soft} ${color.text} ${color.border}`}
            >
              <span className={`size-1.5 rounded-full ${color.dot}`} aria-hidden="true" />
              {subject.name}
            </span>
          )}
          <span
            className={`rounded-full border px-2.5 py-0.5 font-medium capitalize ${PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium}`}
          >
            {task.priority}
          </span>
          {showDate && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatShortDate(task.date)}
            </span>
          )}
          {(task.time || task.duration) && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3.5" aria-hidden="true" />
              {[formatTime(task.time), task.duration ? formatDuration(task.duration) : '']
                .filter(Boolean)
                .join(' · ')}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label={`Edit "${task.title}"`}
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Delete "${task.title}"`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  )
}
