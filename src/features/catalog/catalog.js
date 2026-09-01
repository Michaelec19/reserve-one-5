/* eslint-disable no-undef */
import { Alert } from '../../shared/components/Alert/Alert.js'
import { fileToBase64 } from '../../shared/js/utils.js'
import { CatalogItemCard } from './components/CatalogItemCard/CatalogItemCard.js'
import { CatalogItemModal } from './components/CatalogItemModal/CatalogItemModal.js'

const LOCALSTORAGE_KEY = 'lanhua_programs'

const defaultPrograms = [
  {
    id: crypto.randomUUID(),
    title: 'full pass',
    category: 'Membresía',
    description: 'Acceso libre a clases generales y especializadas.',
    image: '../../assets/LogoSinFondo.png'
  },
  {
    id: crypto.randomUUID(),
    title: 'wushu',
    category: 'Clase',
    description: 'Mensualidad especializada con acceso exclusivo a clases de Wushu.',
    image: '../../assets/LogoSinFondo.png'
  },
  {
    id: crypto.randomUUID(),
    title: 'taichi',
    category: 'Clase',
    description: 'Mensualidad especializada con acceso exclusivo a clases de Taichi.',
    image: '../../assets/LogoSinFondo.png'
  }
]

// elements
const modalElement = document.querySelector('#catalogModal')
const catalogContainer = document.querySelector('#catalogContainer')
const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement)

let form

// CRUD
const getItemsCatalog = () => {
  const savedData = window.localStorage.getItem(LOCALSTORAGE_KEY)

  if (!savedData) {
    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(defaultPrograms))
    return defaultPrograms
  }

  return JSON.parse(savedData)
}

const createItemCatalog = (item) => {
  const items = getItemsCatalog()

  const newItem = {
    id: crypto.randomUUID(),
    ...item
  }

  const updatedItems = [...items, newItem]

  window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedItems))

  return newItem
}

const updateItemCatalog = (id, updatedFields) => {
  const items = getItemsCatalog()

  const updatedItems = items.map(item =>
    item.id === id ? { ...item, ...updatedFields } : item
  )

  window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedItems))

  return updatedItems.find(item => item.id === id)
}

const deleteItemCatalog = (id) => {
  const items = getItemsCatalog()

  const updatedItems = items.filter(item => item.id !== id)

  window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedItems))

  return updatedItems
}

// renders
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

// form: create / edit / reset
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
    confirmButtonText: 'Aceptar'
  })
}

const handleEdit = async (editId) => {
  const imageFile = form.image.files[0]

  const updatedItem = {
    title: form.title.value.toLowerCase(),
    description: form.description.value,
    category: form.category.value,
  }

  if (imageFile && imageFile.size > 0) {
    updatedItem.image = await fileToBase64(imageFile)
  }

  updateItemCatalog(editId, updatedItem)

  Swal.fire({
    icon: 'success',
    title: 'Programa actualizado',
    text: 'El programa se actualizó correctamente.',
    confirmButtonText: 'Aceptar'
  })
}

const handleDelete = (id) => {
  const isConfirmed = confirm('¿Estás seguro de que deseas eliminar este programa?')
  if (!isConfirmed) return

  deleteItemCatalog(id)
  renderItemsCatalog()
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
