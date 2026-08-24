/* eslint-disable no-undef */
import { classesService } from '../../../services/classesService.js'
import { Alert } from '../../../shared/components/Alert/Alert.js'
import { capitalize } from '../../../shared/js/utils.js'

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

const getClasses = () => {
  return classesService.getClasses()
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
      const classId = reserveBtn.getAttribute('data-id')
      const classes = getClasses()
      const selectedClass = classes.find(c => c.id === classId)

      if (!selectedClass) return

      Swal.fire({
        title: `<strong>Confirmar Reserva</strong>`,
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
              window.location.href = '../reservations/reservations.html'
            }
          })
        }
      })
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  renderClasses()
  setupEventListeners()
})
