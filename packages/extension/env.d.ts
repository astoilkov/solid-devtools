export {}

declare global {
  namespace chrome.runtime {
    interface MessageSender {
      documentId: string
    }
  }
  const __ADAPTER_VERSION__: string
}
