# Reserve-One - Booking System for Club Lan Hua


## Cómo probar la aplicación

Para explorar el sistema y probar las diferentes vistas según el rol, dirígete a la ruta de inicio de sesión:
`src/features/auth/auth.html`

### Probar como Administrador
Si deseas explorar las vistas y herramientas de administración sin necesidad de registrarte, puedes utilizar las siguientes credenciales provisionales preconfiguradas:
* **Correo electrónico:** `admin@lanhua.com`
* **Contraseña:** `Admin1234!`

### Probar como Usuario Regular (Estudiante / Cliente)
Para probar la experiencia de un usuario común y el sistema de reservas:
1. Haz clic en la opción **"Crear Cuenta"** y completa el formulario de registro con tus datos.
2. Una vez registrado, ve a la sección de **"Ingresar"**.
3. Inicia sesión normalmente con el correo y la contraseña que acabas de crear para acceder al catálogo, configurar tu perfil y gestionar tus reservas."

## Project Context

**Club Deportivo Lan Hua** is a Chinese martial arts school located in Medellín, Colombia, specializing in:
- Traditional Kung Fu (Mizong Luohan style)
- Competitive Wushu for all ages

### Problem Solved

Club Lan Hua faced significant challenges due to its completely manual and decentralized management:
- **Loss of clients** due to inefficient booking processes
- **Low client retention** due to a lack of follow-up and organization
- **Uncertain management** of classes, schedules, and students due to the lack of a confirmation system
- **Lack of visibility** regarding class occupancy and availability

### Solution: Reserve-One

Reserve-One is an exclusive development designed specifically for Club Lan Hua that automates and optimizes the entire booking and management system of the club.

---

## MVP - Project Scope

### Features Included in the MVP

**Booking System**
- General and specific information about the club
- Online class booking
- Real-time visualization and updating of available classes
- Reservation cancellation by students
- Quota control with real-time updates
- Schedule management and class programming by the administrator

### Features NOT Included in the MVP (Future)

- Membership and payment management
- Attendance and progress tracking
- Notifications (email/direct message)

---

## Design and UX

The system's design is based on the principles of:
- **Simplicity**: Intuitive interface for users of all ages
- **Accessibility**: Easy navigation and use on mobile devices
- **Visual identity**: Design aligned with the philosophy and identity of Club Lan Hua
- **Efficiency**: Fast booking flows

### External Links

- [Link to Figma design](https://www.figma.com/site/TasFM7Lj4KkAN9yRIDTGX5/Proyecto?node-id=0-1&t=SStItpGp0LhiIOZV-1)
- [Deploy admin-dashboard view](https://michaelec19.github.io/reserve-one-5/)
- [Trello](https://trello.com/b/dxG3PcvE/reserveone-group-5)

---

## Technologies Used

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Modern and responsive styles
- **JavaScript (ES6+)**: Application logic

### Backend
- **Spring Boot**: Backend

### Database
- **PostgreSQL**: Database

### Architecture
- **Modular**: Organization by features and functionalities

---

## Installation and Setup


### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Michaelec19/reserve-one-5.git
cd reserve-one-5
```
2. **Open the project**
- Open `index.html` directly in the browser using extensions like LiveServer

---

## System Usage

### For Students
1. Browse available classes
2. Book a spot in the desired classes

### For Administrators
1. Class creation and publication
2. Attendance monitoring

---

## Development

### Code Structure
- **Modularity**: Each functionality in its own module
- **Services**: Business logic separated from UI
- **Events**: Event system for communication between components

### Main Services
- `reservationService.js`: Booking management

---

## Roadmap - Future Features
- [ ] Native mobile app
- [ ] Membership and payment management
- [ ] Progress tracking
- [ ] Notification system (email/direct message)
- [ ] Payment gateway integration
- [ ] Advanced reporting and export

---

## License

This project is an exclusive development for Club Deportivo Lan Hua.

---

## Development Team

Reserve-One - Exclusive development for Club Lan Hua

---

**Version**: 0.0.0
**Last updated**: July 2026
