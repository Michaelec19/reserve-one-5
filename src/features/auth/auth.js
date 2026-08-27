document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash
  if (hash) {
    const triggerEl = document.querySelector(`button[data-bs-target="${hash}"]`)
    if (triggerEl) {
      const tab = new bootstrap.Tab(triggerEl)
      tab.show()
    }
  }

  const toggleButtons = document.querySelectorAll('.toggle-password')
  toggleButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target')
      const inputElement = document.getElementById(targetId)
      const icon = this.querySelector('i')

      if (inputElement.type === 'password') {
        inputElement.type = 'text';
        icon.classList.remove('fa-eye')
        icon.classList.add('fa-eye-slash')
      } else {
        inputElement.type = 'password';
        icon.classList.remove('fa-eye-slash')
        icon.classList.add('fa-eye')
      }
    })
  })

  const loginForm = document.getElementById('loginForm')
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const email = document.getElementById('loginCorreo').value
      const password = document.getElementById('loginPassword').value
      const btn = loginForm.querySelector('button[type="submit"]')
      const spinner = document.getElementById('loginSpinner')

      spinner.classList.remove('d-none')
      btn.disabled = true

      setTimeout(() => {
        spinner.classList.add('d-none')
        btn.disabled = false

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido a LAN HUA!',
          text: 'Has iniciado sesión correctamente.',
          confirmButtonColor: '#f2be22',
          background: '#212529',
          color: '#fff'
        }).then(() => {
        })
      }, 1500)
    })
  }

  const registerForm = document.getElementById('registerForm')
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const nombre = document.getElementById('regNombre').value
      const correo = document.getElementById('regCorreo').value
      const password = document.getElementById('regPassword').value
      const confirmPassword = document.getElementById('regConfirmPassword').value

      if (password !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: 'Las contraseñas no coinciden. Por favor, verifica e intenta de nuevo.',
          confirmButtonColor: '#f2be22',
          background: '#212529',
          color: '#fff'
        })
        return;
      }

      if (password.length < 8) {
        Swal.fire({
          icon: 'warning',
          title: 'Contraseña muy corta',
          text: 'La contraseña debe tener al menos 8 caracteres para ser segura.',
          confirmButtonColor: '#f2be22',
          background: '#212529',
          color: '#fff'
        })
        return;
      }

      const btn = registerForm.querySelector('button[type="submit"]')
      const spinner = document.getElementById('registerSpinner')

      spinner.classList.remove('d-none')
      btn.disabled = true

      setTimeout(() => {
        spinner.classList.add('d-none')
        btn.disabled = false

        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
          confirmButtonColor: '#f2be22',
          background: '#212529',
          color: '#fff'
        }).then(() => {
          registerForm.reset()
          const loginTab = new bootstrap.Tab(document.getElementById('login-tab'))
          loginTab.show()
        })
      }, 1500)
    })
  }
})
