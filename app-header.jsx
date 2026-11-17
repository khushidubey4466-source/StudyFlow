'use client'

import { BookOpen, CalendarDays, LayoutDashboard, ListTodo, Plus, GraduationCap } from 'lucide-react'

export const VIEWS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
]

export function AppHeader({ activeView, onChangeView, onAddTask }) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => onChangeView('dashboard')}
            className="flex items-center gap-2.5 rounded-xl"
            aria-label="StudyFlow home"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-lavender text-primary-foreground shadow-md shadow-primary/30">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">StudyFlow</span>
          </button>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-2xl bg-muted p-1">
              {VIEWS.map((view) => {
                const Icon = view.icon
                const isActive = activeView === view.id
                return (
                  <li key={view.id}>
                    <button
                      type="button"
                      onClick={() => onChangeView(view.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-card text-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {view.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => onAddTask()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-lavender px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.97] sm:px-4"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Add task</span>
          </button>
        </div>
      </header>

      <nav
        aria-label="Main mobile"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <ul className="grid grid-cols-4">
          {VIEWS.map((view) => {
            const Icon = view.icon
            const isActive = activeView === view.id
            return (
              <li key={view.id}>
                <button
                  type="button"
                  onClick={() => onChangeView(view.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <span
                    className={`flex h-7 w-12 items-center justify-center rounded-full transition-all ${
                      isActive ? 'bg-accent' : ''
                    }`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  {view.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
