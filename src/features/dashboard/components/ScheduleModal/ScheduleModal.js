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
              <label for="modality" class="form-label fw-semibold small">Modalidad</label>
              <select class="form-select" id="modality" name="modality" required>
                <option value="" selected disabled>Selecciona una modalidad</option>
                <option value="grupal">Grupal</option>
                <option value="personalizada">Personalizada</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="title" class="form-label fw-semibold small">Disciplina</label>
              <select class="form-select" id="title" name="title" required>
                <option value="" selected disabled>Selecciona una disciplina</option>
                <option value="rutina">Rutina</option>
                <option value="combate">Combate</option>
                <option value="acondicionamiento">Acondicionamiento</option>
                <option value="taichi">Taichí</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="level" class="form-label fw-semibold small">Nivel</label>
              <select class="form-select" id="level" name="level" required>
                <option value="" selected disabled>Selecciona un nivel</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="capacity" class="form-label fw-semibold small">Cupos</label>
              <input type="number" class="form-control" id="capacity" name="capacity" placeholder="Ej. 10" min="1" required>
            </div>
            <div class="mb-3">
  <label for="location" class="form-label fw-semibold small">Ubicación</label>
  <select class="form-select" id="location" name="location" required>
    <option value="" selected disabled>Ej. Sede Laureles</option>
    <option value="Sede Laureles">Sede Laureles</option>
    <option value="Sede Monterrey">Sede Monterrey</option>
    <option value="Sede Haru no Hinata">Sede Haru no Hinata</option>
  </select>
</div>
            <div class="mb-3">
              <label for="image" class="form-label fw-semibold small">Imagen</label>
              <input
                type="file"
                class="form-control"
                id="image"
                name="image"
                accept="image/*"
                required
              />
              <small id="imageHelpText" class="text-muted d-none">Si no deseas cambiar la imagen, puedes dejar este campo vacío</small>
            </div>
            <div class="row">
              <div class="col-md-7 mb-3">
                <label for="date" class="form-label fw-semibold small">Fecha</label>
                <input type="date" class="form-control" id="date" name="date" required>
              </div>
              <div class="col-md-5 mb-3">
                <label for="time" class="form-label fw-semibold small">Hora</label>
                <input type="time" class="form-control" id="time" name="time" required>
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
