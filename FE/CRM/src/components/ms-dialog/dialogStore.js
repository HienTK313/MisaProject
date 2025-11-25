// src/components/ms-dialog/dialogStore.js
import { reactive } from 'vue'

export const dialogState = reactive({
  open: false,
  title: '',
  message: '',
  confirmText: 'Đồng ý',
  cancelText: 'Hủy',
  resolve: null,
})

/**
 * Mở dialog xác nhận
 * @param {Object} options
 *  - title: tiêu đề
 *  - message: nội dung
 *  - confirmText: text nút chính
 *  - cancelText: text nút phụ
 *  - danger: true => nút chính màu đỏ (nếu bạn muốn tuỳ biến sau)
 */
export function openConfirm(options = {}) {
  return new Promise((resolve) => {
    dialogState.open = true
    dialogState.title = options.title || 'Xác nhận'
    dialogState.message = options.message || ''
    dialogState.confirmText = options.confirmText || 'Đồng ý'
    dialogState.cancelText = options.cancelText || 'Hủy'
    dialogState.resolve = resolve
  })
}

export function closeConfirm(result) {
  if (dialogState.resolve) {
    dialogState.resolve(result)
  }
  dialogState.open = false
  dialogState.resolve = null
}
