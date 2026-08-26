import { classesService } from '../../../services/classesService.js'
import { reservationsService } from '../../../services/reservationsService.js'
import { Alert } from '../../../shared/components/Alert/Alert.js'
import { capitalize } from '../../../shared/js/utils.js'
import { ScheduleCardUser } from './components/ScheduleCardUser.js'
import { Filter, initFilter } from './components/Filter.js'

const USER_SESSION_KEY = 'lanhua_user'

const isAuthenticated = () => {
  const user = localStorage.getItem(USER_SESSION_KEY) || sessionStorage.getItem(USER_SESSION_KEY)
  return Boolean(user)
}

const getClasses = async () => {
  return await classesService.getClasses()
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
      title: 'No se encontraron clases',
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
      title: 'No hay clases disponibles',
      text: 'Actualmente no hay horarios o clases creadas por el administrador.'
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
          text: 'Debes ingresar a tu cuenta o registrarte para poder reservar una clase.',
          showCancelButton: true,
          confirmButtonText: 'Iniciar Sesión / Registrarse',
          cancelButtonText: 'Cancelar',
          customClass: {
            confirmButton: 'btn btn-primary px-3',
            cancelButton: 'btn btn-secondary px-3'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '../../auth/login.html'
          }
        })
        return
      }

      const classId = reserveBtn.getAttribute('data-id')
      const classes = await getClasses()
      const selectedClass = classes.find(c => String(c.id) === String(classId))

      if (!selectedClass) return

      Swal.fire({
        title: '<strong>Confirmar Reserva</strong>',
        icon: 'question',
        html: `
          <div class="text-start mt-3 d-flex flex-column gap-2 fs-6">
            <p class="mb-1"><strong>Clase:</strong> ${capitalize(selectedClass.title)}</p>
            <p class="mb-1"><strong>Nivel:</strong> ${capitalize(selectedClass.level)}</p>
            <p class="mb-1"><strong>Horario:</strong> ${selectedClass.dateText}</p>
            <p class="mb-1"><strong>Ubicación:</strong> ${selectedClass.location}</p>
            <p class="mb-0"><strong>Modalidad:</strong> ${capitalize(selectedClass.modality)}</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirmar Reserva',
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
              title: '¡Reserva Confirmada!',
              text: `Has reservado tu cupo para la clase de ${capitalize(selectedClass.title)}.`,
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Ver mis reservas',
              cancelButtonText: 'Continuar reservando',
              reverseButtons: true,
              customClass: {
                confirmButton: 'btn btn-success px-3',
                cancelButton: 'btn btn-outline-dark px-3'
              }
            }).then((navigationResult) => {
              if (navigationResult.isConfirmed) {
                window.location.href = '../../reservations/reservations.html'
              }
            })
          } else {
            Swal.fire({
              title: 'Clase ya reservada',
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
  renderFilter()
  initFilter(renderFilteredClasses, renderClasses)
  await renderClasses()
  setupEventListeners()
})