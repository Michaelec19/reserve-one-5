const SESSION_KEY = 'lanhua_session'

const getSession = () => {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

const showBody = () => {
  document.body.style.visibility = 'visible'
}

export const requireAuth = () => {
  const session = getSession()
  if (!session) {
    window.location.href = '/src/features/auth/auth.html'
    return false
  }
  showBody()
  return true
}

export const requireAdmin = () => {
  const session = getSession()
  if (!session) {
    window.location.href = '/src/features/auth/auth.html'
    return false
  }
  if (session.role !== 'admin') {
    window.location.href = '/src/index.html'
    return false
  }
  showBody()
  return true
}

export const redirectIfAdmin = () => {
  const session = getSession()
  if (session && session.role === 'admin') {
    window.location.href = '/src/features/dashboard/dashboard.html'
    return true
  }
  showBody()
  return false
}

export const redirectIfNotAdmin = () => {
  const session = getSession()
  if (session && session.role !== 'admin') {
    window.location.href = '/src/features/catalog_users/catalog_user.html'
    return true
  }
  showBody()
  return false
}
