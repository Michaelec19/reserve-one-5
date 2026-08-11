export const ScheduleCard = (schedule) => {
  return `
    <article class="class-card border">
      <div class="position-relative">
        <img src="../../assets/1.png" alt="Rutina de entrenamiento" class="card-img-top">
        <span class="badge position-absolute bottom-0 start-0 m-2 class-badge">Principiante</span>
      </div>

      <div class="card-body p-3 d-flex flex-column gap-2">
        <h4 class="class-title h5 m-0 fw-bold">Rutina</h4>

        <div class="d-flex flex-column gap-2 fs-6">

          <div class="class-item d-flex align-items-center gap-2">
            <i class="fa-solid fa-users" aria-hidden="true"></i>
            <span>15 Cupos disponibles</span>
          </div>
ßß
          <div class="class-item d-flex align-items-center gap-2">
            <i class="fa-solid fa-calendar" aria-hidden="true"></i>
            <time datetime="2026-07-02T18:00" class="d-flex gap-1">
              <span>2 Julio 2026</span>
              <span>—</span>
              <span>Lunes 6 PM</span>
            </time>
          </div>

          <div class="class-item d-flex align-items-center gap-2">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            <span>Ubicación: Medellín</span>
          </div>

          <div class="class-item d-flex align-items-center gap-2">
            <i class="fa-solid fa-shoe-prints" aria-hidden="true"></i>
            <span>Modalidad: Grupal</span>
          </div>
        </div>

        <hr class="my-2 opacity-25">

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-action rounded-circle p-0 d-flex align-items-center justify-content-center"
            type="button" aria-label="Actualizar clase" title="Actualizar">
            <i class="fa-solid fa-pen"></i>
          </button>

          <button class="btn btn-action-danger rounded-circle p-0 d-flex align-items-center justify-content-center"
            type="button" aria-label="Eliminar clase" title="Eliminar">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </article>
  `
}
