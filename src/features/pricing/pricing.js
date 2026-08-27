document.addEventListener('DOMContentLoaded', () => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const planTriggers = document.querySelectorAll('.select-plan-trigger')

  planTriggers.forEach(button => {
    button.addEventListener('click', function () {
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
          // to do: pasarela de pago
          // window.location.href = `/checkout?plan=${planName}`;
          Swal.fire({
            title: '¡Excelente elección!',
            text: 'Te redirigiremos al sistema de registro.',
            icon: 'success',
            background: '#1c1f26',
            color: '#fff',
            confirmButtonColor: '#F2BE22'
          })
        }
      })
    })
  })
})
