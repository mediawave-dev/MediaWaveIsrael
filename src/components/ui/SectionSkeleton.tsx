import { m } from 'framer-motion'

interface SectionSkeletonProps {
  lines?: number
  showHeader?: boolean
}

function ShimmerLine({ width = '100%', height = '1rem' }: { width?: string; height?: string }) {
  return (
    <m.div
      className="rounded-md"
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, #F5F0E8 25%, #FDFBF7 50%, #F5F0E8 75%)',
        backgroundSize: '200% 100%',
      }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export default function SectionSkeleton({ lines = 3, showHeader = true }: SectionSkeletonProps) {
  return (
    <div className="py-16 md:py-24" aria-hidden="true">
      <div className="container max-w-5xl">
        {showHeader && (
          <div className="text-center mb-12 space-y-3">
            <div className="flex justify-center">
              <ShimmerLine width="12rem" height="2rem" />
            </div>
            <div className="flex justify-center">
              <ShimmerLine width="20rem" height="1.25rem" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="bg-white/60 rounded-2xl p-6 space-y-4">
              <ShimmerLine width="3rem" height="3rem" />
              <ShimmerLine width="70%" height="1.25rem" />
              <ShimmerLine width="100%" height="0.875rem" />
              <ShimmerLine width="85%" height="0.875rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
