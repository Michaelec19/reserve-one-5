const SESSION_KEY = 'lanhua_session'
const USERS_KEY = 'lanhua_users'
const PROFILE_URL = '/src/features/users/users.html'

const isProfileComplete = (user) => {
  if (!user) return false

  const requiredFields = [
    'nombre',
    'apellidos',
    'documento',
    'direccion',
    'telefono',
    'contactoEmergenciaNombre',
    'contactoEmergenciaParentesco',
    'contactoEmergenciaTelefono',
    'eps',
    'rh'
  ]

  return requiredFields.every(field => {
    const value = user[field]
    return value !== undefined && value !== null && String(value).trim() !== ''
  })
}

export const initWarningUpdate = () => {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY))
  if (!session || session.role === 'admin') return
  const allUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || []
  const fullUser = allUsers.find(u => u.id === session.id) || session
  if (isProfileComplete(fullUser)) return
  if (document.getElementById('warningUpdateBanner')) return
  const bannerElement = document.createElement('div')
  bannerElement.id = 'warningUpdateBanner'
  bannerElement.className = 'warning-update-banner'
  bannerElement.innerHTML = `
    <span>
        Completa Todos los datos en <a href="${PROFILE_URL}">Mi perfil</a> para completar tu inscripción.
    </span>
  `

  const headerElement = document.querySelector('header.header')
  if (headerElement && headerElement.parentNode) {
    headerElement.parentNode.insertBefore(bannerElement, headerElement.nextSibling)
  } else {
    document.body.insertBefore(bannerElement, document.body.firstChild)
  }

  setTimeout(() => {
    bannerElement.classList.add('fade-out')
    setTimeout(() => {
      bannerElement.remove()
    }, 500)
  }, 7000)
}
