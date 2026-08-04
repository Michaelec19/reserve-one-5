document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío por defecto para validar primero

    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let mensaje = document.getElementById("mensaje").value.trim();

    // 1. Validar campos vacíos
    if (!nombre || !correo || !telefono || !mensaje) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos obligatorios.',
            confirmButtonColor: '#BF2A37'
        });
        return;
    }

    // 2. Validar formato de correo electrónico
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

    // 3. Enviar a Formspree vía Fetch
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
                title: '¡Mensaje enviado!',
                text: 'Gracias por ponerte en contacto con nosotros.',
                confirmButtonColor: '#F2BE22',
                confirmButtonText: 'Aceptar'
            });
            document.getElementById("contactForm").reset();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de envío',
                text: 'Hubo un problema al enviar el mensaje. Inténtalo de nuevo.',
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