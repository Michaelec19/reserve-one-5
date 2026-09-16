import api from '../../../services/axiosConfig.js'

// Obtenemos los datos directamente del backend para los filtros
const getClasses = async () => {
  try {
    const response = await api.get('/api/catalog');
    return response.data.map(item => ({
      id: item.idCatalog,
      title: item.name,
      description: item.description,
      category: item.category || [],
      image: item.image
    }));
  } catch (error) {
    return [];
  }
}

const getUniqueValues = (classes, property) => {
  if (!Array.isArray(classes)) return []
  return [...new Set(classes.map(item => item[property]))]
}

// Obtenemos todas las categorías únicas desde los arrays
const getUniqueCategories = (classes) => {
  if (!Array.isArray(classes)) return []
  const allCategories = classes.flatMap(item => item.category || [])
  return [...new Set(allCategories)]
}

const renderFilterOptions = async () => {
  const classes = await getClasses()

  // Filtro de Títulos
  const titles = getUniqueValues(classes, 'title')
  const titleSelect = document.querySelector('#filterTitle')
  if (titleSelect) {
    titles.forEach(title => {
      const option = document.createElement('option')
      option.value = title
      option.textContent = title.charAt(0).toUpperCase() + title.slice(1)
      titleSelect.appendChild(option)
    })
  }

  // Filtro de Categorías
  const categories = getUniqueCategories(classes)
  const categorySelect = document.querySelector('#filterCategory')

  const categoryLabels = {
    'Kids': 'Kids',
    'Regular': 'Regular',
    'Estudiantes': 'Tarifa de Estudiantes',
    'Gratis': 'Gratis',
    'FullPass': 'Full Pass',
    'EspecializadaSinMensualidad': 'Sin Mens. Activa',
    'EspecializadaAdicional': 'Adicional'
  };

  if (categorySelect) {
    categories.forEach(cat => {
      const option = document.createElement('option')
      option.value = cat
      option.textContent = categoryLabels[cat] || cat
      categorySelect.appendChild(option)
    })
  }
}

const filterClasses = async (renderFilteredClasses) => {
  const classes = await getClasses()
  const titleFilter = document.querySelector('#filterTitle')?.value
  const categoryFilter = document.querySelector('#filterCategory')?.value

  const filteredClasses = classes.filter(classItem => {
    const matchTitle = !titleFilter || classItem.title === titleFilter
    // Verificamos si el arreglo de categorías incluye la seleccionada
    const matchCategory = !categoryFilter || (classItem.category && classItem.category.includes(categoryFilter))

    return matchTitle && matchCategory
  })

  renderFilteredClasses(filteredClasses)
}

const clearFilters = async (renderClasses) => {
  const titleSelect = document.querySelector('#filterTitle')
  const categorySelect = document.querySelector('#filterCategory')

  if (titleSelect) titleSelect.value = ''
  if (categorySelect) categorySelect.value = ''

  await renderClasses()
}

const setupFilterListeners = (renderFilteredClasses, renderClasses) => {
  const filterInputs = ['#filterTitle', '#filterCategory']

  filterInputs.forEach(selector => {
    const element = document.querySelector(selector)
    if (element) {
      element.addEventListener('change', () => filterClasses(renderFilteredClasses))
    }
  })

  const clearBtn = document.querySelector('#clearFilters')
  if (clearBtn) {
    clearBtn.addEventListener('click', () => clearFilters(renderClasses))
  }
}

export const Filter = () => {
  return `
    <div class="filters-section mt-5">
      <div class="card p-4">
        <div class="row g-3 justify-content-center">
          <div class="col-md-4">
            <label class="form-label small fw-bold">Programa / Disciplina</label>
            <select class="form-select form-select-sm" id="filterTitle">
              <option value="">Todos</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-bold">Categoría / Plan</label>
            <select class="form-select form-select-sm" id="filterCategory">
              <option value="">Todas</option>
            </select>
          </div>
          <div class="col-md-1 d-flex align-items-end">
            <button class="btn btn-sm w-100" id="clearFilters" title="Limpiar Filtros">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
}

export const initFilter = async (renderFilteredClasses, renderClasses) => {
  await renderFilterOptions()
  setupFilterListeners(renderFilteredClasses, renderClasses)
}