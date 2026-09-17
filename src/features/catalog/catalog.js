// Por: Santiago Castrillón Rojo
/* eslint-disable no-undef */
import { Alert } from '../../shared/components/Alert/Alert.js'
import { fileToBase64 } from '../../shared/js/utils.js'
import { CatalogItemCard } from './components/CatalogItemCard/CatalogItemCard.js'
import { CatalogItemModal } from './components/CatalogItemModal/CatalogItemModal.js'
import api from '../../services/axiosConfig.js'

let currentPrograms = []

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

const renderItemsCatalog = async () => {
  currentPrograms = await getItemsCatalog()
  catalogContainer.innerHTML = ''

  if (!currentPrograms || currentPrograms.length === 0) {
    catalogContainer.innerHTML = Alert({
      variant: 'info',
      title: 'Aún no tienes programas agregados',
      text: 'Haz clic en "Agregar Programa" para crear el primero.'
    })
    return
  }

  currentPrograms.forEach(item => {
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

const resetFormState = () => {
  renderModalContentForm()
}

const validateForm = () => {
  const addCatalogItem = document.querySelector('#addCatalogItem')
  const categoryError = document.querySelector('#categoryError')

  const updateButtonState = () => {
    const checkedCategories = document.querySelectorAll('.category-checkbox:checked').length
    const hasCategories = checkedCategories > 0

    if (!hasCategories) {
      if (categoryError) categoryError.classList.remove('d-none')
    } else {
      if (categoryError) categoryError.classList.add('d-none')
    }

    addCatalogItem.disabled = !form.checkValidity() || !hasCategories
  }

  updateButtonState()
  form.addEventListener('input', updateButtonState)
  form.addEventListener('change', updateButtonState)
}

const getSelectedCategories = () => {
  const checkboxes = document.querySelectorAll('.category-checkbox:checked')
  return Array.from(checkboxes).map(cb => cb.value)
}

const handleCreate = async () => {
  const imageFile = form.image.files[0]
  let imageBase64 = '../../assets/LogoSinFondo.png'

  if (imageFile) {
    imageBase64 = await fileToBase64(imageFile)
  }

  try {
    await createItemCatalog({
      name: form.title.value.toLowerCase(),
      description: form.description.value,
      category: getSelectedCategories(),
      image: imageBase64
    })

    Swal.fire({
      icon: 'success',
      title: 'Programa agregado',
      text: 'El programa se guardó en la base de datos correctamente.',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    Swal.fire('Error', 'Hubo un problema al crear el programa. Revisa la consola.', 'error')
  }
}

const handleEdit = async (editId) => {
  const imageFile = form.image.files[0]
  const updatedItem = {
    name: form.title.value.toLowerCase(),
    description: form.description.value,
    category: getSelectedCategories()
  }

  if (imageFile && imageFile.size > 0) {
    updatedItem.image = await fileToBase64(imageFile)
  }

  try {
    await updateItemCatalog(editId, updatedItem)
    Swal.fire({
      icon: 'success',
      title: 'Programa actualizado',
      text: 'El programa se actualizó correctamente.',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    Swal.fire('Error', 'No se pudo actualizar el programa.', 'error')
  }
}

const handleDelete = (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el programa de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'btn btn-primary px-3',
      cancelButton: 'btn btn-secondary px-3'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteItemCatalog(id)
        await renderItemsCatalog()
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El programa se eliminó correctamente.',
          timer: 1500,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el programa.', 'error')
      }
    }
  })
}

const handleSubmit = async (e) => {
  e.preventDefault()
  const editId = form.dataset.editId

  Swal.fire({
    title: 'Procesando...',
    text: 'Por favor espera',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })

  if (editId) {
    await handleEdit(editId)
  } else {
    await handleCreate()
  }

  bootstrapModal.hide()
  await renderItemsCatalog()
}

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
      const item = currentPrograms.find(i => String(i.id) === String(editBtn.dataset.id))
      renderModalContentForm(item)
      bootstrapModal.show()
    }
  })

  form.addEventListener('submit', handleSubmit)
}

const init = async () => {
  renderModalContentForm()
  await renderItemsCatalog()
  setupEventListeners()
  setupModalReset()
  validateForm()
}

init()