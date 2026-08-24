/* eslint-disable no-undef */
import { getImagePath } from '../shared/js/config.js'

const LOCALSTORAGE_KEY = 'lanhua_classes'

const defaultClasses = [
  {
    id: crypto.randomUUID(),
    title: 'rutina',
    level: 'principiante',
    capacity: 15,
    date: '2026-07-02T18:00',
    dateText: '2 Julio 2026 — Lunes 6 PM',
    location: 'Medellín',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-1.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'combate',
    level: 'avanzado',
    capacity: 10,
    date: '2026-07-03T19:00',
    dateText: '3 Julio 2026 — Martes 7 PM',
    location: 'Monterrey',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-2.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'taichi',
    level: 'intermedio',
    capacity: 20,
    date: '2026-07-04T17:00',
    dateText: '4 Julio 2026 — Miércoles 5 PM',
    location: 'Sabaneta',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Wuchu general',
    level: 'intermedio',
    capacity: 20,
    date: '2026-07-04T17:00',
    dateText: '4 Julio 2026 — Miércoles 5 PM',
    location: 'Sabaneta',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Taolu (formas)',
    level: 'intermedio',
    capacity: 20,
    date: '2026-07-04T17:00',
    dateText: '4 Julio 2026 — Miércoles 5 PM',
    location: 'Laureles',
    modality: 'grupal',
    image: getImagePath('lanhua-banner-3.png')
  },
  {
    id: crypto.randomUUID(),
    title: 'Acondicionamiento físico',
    level: 'intermedio',
    capacity: 20,
    date: '2026-07-04T17:00',
    dateText: '4 Julio 2026 — Miércoles 5 PM',
    location: 'Laureles',
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

export const classesService = {
  getClasses
}
