'use client'

import { useState } from 'react'
import { Modal } from './modal'
import { todayKey } from '@/lib/date-utils'

const PRIORITIES = ['low', 'medium', 'high']

const inputClass =
  'w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15'

function TaskForm({ initialTask, defaults, subjects, onSubmit, onCancel, onManageSubjects }) {
  const [form, setForm] = useState(() => ({
    title: initialTask?.title ?? '',
    subjectId: initialTask?.subjectId ?? defaults?.subjectId ?? subjects[0]?.id ?? '',
    date: initialTask?.date ?? defaults?.date ?? todayKey(),
    time: initialTask?.time ?? '',
    duration: initialTask?.duration ?? 45,
    priority: initialTask?.priority ?? 'medium',
    notes: initialTask?.notes ?? '',
  }))
  const [error, setError] = useState('')

  const update = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Please enter a task title.')
      return
    }
    if (!form.subjectId) {
      setError('Please choose a subject.')
      return
    }
    onSubmit({
      ...form,
      title: form.title.trim(),
      notes: form.notes.trim(),
      duration: Math.max(0, Number(form.duration) || 0),
    })
  }

  if (subjects.length === 0) {
    return (
      <div className="rounded-2xl bg-secondary p-5 text-center">
        <p className="text-sm text-secondary-foreground">
          You need at least one subject before adding tasks.
        </p>
        <button
          type="button"
          onClick={onManageSubjects}
          className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          Create a subject
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-title" className="text-sm font-medium">
          Task title
        </label>
        <input
          id="task-title"
          autoFocus
          value={form.title}
          onChange={(e) => {
            update('title')(e)
            if (error) setError('')
          }}
          placeholder="e.g. Revise chapter 4 notes"
          className={inputClass}
          aria-invalid={error && !form.title.trim() ? true : undefined}
          aria-describedby={error ? 'task-error' : undefined}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-subject" className="text-sm font-medium">
            Subject
          </label>
          <select id="task-subject" value={form.subjectId} onChange={update('subjectId')} className={inputClass}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-date" className="text-sm font-medium">
            Date
          </label>
          <input id="task-date" type="date" value={form.date} onChange={update('date')} className={inputClass} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-time" className="text-sm font-medium">
            Start time <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="task-time" type="time" value={form.time} onChange={update('time')} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-duration" className="text-sm font-medium">
            Duration (minutes)
          </label>
          <input
            id="task-duration"
            type="number"
            min="0"
            step="5"
            value={form.duration}
            onChange={update('duration')}
            className={inputClass}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium">Priority</legend>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-1">
          {PRIORITIES.map((p) => (
            <label
              key={p}
              className={`cursor-pointer rounded-lg py-2 text-center text-sm font-medium capitalize transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                form.priority === p ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <input
                type="radio"
                name="priority"
                value={p}
                checked={form.priority === p}
                onChange={update('priority')}
                className="sr-only"
              />
              {p}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-notes" className="text-sm font-medium">
          Notes <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="task-notes"
          rows={3}
          value={form.notes}
          onChange={update('notes')}
          placeholder="Chapters, page numbers, reminders..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p id="task-error" role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-primary to-lavender px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          {initialTask ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  )
}

export function TaskDialog({ state, subjects, onClose, onSubmit, onManageSubjects }) {
  const isEditing = Boolean(state.task)
  return (
    <Modal
      open={state.open}
      onClose={onClose}
      title={isEditing ? 'Edit study task' : 'New study task'}
      description={isEditing ? 'Update the details of this task.' : 'Plan what you want to study and when.'}
    >
      <TaskForm
        key={state.key}
        initialTask={state.task}
        defaults={state.defaults}
        subjects={subjects}
        onSubmit={onSubmit}
        onCancel={onClose}
        onManageSubjects={onManageSubjects}
      />
    </Modal>
  )
}
