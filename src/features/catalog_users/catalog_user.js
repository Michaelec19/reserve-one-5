import { reservationsService } from '../../services/reservationsService.js'
import { Alert } from '../../shared/components/Alert/Alert.js'
import { capitalize } from '../../shared/js/utils.js'
import { ScheduleCardUser } from './components/ScheduleCardUser.js'
import { Filter, initFilter } from './components/Filter.js'
import { initAuthNav } from '../../shared/js/authNav.js'
import api from '../../services/axiosConfig.js'

const SESSION_KEY = 'lanhua_session'
const getSession = () => {
  const session = localStorage.getItem(SESSION_KEY)
  return session ? JSON.parse(session) : null
}
const isAuthenticated = () => Boolean(getSession())

// --- CONEXIÓN AL BACKEND ---
const getClasses = async () => {
  try {
    const response = await api.get('/api/catalog')
    // Adaptamos los nombres que vienen de Spring Boot
    return response.data.map(item => ({
      id: item.idCatalog,
      title: item.name,
      description: item.description,
      category: item.category || [],
      image: item.image
    }))
  } catch (error) {
    console.error('Error obteniendo el catálogo:', error)
    return []
  }
}

const renderFilter = () => {
  const container = document.querySelector('#mainContainer')
  if (!container) return
  const filterContainer = document.createElement('div')
  filterContainer.innerHTML = Filter()
  container.insertBefore(filterContainer, container.querySelector('#disciplinesContainer'))
}

const renderFilteredClasses = (classes) => {
  const cardsContainer = document.querySelector('#disciplinesContainer')
  if (!cardsContainer) return
  cardsContainer.innerHTML = ''

  if (!classes || classes.length === 0) {
    cardsContainer.innerHTML = Alert({
      variant: 'info',
      title: 'No se encontraron programas',
      text: 'Intenta con otros filtros o borra los filtros actuales.'
    })
    return
  }

  classes.forEach(classItem => {
    cardsContainer.innerHTML += ScheduleCardUser(classItem)
  })
}

const renderClasses = async () => {
  const cardsContainer = document.querySelector('#disciplinesContainer')
  if (!cardsContainer) return

  const classes = await getClasses()
  cardsContainer.innerHTML = ''

  if (!classes || classes.length === 0) {
    cardsContainer.innerHTML = Alert({
      variant: 'info',
      title: 'No hay programas disponibles',
      text: 'Actualmente no hay disciplinas creadas por el administrador.'
    })
    return
  }

  classes.forEach(classItem => {
    cardsContainer.innerHTML += ScheduleCardUser(classItem)
  })
}

const setupEventListeners = () => {
  const cardsContainer = document.querySelector('#disciplinesContainer')
  if (!cardsContainer) return

  cardsContainer.addEventListener('click', async (event) => {
    const reserveBtn = event.target.closest('.reserve-btn')
    if (reserveBtn) {
      if (!isAuthenticated()) {
        Swal.fire({
          icon: 'warning',
          title: 'Iniciar Sesión Requerido',
          text: 'Debes Iniciar Sesión y tener una Mensualidad activa.',
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: 'Iniciar Sesión',
          denyButtonText: 'Mensualidades',
          cancelButtonText: 'Cancelar',
          customClass: {
            confirmButton: 'btn btn-primary px-3',
            cancelButton: 'btn btn-secondary px-3',
            denyButton: 'btn btn-warning px-3 text-dark'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '../auth/auth.html'
          } else if (result.isDenied) {
            window.location.href = '../pricing/pricing.html'
          }
        })
        return
      }

      const classId = reserveBtn.getAttribute('data-id')
      const classes = await getClasses()
      const selectedClass = classes.find(c => String(c.id) === String(classId))

      if (!selectedClass) return

      // Mapeamos las categorías para mostrarlas de forma bonita
      const categoryLabels = {
        'Kids': 'Kids',
        'Regular': 'Regular',
        'Estudiantes': 'Tarifa de Estudiantes',
        'Gratis': 'Gratis',
        'FullPass': 'Full Pass',
        'EspecializadaSinMensualidad': 'Sin Mens. Activa',
        'EspecializadaAdicional': 'Adicional'
      };

      const catTexts = selectedClass.category.map(cat => categoryLabels[cat] || cat).join(', ');

      Swal.fire({
        title: '<strong>Me interesa este Programa</strong>',
        icon: 'question',
        html: `
          <div class="text-start mt-3 d-flex flex-column gap-2 fs-6">
            <p class="mb-1"><strong>Programa:</strong> ${capitalize(selectedClass.title)}</p>
            <p class="mb-1"><strong>Descripción:</strong> ${selectedClass.description}</p>
            <p class="mb-0"><strong>Categorías:</strong> ${catTexts}</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar a mis intereses',
        cancelButtonText: 'Cancelar',
        buttonsStyling: true,
        customClass: {
          confirmButton: 'btn btn-primary px-4',
          cancelButton: 'btn btn-secondary px-4'
        }
      }).then(async (result) => {
        if (result.isConfirmed) {

          const reservationResult = await reservationsService.addReservation(selectedClass)
          if (reservationResult.success) {
            Swal.fire({
              title: '¡Agregado!',
              text: `Has marcado tu interés por ${capitalize(selectedClass.title)}. Ve a tu perfil para más detalles.`,
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Ver Mis Reservas',
              cancelButtonText: 'Continuar Explorando',
              reverseButtons: true,
              customClass: {
                confirmButton: 'btn btn-success px-3',
                cancelButton: 'btn btn-outline-dark px-3'
              }
            }).then((navigationResult) => {
              if (navigationResult.isConfirmed) {
                window.location.href = '../reservations/reservations.html'
              }
            })
          } else {
            Swal.fire({
              title: 'Programa ya agregado',
              text: reservationResult.message,
              icon: 'warning',
              confirmButtonText: 'Entendido',
              customClass: {
                confirmButton: 'btn btn-warning px-4'
              }
            })
          }
        }
      })
    }
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  initAuthNav()
  renderFilter()
  initFilter(renderFilteredClasses, renderClasses)
  await renderClasses()
  setupEventListeners()
})