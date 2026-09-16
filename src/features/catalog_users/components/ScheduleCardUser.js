import { capitalize } from '../../../shared/js/utils.js'

export const ScheduleCardUser = (classItem) => {
  // Diccionario para mostrar textos amigables en las etiquetas
  const categoryLabels = {
    'Kids': 'Kids',
    'Regular': 'Regular',
    'Estudiantes': 'Tarifa de Estudiantes',
    'Gratis': 'Gratis',
    'FullPass': 'Full Pass',
    'EspecializadaSinMensualidad': 'Sin Mens. Activa',
    'EspecializadaAdicional': 'Adicional'
  };

  const categories = Array.isArray(classItem.category) ? classItem.category : [classItem.category];

  // Generamos el HTML para todas las etiquetas
  const badgesHTML = categories.map(cat => {
    if (!cat) return '';
    const label = categoryLabels[cat] || cat;
    return `<span class="badge class-badge-${cat} m-1">${label}</span>`;
  }).join('');

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="class-card bg-white text-dark border rounded shadow-sm h-100 d-flex flex-column">
        <div class="position-relative">
          <img src="${classItem.image}" alt="${classItem.title}" class="card-img-top object-fit-cover" style="height: 220px;">
          <div class="position-absolute bottom-0 start-0 d-flex flex-wrap m-2">
            ${badgesHTML}
          </div>
        </div>
        <div class="card-body p-3 d-flex flex-column gap-2 text-dark flex-grow-1">
          <h4 class="class-title h5 m-0 fw-bold text-dark">${capitalize(classItem.title)}</h4>
          <p class="text-secondary small flex-grow-1 mt-2 mb-2">
            ${classItem.description ? classItem.description : 'Sin descripción disponible.'}
          </p>
          
          <hr class="my-2 opacity-25 border-dark">
          <div class="d-flex justify-content-end mt-auto">
            <button class="btn btn-action w-100 py-2 d-flex align-items-center justify-content-center gap-2 reserve-btn"
              type="button" aria-label="Reservar clase" data-id="${classItem.id}">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Me Interesa</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  `
}