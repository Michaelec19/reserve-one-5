import { classesService } from '../../services/classesService.js'
import { Alert } from '../../shared/components/Alert/Alert.js'
import { setMinDateToday } from '../../shared/js/dateUtils.js'
import { fileToBase64 } from '../../shared/js/utils.js'
import { ScheduleCard } from './components/ScheduleCard/ScheduleCard.js'
import { ScheduleModal } from './components/ScheduleModal/ScheduleModal.js'

const getClasses = () => {
  return classesService.getClasses()
}

const setClasses = (classes) => {
  classesService.saveClasses(classes)
}

const deleteClass = (id) => {
  const currentClasses = getClasses()
  const updatedClasses = currentClasses.filter(classItem => classItem.id !== id)

  setClasses(updatedClasses)
  renderClasses()
}

const renderModalContentForm = () => {
  const modal = document.querySelector('#staticBackdrop')
  modal.innerHTML = ScheduleModal()
}

const renderClasses = () => {
  const classes = getClasses()

  const grupalContainer = document.querySelector('#schedules-grupal')
  const individualContainer = document.querySelector('#schedules-individual')

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

    const currentClasses = getClasses()
    const editId = form.dataset.editId

    if (editId) {
      const classIndex = currentClasses.findIndex(c => c.id === editId)

      if (classIndex !== -1) {
        const existingClass = currentClasses[classIndex]

        const image = hasNewImage
          ? await fileToBase64(imageFile)
          : existingClass.image

        currentClasses[classIndex] = {
          ...existingClass,
          title: schedule.title,
          level: schedule.level,
          capacity: schedule.capacity,
          date: `${schedule.date}T${schedule.time}`,
          dateText: `${schedule.date} — ${schedule.time}`,
          location: schedule.location,
          modality: schedule.modality,
          professor: schedule.professor,
          image
        }

        setClasses(currentClasses)
        renderClasses()

        Swal.fire({
          icon: 'success',
          title: 'Horario Actualizado',
          text: 'El horario se actualizó correctamente.',
          confirmButtonText: 'Aceptar'
        })
      }
    } else {
      const image = hasNewImage
        ? await fileToBase64(imageFile)
        : '../../assets/lanhua-banner-1.png'

      const newClass = {
        id: crypto.randomUUID(),
        title: schedule.title,
        level: schedule.level,
        capacity: schedule.capacity,
        date: `${schedule.date}T${schedule.time}`,
        dateText: `${schedule.date} — ${schedule.time}`,
        location: schedule.location,
        modality: schedule.modality,
        professor: schedule.professor,
        image
      }

      currentClasses.unshift(newClass)
      setClasses(currentClasses)
      renderClasses()

      Swal.fire({
        icon: 'success',
        title: 'Horario agregado',
        text: 'El horario se agregó correctamente.',
        confirmButtonText: 'Aceptar'
      })
    }

    const modalElement = document.querySelector('#staticBackdrop')
    const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement)
    bootstrapModal.hide()
  })
}

const validateForm = () => {
  const addSchedule = document.querySelector('#addSchedule')

  form.addEventListener('input', () => {
    addSchedule.disabled = !form.checkValidity()
  })

  form.addEventListener('change', () => {
    addSchedule.disabled = !form.checkValidity()
  })
}

const setupModalReset = () => {
  const modalElement = document.querySelector('#staticBackdrop')
  modalElement.addEventListener('hidden.bs.modal', resetFormState)
}

const setupEventListeners = () => {
  const cardsContainers = document.querySelectorAll('.cards')

  cardsContainers.forEach(container => {
    container.addEventListener('click', (event) => {
      const deleteBtn = event.target.closest('.delete-btn')
      if (deleteBtn) {
        const classId = deleteBtn.getAttribute('data-id')
        const isConfirmed = confirm('¿Estás seguro de que deseas eliminar esta clase?')
        if (isConfirmed) {
          deleteClass(classId)
        }
        return
      }

      const editBtn = event.target.closest('.edit-btn')
      if (editBtn) {
        const classId = editBtn.getAttribute('data-id')
        const currentClasses = getClasses()
        const classToEdit = currentClasses.find(c => c.id === classId)

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

renderModalContentForm()

const form = document.querySelector('#scheduleForm')

renderClasses()
setupEventListeners()
setupModalReset()
setMinDateToday('#fecha')
handleSubmitSchedule()
validateForm()

const LOCALSTORAGE_PROGRAMS_KEY = 'lanhua_programs'

const renderDashboardDisciplines = () => {
  const container = document.querySelector('#dashboardDisciplinesContainer')
  if (!container) return

  const savedPrograms = window.localStorage.getItem(LOCALSTORAGE_PROGRAMS_KEY)
  const programs = savedPrograms ? JSON.parse(savedPrograms) : []

  container.innerHTML = ''

  if (programs.length === 0) {
    container.innerHTML = '<p class="text-muted small">No hay disciplinas registradas en el catálogo.</p>'
    return
  }

  programs.forEach(program => {
    container.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="card bg-dark border-secondary text-white p-3 h-100">
          <div class="d-flex align-items-center gap-3">
            <img src="${program.image}" alt="${program.title}" class="rounded-circle object-fit-cover bg-secondary" style="width: 50px; height: 50px;">
            <div>
              <h5 class="h6 mb-1 text-warning text-uppercase fw-bold">${program.title}</h5>
              <span class="badge bg-secondary mb-1">${program.category}</span>
              <p class="small text-light mb-0" style="font-size: 12px;">${program.description}</p>
            </div>
          </div>
        </div>
      </div>
    `
  })
}

renderDashboardDisciplines()
