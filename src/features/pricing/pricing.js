/* eslint-disable no-undef */

const USER_SESSION_KEY = 'lanhua_users'

const isAuthenticated = () => {
  const user = localStorage.getItem(USER_SESSION_KEY) || sessionStorage.getItem(USER_SESSION_KEY)
  return Boolean(user)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}

document.addEventListener('DOMContentLoaded', () => {
  const planTriggers = document.querySelectorAll('.select-plan-trigger')

  planTriggers.forEach(button => {
    button.addEventListener('click', function () {

      if (!isAuthenticated()) {
        Swal.fire({
          icon: 'warning',
          title: 'Iniciar Sesión Requerido',
          text: 'Debes ingresar a tu cuenta o registrarte para poder adquirir un plan.',
          showCancelButton: true,
          confirmButtonText: 'Iniciar Sesión / Registrarse',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#F2BE22',
          cancelButtonColor: '#BF2A37',
          background: '#1c1f26',
          color: '#fff'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '../auth/auth.html'
          }
        })
        return
      }

      const planName = this.getAttribute('data-plan')
      const planPrice = parseInt(this.getAttribute('data-price'))

      Swal.fire({
        title: `¿Elegir Plan ${planName}?`,
        html: `El valor de tu mensualidad será de <strong>${formatCurrency(planPrice)}</strong>.<br>¿Deseas continuar con la reserva?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#F2BE22',
        cancelButtonColor: '#BF2A37',
        confirmButtonText: 'Sí, reservar',
        cancelButtonText: 'Cancelar',
        background: '#1c1f26',
        color: '#fff'
      }).then((result) => {
        if (result.isConfirmed) {
          
          Swal.fire({
            title: '¡Excelente elección!',
            text: 'Te estamos redirigiendo a la pasarela de pagos segura...',
            icon: 'success',
            background: '#1c1f26',
            color: '#fff',
            showConfirmButton: false, 
            timer: 2000,              
            timerProgressBar: true,
            willClose: () => {
              const paymentUrl = `https://checkout.tu-pasarela.com/`
              
              window.location.href = paymentUrl
            }
          })

        }
      })
    })
  })
})