'use client'

import { useState } from 'react'
import { Search, ListTodo } from 'lucide-react'
import { TaskItem } from './task-item'
import { getSubjectColor } from '@/lib/subject-colors'
import { sortTasks } from '@/lib/use-planner'

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'To do' },
  { id: 'completed', label: 'Done' },
]

export function TasksView({ tasks, subjects, onToggle, onEdit, onDelete, onAddTask }) {
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')

  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]))
  const normalizedQuery = query.trim().toLowerCase()

  const filtered = sortTasks(
    tasks.filter((t) => {
      if (subjectFilter !== 'all' && t.subjectId !== subjectFilter) return false
      if (status === 'pending' && t.completed) return false
      if (status === 'completed' && !t.completed) return false
      if (normalizedQuery && !`${t.title} ${t.notes}`.toLowerCase().includes(normalizedQuery)) return false
      return true
    }),
  )

  const countFor = (id) => tasks.filter((t) => (id === 'all' ? true : t.subjectId === id)).length

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All tasks</h1>
        <p className="mt-1 text-muted-foreground">Filter by subject or status, and tick tasks off as you go.</p>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="task-search" className="sr-only">
              Search tasks
            </label>
            <input
              id="task-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </div>
          <div role="tablist" aria-label="Filter by status" className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={status === f.id}
                onClick={() => setStatus(f.id)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  status === f.id ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by subject">
          <button
            type="button"
            onClick={() => setSubjectFilter('all')}
            aria-pressed={subjectFilter === 'all'}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
              subjectFilter === 'all'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            All subjects <span className="opacity-70">({countFor('all')})</span>
          </button>
          {subjects.map((s) => {
            const color = getSubjectColor(s.color)
            const active = subjectFilter === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSubjectFilter(s.id)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? `${color.soft} ${color.text} ${color.border} ring-2 ring-offset-1 ring-current/20`
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className={`size-2 rounded-full ${color.dot}`} aria-hidden="true" />
                {s.name} <span className="opacity-70">({countFor(s.id)})</span>
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <ul className="flex flex-col gap-3" aria-live="polite">
          {filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              subject={subjectById[task.subjectId]}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              showDate
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-border bg-card/50 px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <ListTodo className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-3 font-medium">No tasks found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different filter or add a new task.</p>
          <button
            type="button"
            onClick={() => onAddTask(subjectFilter !== 'all' ? { subjectId: subjectFilter } : undefined)}
            className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            Add task
          </button>
        </div>
      )}
    </div>
  )
}
