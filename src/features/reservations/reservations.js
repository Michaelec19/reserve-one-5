import { reservationsService } from '../../services/reservationsService.js'
import { getImagePath } from '../../shared/js/config.js'
import { capitalize } from '../../shared/js/utils.js'

async function renderizarReservas() {
  const contenedor = document.getElementById('lista-reservas')
  const totalElemento = document.getElementById('total-reservas')
  const contadorBadge = document.getElementById('contador-badge')
  const resumenCantidad = document.getElementById('resumen-cantidad')
  const contenedorVaciar = document.getElementById('contenedor-vaciar')

  if (!contenedor) return

  const misReservas = await reservationsService.getPendingReservations()
  contenedor.innerHTML = ''

  if (!misReservas || misReservas.length === 0) {
    contenedor.innerHTML = `
            <div class="card p-5 text-center bg-dark text-muted border-secondary">
                <h5 class="text-warning mb-2">No tienes reservas activas</h5>
                <p class="small mb-3">Parece que aún no has agendado ninguna clase en el club.</p>
                <a href="../catalog_users/catalog_user.html" class="btn btn-outline-warning btn-sm w-50 mx-auto fw-bold">Ver Cartelera de Clases</a>
            </div>`
    if (totalElemento) totalElemento.textContent = '0'
    if (contadorBadge) contadorBadge.textContent = '0 clases'
    if (resumenCantidad) resumenCantidad.textContent = '0'
    if (contenedorVaciar) contenedorVaciar.classList.add('d-none')
    return
  }

  if (contenedorVaciar) contenedorVaciar.classList.remove('d-none')

  misReservas.forEach((item) => {
    const claseInfo = item.schedule || item

    const titulo = claseInfo.title || claseInfo.name || 'Clase de Artes Marciales'
    const imagen = claseInfo.image || 'lanhua-banner-1.png'
    const nivel = claseInfo.level || 'General'
    const fechaText = claseInfo.dateText || claseInfo.scheduleDate || 'Horario programado'
    const ubicacion = claseInfo.location || 'Sede Principal'
    const modalidad = claseInfo.modality || 'grupal'
    const cupos = claseInfo.capacity || claseInfo.quotas || 15
    const idReserva = item.idReservation || item.id

    contenedor.innerHTML += `
            <div class="card p-3 bg-dark border-secondary mb-2">
                <div class="row align-items-center">
                    <div class="col-md-3 mb-2 mb-md-0">
                        <img src="${getImagePath(imagen.split('/').pop())}" class="img-fluid rounded object-fit-cover" alt="${titulo}" style="height: 80px; width: 100%;">
                    </div>
                    <div class="col-md-5">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <h5 class="text-light m-0 fs-6 fw-bold">${capitalize(titulo)}</h5>
                            <span class="badge bg-warning text-dark" style="font-size: 0.65rem;">${capitalize(nivel)}</span>
                        </div>
                        <p class="text-light small mb-1">${fechaText}</p>
                        <p class="text-light small mb-1">Ubicación: ${ubicacion}</p>
                        <p class="text-light small mb-0">Modalidad: ${capitalize(modalidad)}</p>
                    </div>
                    <div class="col-md-2 my-2 my-md-0">
                        <label class="text-light small d-block mb-1">Cupos:</label>
                        <div class="form-control text-center bg-secondary text-light border-0 fw-bold" style="font-size: 0.75rem;">${cupos}</div>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-sm btn-outline-danger px-2 py-1" onclick="eliminarItem('${idReserva}')">Cancelar</button>
                    </div>
                </div>
            </div>
        `
  })

  if (totalElemento) totalElemento.textContent = misReservas.length
  if (contadorBadge) contadorBadge.textContent = `${misReservas.length} clase${misReservas.length !== 1 ? 's' : ''}`
  if (resumenCantidad) resumenCantidad.textContent = misReservas.length
}

window.eliminarItem = async (idReservation) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas cancelar esta reserva?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f2be22',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No'
  })

  if (result.isConfirmed) {
    const response = await reservationsService.removeReservation(idReservation)

    if (response.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Cancelada!',
        text: 'La reserva ha sido cancelada correctamente.',
        background: '#212529',
        color: '#fff',
        confirmButtonColor: '#f2be22'
      })

      await renderizarReservas()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cancelar la reserva.',
        background: '#212529',
        color: '#fff'
      })
    }
  }
}

window.vaciarReservas = async function () {
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
  }).then(async (result) => {
    if (result.isConfirmed) {
      const pendientes = await reservationsService.getPendingReservations()
      for (const res of pendientes) {
        await reservationsService.removeReservation(res.idReservation || res.id)
      }
      await renderizarReservas()
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

window.confirmarReservas = async function () {
  const misReservas = await reservationsService.getPendingReservations()
  if (!misReservas || misReservas.length === 0) {
    Swal.fire({
      title: 'Sin reservas',
      text: 'No tienes clases pendientes seleccionadas para confirmar.',
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
  }).then(async (result) => {
    await reservationsService.confirmUserReservations()
    await renderizarReservas()
    if (result.isConfirmed) {
      window.location.href = '../daylie/daylie.html'
    }
  })
}

window.eliminarItem = eliminarItem
window.vaciarReservas = vaciarReservas
window.confirmarReservas = confirmarReservas

document.addEventListener('DOMContentLoaded', renderizarReservas)
