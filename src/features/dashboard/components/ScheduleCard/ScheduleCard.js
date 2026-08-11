// ScheduleCard.js

export const ScheduleCard = (classItem) => {
  return `
    <article class="class-card border">
      <div class="position-relative">
        <img src="${classItem.image}" alt="${classItem.title}" class="card-img-top">
        <span class="badge position-absolute bottom-0 start-0 m-2 class-badge">${classItem.level}</span>
      </div>

      <div class="card-body p-3 d-flex flex-column gap-2">
        <h4 class="class-title h5 m-0 fw-bold">${classItem.title}</h4>

        <div class="d-flex flex-column gap-2 fs-6">

          <div class="class-item d-flex align-items-center gap-2">
            <i class="fa-solid fa-users" aria-hidden="true"></i>
            <span>${classItem.capacity} Cupos disponibles</span>
          </div>

          <div class="class-item d-flex align-items-center gap-2">
            <i class="fa-solid fa-calendar" aria-hidden="true"></i>
            <time datetime="${classItem.date}" class="d-flex gap-1">
              <span>${classItem.dateText}</span>
            </time>
          </div>

          <div class="class-item d-flex align-items-center gap-2">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            <span>Ubicación: ${classItem.location}</span>
          </div>

          <div class="class-item d-flex align-items-center gap-2">
            <i class="fa-solid fa-shoe-prints" aria-hidden="true"></i>
            <span>Modalidad: ${classItem.modality}</span>
          </div>
        </div>

        <hr class="my-2 opacity-25">

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-action rounded-circle p-0 d-flex align-items-center justify-content-center edit-btn"
            type="button" aria-label="Actualizar clase" title="Actualizar" data-id="${classItem.id}">
            <i class="fa-solid fa-pen"></i>
          </button>

          <button class="btn btn-action-danger rounded-circle p-0 d-flex align-items-center justify-content-center delete-btn"
            type="button" aria-label="Eliminar clase" title="Eliminar" data-id="${classItem.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </article>
  `;
};
