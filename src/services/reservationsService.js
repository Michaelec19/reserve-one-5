const LOCALSTORAGE_KEY = 'lanhua_reservations'
const SESSION_KEY = 'lanhua_session'

const getCurrentUserId = () => {
  const session = localStorage.getItem(SESSION_KEY)
  if (!session) return null
  return JSON.parse(session).id
}

const getAllReservations = () => {
  const savedData = localStorage.getItem(LOCALSTORAGE_KEY)
  return savedData ? JSON.parse(savedData) : []
}

const saveAllReservations = (reservations) => {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(reservations))
}

const getReservations = () => {
  const userId = getCurrentUserId()
  if (!userId) return []

  const allReservations = getAllReservations()
  return allReservations.filter(reservation => reservation.userId === userId)
}

const getPendingReservations = () => {
  return getReservations().filter(res => res.status !== 'confirmed')
}

const getConfirmedReservations = () => {
  return getReservations().filter(res => res.status === 'confirmed')
}

const addReservation = (classItem) => {
  const userId = getCurrentUserId()

  if (!userId) {
    return {
      success: false,
      message: 'Debes iniciar sesión para reservar una clase'
    }
  }

  const allReservations = getAllReservations()

  const isAlreadyReserved = allReservations.some(
    reservation => reservation.id === classItem.id && reservation.userId === userId
  )

  if (isAlreadyReserved) {
    return {
      success: false,
      message: 'Ya tienes una reserva para esta clase'
    }
  }

  const newReservation = {
    ...classItem,
    userId,
    status: 'pending',
    reservedAt: new Date().toISOString()
  }

  allReservations.push(newReservation)
  saveAllReservations(allReservations)

  return {
    success: true,
    message: 'Reserva confirmada exitosamente'
  }
}

const removeReservation = (classId) => {
  const userId = getCurrentUserId()
  if (!userId) return

  const allReservations = getAllReservations()

  const updatedReservations = allReservations.filter(
    reservation => !(reservation.id === classId && reservation.userId === userId)
  )

  saveAllReservations(updatedReservations)
}

const removeAllPendingReservations = () => {
  const userId = getCurrentUserId()
  if (!userId) return

  const allReservations = getAllReservations()
  const updatedReservations = allReservations.filter(
    reservation => !(reservation.userId === userId && reservation.status !== 'confirmed')
  )

  saveAllReservations(updatedReservations)
}

const confirmUserReservations = () => {
  const userId = getCurrentUserId()
  if (!userId) return

  const allReservations = getAllReservations()
  const updatedReservations = allReservations.map(reservation => {
    if (reservation.userId === userId && reservation.status !== 'confirmed') {
      return { ...reservation, status: 'confirmed' }
    }
    return reservation
  })

  saveAllReservations(updatedReservations)
}

const getAllConfirmedReservationsAdmin = () => {
  const allReservations = getAllReservations()
  return allReservations.filter(res => res.status === 'confirmed')
}

export const reservationsService = {
  getReservations,
  getPendingReservations,
  getConfirmedReservations,
  getAllConfirmedReservationsAdmin,
  addReservation,
  removeReservation,
  removeAllPendingReservations,
  removeAllReservations: removeAllPendingReservations,
  clearPendingReservations: removeAllPendingReservations,
  confirmUserReservations
}
