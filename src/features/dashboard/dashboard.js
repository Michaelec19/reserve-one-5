import { ScheduleCard } from './components/ScheduleCard/ScheduleCard.js';

const LOCALSTORAGE_KEY = 'lanhua_classes';

const defaultClasses = [
  {
    id: crypto.randomUUID(),
    title: 'Rutina',
    level: 'Principiante',
    capacity: 15,
    date: '2026-07-02T18:00',
    dateText: '2 Julio 2026 — Lunes 6 PM',
    location: 'Medellín',
    modality: 'Grupal',
    image: '../../assets/1.png'
  }
];

export const getClasses = () => {
  const savedData = localStorage.getItem(LOCALSTORAGE_KEY);

  if (!savedData) {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(defaultClasses));
    return defaultClasses;
  }
  return JSON.parse(savedData);
};

console.log('Loaded classes:', getClasses());

export const renderClasses = () => {
  const classes = getClasses();
  const cardsContainer = document.querySelector('#schedules');

  cardsContainer.innerHTML = '';

  classes.forEach(classItem => {
    cardsContainer.innerHTML += ScheduleCard(classItem);
  });
};

renderClasses();

export const deleteClass = (id) => {
  const currentClasses = getClasses();

  const updatedClasses = currentClasses.filter(classItem => classItem.id !== id);

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedClasses));

  renderClasses();
};

export const setupEventListeners = () => {
  const cardsContainer = document.querySelector('.cards');

  cardsContainer.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.delete-btn');

    if (deleteBtn) {
      const classId = deleteBtn.getAttribute('data-id');

      const isConfirmed = confirm('¿Estás seguro de que deseas eliminar esta clase?');

      if (isConfirmed) {
        deleteClass(classId);
      }
    }
  });
};

setupEventListeners();
