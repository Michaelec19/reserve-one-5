import api from './axiosConfig.js'

export const classesService = {
  getClasses: async () => {
    try {
      const response = await api.get('/schedules')
      return Array.isArray(response.data) ? response.data : (response.data.content || [])
    } catch (error) {
      console.error('Error obteniendo las clases:', error)
      return []
    }
  }
}
