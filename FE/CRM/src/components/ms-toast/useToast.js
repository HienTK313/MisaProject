// src/components/ms-toast/useToast.js
import { showToast } from './toastStore'

export function useToast() {
  return {
    success(message, opts) {
      showToast('success', message, opts)
    },
    error(message, opts) {
      showToast('error', message, opts)
    },
    info(message, opts) {
      showToast('info', message, opts)
    },
    warning(message, opts) {
      showToast('warning', message, opts)
    },
    // giữ backward-compat
    warn(message, opts) {
      showToast('warning', message, opts)
    },
  }
}
