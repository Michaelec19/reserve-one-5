const USERS_COLLECTION = 'lanhua_users'; 
const CURRENT_SESSION = 'lanhua_session';
const API_BASE_URL = 'http://localhost:8080/api/user-information';
const API_USERS_URL = 'http://localhost:8080/api/users';

const seedDefaultAdmin = () => {
  const users = JSON.parse(localStorage.getItem(USERS_COLLECTION)) || [];
  const defaultAdminEmail = 'admin@lanhua.com';
  const adminExists = users.some(u => u.email === defaultAdminEmail);

  if (!adminExists) {
    const provisionalAdmin = {
      id: 1, 
      nombre: 'Administrador',
      apellido: 'Sistema Lan Hua',
      email: defaultAdminEmail,
      password: 'Admin1234',
      role: 'admin',
      fotoPerfil: ''
    };
    users.push(provisionalAdmin);
    localStorage.setItem(USERS_COLLECTION, JSON.stringify(users));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  seedDefaultAdmin();
  const currentSessionData = JSON.parse(localStorage.getItem(CURRENT_SESSION));

  if (!currentSessionData) {
    window.location.href = '../auth/auth.html';
    return;
  }

  const clientHeaderNode = document.getElementById('clientHeader');
  const adminHeaderNode = document.getElementById('adminHeader');

  if (currentSessionData.role === 'admin') {
    adminHeaderNode?.classList.remove('d-none');
    setupAdminLogout();
  } else {
    clientHeaderNode?.classList.remove('d-none');
  }

  populateProfileForm(currentSessionData);

  const imageUploader = document.getElementById('profileImageInput');
  if (imageUploader) {
    imageUploader.addEventListener('change', handleAvatarPreview);
  }

  const profileForm = document.getElementById('profileConfigurationForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (event) => {
      event.preventDefault();
      saveProfileConfiguration(currentSessionData);
    });
  }

  const btnCancelUpdates = document.getElementById('btnCancelUpdates');
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
          window.location.href = '../catalog_users/catalog_user.html';
        }
      });
    });
  }
});

function checkEpsCertificateExpiration(dateEpsStr) {
  if (!dateEpsStr) return;

  const [year, month, day] = dateEpsStr.split('-');
  const lastUpdate = new Date(year, month - 1, day);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - lastUpdate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 90) {
    Swal.fire({
      icon: 'warning',
      title: '¡Certificado de EPS Vencido!',
      html: 'Han pasado más de 3 meses desde tu última actualización de EPS.<br><br>Por favor <strong>actualiza la fecha y adjunta tu certificado de afiliación vigente</strong>.',
      confirmButtonText: 'Actualizar Ahora',
      confirmButtonColor: '#f2be22',
      background: '#212529',
      color: '#fff'
    });
  }
}

async function populateProfileForm(session) {
  // Llenar datos básicos desde la sesión local
  document.getElementById('inputFirstName').value = session.nombre || '';
  document.getElementById('inputLastName').value = session.apellido || '';
  
  if (session.fotoPerfil) {
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarPreview) avatarPreview.src = session.fotoPerfil;
  }

  // Traer información médica y de contacto desde la base de datos
  try {
    const response = await fetch(`${API_BASE_URL}/${session.id}`);
    
    if (response.ok) {
      const dbUser = await response.json();
      
      document.getElementById('inputDocumentId').value = dbUser.numberDni || '';
      document.getElementById('inputAddress').value = dbUser.address || '';
      document.getElementById('inputPhone').value = dbUser.userPhone || '';
      document.getElementById('inputEmergencyName').value = dbUser.contactName || '';
      document.getElementById('inputEmergencyRelation').value = dbUser.kinship || '';
      document.getElementById('inputEmergencyPhone').value = dbUser.contactPhone || '';
      document.getElementById('selectHealthProvider').value = dbUser.eps || '';
      document.getElementById('selectBloodType').value = dbUser.rh || '';
      document.getElementById('textareaMedicalConditions').value = dbUser.medicConditions || '';
      
      const epsDateField = document.getElementById('inputEpsUpdateDate');
      if (epsDateField && dbUser.dateEps) {
        epsDateField.value = dbUser.dateEps;
        checkEpsCertificateExpiration(dbUser.dateEps);
      }
    } else {
      console.info("El usuario aún no tiene información adicional registrada en la base de datos.");
    }
  } catch (error) {
    console.error('Error de conexión con el backend:', error);
  }
}

function handleAvatarPreview(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const avatarPreview = document.getElementById('avatarPreview');
      if (avatarPreview) avatarPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function saveProfileConfiguration(session) {
  const currentEps = document.getElementById('selectHealthProvider').value.trim();
  const epsDateField = document.getElementById('inputEpsUpdateDate');
  const avatarPreview = document.getElementById('avatarPreview');
  
  const lastEpsUpdateDate = epsDateField && epsDateField.value 
    ? epsDateField.value 
    : new Date().toISOString().split('T')[0];

  const firstName = document.getElementById('inputFirstName').value.trim();
  const lastName = document.getElementById('inputLastName').value.trim();

  // 1. DTO para actualizar la tabla 'user_information'
  const userInformationDTO = {
    idUser: session.id, 
    numberDni: document.getElementById('inputDocumentId').value.trim(),
    address: document.getElementById('inputAddress').value.trim(),
    userPhone: document.getElementById('inputPhone').value.trim(),
    contactName: document.getElementById('inputEmergencyName').value.trim(),
    kinship: document.getElementById('inputEmergencyRelation').value.trim(),
    contactPhone: document.getElementById('inputEmergencyPhone').value.trim(),
    eps: currentEps,
    rh: document.getElementById('selectBloodType').value,
    medicConditions: document.getElementById('textareaMedicalConditions').value.trim(),
    dateEps: lastEpsUpdateDate,
    documentUrl: "", 
    epsUrl: ""       
  };

  // 2. DTO para actualizar la tabla 'users' (Nombre y Apellido)
  const userRequestDto = {
    nameUser: firstName,
    lastNameUser: lastName,
    emailUser: session.email, // Necesario para el backend
    idRol: session.role === 'admin' ? 1 : 2 
  };

  try {
    // Ejecutamos ambas peticiones al backend en paralelo
    const [infoResponse, userResponse] = await Promise.all([
      fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInformationDTO)
      }),
      fetch(`${API_USERS_URL}/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userRequestDto)
      })
    ]);

    if (infoResponse.ok && userResponse.ok) {
      // Actualizamos solo la sesión activa en el navegador para que la UI se refresque sin recargar
      const updatedSession = {
        ...session,
        nombre: firstName,
        apellido: lastName,
        fotoPerfil: avatarPreview ? avatarPreview.src : session.fotoPerfil
      };
      
      localStorage.setItem(CURRENT_SESSION, JSON.stringify(updatedSession));

      Swal.fire({
        icon: 'success',
        title: '¡Perfil Actualizado!',
        text: 'Tus datos médicos y personales se han guardado en el servidor correctamente.',
        confirmButtonColor: '#f2be22',
        background: '#212529',
        color: '#fff'
      });
    } else {
      throw new Error("Fallo al guardar en alguna de las tablas del servidor.");
    }
  } catch (error) {
    Swal.fire('Error', 'Hubo un problema al conectar con el servidor backend.', 'error');
    console.error(error);
  }
}

function setupAdminLogout() {
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      localStorage.removeItem(CURRENT_SESSION);
      window.location.href = '../auth/auth.html';
    });
  }
}