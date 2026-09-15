/* eslint-disable space-before-function-paren */
import api from './axiosConfig.js'

const getCurrentUser = () => {
  const session = window.localStorage.getItem('lanhua_session')
  return session ? JSON.parse(session) : null
}

export const reservationsService = {

  getReservations: async () => {
    try {
      const user = getCurrentUser()

      if (!user) {
        console.warn('No hay sesión de usuario activa en localStorage.')
        return []
      }

      const userId = user.id || user.idUser || 1

      const response = await api.get(`/reservations/user/${userId}`)

      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      return []
    }
  },

  getPendingReservations: async () => {
    const reservations = await reservationsService.getReservations()

    const filtered = reservations.filter(res => {
      const state = (res.reservationState || '').toUpperCase()
      return state === 'PENDIENTE' || state === 'PENDING'
    })

    return filtered
  },

  getConfirmedReservations: async () => {
    const reservations = await reservationsService.getReservations()
    return reservations.filter(res => res.reservationState === 'CONFIRMED' || res.reservationState === 'confirmed')
  },

  getAllConfirmedReservations: async () => {
    try {
      const response = await api.get('/reservations')
      const reservations = Array.isArray(response.data) ? response.data : (response.data.content || [])

      return reservations.filter(res => {
        const state = (res.reservationState || '').toUpperCase()
        return state === 'CONFIRMED'
      })
    } catch (error) {
      console.error('Error obteniendo las reservas globales:', error)
      return []
    }
  },

  addReservation: async (selectedClass) => {
    try {
      const user = getCurrentUser()
      if (!user) {
        return { success: false, message: 'Debes iniciar sesión para reservar una clase' }
      }

      const reservationData = {
        idSchedule: selectedClass.id || selectedClass.idSchedule,
        idUsers: [user.id || user.idUser || 5]
      }

      const response = await api.post('/reservations', reservationData)
      return {
        success: true,
        message: 'Reserva agregada temporalmente',
        data: response.data
      }
    } catch (error) {
      console.error('Error al agregar la reserva:', error)
      const errorMsg = error.response?.data?.message || 'Ya tienes una reserva para esta clase o hubo un error.'
      return { success: false, message: errorMsg }
    }
  },

  removeReservation: async (reservationId) => {
    try {
      const token = window.localStorage.getItem('lanhua_token')

      await api.put(`/reservations/${reservationId}/cancel`, {}, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      })
      return { success: true }
    } catch (error) {
      console.error('Error al cancelar la reserva:', error)
      return { success: false }
    }
  },

  confirmUserReservations: async () => {
    try {
      const user = getCurrentUser()
      if (!user) return { success: false }

      const userId = user.id || user.idUser || 1

      await api.put(`/reservations/user/${userId}/confirm`)

      return { success: true }
    } catch (error) {
      console.error('Error al confirmar las reservas:', error)
      return { success: false }
    }
  }
}
