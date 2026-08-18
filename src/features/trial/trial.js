document.getElementById("trialForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let nombre = document.getElementById("nombre").value.trim();
  let correo = document.getElementById("correo").value.trim();
  let telefono = document.getElementById("telefono").value.trim();
  let sede = document.getElementById("location").value;
  let horario = document.getElementById("availableschedule").value;

  if (!nombre || !correo || !telefono || !sede || !horario) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos, incluyendo la Sede y el Horario.',
      confirmButtonColor: '#F2BE22'
    });
    return;
  }

  let regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(correo)) {
    Swal.fire({
      icon: 'error',
      title: 'Correo inválido',
      text: 'Por favor, ingresa una dirección de correo electrónico válida.',
      confirmButtonColor: '#BF2A37'
    });
    return;
  }

  let formData = new FormData(this);

  fetch(this.action, {
    method: "POST",
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Reserva enviada!',
        text: 'Gracias por reservar tu clase. Recibiras un mensaje con la confirmacion.',
        confirmButtonColor: '#F2BE22',
        confirmButtonText: 'Aceptar'
      });
      document.getElementById("contactForm").reset();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de envío',
        text: 'Hubo un problema al enviar la reserva. Inténtalo de nuevo.',
        confirmButtonColor: '#BF2A37'
      });
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'Verifica tu conexión a internet.',
      confirmButtonColor: '#BF2A37'
    });
  });
});
