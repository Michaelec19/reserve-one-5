/* eslint-disable no-undef */
<<<<<<< HEAD
import { Alert } from '../../../shared/components/Alert/Alert.js'
import { capitalize } from '../../../shared/js/utils.js'

const LOCALSTORAGE_KEY = 'lanhua_classes'
const USER_SESSION_KEY = 'lanhua_user' 

const defaultClasses = [
  {
    id: crypto.randomUUID(),
    title: 'rutina',
    level: 'principiante',
    capacity: 15,
    date: '2026-07-02T18:00',
    dateText: '2 Julio 2026 — Lunes 6 PM',
    location: 'Medellín',
    modality: 'grupal',
    image: '../../../assets/1.png'
  },
  {
    id: crypto.randomUUID(),
    title: 'combate',
    level: 'avanzado',
    capacity: 10,
    date: '2026-07-03T19:00',
    dateText: '3 Julio 2026 — Martes 7 PM',
    location: 'Medellín',
    modality: 'grupal',
    image: '../../../assets/2.png'
  },
  {
    id: crypto.randomUUID(),
    title: 'taichi',
    level: 'intermedio',
    capacity: 20,
    date: '2026-07-04T17:00',
    dateText: '4 Julio 2026 — Miércoles 5 PM',
    location: 'Sabaneta',
    modality: 'grupal',
    image: '../../../assets/3.png'
  }
]

const isAuthenticated = () => {
  const user = localStorage.getItem(USER_SESSION_KEY) || sessionStorage.getItem(USER_SESSION_KEY)
  return Boolean(user)
}

const ScheduleCardUser = (classItem) => {
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="class-card bg-white text-dark border rounded shadow-sm h-100">
        <div class="position-relative">
          <img src="${classItem.image}" alt="${classItem.title}" class="card-img-top">
          <span class="badge position-absolute bottom-0 start-0 m-2 class-badge">${capitalize(classItem.level)}</span>
        </div>

        <div class="card-body p-3 d-flex flex-column gap-2 text-dark">
          <h4 class="class-title h5 m-0 fw-bold text-dark">${capitalize(classItem.title)}</h4>

          <div class="d-flex flex-column gap-2 fs-6 flex-grow-1 text-secondary">
            <div class="class-item d-flex align-items-center gap-2">
              <i class="fa-solid fa-users text-dark" aria-hidden="true"></i>
              <span class="text-dark">${classItem.capacity} Cupos disponibles</span>
            </div>

            <div class="class-item d-flex align-items-center gap-2">
              <i class="fa-solid fa-calendar text-dark" aria-hidden="true"></i>
              <time datetime="${classItem.date}" class="d-flex gap-1 text-dark">
                <span>${classItem.dateText}</span>
              </time>
            </div>

            <div class="class-item d-flex align-items-center gap-2">
              <i class="fa-solid fa-location-dot text-dark" aria-hidden="true"></i>
              <span class="text-dark">Ubicación: ${classItem.location}</span>
            </div>

            <div class="class-item d-flex align-items-center gap-2">
              <i class="fa-solid fa-shoe-prints text-dark" aria-hidden="true"></i>
              <span class="text-dark">Modalidad: ${capitalize(classItem.modality)}</span>
            </div>
          </div>

          <hr class="my-2 opacity-25 border-dark">

          <div class="d-flex justify-content-end">
            <button class="btn btn-action w-100 py-2 d-flex align-items-center justify-content-center gap-2 reserve-btn"
              type="button" aria-label="Reservar clase" data-id="${classItem.id}">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Reservar Clase</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  `
}
=======
import { classesService } from '../../../services/classesService.js'
import { reservationsService } from '../../../services/reservationsService.js'
import { Alert } from '../../../shared/components/Alert/Alert.js'
import { capitalize } from '../../../shared/js/utils.js'
import { ScheduleCardUser } from './components/ScheduleCardUser.js'
import { Filter, initFilter } from './components/Filter.js'
>>>>>>> 559c469bb93707c45e568137892c54fecc2c8ac0

const getClasses = () => {
  return classesService.getClasses()
}

const renderFilter = () => {
  const container = document.querySelector('#mainContainer')
  const filterContainer = document.createElement('div')
  filterContainer.innerHTML = Filter()
  container.insertBefore(filterContainer, container.querySelector('#disciplinesContainer'))
}

const renderFilteredClasses = (classes) => {
  const cardsContainer = document.querySelector('#disciplinesContainer')

  cardsContainer.innerHTML = ''

  if (classes.length === 0) {
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

const renderClasses = () => {
  const classes = getClasses()
  const cardsContainer = document.querySelector('#disciplinesContainer')

  if (!cardsContainer) return

  cardsContainer.innerHTML = ''

  if (classes.length === 0) {
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

  cardsContainer.addEventListener('click', (event) => {
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
      const classes = getClasses()
      const selectedClass = classes.find(c => c.id === classId)

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
      }).then((result) => {
        if (result.isConfirmed) {
<<<<<<< HEAD
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
              window.location.href = '../my_reservations/my_reservations.html'
            }
          })
=======
          // Intentar agregar la reserva usando el servicio
          const reservationResult = reservationsService.addReservation(selectedClass)

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
                // Redirección a la sección de reservas
                window.location.href = '../../reservations/reservations.html'
              }
            })
          } else {
            // La clase ya está reservada
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
>>>>>>> 559c469bb93707c45e568137892c54fecc2c8ac0
        }
      })
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  renderFilter()
  initFilter(renderFilteredClasses, renderClasses)
  renderClasses()
  setupEventListeners()
})
