// src/components/ms-dialog/useConfirm.js
import { openConfirm } from './dialogStore'

export function useConfirm() {
  return {
    confirm(options) {
      return openConfirm(options)
    },
  }
}
