import { Alert } from '../../shared/components/Alert/Alert.js'
import { setMinDateToday } from '../../shared/js/dateUtils.js'
import { ScheduleCard } from './components/ScheduleCard/ScheduleCard.js'
import { ScheduleModal } from './components/ScheduleModal/ScheduleModal.js'
import { schedulesService } from '../../services/schedulesService.js'
import api from '../../services/axiosConfig.js'

const getClasses = async () => {
  return await schedulesService.getClasses()
}

const deleteClass = async (id) => {
  const success = await schedulesService.deleteClass(id)

  if (success) {
    await renderClasses()
    Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: 'La clase se eliminó correctamente.',
      timer: 1500,
      showConfirmButton: false
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar la clase del servidor.'
    })
  }
}

const renderModalContentForm = () => {
  const modal = document.querySelector('#staticBackdrop')
  modal.innerHTML = ScheduleModal()
}

const renderClasses = async () => {
  const classes = await getClasses()

  const grupalContainer = document.querySelector('#schedules-grupal')
  const individualContainer = document.querySelector('#schedules-individual')

  if (!grupalContainer || !individualContainer) return

  grupalContainer.innerHTML = ''
  individualContainer.innerHTML = ''

  if (classes.length === 0) {
    grupalContainer.innerHTML = Alert({
      variant: 'info',
      title: 'Aún no tienes horarios agregados',
      text: 'Haz clic en "Agregar Horario" para crear el primero.'
    })
    return
  }

  classes.forEach(classItem => {
    const modalidad = classItem.modality ? classItem.modality.toLowerCase() : 'grupal'

    if (modalidad === 'grupal') {
      grupalContainer.innerHTML += ScheduleCard(classItem)
    } else {
      individualContainer.innerHTML += ScheduleCard(classItem)
    }
  })

  if (grupalContainer.innerHTML === '') {
    grupalContainer.innerHTML = '<p class="text-muted small">No hay clases grupales registradas.</p>'
  }
  if (individualContainer.innerHTML === '') {
    individualContainer.innerHTML = '<p class="text-muted small">No hay clases individuales registradas.</p>'
  }
}

const resetFormState = () => {
  form.reset()
  delete form.dataset.editId
  form.image.required = true
  document.querySelector('#staticBackdropLabel').textContent = 'Agregar Horario'

  const submitBtn = document.querySelector('#addSchedule')
  submitBtn.textContent = 'Agregar Horario'
}

const setSelectValue = (select, value, label = value) => {
  if (!value) {
    const matchingOption = Array.from(select.options).find(option =>
      label && option.textContent.trim().toLowerCase() === String(label).trim().toLowerCase()
    )
    select.value = matchingOption ? matchingOption.value : ''
    return
  }

  const optionExists = Array.from(select.options).some(option => String(option.value) === String(value))

  if (!optionExists) {
    const option = document.createElement('option')
    option.value = value
    option.textContent = label
    option.selected = true
    select.add(option)
  } else {
    select.value = value
  }
}

const normalizeId = (value) => {
  if (value === undefined || value === null || value === '') return value
  return /^\d+$/.test(String(value)) ? Number(value) : value
}

const fillFormForEdit = (classToEdit, classId) => {
  const modality = classToEdit.modality?.toLowerCase() ?? 'grupal'
  const level = classToEdit.level?.toLowerCase() ?? ''
  setSelectValue(form.modality, modality)

  const catalogId = classToEdit.idCatalog ?? classToEdit.catalogId ?? classToEdit.catalog?.idCatalog ?? classToEdit.catalog?.id
  const catalogName = classToEdit.catalog?.name ?? classToEdit.catalog?.title ?? 'Disciplina actual'
  setSelectValue(form.idCatalog, catalogId, catalogName)
  setSelectValue(form.level, level)
  form.quotas.value = classToEdit.quotas ?? classToEdit.capacity ?? ''
  setSelectValue(form.location, classToEdit.location)
  const userId = classToEdit.idUser ?? classToEdit.userId ?? classToEdit.user?.idUser ?? classToEdit.user?.id ?? classToEdit.professor?.idUser ?? classToEdit.professor?.id
  const userName = classToEdit.userName ?? classToEdit.user?.name ?? classToEdit.professor?.name ?? ''
  setSelectValue(form.idUser, userId, userName)
  form.image.value = classToEdit.image ?? classToEdit.catalog?.image ?? ''

  const scheduleDate = classToEdit.date ?? classToEdit.scheduleDate ?? ''
  form.scheduleDate.value = scheduleDate.replace(' ', 'T').slice(0, 16)
  form.dataset.editId = classId

  form.image.required = false
  document.querySelector('#staticBackdropLabel').textContent = 'Actualizar Horario'

  const submitBtn = document.querySelector('#addSchedule')
  submitBtn.textContent = 'Actualizar Horario'
  submitBtn.disabled = !form.checkValidity()
}

