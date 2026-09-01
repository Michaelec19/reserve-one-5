const SESSION_KEY = 'lanhua_session'
const DEFAULT_AVATAR = '/src/assets/default-avatar.png'
const LOGIN_URL = '/src/features/auth/auth.html'
const RESERVATIONS_URL = '/src/features/reservations/reservations.html'
const PROFILE_URL = '/src/features/users/users.html'

const LOGOUT_REDIRECT = LOGIN_URL

const getSession = () => {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

const logout = () => {
  window.localStorage.removeItem(SESSION_KEY)
  window.location.href = LOGOUT_REDIRECT
}

const menuItem = (href, iconPath, label, extraClass = '') => `
  <li><a class="user-menu-panel__item ${extraClass}" href="${href}">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      ${iconPath}
    </svg>
    ${label}
  </a></li>
`

const logoutItem = () => `
  <li><a class="user-menu-panel__item user-menu-panel__item--danger" href="#" id="logoutBtn">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <path d="M16 17l5-5-5-5M21 12H9"/>
    </svg>
    Cerrar sesión
  </a></li>
`

const userMenuItems = () => {
  return `
    ${menuItem(RESERVATIONS_URL, '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>', 'Mis reservas')}
    ${menuItem(PROFILE_URL, '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 'Mi Perfil')}
    <li><hr class="user-menu-panel__divider"></li>
    ${logoutItem()}
  `
}

const adminMenuItems = () => {
  return `
    ${menuItem(PROFILE_URL, '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 'Mi Perfil')}
    <li><hr class="user-menu-panel__divider"></li>
    ${logoutItem()}
  `
}

const template = (session) => {
  if (!session) {
    return `
      <a href="${LOGIN_URL}" class="w-100" id="authNavLink">
        <button class="btnLogin w-100" id="authNavBtn">Ingresar</button>
      </a>
    `
  }

  const name = session.nombre && (session.apellido || session.apellidos)
    ? `${session.nombre} ${session.apellido || session.apellidos}`
    : session.nombre || session.name || session.email || 'Mi cuenta'
  const avatar = session.fotoPerfil || DEFAULT_AVATAR
  const isAdmin = session.role === 'admin'

  return `
    <div class="dropdown w-100" id="userMenu">
      <button class="user-chip" type="button" id="userMenuBtn" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="user-chip__name">${name}</span>
        <span class="user-chip__avatar">
          <img src="${avatar}" alt="${name}" />
        </span>
        <svg class="user-chip__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <ul class="dropdown-menu dropdown-menu-end user-menu-panel" aria-labelledby="userMenuBtn">
        ${isAdmin ? adminMenuItems() : userMenuItems()}
      </ul>
    </div>
  `
}

export const loadUserMenu = (containerId = 'authNavContainer') => {
  const container = document.getElementById(containerId)

  if (!container) return

  const session = getSession()
  container.innerHTML = template(session)

  if (!session) return

  const logoutBtn = document.getElementById('logoutBtn')

  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    logout()
  })
}
