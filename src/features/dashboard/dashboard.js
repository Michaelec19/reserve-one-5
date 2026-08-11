import { ScheduleCard } from './components/ScheduleCard/ScheduleCard.js';
import { ScheduleModal } from './components/ScheduleModal/ScheduleModal.js'

const LOCALSTORAGE_KEY = 'lanhua_classes';

const defaultClasses = [
  {
    id: crypto.randomUUID(),
    title: 'Rutina Base',
    level: 'Principiante',
    capacity: 15,
    date: '2026-07-02T18:00',
    dateText: '2 Julio 2026 — Lunes 6 PM',
    location: 'Medellín',
    modality: 'Grupal',
    image: '../../assets/1.png'
  },
  {
    id: crypto.randomUUID(),
    title: 'Sanda / Combate',
    level: 'Avanzado',
    capacity: 10,
    date: '2026-07-03T19:00',
    dateText: '3 Julio 2026 — Martes 7 PM',
    location: 'Medellín',
    modality: 'Parejas',
    image: '../../assets/1.png'
  },
  {
    id: crypto.randomUUID(),
    title: 'Wushu Tradicional',
    level: 'Intermedio',
    capacity: 20,
    date: '2026-07-04T17:00',
    dateText: '4 Julio 2026 — Miércoles 5 PM',
    location: 'Sabaneta',
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
      return;
    }

    const editBtn = event.target.closest('.edit-btn');
    if (editBtn) {
      const classId = editBtn.getAttribute('data-id');
      const currentClasses = getClasses();
      const classToEdit = currentClasses.find(c => c.id === classId);

      if (classToEdit) {

        form.modalidad.value = classToEdit.modality.toLowerCase();

        form.disciplina.value = classToEdit.title.toLowerCase();
        form.nivel.value = classToEdit.level.toLowerCase();
        form.cupos.value = classToEdit.capacity;
        form.ubicacion.value = classToEdit.location;

        const [fechaStr, horaStr] = classToEdit.date.split('T');
        form.fecha.value = fechaStr;
        form.hora.value = horaStr;

        form.dataset.editId = classId;

        document.querySelector('#staticBackdropLabel').textContent = 'Actualizar Horario';
        const submitBtn = document.querySelector('#addSchedule');
        submitBtn.textContent = 'Actualizar Horario';
        submitBtn.disabled = false;

        const modalElement = document.querySelector('#staticBackdrop');
        const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement);
        bootstrapModal.show();
      }
    }
  });
};

setupEventListeners();


const modal = document.querySelector('#staticBackdrop')
modal.innerHTML = ScheduleModal()

const form = document.querySelector('#scheduleForm')

const validateDate = () => {
  const today = new Date().toISOString().split('T')[0]
  document.querySelector('#fecha').min = today
}

const validateForm = () => {
  const addSchedule = document.querySelector('#addSchedule')

  form.addEventListener('input', () => {
    addSchedule.disabled = !form.checkValidity()
  })

  form.addEventListener('change', () => {
    addSchedule.disabled = !form.checkValidity()
  })
}

const btnAddSchedule = document.querySelector('.btnAddSchedule');
btnAddSchedule.addEventListener('click', () => {
  form.reset();
  delete form.dataset.editId;
  document.querySelector('#staticBackdropLabel').textContent = 'Agregar Horario';
  document.querySelector('#addSchedule').textContent = 'Agregar Horario';
  document.querySelector('#addSchedule').disabled = true;
});

const createSchedule = () => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const scheduleData = Object.fromEntries(formData);
    console.log('Datos del formulario:', scheduleData);

    const currentClasses = getClasses();

    const isEditingId = form.dataset.editId;

    if (isEditingId) {
      const classIndex = currentClasses.findIndex(c => c.id === isEditingId);

      if (classIndex !== -1) {
        currentClasses[classIndex] = {
          ...currentClasses[classIndex],
          title: scheduleData.disciplina,
          level: scheduleData.nivel,
          capacity: scheduleData.cupos,
          date: `${scheduleData.fecha}T${scheduleData.hora}`,
          dateText: `${scheduleData.fecha} — ${scheduleData.hora}`,
          location: scheduleData.ubicacion,
          modality: scheduleData.modalidad,
        };
      }
    } else {
      const newClass = {
        id: crypto.randomUUID(),
        title: scheduleData.disciplina,
        level: scheduleData.nivel,
        capacity: scheduleData.cupos,
        date: `${scheduleData.fecha}T${scheduleData.hora}`,
        dateText: `${scheduleData.fecha} — ${scheduleData.hora}`,
        location: scheduleData.ubicacion,
        modality: scheduleData.modalidad,
        image: '../../assets/1.png'
      };
      currentClasses.unshift(newClass);
    }


    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(currentClasses));

    renderClasses();

    form.reset();
    delete form.dataset.editId;

    const modalElement = document.querySelector('#staticBackdrop');
    const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    bootstrapModal.hide();

    document.body.classList.remove('modal-open');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  });
};

validateDate()
validateForm()
createSchedule()
