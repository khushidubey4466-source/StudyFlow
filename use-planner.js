'use client'

import { useCallback, useEffect, useState } from 'react'
import { addDays, startOfWeek, toDateKey } from './date-utils'

const STORAGE_KEY = 'studyflow-planner-v1'

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function createSampleData() {
  const today = new Date()
  const weekStart = startOfWeek(today)
  const day = (offset) => toDateKey(addDays(weekStart, offset))
  const todayKey = toDateKey(today)

  const subjects = [
    { id: 'math', name: 'Mathematics', color: 'indigo' },
    { id: 'physics', name: 'Physics', color: 'violet' },
    { id: 'english', name: 'English Literature', color: 'pink' },
    { id: 'cs', name: 'Computer Science', color: 'sky' },
    { id: 'history', name: 'History', color: 'amber' },
  ]

  const tasks = [
    { title: 'Review calculus derivatives', subjectId: 'math', date: todayKey, time: '09:00', duration: 60, priority: 'high', completed: true, notes: 'Chapter 3, exercises 1–20' },
    { title: 'Read Chapter 5 of Hamlet', subjectId: 'english', date: todayKey, time: '11:00', duration: 45, priority: 'medium', completed: false, notes: '' },
    { title: 'Practice Newton’s laws problems', subjectId: 'physics', date: todayKey, time: '14:00', duration: 90, priority: 'high', completed: false, notes: 'Focus on free-body diagrams' },
    { title: 'Code a binary search exercise', subjectId: 'cs', date: todayKey, time: '16:30', duration: 40, priority: 'low', completed: false, notes: '' },
    { title: 'Linear algebra quiz prep', subjectId: 'math', date: day(0), time: '10:00', duration: 60, priority: 'medium', completed: true, notes: '' },
    { title: 'Summarize World War I causes', subjectId: 'history', date: day(1), time: '15:00', duration: 50, priority: 'medium', completed: true, notes: '' },
    { title: 'Lab report: pendulum motion', subjectId: 'physics', date: day(2), time: '13:00', duration: 120, priority: 'high', completed: false, notes: '' },
    { title: 'Essay outline: themes in Hamlet', subjectId: 'english', date: day(3), time: '17:00', duration: 60, priority: 'medium', completed: false, notes: '' },
    { title: 'Data structures flashcards', subjectId: 'cs', date: day(4), time: '09:30', duration: 30, priority: 'low', completed: false, notes: '' },
    { title: 'Weekly revision session', subjectId: 'math', date: day(5), time: '11:00', duration: 120, priority: 'high', completed: false, notes: 'Go over the full week' },
    { title: 'History timeline review', subjectId: 'history', date: day(6), time: '16:00', duration: 45, priority: 'low', completed: false, notes: '' },
  ]

  const seen = new Set()
  return {
    subjects,
    tasks: tasks
      .filter((t) => {
        const key = `${t.title}-${t.date}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .map((t) => ({ ...t, id: createId(), createdAt: Date.now() })),
  }
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.tasks) && Array.isArray(parsed.subjects)) {
        return parsed
      }
    }
  } catch {
    // Corrupt or unavailable storage falls back to sample data.
  }
  return createSampleData()
}

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return (a.time || '99:99').localeCompare(b.time || '99:99')
  })
}

export function usePlanner() {
  const [state, setState] = useState({ tasks: [], subjects: [] })
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setState(loadState())
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage may be full or disabled; the app keeps working in memory.
    }
  }, [state, isReady])

  const addTask = useCallback((task) => {
    setState((s) => ({
      ...s,
      tasks: [...s.tasks, { ...task, id: createId(), completed: false, createdAt: Date.now() }],
    }))
  }, [])

  const updateTask = useCallback((id, updates) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  }, [])

  const toggleTask = useCallback((id) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }))
  }, [])

  const deleteTask = useCallback((id) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }))
  }, [])

  const addSubject = useCallback((subject) => {
    setState((s) => ({
      ...s,
      subjects: [...s.subjects, { ...subject, id: createId() }],
    }))
  }, [])

  const updateSubject = useCallback((id, updates) => {
    setState((s) => ({
      ...s,
      subjects: s.subjects.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub)),
    }))
  }, [])

  const deleteSubject = useCallback((id) => {
    setState((s) => ({
      subjects: s.subjects.filter((sub) => sub.id !== id),
      tasks: s.tasks.filter((t) => t.subjectId !== id),
    }))
  }, [])

  const resetToSample = useCallback(() => {
    setState(createSampleData())
  }, [])

  return {
    isReady,
    tasks: state.tasks,
    subjects: state.subjects,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    addSubject,
    updateSubject,
    deleteSubject,
    resetToSample,
  }
}
