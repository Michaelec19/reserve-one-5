const USERS_KEY = 'lanhua_users'
const SESSION_KEY = 'lanhua_session'

const defaultAdmins = [
  {
    id: 'admin-demo-01',
    nombre: 'Administrador',
    apellido: 'Lan Hua',
    email: 'admin@lanhua.com',
    password: 'Admin1234',
    role: 'admin',
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'admin-demo-02',
    nombre: 'María',
    apellido: 'López',
    email: 'maria.lopez@lanhua.com',
    password: 'Admin1234',
    role: 'admin',
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'admin-demo-03',
    nombre: 'Juan',
    apellido: 'Mendoza',
    email: 'juan.mendoza@lanhua.com',
    password: 'Admin1234',
    role: 'admin',
    createdAt: '2026-02-15T10:00:00.000Z'
  }
]

const seedDefaultAdmins = (users) => {
  const adminsToAdd = defaultAdmins.filter(
    (admin) => !users.some((user) => user.email.toLowerCase() === admin.email.toLowerCase())
  )

  if (adminsToAdd.length === 0) return users

  const updatedUsers = [...users, ...adminsToAdd]
  saveAllUsers(updatedUsers)
  return updatedUsers
}

const getCurrentUserId = () => {
  const session = window.localStorage.getItem(SESSION_KEY)
  if (!session) return null
  return JSON.parse(session).id
}

const getAllUsers = () => {
  const savedData = window.localStorage.getItem(USERS_KEY)

  if (!savedData) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(defaultAdmins))
    return [...defaultAdmins]
  }

  const users = JSON.parse(savedData)
  const hasAdmins = users.some((user) => user.role === 'admin')

  if (!hasAdmins) {
    return seedDefaultAdmins(users)
  }

  return users
}

const saveAllUsers = (users) => {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const getUserById = (id) => {
  const allUsers = getAllUsers()
  return allUsers.find(user => user.id === id) || null
}

const getUserByEmail = (email) => {
  const allUsers = getAllUsers()
  return allUsers.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
}

const getCurrentUser = () => {
  const userId = getCurrentUserId()
  if (!userId) return null
  return getUserById(userId)
}

const emailExists = (email) => {
  return getUserByEmail(email) !== null
}

const registerUser = (userData) => {
  const { email, password, nombre } = userData

  if (!email || !password || !nombre) {
    return {
      success: false,
      message: 'Nombre, correo y contraseña son obligatorios'
    }
  }

  if (emailExists(email)) {
    return {
      success: false,
      message: 'Ya existe una cuenta registrada con este correo'
    }
  }

  const allUsers = getAllUsers()

  const newUser = {
    id: crypto.randomUUID(),
    role: 'user',
    createdAt: new Date().toISOString(),
    ...userData
  }

  allUsers.push(newUser)
  saveAllUsers(allUsers)

  return {
    success: true,
    message: 'Usuario registrado exitosamente',
    user: newUser
  }
}

const login = (email, password) => {
  const user = getUserByEmail(email)

  if (!user || user.password !== password) {
    return {
      success: false,
      message: 'Correo o contraseña incorrectos'
    }
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id }))

  return {
    success: true,
    message: 'Sesión iniciada exitosamente',
    user
  }
}

const logout = () => {
  window.localStorage.removeItem(SESSION_KEY)
}

const updateUser = (id, changes) => {
  const allUsers = getAllUsers()
  const index = allUsers.findIndex(user => user.id === id)

  if (index === -1) {
    return {
      success: false,
      message: 'Usuario no encontrado'
    }
  }

  const { id: _id, createdAt: _createdAt, ...safeChanges } = changes

  allUsers[index] = { ...allUsers[index], ...safeChanges }
  saveAllUsers(allUsers)

  return {
    success: true,
    message: 'Usuario actualizado exitosamente',
    user: allUsers[index]
  }
}

const changeUserRole = (id, role) => {
  return updateUser(id, { role })
}

const deleteUser = (id) => {
  const allUsers = getAllUsers()
  const updatedUsers = allUsers.filter(user => user.id !== id)
  saveAllUsers(updatedUsers)
}

const getAdmins = () => {
  const allUsers = getAllUsers()
  return allUsers.filter(user => user.role === 'admin')
}

export const usersService = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getCurrentUser,
  emailExists,
  registerUser,
  login,
  logout,
  updateUser,
  changeUserRole,
  deleteUser,
  getAdmins
}
