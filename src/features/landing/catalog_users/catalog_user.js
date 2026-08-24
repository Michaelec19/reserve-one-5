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
        title: `<strong>Reservar: ${capitalize(selectedClass.title)}</strong>`,
        icon: 'info',
        html: `
          <div class="text-start mt-3 d-flex flex-column gap-3">
            <div>
              <p class="mb-1"><strong>Horario:</strong> ${selectedClass.dateText}</p>
            </div>

            <!-- Menú Desplegable: Sedes -->
            <div>
              <label for="branchLocation" class="form-label fw-bold mb-1">Sede:</label>
              <select id="branchLocation" class="form-select">
                <option value="" selected disabled>-- Selecciona una sede --</option>
                <optgroup label="Lan Hua Sur">
                  <option value="Sede Monterrey Hayeshi">Sede Monterrey Hayeshi (Cra. 48 #10-45, Piso 2, Local 232)</option>
                  <option value="Sede Haru No Hinata">Sede Haru No Hinata (Cra 48A #16 sur - 01, Piso 1)</option>
                </optgroup>
                <optgroup label="Lan Hua Laureles Estadio">
                  <option value="Sede Principal - Laureles Estadio">Sede Principal - Laureles Estadio (Cll 48b #78a-47 Piso 5)</option>
                </optgroup>
              </select>
            </div>

            <!-- Menú Desplegable: Tipo de Plan / Servicio -->
            <div>
              <label for="planType" class="form-label fw-bold mb-1">Tipo de Plan / Servicio:</label>
              <select id="planType" class="form-select">
                <option value="" selected disabled>-- Selecciona un plan --</option>
                <option value="Mensualidad (Estudiantes) - $120.000">Mensualidad Colegio / Universidad — $120.000</option>
                <option value="Mensualidad Tarifa Regular - $150.000">Mensualidad Tarifa Regular — $150.000</option>
                <option value="Kids (6 a 11 años) - $120.000">Kids (6 a 11 años) — $120.000</option>
                <option value="Clase Individual Adicional - $15.000">Clase Individual Adicional (Alumnos activos) — $15.000</option>
                <option value="Clase Individual Sin Mensualidad - $32.500">Clase Individual Sin Mensualidad (Especializada) — $32.500</option>
                <option value="Full Pass - $190.000">Full Pass (Acceso ilimitado) — $190.000</option>
              </select>
            </div>

            <!-- Menú Desplegable: Método de Pago -->
            <div>
              <label for="paymentMethod" class="form-label fw-bold mb-1">Método de pago:</label>
              <select id="paymentMethod" class="form-select">
                <option value="" selected disabled>-- Selecciona una opción --</option>
                <option value="nequi">Nequi / Daviplata</option>
                <option value="tarjeta">Tarjeta de Crédito / Débito</option>
                <option value="efectivo">Pagar en Sede (Efectivo)</option>
                <option value="transferencia">Transferencia Bancaria</option>
              </select>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirmar Reserva',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
          const branchLocation = document.getElementById('branchLocation').value
          const planType = document.getElementById('planType').value
          const paymentMethod = document.getElementById('paymentMethod').value

          if (!branchLocation) {
            Swal.showValidationMessage('Por favor selecciona una sede')
            return false
          }
          if (!planType) {
            Swal.showValidationMessage('Por favor selecciona el tipo de plan')
            return false
          }
          if (!paymentMethod) {
            Swal.showValidationMessage('Por favor selecciona un método de pago')
            return false
          }

          return { branchLocation, planType, paymentMethod }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { branchLocation, planType, paymentMethod } = result.value

          Swal.fire({
            icon: 'success',
            title: '¡Reserva Registrada!',
            html: `
              <div class="text-start">
                <p><strong>Clase:</strong> ${capitalize(selectedClass.title)}</p>
                <p><strong>Sede:</strong> ${branchLocation}</p>
                <p><strong>Plan:</strong> ${planType}</p>
                <p><strong>Pago:</strong> ${paymentMethod.toUpperCase()}</p>
              </div>
            `,
            confirmButtonText: 'Aceptar'
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
