/* eslint-disable no-undef */

const USERS_KEY = 'lanhua_users'
const CURRENT_USER_KEY = 'lanhua_user'

// 1. Obtener usuarios existentes en localStorage
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

// 2. Guardar nuevo usuario en localStorage
const saveUser = (newUser) => {
  const users = getUsers()
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// 3. Validar correo con Expresión Regular
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 4. Manejo del Evento Submit del Formulario
const setupRegisterForm = () => {
  const form = document.querySelector('#registerForm')
  if (!form) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Captura de valores de los inputs
    const fullName = document.querySelector('#fullName').value.trim()
    const email = document.querySelector('#email').value.trim()
    const password = document.querySelector('#password').value
    const confirmPassword = document.querySelector('#confirmPassword').value

    // --- VALIDACIONES ---
    if (!fullName || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, diligencia todos los campos del formulario.'
      })
      return
    }

    if (!isValidEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor ingresa un formato de correo electrónico válido.'
      })
      return
    }

    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 6 caracteres.'
      })
      return
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Verifica que ambas contraseñas ingresadas sean idénticas.'
      })
      return
    }

    // --- VERIFICAR SI EL CORREO YA EXISTE ---
    const users = getUsers()
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase())

    if (userExists) {
      Swal.fire({
        icon: 'error',
        title: 'Usuario ya registrado',
        text: 'Este correo electrónico ya está en uso. Intenta iniciar sesión.'
      })
      return
    }

    // --- REGISTRAR NUEVO USUARIO ---
    const newUser = {
      id: crypto.randomUUID(),
      fullName,
      email,
      password // Nota: En desarrollo local se guarda así, en producción irá encriptado
    }

    saveUser(newUser)

    // Opcional: Iniciar sesión automáticamente guardando la sesión activa
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email
    }))

    Swal.fire({
      icon: 'success',
      title: '¡Registro Exitoso!',
      text: 'Tu cuenta ha sido creada correctamente.',
      confirmButtonText: 'Ir a Disciplinas'
    }).then(() => {
      // Redireccionar al catálogo del usuario
      window.location.href = '../catalog/catalog_user.html'
    })
  })
}

// Cargar listener cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  setupRegisterForm()
})