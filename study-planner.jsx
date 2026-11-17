'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { usePlanner } from '@/lib/use-planner'
import { AppHeader } from './app-header'
import { DashboardView } from './dashboard-view'
import { TasksView } from './tasks-view'
import { CalendarView } from './calendar-view'
import { SubjectsView } from './subjects-view'
import { TaskDialog } from './task-dialog'
import { ConfirmDialog } from './confirm-dialog'

function LoadingState() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6" aria-busy="true" aria-label="Loading planner">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-3xl bg-muted" />
    </div>
  )
}

export function StudyPlanner() {
  const planner = usePlanner()
  const [view, setView] = useState('dashboard')
  const [taskDialog, setTaskDialog] = useState({ open: false, task: null, defaults: null, key: 0 })
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const notify = (message) => setToast({ message, id: Date.now() })

  const changeView = (next) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openNewTask = (defaults) =>
    setTaskDialog((s) => ({ open: true, task: null, defaults: defaults ?? null, key: s.key + 1 }))

  const openEditTask = (task) => setTaskDialog((s) => ({ open: true, task, defaults: null, key: s.key + 1 }))

  const closeTaskDialog = () => setTaskDialog((s) => ({ ...s, open: false }))

  const handleTaskSubmit = (values) => {
    if (taskDialog.task) {
      planner.updateTask(taskDialog.task.id, values)
      notify('Task updated')
    } else {
      planner.addTask(values)
      notify('Task added to your plan')
    }
    closeTaskDialog()
  }

  const handleToggle = (id) => {
    const task = planner.tasks.find((t) => t.id === id)
    planner.toggleTask(id)
    if (task && !task.completed) notify('Nice work! Task completed')
  }

  const requestDeleteTask = (task) =>
    setConfirm({
      title: 'Delete this task?',
      message: `"${task.title}" will be permanently removed from your planner.`,
      onConfirm: () => {
        planner.deleteTask(task.id)
        notify('Task deleted')
      },
    })

  const requestDeleteSubject = (subject) => {
    const count = planner.tasks.filter((t) => t.subjectId === subject.id).length
    setConfirm({
      title: `Delete ${subject.name}?`,
      message:
        count > 0
          ? `This subject and its ${count} ${count === 1 ? 'task' : 'tasks'} will be permanently removed.`
          : 'This subject will be permanently removed.',
      onConfirm: () => {
        planner.deleteSubject(subject.id)
        notify('Subject deleted')
      },
    })
  }

  const requestReset = () =>
    setConfirm({
      title: 'Reset to sample data?',
      message: 'All your current subjects and tasks will be replaced with the sample study plan.',
      confirmLabel: 'Reset',
      onConfirm: () => {
        planner.resetToSample()
        notify('Planner reset')
      },
    })

  const sharedProps = {
    tasks: planner.tasks,
    subjects: planner.subjects,
    onToggle: handleToggle,
    onEdit: openEditTask,
    onDelete: requestDeleteTask,
    onAddTask: openNewTask,
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_10%_-10%,var(--sky-soft),transparent),radial-gradient(50rem_30rem_at_100%_0%,var(--lavender-soft),transparent)]"
      />
      <AppHeader activeView={view} onChangeView={changeView} onAddTask={openNewTask} />

      {!planner.isReady ? (
        <LoadingState />
      ) : (
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 md:pb-12">
          <div key={view}>
            {view === 'dashboard' && <DashboardView {...sharedProps} onChangeView={changeView} />}
            {view === 'tasks' && <TasksView {...sharedProps} />}
            {view === 'calendar' && <CalendarView {...sharedProps} />}
            {view === 'subjects' && (
              <SubjectsView
                tasks={planner.tasks}
                subjects={planner.subjects}
                onAddSubject={(s) => {
                  planner.addSubject(s)
                  notify(`${s.name} added`)
                }}
                onUpdateSubject={(id, updates) => {
                  planner.updateSubject(id, updates)
                  notify('Subject updated')
                }}
                onDeleteSubject={requestDeleteSubject}
                onAddTask={openNewTask}
              />
            )}
          </div>

          <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
            <p>Your plan is saved automatically in this browser.</p>
            <button
              type="button"
              onClick={requestReset}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset sample data
            </button>
          </footer>
        </main>
      )}

      <TaskDialog
        state={taskDialog}
        subjects={planner.subjects}
        onClose={closeTaskDialog}
        onSubmit={handleTaskSubmit}
        onManageSubjects={() => {
          closeTaskDialog()
          changeView('subjects')
        }}
      />

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title ?? ''}
        message={confirm?.message ?? ''}
        confirmLabel={confirm?.confirmLabel}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          confirm?.onConfirm()
          setConfirm(null)
        }}
      />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-6">
        {toast && (
          <div
            key={toast.id}
            className="flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background shadow-xl animate-in fade-in slide-in-from-bottom-4"
          >
            <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />
            {toast.message}
          </div>
        )}
      </div>
    </div>
  )
}
