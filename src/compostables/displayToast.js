import { useToast as usePrimeToast } from "primevue/usetoast"

const DEFAULT_MESSAGES = {
  401: 'Your session expired. Please log in again.',
  403: "We can't complete your request.",
  404: 'This is not available right now.',
  422: "We can't complete your request",
  429: 'Too many attempts. Please wait a minute and try again.'
}

export function displayToast() {
  const toast = usePrimeToast()

  const notifyError = (summary, error, messages = {}) => {
    console.error(error)
    const detail = messages[error?.response?.status] || DEFAULT_MESSAGES[error?.response?.status] || 'Something went wrong. Please try again.'
    toast.add({ severity: 'error', summary, detail, life: 5000 })
  }

  const notifySuccess = (summary, detail, life = 5000) => {
    toast.add({ severity: 'success', summary, detail, life })
  }

  return { notifyError, notifySuccess }
}
