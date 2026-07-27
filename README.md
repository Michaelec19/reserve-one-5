# Reserve-One - Sistema de Reservas para Club Lan Hua

## 📋 Contexto del Proyecto

**Club Deportivo Lan Hua** es una escuela de artes marciales chinas ubicada en Medellín, Colombia, especializada en:
- Kung Fu tradicional (estilo Mizong Luohan)
- Wushu competitivo para todas las edades

### Problema Resuelto

El Club Lan Hua enfrentaba desafíos significativos debido a su gestión completamente manual:
- **Pérdida de clientes** por procesos de reserva ineficientes
- **Baja retención de clientes** por falta de seguimiento y organización
- **Gestión desorganizada** de clases, horarios y alumnos
- **Falta de visibilidad** sobre la ocupación de clases y disponibilidad

### Solución: Reserve-One

Reserve-One es un desarrollo exclusivo diseñado específicamente para el Club Lan Hua que automatiza y optimiza todo el sistema de reservas y gestión del club.

---

## 🎯 MVP - Alcance del Proyecto

### Funcionalidades Incluidas en el MVP

**Sistema de Reservas**
- Reserva de clases de artes marciales en línea
- Visualización de clases disponibles
- Cancelación de reservas por parte de alumnos
- Control de cupos por clase
- Gestión de horarios y programación de clases
- **Reservas SIN registro obligatorio de alumnos**

### Funcionalidades NO Incluidas en el MVP (Futuras)

- Sistema de registro y autenticación de usuarios
- Gestión de membresías y pagos
- Seguimiento de asistencia y progreso
- Notificaciones (email/SMS)
- Dashboard administrativo avanzado

---

## 🎨 Diseño y UX

El diseño del sistema se basa en los principios de:
- **Simplicidad**: Interfaz intuitiva para usuarios de todas las edades
- **Accesibilidad**: Fácil navegación y uso en dispositivos móviles
- **Identidad visual**: Diseño alineado con la filosofía de artes marciales chinas
- **Eficiencia**: Flujos de reserva rápidos y sin fricción

### Figma

El diseño visual y prototipos de interfaz están disponibles en Figma:
- [Link al diseño de Figma] (https://www.figma.com/site/TasFM7Lj4KkAN9yRIDTGX5/Proyecto?node-id=0-1&t=SStItpGp0LhiIOZV-1

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos y responsive
- **JavaScript (ES6+)**: Lógica de aplicación

### Backend
- **Spring Boot**: Backend

### Base de Datos
- **PostgreSQL**: Base de datos

### Arquitectura
- **Modular**: Organización por características y funcionalidades
- **Component-based**: Reutilización de componentes UI
- **Service-oriented**: Separación de lógica de negocio

---

## 📦 Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [URL del repositorio]
cd reserve-one-5
```

2. **Abrir el proyecto**
- Abrir `index.html` directamente en el navegador
- O usar un servidor local para desarrollo

3. **Configuración inicial**
- Revisar `js/constants/config.js` para ajustes de configuración
- Personalizar datos iniciales en `js/data/`

---

## 📖 Uso del Sistema

### Para Alumnos
1. Navegar por las clases disponibles
2. Reservar cupo en las clases deseadas (sin registro obligatorio)

### Para Administradores
1. Gestionar instructores
2. Asociar instructores a clases
3. Ver reportes básicos de ocupación

---

## 🔧 Desarrollo

### Estructura de Código
- **Modularidad**: Cada funcionalidad en su propio módulo
- **Servicios**: Lógica de negocio separada de UI
- **Eventos**: Sistema de eventos para comunicación entre componentes

### Servicios Principales
- `reservationService.js`: Gestión de reservas

---

## 🎯 Roadmap - Funcionalidades Futuras

- [ ] Gestión de membresías y pagos
- [ ] Seguimiento de asistencia y progreso
- [ ] Sistema de notificaciones (email/SMS)
- [ ] Dashboard administrativo avanzado
- [ ] Integración con pasarela de pagos
- [ ] App móvil nativa
- [ ] Sistema de gamificación para alumnos
- [ ] Reportes avanzados y exportación
- [ ] API para integraciones externas

---

## 📄 Licencia

Este proyecto es un desarrollo exclusivo para el Club Deportivo Lan Hua.

---

## 👥 Equipo de Desarrollo

Reserve-One - Desarrollo exclusivo para Club Lan Hua

---

**Versión**: 1.0.0
**Última actualización**: Julio 2026
