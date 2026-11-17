'use client'

import { CheckCircle2, Clock3, ListChecks, Plus, Target, Sparkles } from 'lucide-react'
import { ProgressBar } from './progress-bar'
import { QuoteCard } from './quote-card'
import { TaskItem } from './task-item'
import { getSubjectColor } from '@/lib/subject-colors'
import { sortTasks } from '@/lib/use-planner'
import {
  formatDuration,
  formatLongDate,
  getGreeting,
  getWeekDays,
  startOfWeek,
  toDateKey,
  todayKey,
} from '@/lib/date-utils'

function StatCard({ icon: Icon, label, value, hint, tone }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 sm:p-5">
      <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function progressMessage(percent, total) {
  if (total === 0) return 'No tasks planned yet — add one to get started!'
  if (percent === 100) return 'Amazing! You completed everything for today.'
  if (percent >= 60) return 'Great momentum — you’re almost there!'
  if (percent > 0) return 'Nice start! Keep the streak going.'
  return 'Let’s get the first task done.'
}

export function DashboardView({ tasks, subjects, onToggle, onEdit, onDelete, onAddTask, onChangeView }) {
  const today = todayKey()
  const subjectById = Object.fromEntries(subjects.map((s) => [s.id, s]))
  const todayTasks = sortTasks(tasks.filter((t) => t.date === today))
  const completedToday = todayTasks.filter((t) => t.completed).length
  const percent = todayTasks.length ? (completedToday / todayTasks.length) * 100 : 0
  const minutesToday = todayTasks.reduce((sum, t) => sum + (Number(t.duration) || 0), 0)
  const minutesDone = todayTasks.filter((t) => t.completed).reduce((sum, t) => sum + (Number(t.duration) || 0), 0)

  const weekKeys = getWeekDays(startOfWeek(new Date())).map(toDateKey)
  const weekTasks = tasks.filter((t) => weekKeys.includes(t.date))
  const weekDone = weekTasks.filter((t) => t.completed).length

  const upcoming = sortTasks(tasks.filter((t) => t.date > today && !t.completed)).slice(0, 3)

  const subjectStats = subjects
    .map((s) => {
      const list = tasks.filter((t) => t.subjectId === s.id)
      const done = list.filter((t) => t.completed).length
      return { ...s, total: list.length, done }
    })
    .filter((s) => s.total > 0)

  return (
    <div className="flex flex-col gap-6">
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <p className="text-sm font-medium text-primary">{formatLongDate(new Date())}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {getGreeting()}, Scholar
          <Sparkles className="ml-2 inline size-7 text-lavender" aria-hidden="true" />
        </h1>
        <p className="mt-2 text-muted-foreground">
          {todayTasks.length > 0
            ? `You have ${todayTasks.length - completedToday} of ${todayTasks.length} study ${todayTasks.length === 1 ? 'task' : 'tasks'} left today.`
            : 'Your schedule is clear today. Plan something new!'}
        </p>
      </section>

      <section
        aria-label="Study statistics"
        className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500 sm:gap-4 lg:grid-cols-4"
      >
        <StatCard icon={ListChecks} label="Today’s tasks" value={todayTasks.length} hint={`${completedToday} completed`} tone="bg-accent text-accent-foreground" />
        <StatCard icon={CheckCircle2} label="Completed" value={`${Math.round(percent)}%`} hint="of today’s plan" tone="bg-emerald-50 text-emerald-600" />
        <StatCard icon={Clock3} label="Study time" value={formatDuration(minutesToday)} hint={`${formatDuration(minutesDone)} done`} tone="bg-lavender-soft text-secondary-foreground" />
        <StatCard icon={Target} label="This week" value={`${weekDone}/${weekTasks.length}`} hint="tasks finished" tone="bg-sky-soft text-sky-700" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section
            aria-labelledby="progress-heading"
            className="rounded-3xl border border-border bg-card p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 sm:p-6"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="progress-heading" className="text-lg font-semibold">
                  Daily progress
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{progressMessage(Math.round(percent), todayTasks.length)}</p>
              </div>
              <p className="text-3xl font-bold text-primary">{Math.round(percent)}%</p>
            </div>
            <ProgressBar value={percent} label="Today’s completion" className="mt-4 h-4" />
            <p className="mt-2 text-xs text-muted-foreground">
              {completedToday} of {todayTasks.length} tasks completed
            </p>
          </section>

          <section
            aria-labelledby="today-heading"
            className="rounded-3xl border border-border bg-card p-5 animate-in fade-in slide-in-from-bottom-4 duration-700 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="today-heading" className="text-lg font-semibold">
                Today’s study plan
              </h2>
              <button
                type="button"
                onClick={() => onAddTask({ date: today })}
                className="flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition-all hover:brightness-95"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add
              </button>
            </div>
            {todayTasks.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {todayTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    subject={subjectById[task.subjectId]}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border px-6 py-10 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <ListChecks className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-3 font-medium">Nothing planned for today</p>
                <p className="mt-1 text-sm text-muted-foreground">Add a study task to build your plan.</p>
                <button
                  type="button"
                  onClick={() => onAddTask({ date: today })}
                  className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                >
                  Plan a task
                </button>
              </div>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <QuoteCard />

          <section aria-labelledby="subjects-heading" className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="subjects-heading" className="text-lg font-semibold">
                Subjects
              </h2>
              <button
                type="button"
                onClick={() => onChangeView('subjects')}
                className="text-sm font-medium text-primary hover:underline"
              >
                Manage
              </button>
            </div>
            {subjectStats.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {subjectStats.map((s) => {
                  const color = getSubjectColor(s.color)
                  return (
                    <li key={s.id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium">
                          <span className={`size-2.5 rounded-full ${color.dot}`} aria-hidden="true" />
                          {s.name}
                        </span>
                        <span className="text-muted-foreground">
                          {s.done}/{s.total}
                        </span>
                      </div>
                      <ProgressBar value={(s.done / s.total) * 100} label={`${s.name} progress`} className="h-2" barClassName={color.bar} />
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Add tasks to see subject progress.</p>
            )}
          </section>

          <section aria-labelledby="upcoming-heading" className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 id="upcoming-heading" className="mb-4 text-lg font-semibold">
              Up next
            </h2>
            {upcoming.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {upcoming.map((t) => {
                  const subject = subjectById[t.subjectId]
                  const color = getSubjectColor(subject?.color)
                  return (
                    <li key={t.id} className="flex items-center gap-3">
                      <span className={`h-9 w-1 shrink-0 rounded-full ${color.bar}`} aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{t.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(`${t.date}T00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming tasks. You&apos;re all caught up!</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