const handleSubmitSchedule = () => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const schedule = Object.fromEntries(formData)
    const editId = form.dataset.editId

    const scheduleData = {
      idCatalog: normalizeId(schedule.idCatalog),
      level: schedule.level,
      quotas: Number(schedule.quotas),
      scheduleDate: schedule.scheduleDate,
      location: schedule.location,
      modality: schedule.modality,
      idUser: normalizeId(schedule.idUser),
      image: schedule.image
    }

    console.log('Datos del horario a enviar al servidor:', scheduleData)

    try {
      if (editId) {
        await api.put(`/schedules/${editId}`, scheduleData)
      } else {
        await api.post('/schedules', scheduleData)
      }

      await renderClasses()

      Swal.fire({
        icon: 'success',
        title: editId ? 'Horario Actualizado' : 'Horario agregado',
        text: editId ? 'El horario se actualizó correctamente.' : 'El horario se agregó correctamente.',
        timer: 1500,
        showConfirmButton: false
      })

      const modalElement = document.querySelector('#staticBackdrop')
      const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement)
      bootstrapModal.hide()
    } catch (error) {
      console.log(error)
      const serverError = error.response?.data
      const responseMessage = typeof serverError === 'string' ? serverError.trim() : ''
      const errorMessage = responseMessage || serverError?.message || serverError?.error || `Error HTTP ${error.response?.status || 'desconocido'}`

      console.error('Error guardando el horario:', errorMessage, serverError)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      })
    }
  })
}

const validateForm = () => {
  const addSchedule = document.querySelector('#addSchedule')
  if (!addSchedule) return

  form.addEventListener('input', () => {
    addSchedule.disabled = !form.checkValidity()
  })

  form.addEventListener('change', () => {
    addSchedule.disabled = !form.checkValidity()
  })
}

const setupModalReset = () => {
  const modalElement = document.querySelector('#staticBackdrop')
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', resetFormState)
  }
}

const setupEventListeners = () => {
  const cardsContainers = document.querySelectorAll('.cards')

  cardsContainers.forEach(container => {
    container.addEventListener('click', async (event) => {
      const deleteBtn = event.target.closest('.delete-btn')
      if (deleteBtn) {
        const classId = deleteBtn.getAttribute('data-id')
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Estás seguro de que deseas eliminar esta clase?',
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
            await deleteClass(classId)
          }
        })
        return
      }

      const editBtn = event.target.closest('.edit-btn')
      if (editBtn) {
        const classId = editBtn.getAttribute('data-id')
        const currentClasses = await getClasses()
        const classToEdit = currentClasses.find(c => String(c.idSchedule ?? c.id) === String(classId))

        if (classToEdit) {
          fillFormForEdit(classToEdit, classId)

          const modalElement = document.querySelector('#staticBackdrop')
          const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement)
          bootstrapModal.show()
        }
      }
    })
  })
}

const renderDashboardDisciplines = async () => {
  const container = document.querySelector('#dashboardDisciplinesContainer')
  if (!container) return

  try {
    const savedPrograms = window.localStorage.getItem('lanhua_programs')
    const programs = savedPrograms ? JSON.parse(savedPrograms) : []

    container.innerHTML = ''

    if (programs.length === 0) {
      container.innerHTML = '<p class="text-muted small">No hay disciplinas o programas registrados.</p>'
      return
    }

    programs.forEach(program => {
      const programTitle = program.title ?? program.name ?? 'Programa sin nombre'

      container.innerHTML += `
        <div class="col-md-6 col-lg-4">
          <div class="card bg-dark border-secondary text-white p-3 h-100">
            <div class="d-flex align-items-center gap-3">
              <img src="${program.image || '../../assets/lanhua-banner-1.png'}" alt="${programTitle}" class="rounded-circle object-fit-cover bg-secondary" style="width: 50px; height: 50px;">
              <div>
                <h5 class="h6 mb-1 text-warning text-uppercase fw-bold">${programTitle}</h5>
                <span class="badge bg-secondary mb-1">${program.category || 'General'}</span>
                <p class="small text-light mb-0" style="font-size: 12px;">${program.description || ''}</p>
              </div>
            </div>
          </div>
        </div>
      `
    })
  } catch (error) {
    console.error('Error cargando disciplinas:', error)
    container.innerHTML = '<p class="text-danger small">Error al conectar con el servidor para cargar las disciplinas.</p>'
  }
}

renderModalContentForm()

const form = document.querySelector('#scheduleForm')

if (form) {
  renderClasses()
  setupEventListeners()
  setupModalReset()
  setMinDateToday('#scheduleDate')
  handleSubmitSchedule()
  validateForm()
}

renderDashboardDisciplines()
