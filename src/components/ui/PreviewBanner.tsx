import { usePreview } from '../../sanity/PreviewContext'

export default function PreviewBanner() {
  const { isPreview, exitPreview } = usePreview()

  if (!isPreview) return null

  return (
    <div
      dir="rtl"
      className="fixed top-0 inset-x-0 z-[9999] bg-amber-400 text-amber-950 text-sm font-medium py-2 px-4 flex items-center justify-center gap-3 shadow-md"
    >
      <span>
        מצב תצוגה מקדימה: התוכן שמוצג כולל טיוטות שלא פורסמו
      </span>
      <button
        onClick={exitPreview}
        className="bg-amber-950 text-amber-100 px-3 py-1 rounded text-xs font-bold hover:bg-amber-900 transition-colors"
      >
        יציאה מתצוגה מקדימה
      </button>
    </div>
  )
}
