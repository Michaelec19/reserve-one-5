import { Alert } from '../../shared/components/Alert/Alert.js'
import { setMinDateToday } from '../../shared/js/dateUtils.js'
import { fileToBase64 } from '../../shared/js/utils.js'
import { ScheduleCard } from './components/ScheduleCard/ScheduleCard.js'
import { ScheduleModal } from './components/ScheduleModal/ScheduleModal.js'
import { scheduleService } from '../../services/scheduleService.js'
import api from '../../services/axiosConfig.js'

const getClasses = async () => {
  return await scheduleService.getClasses()
}

const deleteClass = async (id) => {
  const success = await scheduleService.deleteClass(id)
  
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
  document.querySelector('#imageHelpText').classList.add('d-none')
  document.querySelector('#staticBackdropLabel').textContent = 'Agregar Horario'

  const submitBtn = document.querySelector('#addSchedule')
  submitBtn.textContent = 'Agregar Horario'
}

const fillFormForEdit = (classToEdit, classId) => {
  form.modality.value = classToEdit.modality ? classToEdit.modality.toLowerCase() : 'grupal'
  form.title.value = classToEdit.title.toLowerCase()
  form.level.value = classToEdit.level.toLowerCase()
  form.capacity.value = classToEdit.capacity
  form.location.value = classToEdit.location
  form.professor.value = classToEdit.professor || ''

  const [dateStr, timeStr] = classToEdit.date.split('T')
  form.date.value = dateStr
  form.time.value = timeStr
  form.dataset.editId = classId

  form.image.required = false
  document.querySelector('#imageHelpText').classList.remove('d-none')
  document.querySelector('#staticBackdropLabel').textContent = 'Actualizar Horario'

  const submitBtn = document.querySelector('#addSchedule')
  submitBtn.textContent = 'Actualizar Horario'
  submitBtn.disabled = false
}

const handleSubmitSchedule = () => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const imageFile = formData.get('image')
    const hasNewImage = imageFile && imageFile.size > 0
    const schedule = Object.fromEntries(formData)
    const editId = form.dataset.editId

    const image = hasNewImage
      ? await fileToBase64(imageFile)
      : (editId ? null : '../../assets/lanhua-banner-1.png')

    const scheduleData = {
      title: schedule.title,
      level: schedule.level,
      capacity: Number(schedule.capacity),
      date: `${schedule.date}T${schedule.time}`,
      dateText: `${schedule.date} — ${schedule.time}`,
      location: schedule.location,
      modality: schedule.modality,
      professor: schedule.professor,
      ...(image && { image })
    }

    try {
      let response
      if (editId) {
        response = await api.put(`/schedules/${editId}`, scheduleData)
      } else {
        response = await api.post('/schedules', scheduleData)
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
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar los datos.'
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
        const classToEdit = currentClasses.find(c => c.id == classId)

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
    const response = await api.get('/catalog')
    const programs = response.data

    programs.forEach(program => {
      container.innerHTML += `
        <div class="col-md-6 col-lg-4">
          <div class="card bg-dark border-secondary text-white p-3 h-100">
            <div class="d-flex align-items-center gap-3">
              <img src="${program.image || '../../assets/lanhua-banner-1.png'}" alt="${program.title}" class="rounded-circle object-fit-cover bg-secondary" style="width: 50px; height: 50px;">
              <div>
                <h5 class="h6 mb-1 text-warning text-uppercase fw-bold">${program.title}</h5>
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
  setMinDateToday('#fecha')
  handleSubmitSchedule()
  validateForm()
}

renderDashboardDisciplines()