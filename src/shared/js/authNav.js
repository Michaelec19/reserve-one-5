const SESSION_KEY = 'lanhua_session'

const getSession = () => {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

const logout = () => {
  window.localStorage.removeItem(SESSION_KEY)
  window.location.href = '/src/index.html'
}

export const initAuthNav = () => {
  const session = getSession()

  const authLink = document.getElementById('authNavLink')
  const userMenu = document.getElementById('userMenu')
  const userMenuName = document.getElementById('userMenuName')
  const logoutBtn = document.getElementById('logoutBtn')

  if (!authLink || !userMenu) return

  const isLoggedIn = Boolean(session)

  authLink.classList.toggle('d-none', isLoggedIn)
  userMenu.classList.toggle('d-none', !isLoggedIn)

  if (isLoggedIn) {
    userMenuName.textContent = session.nombre || session.name || session.email || 'Mi cuenta'

    logoutBtn?.addEventListener('click', (e) => {
      e.preventDefault()
      logout()
    })
  }
}
