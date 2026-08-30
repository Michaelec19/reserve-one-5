const SESSION_KEY = 'lanhua_session'

const getSession = () => {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

export const requireAuth = () => {
  const session = getSession()
  if (!session) {
    window.location.href = '/src/features/auth/auth.html'
    return false
  }
  return true
}

export const requireAdmin = () => {
  const session = getSession()
  if (!session) {
    window.location.href = '/src/features/auth/auth.html'
    return false
  }
  if (session.role !== 'admin') {
    Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      text: 'No tienes permisos para acceder a esta sección.',
      confirmButtonColor: '#f2be22',
      background: '#212529',
      color: '#fff'
    }).then(() => {
      window.location.href = '/src/index.html'
    })
    return false
  }
  return true
}

export const redirectIfAdmin = () => {
  const session = getSession()
  if (session && session.role === 'admin') {
    window.location.href = '/src/features/dashboard/dashboard.html'
    return true
  }
  return false
}

export const redirectIfNotAdmin = () => {
  const session = getSession()
  if (session && session.role !== 'admin') {
    window.location.href = '/src/features/catalog_users/catalog_user.html'
    return true
  }
  return false
}
