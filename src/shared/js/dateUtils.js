// utils/dateUtils.js

export const setMinDateToday = (selector) => {
  const input = document.querySelector(selector)
  if (!input) return

  const today = new Date().toLocaleDateString('en-CA')
  input.min = today
}
