// utils/dateUtils.js

export const setMinDateToday = (selector) => {
  const input = document.querySelector(selector)
  if (!input) return

  const today = new Date().toLocaleDateString('en-CA')
  input.min = today
}

export const formatScheduleDate = (dateString) => {
  const date = new Date(dateString)

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const weekDay = days[date.getDay()]

  let hours = date.getHours()
  const minutes = date.getMinutes()

  const period = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12 || 12

  const formattedMinutes = minutes.toString().padStart(2, '0')

  const time = minutes === 0
    ? `${hours} ${period} `
    : `${hours}:${formattedMinutes} ${period} `

  return `${day} ${month} ${year} — ${weekDay} ${time} `
}
