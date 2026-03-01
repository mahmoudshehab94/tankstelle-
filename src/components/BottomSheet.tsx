export function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-t-3xl bg-white p-4 shadow-xl dark:bg-zinc-900">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        {children}
      </div>
    </div>
  )
}
