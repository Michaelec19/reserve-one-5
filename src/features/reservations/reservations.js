// Límite máximo de cupos por clase
const LIMITE_MAXIMO_CUPOS = 5;

let misReservas = JSON.parse(localStorage.getItem('reservasClub')) || [];

function renderizarReservas() {
    const contenedor = document.getElementById('lista-reservas');
    const totalElemento = document.getElementById('total-reservas');
    const contadorBadge = document.getElementById('contador-badge');
    const resumenCantidad = document.getElementById('resumen-cantidad');
    const contenedorVaciar = document.getElementById('contenedor-vaciar');
    
    if (!contenedor) return;

    contenedor.innerHTML = '';
    let totalClasesAgendadas = 0;

    if (misReservas.length === 0) {
        contenedor.innerHTML = `
            <div class="card p-5 text-center bg-dark text-muted border-secondary">
                <h5 class="text-warning mb-2">No tienes reservas activas</h5>
                <p class="small mb-3">Parece que aún no has agendado ninguna clase en el club.</p>
                <a href="index.html" class="btn btn-outline-warning btn-sm w-50 mx-auto fw-bold">Ver Cartelera de Clases</a>
            </div>`;
        totalElemento.textContent = '0';
        contadorBadge.textContent = '0 clases';
        resumenCantidad.textContent = '0';
        contenedorVaciar.classList.add('d-none');
        return;
    }

    contenedorVaciar.classList.remove('d-none');

    misReservas.forEach((item, index) => {
        totalClasesAgendadas += item.cantidad;

        let alertaLleno = '';
        if (item.cantidad >= LIMITE_MAXIMO_CUPOS) {
            alertaLleno = `<span class="badge bg-danger mt-1 d-inline-block">Cupos al límite (Máx. ${LIMITE_MAXIMO_CUPOS})</span>`;
        }

        contenedor.innerHTML += `
            <div class="card p-3 bg-dark border-secondary">
                <div class="row align-items-center">
                    <div class="col-md-3 mb-2 mb-md-0">
                        <img src="${item.imagen || 'https://via.placeholder.com/150'}" class="img-fluid rounded object-fit-cover" alt="${item.nombre}" style="height: 80px; width: 100%;">
                    </div>
                    <div class="col-md-5">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <h5 class="text-light m-0 fs-6 fw-bold">${item.nombre}</h5>
                            <span class="badge bg-warning text-dark" style="font-size: 0.65rem;">Próxima Clase</span>
                        </div>
                        <p class="text-muted small mb-1">${item.descripcion}</p>
                        ${alertaLleno}
                    </div>
                    <div class="col-md-2 my-2 my-md-0">
                        <label class="text-muted small d-block mb-1">Cupos:</label>
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-warning" onclick="cambiarCantidad(${index}, -1)">-</button>
                            <input type="text" class="form-control text-center bg-secondary text-light border-0 fw-bold" value="${item.cantidad}" readonly>
                            <button class="btn btn-outline-warning" onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-sm btn-outline-danger px-2 py-1" onclick="eliminarItem(${index})">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
    });

    totalElemento.textContent = totalClasesAgendadas;
    contadorBadge.textContent = `${totalClasesAgendadas} clase${totalClasesAgendadas !== 1 ? 's' : ''}`;
    resumenCantidad.textContent = misReservas.length;
}

function cambiarCantidad(index, cambio) {
    if (cambio > 0 && misReservas[index].cantidad >= LIMITE_MAXIMO_CUPOS) {
        alert(`Has alcanzado el límite máximo de ${LIMITE_MAXIMO_CUPOS} cupos para esta clase.`);
        return;
    }

    misReservas[index].cantidad += cambio;
    
    if (misReservas[index].cantidad <= 0) {
        misReservas[index].cantidad = 1;
    }
    
    guardarYActualizar();
}

function eliminarItem(index) {
    misReservas.splice(index, 1);
    guardarYActualizar();
}

function vaciarReservas() {
    if (confirm("¿Estás segura de que deseas cancelar todas tus reservas de clases?")) {
        misReservas = [];
        guardarYActualizar();
    }
}

function guardarYActualizar() {
    localStorage.setItem('reservasClub', JSON.stringify(misReservas));
    renderizarReservas();
}

function confirmarReservas() {
    if (misReservas.length === 0) {
        alert("No tienes clases seleccionadas para confirmar.");
        return;
    }
    alert("¡Tus reservas han sido registradas con éxito en el sistema del club!");
    localStorage.removeItem('reservasClub');
    misReservas = [];
    renderizarReservas();
}

document.addEventListener('DOMContentLoaded', renderizarReservas);