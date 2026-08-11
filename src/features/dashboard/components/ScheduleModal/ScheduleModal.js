export const ScheduleModal = (schedule = null) => {
  return `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Agregar Horario</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <form id="scheduleForm">
            <div class="mb-3">
              <label for="modalidad" class="form-label fw-semibold small">Modalidad</label>
              <select class="form-select" id="modalidad" name="modalidad" required>
                <option value="" selected disabled>Selecciona una modalidad</option>
                <option value="grupal">Grupal</option>
                <option value="personalizada">Personalizada</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="disciplina" class="form-label fw-semibold small">Disciplina</label>
              <select class="form-select" id="disciplina" name="disciplina" required>
                <option value="" selected disabled>Selecciona una disciplina</option>
                <option value="rutina">Rutina</option>
                <option value="combate">Combate</option>
                <option value="acondicionamiento">Acondicionamiento</option>
                <option value="taichi">Taichí</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="nivel" class="form-label fw-semibold small">Nivel</label>
              <select class="form-select" id="nivel" name="nivel" required>
                <option value="" selected disabled>Selecciona un nivel</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="cupos" class="form-label fw-semibold small">Cupos</label>
              <input type="number" class="form-control" id="cupos" name="cupos" placeholder="Ej. 10" min="1" required>
            </div>
            <div class="mb-3">
              <label for="ubicacion" class="form-label fw-semibold small">Ubicación</label>
              <input type="text" class="form-control" id="ubicacion" name="ubicacion" placeholder="Ej. Medellín" required>
            </div>
            <div class="row">
              <div class="col-md-7 mb-3">
                <label for="fecha" class="form-label fw-semibold small">Fecha</label>
                <input type="date" class="form-control" id="fecha" name="fecha" required>
              </div>
              <div class="col-md-5 mb-3">
                <label for="hora" class="form-label fw-semibold small">Hora</label>
                <input type="time" class="form-control" id="hora" name="hora" required>
              </div>
            </div>
            <div class="d-flex justify-content-end gap-2 pt-2">
              <button type="submit" class="btn btn-primary" id="addSchedule" disabled>Agregar Horario</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
}
