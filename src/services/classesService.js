import { getImagePath } from '../shared/js/config.js'

const LOCALSTORAGE_KEY = 'lanhua_classes'

const defaultClasses = [
  {
    id: crypto.randomUUID(),
    title: 'rutina',
    level: 'principiante',
    capacity: 15,
    date: '2026-09-04T08:00',
    dateText: '4 Septiembre 2026 — Viernes 8 AM',
    location: 'Medellín',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-1.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'combate',
    level: 'avanzado',
    capacity: 10,
    date: '2026-09-04T10:00',
    dateText: '4 Septiembre 2026 — Viernes 10 AM',
    location: 'Monterrey',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-2.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'taichi',
    level: 'intermedio',
    capacity: 20,
    date: '2026-09-04T15:00',
    dateText: '4 Septiembre 2026 — Viernes 3 PM',
    location: 'Sabaneta',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Wuchu general',
    level: 'intermedio',
    capacity: 20,
    date: '2026-09-04T17:00',
    dateText: '4 Septiembre 2026 — Viernes 5 PM',
    location: 'Sabaneta',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Taolu (formas)',
    level: 'intermedio',
    capacity: 20,
    date: '2026-09-04T18:30',
    dateText: '4 Septiembre 2026 — Viernes 6:30 PM',
    location: 'Laureles',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Acondicionamiento físico',
    level: 'intermedio',
    capacity: 20,
    date: '2026-09-04T20:00',
    dateText: '4 Septiembre 2026 — Viernes 8 PM',
    location: 'Laureles',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Wushu Avanzado',
    level: 'avanzado',
    capacity: 12,
    date: '2026-09-05T09:00',
    dateText: '5 Septiembre 2026 — Sábado 9 AM',
    location: 'Sabaneta',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-1.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Calistenia y Fuerza',
    level: 'intermedio',
    capacity: 15,
    date: '2026-09-05T11:00',
    dateText: '5 Septiembre 2026 — Sábado 11 AM',
    location: 'Laureles',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-2.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Taichi Matutino',
    level: 'principiante',
    capacity: 20,
    date: '2026-09-05T15:00',
    dateText: '5 Septiembre 2026 — Sábado 3 PM',
    location: 'Monterrey',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  },

  // --- CLASES DEL 6 DE SEPTIEMBRE (Domingo) ---
  {
    id: crypto.randomUUID(),
    title: 'Taolu (formas)',
    level: 'intermedio',
    capacity: 15,
    date: '2026-09-06T10:00',
    dateText: '6 Septiembre 2026 — Domingo 10 AM',
    location: 'Laureles',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-1.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Acondicionamiento físico',
    level: 'principiante',
    capacity: 20,
    date: '2026-09-06T12:00',
    dateText: '6 Septiembre 2026 — Domingo 12 PM',
    location: 'Sabaneta',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-2.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Defensa Personal',
    level: 'avanzado',
    capacity: 10,
    date: '2026-09-06T16:00',
    dateText: '6 Septiembre 2026 — Domingo 4 PM',
    location: 'Monterrey',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  },

  // --- CLASES DEL 7 DE SEPTIEMBRE (Lunes) ---
  {
    id: crypto.randomUUID(),
    title: 'rutina',
    level: 'principiante',
    capacity: 15,
    date: '2026-09-07T18:00',
    dateText: '7 Septiembre 2026 — Lunes 6 PM',
    location: 'Medellín',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-1.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'combate',
    level: 'avanzado',
    capacity: 10,
    date: '2026-09-07T19:00',
    dateText: '7 Septiembre 2026 — Lunes 7 PM',
    location: 'Monterrey',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-2.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'taichi',
    level: 'intermedio',
    capacity: 20,
    date: '2026-09-07T20:00',
    dateText: '7 Septiembre 2026 — Lunes 8 PM',
    location: 'Sabaneta',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  }
]

const getClasses = () => {
  const savedData = localStorage.getItem(LOCALSTORAGE_KEY)

  if (!savedData) {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(defaultClasses))
    return defaultClasses
  }

  return JSON.parse(savedData)
}

const saveClasses = (classes) => {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(classes))
}

export const classesService = {
  getClasses,
  saveClasses
}
