import { ScheduleModal } from './components/ScheduleModal/ScheduleModal.js'

const modal = document.querySelector('#staticBackdrop')
modal.innerHTML = ScheduleModal()

const form = document.querySelector('#scheduleForm')

const validateDate = () => {
  const today = new Date().toISOString().split('T')[0]
  document.querySelector('#fecha').min = today
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

const createSchedule = () => {
  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(form)

    const schedule = Object.fromEntries(formData)

    console.log('schedule', schedule)

    // TODO: Agregar lógica de guardar clase

    // TODO: Despues de agregar renderizar card
  })
}

validateDate()
validateForm()
createSchedule()
