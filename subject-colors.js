export const SUBJECT_COLORS = {
  sky: {
    label: 'Sky',
    dot: 'bg-sky-500',
    soft: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    bar: 'bg-sky-500',
  },
  violet: {
    label: 'Violet',
    dot: 'bg-violet-500',
    soft: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    bar: 'bg-violet-500',
  },
  indigo: {
    label: 'Indigo',
    dot: 'bg-indigo-500',
    soft: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    bar: 'bg-indigo-500',
  },
  pink: {
    label: 'Pink',
    dot: 'bg-pink-500',
    soft: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    bar: 'bg-pink-500',
  },
  teal: {
    label: 'Teal',
    dot: 'bg-teal-500',
    soft: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    bar: 'bg-teal-500',
  },
  amber: {
    label: 'Amber',
    dot: 'bg-amber-500',
    soft: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    bar: 'bg-amber-500',
  },
}

export const COLOR_KEYS = Object.keys(SUBJECT_COLORS)

export function getSubjectColor(key) {
  return SUBJECT_COLORS[key] ?? SUBJECT_COLORS.indigo
}
