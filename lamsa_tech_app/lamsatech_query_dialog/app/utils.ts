
type FrappeCallOptions = frappe.FrappeCallOptions

export function frappeCallAsync (options: Omit<FrappeCallOptions, 'callback' | 'error' >): Promise<{ message?: any }> {
  return new Promise((resolve, reject) => {
    frappe.call({
      ...options,
      callback (r) {
        resolve(r)
      },
      error (err) {
        reject(err)
      },
    })
  })
}
