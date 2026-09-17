import { Alert } from '../../shared/components/Alert/Alert.js'
import { fileToBase64 } from '../../shared/js/utils.js'
import { CatalogItemCard } from './components/CatalogItemCard/CatalogItemCard.js'
import { CatalogItemModal } from './components/CatalogItemModal/CatalogItemModal.js'

const LOCALSTORAGE_KEY = 'lanhua_programs'

const defaultPrograms = [
  {
    id: crypto.randomUUID(),
    title: 'rutina',
    category: 'Mensualidad FullPass',
    description: 'Acceso a rutinas guiadas y clases generales de acondicionamiento corporal.',
    image: '../../assets/LogoSinFondo.png'
  },
  {
    id: crypto.randomUUID(),
    title: 'combate',
    category: 'Mensualidad FullPass',
    description: 'Entrenamiento enfocado en técnicas de combate, defensa y sparring.',
    image: '../../assets/LogoSinFondo.png'
  },
  {
    id: crypto.randomUUID(),
    title: 'acondicionamiento',
    category: 'Mensualidad FullPass',
    description: 'Programa orientado a mejorar la resistencia, fuerza y condición física general.',
    image: '../../assets/LogoSinFondo.png'
  },
  {
    id: crypto.randomUUID(),
    title: 'taichi',
    category: 'Mensualidad FullPass',
    description: 'Mensualidad especializada con acceso exclusivo a clases de Taichi y formas tradicionales.',
    image: '../../assets/LogoSinFondo.png'
  }
]

// elements
const modalElement = document.querySelector('#catalogModal')
const catalogContainer = document.querySelector('#catalogContainer')
const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement)

let form

const getItemsCatalog = async () => {
  try {

    const response = await api.get('/catalog')
    return response.data.map(item => ({
      id: item.idCatalog,
      title: item.name,
      description: item.description,
      category: item.category,
      image: item.image
    }))
  } catch (error) {
    console.error('Error obteniendo programas:', error)
    return []
  }
}

const createItemCatalog = async (item) => {
  try {
    const response = await api.post('/catalog', item)
    return response.data
  } catch (error) {
    console.error('Error creando programa:', error)
    throw error
  }
}

const updateItemCatalog = async (id, updatedFields) => {
  try {
    const response = await api.put(`/catalog/${id}`, updatedFields)
    return response.data
  } catch (error) {
    console.error('Error actualizando programa:', error)
    throw error
  }
}

const deleteItemCatalog = async (id) => {
  try {
    await api.delete(`/catalog/${id}`)
    return true
  } catch (error) {
    console.error('Error eliminando programa:', error)
    throw error
  }
}


// RENDERS
const renderItemsCatalog = () => {
  const programs = getItemsCatalog()
  
  catalogContainer.innerHTML = ''

  if (programs.length === 0) {
    catalogContainer.innerHTML = Alert({
      variant: 'info',
      title: 'Aún no tienes programas agregados',
      text: 'Haz clic en "Agregar Programa" para crear el primero.'
    })
    return
  }

  programs.forEach(item => {
    catalogContainer.innerHTML += CatalogItemCard(item)
  })
}

const renderModalContentForm = (item = null) => {
  modalElement.innerHTML = CatalogItemModal(item)
  form = document.querySelector('#catalogForm')

  if (item) {
    form.dataset.editId = item.id
  }

  form.addEventListener('submit', handleSubmit)
  validateForm()
}


// VALIDACIONES Y FORMULARIO
const resetFormState = () => {
  renderModalContentForm()
}

const validateForm = () => {
  const addCatalogItem = document.querySelector('#addCatalogItem')

  const updateButtonState = () => {
    addCatalogItem.disabled = !form.checkValidity()
  }

  updateButtonState()

  form.addEventListener('input', updateButtonState)
  form.addEventListener('change', updateButtonState)
}

const getSelectedCategories = () => {
  const checkboxes = document.querySelectorAll('.category-checkbox:checked')
  return Array.from(checkboxes).map(cb => cb.value)
}


// MANEJADORES DE EVENTOS


// handles
const handleCreate = async () => {
  const imageFile = form.image.files[0]
  const imageBase64 = await fileToBase64(imageFile)

  createItemCatalog({
    title: form.title.value.toLowerCase(),
    description: form.description.value,
    category: form.category.value,
    image: imageBase64
  })

  Swal.fire({
    icon: 'success',
    title: 'Programa agregado',
    text: 'El programa se agregó correctamente.',
    timer: 1500,
    showConfirmButton: false
  })
}

const handleEdit = async (editId) => {
  const imageFile = form.image.files[0]

  const updatedItem = {
    title: form.title.value.toLowerCase(),
    description: form.description.value,
    category: form.category.value
  }

  if (imageFile && imageFile.size > 0) {
    updatedItem.image = await fileToBase64(imageFile)
  }

  updateItemCatalog(editId, updatedItem)

  Swal.fire({
    icon: 'success',
    title: 'Programa actualizado',
    text: 'El programa se actualizó correctamente.',
    timer: 1500,
    showConfirmButton: false
  })
}

const handleDelete = (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Estás seguro de que deseas eliminar este programa?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'btn btn-primary px-3',
      cancelButton: 'btn btn-secondary px-3'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      deleteItemCatalog(id)
      renderItemsCatalog()

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El programa se eliminó correctamente.',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}

const handleSubmit = async (e) => {
  e.preventDefault()

  const editId = form.dataset.editId

  if (editId) {
    await handleEdit(editId)
  } else {
    await handleCreate()
  }

  bootstrapModal.hide()
  renderItemsCatalog()
}


// INICIALIZACIÓN


// listeners
const setupModalReset = () => {
  modalElement.addEventListener('hidden.bs.modal', resetFormState)
}

const setupEventListeners = () => {
  catalogContainer.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.delete-btn')
    if (deleteBtn) {
      handleDelete(deleteBtn.dataset.id)
      return
    }

    const editBtn = event.target.closest('.edit-btn')

    if (editBtn) {
      const item = getItemsCatalog().find(i => i.id === editBtn.dataset.id)

      renderModalContentForm(item)
      bootstrapModal.show()
    }
  })

  form.addEventListener('submit', handleSubmit)
}

// init
renderModalContentForm()
renderItemsCatalog()
setupEventListeners()
setupModalReset()
validateForm()
