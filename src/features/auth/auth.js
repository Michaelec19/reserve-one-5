document.addEventListener('DOMContentLoaded', () => {
  const togglePasswordButtons = document.querySelectorAll('.toggle-password')

  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target')
      const input = document.getElementById(targetId)
      const icon = this.querySelector('i')

      if (input.type === 'password') {
        input.type = 'text'
        icon.classList.remove('fa-eye')
        icon.classList.add('fa-eye-slash')
      } else {
        input.type = 'password'
        icon.classList.remove('fa-eye-slash')
        icon.classList.add('fa-eye')
      }
    })
  })

  const loginForm = document.getElementById('loginForm')
  const registerForm = document.getElementById('registerForm')

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault()
    })
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault()
    })
  }
})
