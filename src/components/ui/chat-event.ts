// Open the chat from anywhere (shot: S3's chatbots bubble). ChatWidget mounts late
// (Layout's widgetsReady), so the request is also kept on window: Layout mounts the widgets at
// once when the event fires, and ChatWidget honours the pending placement on mount.
export const CHAT_EVENT = 'mw:chat-open'

type ChatWindow = { __mwChatPending?: string }

export function openChat(placement: string) {
  (window as unknown as ChatWindow).__mwChatPending = placement
  window.dispatchEvent(new CustomEvent(CHAT_EVENT, { detail: { placement } }))
}

/** The placement of a chat open requested before ChatWidget mounted, cleared on read. */
export function takePendingChat(): string | null {
  const w = window as unknown as ChatWindow
  const placement = w.__mwChatPending ?? null
  delete w.__mwChatPending
  return placement
}

/** True while an open request waits for ChatWidget (Layout mounts the widgets at once). */
export function hasPendingChat(): boolean {
  return (window as unknown as ChatWindow).__mwChatPending !== undefined
}
