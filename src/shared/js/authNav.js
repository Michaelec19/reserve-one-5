export const initAuthNav = () => {
  const session = JSON.parse(window.localStorage.getItem('lanhua_session'))

  const authLink = document.getElementById('authNavLink')
  const authBtn = document.getElementById('authNavBtn')

  if (!authLink || !authBtn) return

  if (session) {
    authBtn.textContent = 'Cerrar Sesión'
    authLink.setAttribute('href', '#')

    authLink.addEventListener('click', (e) => {
      e.preventDefault()
      window.localStorage.removeItem('lanhua_session')
      window.location.href = '/src/index.html'
    })
  }
}
