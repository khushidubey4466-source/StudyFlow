'use client'

import { useState } from 'react'
import { BookOpen, Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { ProgressBar } from './progress-bar'
import { COLOR_KEYS, getSubjectColor } from '@/lib/subject-colors'
import { todayKey } from '@/lib/date-utils'

function ColorPicker({ value, onChange, name }) {
  return (
    <div role="radiogroup" aria-label="Subject color" className="flex flex-wrap gap-2">
      {COLOR_KEYS.map((key) => {
        const color = getSubjectColor(key)
        const selected = value === key
        return (
          <label key={key} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={key}
              checked={selected}
              onChange={() => onChange(key)}
              className="peer sr-only"
            />
            <span
              className={`flex size-8 items-center justify-center rounded-full ${color.dot} text-white ring-offset-2 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${
                selected ? 'scale-110 ring-2 ring-foreground/20' : 'hover:scale-105'
              }`}
            >
              {selected && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
              <span className="sr-only">{color.label}</span>
            </span>
          </label>
        )
      })}
    </div>
  )
}

function SubjectCard({ subject, tasks, onUpdate, onDelete, onAddTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(subject.name)
  const [colorKey, setColorKey] = useState(subject.color)
  const color = getSubjectColor(subject.color)

  const subjectTasks = tasks.filter((t) => t.subjectId === subject.id)
  const done = subjectTasks.filter((t) => t.completed).length
  const pending = subjectTasks.length - done
  const today = todayKey()
  const upcoming = subjectTasks.filter((t) => !t.completed && t.date >= today).length

  const save = (event) => {
    event.preventDefault()
    if (!name.trim()) return
    onUpdate(subject.id, { name: name.trim(), color: colorKey })
    setIsEditing(false)
  }

  const cancel = () => {
    setName(subject.name)
    setColorKey(subject.color)
    setIsEditing(false)
  }

  return (
    <li className="group flex flex-col rounded-3xl border border-border bg-card p-5 transition-all animate-in fade-in zoom-in-95 duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
      {isEditing ? (
        <form onSubmit={save} className="flex flex-col gap-4">
          <label htmlFor={`subject-name-${subject.id}`} className="sr-only">
            Subject name
          </label>
          <input
            id={`subject-name-${subject.id}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
          <ColorPicker value={colorKey} onChange={setColorKey} name={`color-${subject.id}`} />
          <div className="flex gap-2">
            <button type="submit" className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
              <Check className="size-4" aria-hidden="true" /> Save
            </button>
            <button type="button" onClick={cancel} className="flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-sm font-semibold hover:bg-muted">
              <X className="size-4" aria-hidden="true" /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`flex size-11 items-center justify-center rounded-2xl ${color.soft} ${color.text}`}>
                <BookOpen className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold leading-tight">{subject.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {subjectTasks.length} {subjectTasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label={`Edit ${subject.name}`}
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(subject)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Delete ${subject.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              ['Done', done],
              ['Pending', pending],
              ['Upcoming', upcoming],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-muted/70 py-2">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
                <dd className="text-lg font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{subjectTasks.length ? Math.round((done / subjectTasks.length) * 100) : 0}%</span>
            </div>
            <ProgressBar
              value={subjectTasks.length ? (done / subjectTasks.length) * 100 : 0}
              label={`${subject.name} progress`}
              className="h-2"
              barClassName={color.bar}
            />
          </div>

          <button
            type="button"
            onClick={() => onAddTask({ subjectId: subject.id })}
            className={`mt-5 flex items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-semibold transition-all hover:brightness-95 ${color.soft} ${color.text} ${color.border}`}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add {subject.name} task
          </button>
        </>
      )}
    </li>
  )
}

export function SubjectsView({ tasks, subjects, onAddSubject, onUpdateSubject, onDeleteSubject, onAddTask }) {
  const [name, setName] = useState('')
  const [colorKey, setColorKey] = useState('sky')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter a subject name.')
      return
    }
    if (subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('That subject already exists.')
      return
    }
    onAddSubject({ name: trimmed, color: colorKey })
    setName('')
    setError('')
    const nextIndex = (COLOR_KEYS.indexOf(colorKey) + 1) % COLOR_KEYS.length
    setColorKey(COLOR_KEYS[nextIndex])
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <p className="mt-1 text-muted-foreground">Organize your tasks by subject and track progress for each one.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-gradient-to-br from-sky-soft to-lavender-soft p-5 sm:p-6" noValidate>
        <h2 className="text-lg font-semibold">Add a new subject</h2>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="new-subject" className="text-sm font-medium">
              Subject name
            </label>
            <input
              id="new-subject"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              placeholder="e.g. Chemistry"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'subject-error' : undefined}
              className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Color</span>
            <ColorPicker value={colorKey} onChange={setColorKey} name="new-subject-color" />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-lavender px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add subject
          </button>
        </div>
        {error && (
          <p id="subject-error" role="alert" className="mt-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </form>

      {subjects.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <SubjectCard
              key={s.id}
              subject={s}
              tasks={tasks}
              onUpdate={onUpdateSubject}
              onDelete={onDeleteSubject}
              onAddTask={onAddTask}
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
          No subjects yet. Add your first subject above.
        </p>
      )}
    </div>
  )
}
