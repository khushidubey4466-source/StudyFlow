'use client'

import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, description, children, size = 'md' }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) onClose()
  }

  const width = size === 'sm' ? 'max-w-sm' : 'max-w-lg'

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
      className={`m-auto w-[calc(100%-2rem)] ${width} rounded-3xl border border-border bg-card p-0 text-card-foreground shadow-2xl shadow-primary/10 open:animate-in open:fade-in open:zoom-in-95`}
    >
      {open && (
        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-balance">
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
