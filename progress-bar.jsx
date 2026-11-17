export function ProgressBar({ value, label, className = '', barClassName = '' }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-3 w-full overflow-hidden rounded-full bg-muted ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${barClassName || 'bg-gradient-to-r from-primary to-lavender'}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
