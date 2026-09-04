const horariosPorSede = {
  'Sede Laureles': [
    { value: 'Lunes 6:00 PM', text: 'Lunes 6:00 PM - Wushu Básico' },
    { value: 'Miércoles 7:00 PM', text: 'Miércoles 7:00 PM - Wushu Básico' }
  ],
  'Sede Monterrey': [
    { value: 'Martes 5:00 PM', text: 'Martes 5:00 PM - Wushu General' },
    { value: 'Jueves 6:30 PM', text: 'Jueves 6:30 PM - Formas' }
  ],
  'Sede Haru no Hinata': [
    { value: 'Sábado 9:00 AM', text: 'Sábado 9:00 AM - Calistenia' },
    { value: 'Sábado 11:00 AM', text: 'Sábado 11:00 AM - Taolu(Combate)' }
  ]
}

document.getElementById('location').addEventListener('change', function (event) {
  const sedeSeleccionada = event.target.value
  const selectHorario = document.getElementById('availableschedule')

  selectHorario.innerHTML = '<option value="" selected disabled style="color: #adb5bd">Seleccionar Horario</option>'

  if (horariosPorSede[sedeSeleccionada]) {
    horariosPorSede[sedeSeleccionada].forEach(horario => {
      const opcion = document.createElement('option')
      opcion.value = horario.value
      opcion.textContent = horario.text
      selectHorario.appendChild(opcion)
    })
  }
})

document.getElementById('trialForm').addEventListener('submit', function (event) {
  event.preventDefault()

  let nombre = document.getElementById('nombre').value.trim()
  let correo = document.getElementById('correo').value.trim()
  let telefono = document.getElementById('telefono').value.trim()
  let sede = document.getElementById('location').value
  let horario = document.getElementById('availableschedule').value

  if (!nombre || !correo || !telefono || !sede || !horario) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos, incluyendo la Sede y el Horario.',
      confirmButtonColor: '#F2BE22'
    })
    return;
  }

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(correo)) {
    Swal.fire({
      icon: 'error',
      title: 'Correo inválido',
      text: 'Por favor, ingresa una dirección de correo electrónico válida.',
      confirmButtonColor: '#BF2A37'
    })
    return;
  }

  Swal.fire({
    title: 'Procesando...',
    text: 'Enviando tu reserva de cortesía',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })

  setTimeout(() => {
    Swal.fire({
      icon: 'success',
      title: '¡Reserva enviada exitosamente!',
      text: 'Gracias por reservar tu clase. Recibirás un mensaje con la confirmación.',
      confirmButtonColor: '#F2BE22',
      confirmButtonText: 'Aceptar'
    })

    document.getElementById('trialForm').reset()

    document.getElementById('availableschedule').innerHTML = '<option value="" selected disabled style="color: #adb5bd">Seleccionar Horario</option>'

  }, 1200)
})
