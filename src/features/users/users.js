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
      createdAt: new Date().toISOString(),
      lastEpsUpdateDate: new Date().toISOString().split('T')[0] 
    }

    users.push(provisionalAdmin)
    localStorage.setItem(USERS_COLLECTION, JSON.stringify(users))
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
    adminHeaderNode?.classList.remove('d-none')
    setupAdminLogout()
  } else {
    clientHeaderNode?.classList.remove('d-none')
  }

  populateProfileForm(currentSessionData)
  checkEpsCertificateExpiration(currentSessionData)

  const imageUploader = document.getElementById('profileImageInput')
  if (imageUploader) {
    imageUploader.addEventListener('change', handleAvatarPreview)
  }

  const profileForm = document.getElementById('profileConfigurationForm')
  if (profileForm) {
    profileForm.addEventListener('submit', (event) => {
      event.preventDefault()
      saveProfileConfiguration(currentSessionData)
    })
  }
})

<<<<<<< HEAD
function checkEpsCertificateExpiration (session) {
  const allUsers = JSON.parse(localStorage.getItem(USERS_COLLECTION)) || []
  const fullUserData = allUsers.find(user => user.id === session.id) || session

  if (!fullUserData.lastEpsUpdateDate) return

  const [year, month, day] = fullUserData.lastEpsUpdateDate.split('T')[0].split('-')
  const lastUpdate = new Date(year, month - 1, day)
  const currentDate = new Date()

  const diffTime = Math.abs(currentDate - lastUpdate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays >= 90) {
    Swal.fire({
      icon: 'warning',
      title: '¡Certificado de EPS Vencido!',
      html: 'Han pasado más de 3 meses desde tu última actualización de EPS.<br><br>Por favor <strong>actualiza la fecha y adjunta tu certificado de afiliación vigente</strong>.',
      confirmButtonText: 'Actualizar Ahora',
      confirmButtonColor: '#f2be22',
      background: '#212529',
      color: '#fff'
    })
  }
}

=======
const btnCancelUpdates = document.getElementById('btnCancelUpdates')
  if (btnCancelUpdates) {
    btnCancelUpdates.addEventListener('click', () => {
      Swal.fire({
        title: '¿Estás seguro de cancelar?',
        text: 'Si cancelas ahora, perderás los cambios no guardados en tu información de perfil.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar más tarde',
        cancelButtonText: 'No, seguir ahora',
        reverseButtons: true,
        background: '#212529',
        color: '#fff',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#343a40'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '../catalog_users/catalog_user.html'
        }
      })
    })
  }
        
>>>>>>> 63f31a7755b7f9084bf626b9686559352aeaa2bc
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

  const epsDateField = document.getElementById('inputEpsUpdateDate')
  if (epsDateField) {
    const rawDate = fullUserData.lastEpsUpdateDate || new Date().toISOString()
    epsDateField.value = rawDate.split('T')[0]
  }

  if (fullUserData.fotoPerfil) {
    const avatarPreview = document.getElementById('avatarPreview')
    if (avatarPreview) avatarPreview.src = fullUserData.fotoPerfil
  }
}

function handleAvatarPreview (event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      const avatarPreview = document.getElementById('avatarPreview')
      if (avatarPreview) avatarPreview.src = e.target.result
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

  const currentEps = document.getElementById('selectHealthProvider').value.trim()
  const epsDateField = document.getElementById('inputEpsUpdateDate')
  const avatarPreview = document.getElementById('avatarPreview')
  
  const lastEpsUpdateDate = epsDateField && epsDateField.value 
    ? epsDateField.value 
    : new Date().toISOString().split('T')[0]

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

    eps: currentEps,
    rh: document.getElementById('selectBloodType').value,
    condicionesMedicas: document.getElementById('textareaMedicalConditions').value.trim(),
    fotoPerfil: avatarPreview ? avatarPreview.src : '',
    
    lastEpsUpdateDate: lastEpsUpdateDate
  }

  allUsers[userIndex] = updatedUser
  localStorage.setItem(USERS_COLLECTION, JSON.stringify(allUsers))

  const { password, ...safeSession } = updatedUser
  localStorage.setItem(CURRENT_SESSION, JSON.stringify(safeSession))

  Swal.fire({
    icon: 'success',
    title: '¡Perfil Actualizado!',
    text: 'Tus datos y la fecha de tu certificado de EPS se han guardado correctamente.',
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