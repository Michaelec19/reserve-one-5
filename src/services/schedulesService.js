import api from './axiosConfig.js'

export const schedulesService = {
  getClasses: async () => {
    try {
      const response = await api.get('/schedules')
      return Array.isArray(response.data) ? response.data : (response.data.content || [])
    } catch (error) {
      console.error('Error obteniendo las clases:', error)
      return []
    }
  },

  getScheduledById: async (id) => {
    try {
      const response = await api.get(`/schedules/scheduled/${id}`)
      return Array.isArray(response.data) ? response.data : (response.data.content || [])
    } catch (error) {
      console.error('Error obteniendo las clases agendadas:', error)
      return []
    }
  },

  deleteClass: async (id) => {
    try {
      await api.delete(`/schedules/${id}`)
      return true
    } catch (error) {
      console.error('Error al eliminar:', error)
      return false
    }
  }
}
