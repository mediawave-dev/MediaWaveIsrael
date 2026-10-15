// Types for lead-intent.js (vendored from the site-director skill: assets/lead/lead-intent.js).
export interface LeadIntentState {
  activeMs: number
  depth: number
  points: number
  signals: string[]
  opened: boolean
  blockedBy: string | null
}
export interface LeadIntentOptions {
  onOpen: (reason: string, state: LeadIntentState) => void
  isBusy?: () => boolean
  threshold?: number
  minActiveMs?: number
  engagedActiveMs?: number
  engagedDepth?: number
  interestDwellMs?: number
  signalUses?: number
  hiddenReturnMs?: number
  scrollBackVp?: number
  exitIntent?: boolean
  exitMinActiveMs?: number
  exitMinDepth?: number
  cooldownDays?: number
  legacyConverted?: string[]
  legacyDismissed?: string[]
}
export interface LeadIntent {
  dismissed(): void
  converted(): void
  destroy(): void
  state(): LeadIntentState
}
export function createLeadIntent(opts: LeadIntentOptions): LeadIntent
