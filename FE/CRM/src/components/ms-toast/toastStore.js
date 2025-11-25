// src/components/ms-toast/toastStore.js
import { reactive } from 'vue'

let _id = 0

export const toastState = reactive({
  items: [],
})

/**
 * showToast có thể gọi theo 2 kiểu:
 * 1) showToast('success', 'Thành công', { duration: 2500 })
 * 2) showToast({ type:'success', message:'Thành công', duration:2500 })
 */
export function showToast(arg1, arg2, arg3) {
  let payload = {}

  if (typeof arg1 === 'string') {
    payload = {
      type: arg1,
      message: arg2,
      ...(arg3 || {}),
    }
  } else {
    payload = { ...(arg1 || {}) }
  }

  const { type = 'info', message = '', duration = 2500, closable = true } = payload

  const normalizedType = normalizeType(type)

  const id = ++_id
  toastState.items.push({
    id,
    type: normalizedType,
    message,
    duration,
    closable,
    createdAt: Date.now(),
  })

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }

  return id
}

export function removeToast(id) {
  const idx = toastState.items.findIndex((t) => t.id === id)
  if (idx >= 0) toastState.items.splice(idx, 1)
}

export function clearToasts() {
  toastState.items.splice(0, toastState.items.length)
}

function normalizeType(t) {
  const v = (t || '').toString().toLowerCase().trim()
  if (v === 'warn') return 'warning'
  if (v === 'danger') return 'error'
  return ['success', 'error', 'info', 'warning'].includes(v) ? v : 'info'
}
