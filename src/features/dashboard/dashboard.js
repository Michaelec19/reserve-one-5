const LOCALSTORAGE_KEY = 'lanhua_classes';

const defaultClasses = [
  {
    id: crypto.randomUUID(),
    title: 'Rutina',
    level: 'Principiante',
    capacity: 15,
    date: '2026-07-02T18:00',
    dateText: '2 Julio 2026 — Lunes 6 PM',
    location: 'Medellín',
    modality: 'Grupal',
    image: '../../assets/1.png'
  }
];

export const getClasses = () => {
  const savedData = localStorage.getItem(LOCALSTORAGE_KEY);

  if (!savedData) {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(defaultClasses));
    return defaultClasses;
  }
  return JSON.parse(savedData);
};

console.log('Loaded classes:', getClasses());

export const renderClasses = () => {
  const classes = getClasses();
  const cardsContainer = document.querySelector('.cards');

  cardsContainer.innerHTML = '';

  classes.forEach(classItem => {
    const cardHTML = `
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
            <!-- Notice the data-id attribute and 'edit-btn' class added here -->
            <button class="btn btn-action rounded-circle p-0 d-flex align-items-center justify-content-center edit-btn"
              type="button" aria-label="Actualizar clase" title="Actualizar" data-id="${classItem.id}">
              <i class="fa-solid fa-pen"></i>
            </button>

            <!-- Notice the data-id attribute and 'delete-btn' class added here -->
            <button class="btn btn-action-danger rounded-circle p-0 d-flex align-items-center justify-content-center delete-btn"
              type="button" aria-label="Eliminar clase" title="Eliminar" data-id="${classItem.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </article>
    `;

    cardsContainer.innerHTML += cardHTML;
  });
};

renderClasses();

export const deleteClass = (id) => {
  const currentClasses = getClasses();

  const updatedClasses = currentClasses.filter(classItem => classItem.id !== id);

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedClasses));

  renderClasses();
};

export const setupEventListeners = () => {
  const cardsContainer = document.querySelector('.cards');

  cardsContainer.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.delete-btn');

    if (deleteBtn) {
      const classId = deleteBtn.getAttribute('data-id');

      const isConfirmed = confirm('¿Estás seguro de que deseas eliminar esta clase?');

      if (isConfirmed) {
        deleteClass(classId);
      }
    }
  });
};

setupEventListeners();
