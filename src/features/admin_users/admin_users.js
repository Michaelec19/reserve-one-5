/* eslint-disable no-undef */
import { usersService } from '../../services/userService.js'

const tableBody = document.getElementById('tableBody')

const modalElement = document.querySelector('#adminUsersModal')
const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement)
const modalTitle = document.getElementById('adminUsersModalLabel')

const userForm = document.getElementById('userForm')
const userIdInput = document.getElementById('userId')
const userNombreInput = document.getElementById('userNombre')
const userApellidoInput = document.getElementById('userApellido')
const userEmailInput = document.getElementById('userEmail')
const userPasswordInput = document.getElementById('userPassword')
const passwordHint = document.getElementById('passwordHint')
const btnDeleteUser = document.getElementById('btnDeleteUser')

const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const renderUsers = (list) => {
  tableBody.innerHTML = ''

  if (list.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-4">No hay usuarios administradores registrados</td>
      </tr>
    `
    return
  }

  list.forEach((user) => {
    const tr = document.createElement('tr')

    const fullName = user.nombre && (user.apellido || user.apellidos)
      ? `${user.nombre} ${user.apellido || user.apellidos}`
      : user.nombre

    tr.innerHTML = `
      <td>
        <button class="btnEditUser" data-id="${user.id}" title="Editar usuario">
          <i class="fa-solid fa-pen"></i>
        </button>
      </td>
      <td class="text-muted">${fullName}</td>
      <td class="text-muted">${user.email}</td>
      <td class="text-muted">${user.role}</td>
      <td class="text-muted">${formatDate(user.createdAt)}</td>
    `

    tableBody.appendChild(tr)
  })
}

const resetForm = () => {
  userForm.reset()
  userIdInput.value = ''
}

const openCreateModal = () => {
  resetForm()
  modalTitle.textContent = 'Agregar Usuario'
  userPasswordInput.required = true
  passwordHint.classList.add('d-none')
  btnDeleteUser.classList.add('d-none')
  bootstrapModal.show()
}

const openEditModal = (id) => {
  const user = usersService.getUserById(id)
  if (!user) return

  resetForm()
  modalTitle.textContent = 'Editar Usuario'
  userIdInput.value = user.id
  userNombreInput.value = user.nombre
  userApellidoInput.value = user.apellido || user.apellidos || ''
  userEmailInput.value = user.email
  userPasswordInput.required = false
  passwordHint.classList.remove('d-none')
  btnDeleteUser.classList.remove('d-none')
  bootstrapModal.show()
}

userForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const id = userIdInput.value
  const nombre = userNombreInput.value.trim()
  const apellido = userApellidoInput.value.trim()
  const email = userEmailInput.value.trim()
  const password = userPasswordInput.value

  let result

  if (id) {
    const changes = { nombre, apellido, email }
    if (password) changes.password = password

    result = usersService.updateUser(id, changes)
  } else {
    result = usersService.registerUser({ nombre, apellido, email, password, role: 'admin' })
  }

  if (!result.success) {
    Swal.fire({ icon: 'error', title: 'Ups...', text: result.message })
    return
  }

  bootstrapModal.hide()
  renderUsers(usersService.getAdmins())
  Swal.fire({ icon: 'success', title: id ? 'Usuario actualizado' : 'Usuario agregado', timer: 1500, showConfirmButton: false })
})

btnDeleteUser.addEventListener('click', () => {
  const id = userIdInput.value
  if (!id) return

  Swal.fire({
    icon: 'warning',
    title: '¿Eliminar usuario?',
    text: 'Esta acción no se puede deshacer.',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545'
  }).then((confirmResult) => {
    if (!confirmResult.isConfirmed) return

    usersService.deleteUser(id)
    bootstrapModal.hide()
    renderUsers(usersService.getAdmins())
    Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1500, showConfirmButton: false })
  })
})

tableBody.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-id]')
  if (!btn) return

  openEditModal(btn.dataset.id)
})

document.getElementById('addProgram').addEventListener('click', openCreateModal)

renderUsers(usersService.getAdmins())
