// src/api/customersApi.js
import http from './http'

/**
 * GET LIST (paged + filter + sort)
 * BE: GET /api/customers?page=&pageSize=&sortColumn=&sortDirection=&name=&email=&phone=
 */
export function getCustomers(params) {
  return http.get('/customers', { params })
}

/** GET BY ID */
export function getCustomerById(id) {
  return http.get(`/customers/${id}`)
}

/** CREATE */
export function createCustomer(dto) {
  return http.post('/customers', dto)
}

/** UPDATE */
export function updateCustomer(id, dto) {
  return http.put(`/customers/${id}`, dto)
}

/** SOFT DELETE 1 */
export function softDeleteCustomer(id) {
  return http.delete(`/customers/${id}`)
}

/** UPDATE STATUS MANY */
export function updateStatusMany(ids, status) {
  return http.patch('/customers/status', { ids, status })
}

/** IMPORT EXCEL/CSV */
export function importCustomers(file) {
  const fd = new FormData()
  fd.append('file', file)

  return http.post('/customers/import', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
