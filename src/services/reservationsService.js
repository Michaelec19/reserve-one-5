/* eslint-disable no-undef */
const LOCALSTORAGE_KEY = 'lanhua_reservations'

const getReservations = () => {
  const savedData = localStorage.getItem(LOCALSTORAGE_KEY)

  if (!savedData) {
    return []
  }

  return JSON.parse(savedData)
}

const addReservation = (classItem) => {
  const reservations = getReservations()

  // Verificar si la clase ya está reservada
  const isAlreadyReserved = reservations.some(reservation => reservation.id === classItem.id)

  if (isAlreadyReserved) {
    return {
      success: false,
      message: 'Ya tienes una reserva para esta clase'
    }
  }

  // Agregar la nueva reserva
  const newReservation = {
    ...classItem,
    reservedAt: new Date().toISOString()
  }

  reservations.push(newReservation)
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(reservations))

  return {
    success: true,
    message: 'Reserva confirmada exitosamente'
  }
}

const removeReservation = (classId) => {
  const reservations = getReservations()
  const updatedReservations = reservations.filter(reservation => reservation.id !== classId)
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedReservations))
}

export const reservationsService = {
  getReservations,
  addReservation,
  removeReservation
}
