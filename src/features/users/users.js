const USERS_COLLECTION = 'lanhua_users'
const CURRENT_SESSION = 'lanhua_session'

const seedDefaultAdmin = () => {
  const USERS_KEY = 'lanhua_users'
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || []

  const defaultAdminEmail = 'admin@lanhua.com'
  const adminExists = users.some(u => u.email === defaultAdminEmail)

  if (!adminExists) {
    const provisionalAdmin = {
      id: 'admin-provisional-01',
      nombre: 'Administrador',
      apellido: 'Sistema Lan Hua',
      email: defaultAdminEmail,
      password: 'Admin1234',
      role: 'admin',
      documento: '1000000000',
      direccion: 'Sede Principal Laureles',
      telefono: '3130000000',
      contactoEmergenciaNombre: 'Soporte Técnico',
      contactoEmergenciaParentesco: 'Sistema',
      contactoEmergenciaTelefono: '3130000000',
      eps: 'Sura',
      rh: 'O+',
      condicionesMedicas: 'Ninguna',
      createdAt: new Date().toISOString()
    }

    users.push(provisionalAdmin)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  seedDefaultAdmin()
  const currentSessionData = JSON.parse(localStorage.getItem(CURRENT_SESSION))

  if (!currentSessionData) {
    window.location.href = '../auth/auth.html'
    return
  }

  const clientHeaderNode = document.getElementById('clientHeader')
  const adminHeaderNode = document.getElementById('adminHeader')

  if (currentSessionData.role === 'admin') {
    adminHeaderNode.classList.remove('d-none')
    setupAdminLogout()
  } else {
    clientHeaderNode.classList.remove('d-none')
  }

  populateProfileForm(currentSessionData)

  const imageUploader = document.getElementById('profileImageInput')
  imageUploader.addEventListener('change', handleAvatarPreview)

  const profileForm = document.getElementById('profileConfigurationForm')
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault()
    saveProfileConfiguration(currentSessionData)
  })
})

function populateProfileForm (session) {
  const allUsers = JSON.parse(localStorage.getItem(USERS_COLLECTION)) || []
  const fullUserData = allUsers.find(user => user.id === session.id) || session

  document.getElementById('inputFirstName').value = fullUserData.nombre || ''
  document.getElementById('inputLastName').value = fullUserData.apellido || ''
  document.getElementById('inputDocumentId').value = fullUserData.documento || ''
  document.getElementById('inputAddress').value = fullUserData.direccion || ''
  document.getElementById('inputPhone').value = fullUserData.telefono || ''

  document.getElementById('inputEmergencyName').value = fullUserData.contactoEmergenciaNombre || ''
  document.getElementById('inputEmergencyRelation').value = fullUserData.contactoEmergenciaParentesco || ''
  document.getElementById('inputEmergencyPhone').value = fullUserData.contactoEmergenciaTelefono || ''

  document.getElementById('selectHealthProvider').value = fullUserData.eps || ''
  document.getElementById('selectBloodType').value = fullUserData.rh || ''
  document.getElementById('textareaMedicalConditions').value = fullUserData.condicionesMedicas || ''

  if (fullUserData.fotoPerfil) {
    document.getElementById('avatarPreview').src = fullUserData.fotoPerfil
  }
}

function handleAvatarPreview (event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      document.getElementById('avatarPreview').src = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function saveProfileConfiguration (session) {
  const allUsers = JSON.parse(localStorage.getItem(USERS_COLLECTION)) || []
  const userIndex = allUsers.findIndex(user => user.id === session.id)

  if (userIndex === -1) {
    Swal.fire('Error', 'Usuario no encontrado en la base de datos.', 'error')
    return
  }

  const updatedUser = {
    ...allUsers[userIndex],
    nombre: document.getElementById('inputFirstName').value.trim(),
    apellido: document.getElementById('inputLastName').value.trim(),
    documento: document.getElementById('inputDocumentId').value.trim(),
    direccion: document.getElementById('inputAddress').value.trim(),
    telefono: document.getElementById('inputPhone').value.trim(),

    contactoEmergenciaNombre: document.getElementById('inputEmergencyName').value.trim(),
    contactoEmergenciaParentesco: document.getElementById('inputEmergencyRelation').value.trim(),
    contactoEmergenciaTelefono: document.getElementById('inputEmergencyPhone').value.trim(),

    eps: document.getElementById('selectHealthProvider').value.trim(),
    rh: document.getElementById('selectBloodType').value,
    condicionesMedicas: document.getElementById('textareaMedicalConditions').value.trim(),
    fotoPerfil: document.getElementById('avatarPreview').src
  }

  allUsers[userIndex] = updatedUser
  localStorage.setItem(USERS_COLLECTION, JSON.stringify(allUsers))

  const { password, ...safeSession } = updatedUser
  localStorage.setItem(CURRENT_SESSION, JSON.stringify(safeSession))

  Swal.fire({
    icon: 'success',
    title: '¡Perfil Actualizado!',
    text: 'Tus datos se han guardado correctamente.',
    confirmButtonColor: '#f2be22',
    background: '#212529',
    color: '#fff'
  })
}

function setupAdminLogout () {
  const adminLogoutBtn = document.getElementById('adminLogoutBtn')
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      localStorage.removeItem(CURRENT_SESSION)
      window.location.href = '../auth/auth.html'
    })
  }
}
