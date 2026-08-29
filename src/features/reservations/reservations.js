/* eslint-disable no-undef */
import { reservationsService } from '../../services/reservationsService.js'
import { getImagePath } from '../../shared/js/config.js'
import { capitalize } from '../../shared/js/utils.js'

function renderizarReservas() {
  const contenedor = document.getElementById('lista-reservas')
  const totalElemento = document.getElementById('total-reservas')
  const contadorBadge = document.getElementById('contador-badge')
  const resumenCantidad = document.getElementById('resumen-cantidad')
  const contenedorVaciar = document.getElementById('contenedor-vaciar')

  if (!contenedor) return

  const misReservas = reservationsService.getPendingReservations()
  contenedor.innerHTML = ''

  if (misReservas.length === 0) {
    contenedor.innerHTML = `
            <div class="card p-5 text-center bg-dark text-muted border-secondary">
                <h5 class="text-warning mb-2">No tienes reservas activas</h5>
                <p class="small mb-3">Parece que aún no has agendado ninguna clase en el club.</p>
                <a href="../landing/catalog_users/catalog_user.html" class="btn btn-outline-warning btn-sm w-50 mx-auto fw-bold">Ver Cartelera de Clases</a>
            </div>`
    totalElemento.textContent = '0'
    contadorBadge.textContent = '0 clases'
    resumenCantidad.textContent = '0'
    contenedorVaciar.classList.add('d-none')
    return
  }

  contenedorVaciar.classList.remove('d-none')

  misReservas.forEach((item) => {
    contenedor.innerHTML += `
            <div class="card p-3 bg-dark border-secondary">
                <div class="row align-items-center">
                    <div class="col-md-3 mb-2 mb-md-0">
                        <img src="${getImagePath(item.image.split('/').pop())}" class="img-fluid rounded object-fit-cover" alt="${item.title}" style="height: 80px; width: 100%;">
                    </div>
                    <div class="col-md-5">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <h5 class="text-light m-0 fs-6 fw-bold">${capitalize(item.title)}</h5>
                            <span class="badge bg-warning text-dark" style="font-size: 0.65rem;">${capitalize(item.level)}</span>
                        </div>
                        <p class="text-light small mb-1">${item.dateText}</p>
                        <p class="text-light small mb-1">Ubicación: ${item.location}</p>
                        <p class="text-light small mb-0">Modalidad: ${capitalize(item.modality)}</p>
                    </div>
                    <div class="col-md-2 my-2 my-md-0">
                        <label class="text-light small d-block mb-1">Cupos disponibles:</label>
                        <div class="form-control text-center bg-secondary text-light border-0 fw-bold">${item.capacity}</div>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-sm btn-outline-danger px-2 py-1" onclick="eliminarItem('${item.id}')">Cancelar</button>
                    </div>
                </div>
            </div>
        `
  })

  totalElemento.textContent = misReservas.length
  contadorBadge.textContent = `${misReservas.length} clase${misReservas.length !== 1 ? 's' : ''}`
  resumenCantidad.textContent = misReservas.length
}

function eliminarItem(classId) {
  Swal.fire({
    title: '¿Cancelar reserva?',
    text: '¿Estás seguro de que deseas cancelar esta reserva?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No, mantener',
    customClass: {
      confirmButton: 'btn btn-danger px-4',
      cancelButton: 'btn btn-secondary px-4'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      reservationsService.removeReservation(classId)
      renderizarReservas()
      Swal.fire({
        title: 'Reserva cancelada',
        text: 'Tu reserva ha sido cancelada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'btn btn-success px-4'
        }
      })
    }
  })
}

function vaciarReservas() {
  Swal.fire({
    title: '¿Cancelar todas las reservas?',
    text: '¿Estás segura de que deseas cancelar todas tus reservas de clases?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar todo',
    cancelButtonText: 'No, mantener',
    customClass: {
      confirmButton: 'btn btn-danger px-4',
      cancelButton: 'btn btn-secondary px-4'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      reservationsService.removeAllReservations()
      renderizarReservas()
      Swal.fire({
        title: 'Reservas canceladas',
        text: 'Todas tus reservas han sido canceladas.',
        icon: 'success',
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'btn btn-success px-4'
        }
      })
    }
  })
}

function confirmarReservas() {
  const misReservas = reservationsService.getReservations()
  if (misReservas.length === 0) {
    Swal.fire({
      title: 'Sin reservas',
      text: 'No tienes clases seleccionadas para confirmar.',
      icon: 'warning',
      confirmButtonText: 'Entendido',
      customClass: {
        confirmButton: 'btn btn-warning px-4'
      }
    })
    return
  }
  Swal.fire({
    title: '¡Reservas confirmadas!',
    text: '¡Tus reservas han sido registradas con éxito en el sistema del club!',
    icon: 'success',
    confirmButtonText: 'Ir a Mi Agenda',
    showCancelButton: true,
    cancelButtonText: 'Seguir aquí',
    customClass: {
      confirmButton: 'btn btn-success px-4',
      cancelButton: 'btn btn-secondary px-4'
    }
  }).then((result) => {
    reservationsService.confirmUserReservations()
    renderizarReservas()
    if (result.isConfirmed) {
      window.location.href = '../daylie/daylie.html';
    }
  })
}

window.eliminarItem = eliminarItem
window.vaciarReservas = vaciarReservas
window.confirmarReservas = confirmarReservas

document.addEventListener('DOMContentLoaded', renderizarReservas)
