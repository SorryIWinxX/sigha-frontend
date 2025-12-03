# 📚 MANUAL DE USUARIO - SIGHA

## Sistema Integral de Gestión de Horarios Académicos

---

## 📋 Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Roles de Usuario](#3-roles-de-usuario)
4. [Funcionalidades por Rol](#4-funcionalidades-por-rol)
   - [4.1 Profesor](#41-profesor)
   - [4.2 Director de Escuela / Coordinador Académico](#42-director-de-escuela--coordinador-académico)
5. [Módulos del Sistema](#5-módulos-del-sistema)
6. [Guías de Uso Detalladas](#6-guías-de-uso-detalladas)
7. [Preguntas Frecuentes](#7-preguntas-frecuentes)
8. [Soporte Técnico](#8-soporte-técnico)

---

## 1. Introducción

### 1.1 ¿Qué es SIGHA?

**SIGHA (Sistema Integral de Gestión de Horarios Académicos)** es una plataforma web diseñada para optimizar y automatizar la gestión de horarios académicos en instituciones educativas. El sistema permite:

- 📅 Gestionar la disponibilidad horaria de profesores
- 👥 Administrar grupos y asignaciones de docentes
- 🏫 Organizar áreas y materias
- 📊 Visualizar métricas y estadísticas en tiempo real
- ✉️ Procesar solicitudes académicas
- ⚙️ Configurar semestres académicos

### 1.2 Características Principales

- **Interfaz Intuitiva**: Diseño moderno y fácil de usar
- **Gestión en Tiempo Real**: Actualización inmediata de información
- **Multi-Rol**: Diferentes vistas según el tipo de usuario
- **Reportes Visuales**: Gráficos y estadísticas interactivas
- **Calendario Interactivo**: Gestión visual de horarios

### 1.3 Requisitos del Sistema

- **Navegador Web Moderno**: Chrome, Firefox, Safari, Edge (versiones recientes)
- **Conexión a Internet**: Conexión estable requerida
- **Resolución de Pantalla**: Mínimo 1280x720 píxeles (recomendado: 1920x1080)

---

## 2. Acceso al Sistema

### 2.1 Inicio de Sesión

1. **Acceder a la URL del sistema** proporcionada por su institución
2. **Ingresar credenciales**:
   - **Documento**: Número de identificación (sin puntos ni guiones)
   - **Contraseña**: Contraseña asignada o personalizada
3. **Hacer clic en "Iniciar sesión"**

![Pantalla de Login](docs/images/login-screen.png)

### 2.2 Primer Acceso

Si es su primer acceso al sistema:

1. El sistema le solicitará **cambiar la contraseña**
2. Ingrese una **nueva contraseña** (mínimo 8 caracteres)
3. **Confirme la nueva contraseña**
4. Haga clic en **"Cambiar contraseña"**

**Requisitos de contraseña:**

- Mínimo 8 caracteres
- Se recomienda incluir mayúsculas, minúsculas y números

### 2.3 Recuperación de Contraseña

Si olvidó su contraseña:

1. En la pantalla de login, haga clic en **"¿Olvidaste tu contraseña?"**
2. Ingrese su **número de documento**
3. Siga las instrucciones enviadas a su correo institucional

> ⚠️ **Nota**: Esta funcionalidad debe estar habilitada por el administrador del sistema

### 2.4 Cerrar Sesión

Para cerrar sesión de forma segura:

1. Haga clic en el botón **"Cerrar sesión"** en el menú lateral
2. Será redirigido automáticamente a la pantalla de login

---

## 3. Roles de Usuario

SIGHA maneja tres roles principales:

### 3.1 Profesor 👨‍🏫

**Permisos:**

- Gestionar su propia disponibilidad horaria
- Ver su perfil
- Consultar horarios asignados

**Vista Principal:** Módulo de Disponibilidad

### 3.2 Director de Escuela 👔

**Permisos:**

- Todas las funcionalidades administrativas
- Gestión completa de usuarios
- Configuración del sistema
- Aprobación de solicitudes
- Visualización de dashboard completo

**Vista Principal:** Dashboard Administrativo

### 3.3 Coordinador Académico 📋

**Permisos:**

- Gestión académica completa
- Administración de grupos y horarios
- Gestión de disponibilidades
- Configuración de áreas y materias
- Visualización de reportes

**Vista Principal:** Dashboard Administrativo

---

## 4. Funcionalidades por Rol

### 4.1 Profesor

#### 4.1.1 Gestión de Disponibilidad

El módulo de disponibilidad permite a los profesores indicar sus horarios disponibles:

**Acceso:** Menú lateral → "Disponibilidad"

**Funcionalidades:**

1. **Vista de Calendario Semanal**

   - Visualización de lunes a sábado
   - Horarios de 6:00 AM a 10:00 PM
   - Bloques horarios de 1 hora

2. **Marcar Disponibilidad**

   - **Verde**: Disponible
   - **Amarillo**: Preferiblemente no
   - **Rojo**: No disponible
   - **Gris**: Sin definir

3. **Guardar Cambios**
   - Los cambios se guardan automáticamente
   - Confirmación visual al guardar

**Pasos para configurar disponibilidad:**

1. Acceda al módulo de **"Disponibilidad"**
2. Seleccione el **semestre** correspondiente
3. Haga clic en cada celda para cambiar el estado:
   - 1er clic: Disponible (verde)
   - 2do clic: Preferiblemente no (amarillo)
   - 3er clic: No disponible (rojo)
   - 4to clic: Sin definir (gris)
4. Los cambios se guardan automáticamente
5. Verifique el mensaje de confirmación

#### 4.1.2 Ver Perfil

**Acceso:** Menú lateral → Clic en nombre de usuario

**Información visible:**

- Nombre completo
- Correo electrónico
- Documento de identidad
- Tipo de documento
- Rol(es) asignado(s)
- Áreas académicas asignadas

**Opciones:**

- Editar información personal
- Cambiar contraseña
- Actualizar foto de perfil

---

### 4.2 Director de Escuela / Coordinador Académico

#### 4.2.1 Dashboard Principal

**Acceso:** Menú lateral → "Dashboard"

El dashboard presenta una vista completa del estado académico:

**Métricas Principales:**

1. **Total de Grupos**

   - Contador total de grupos activos
   - Icono azul con número destacado

2. **Grupos con Profesor**

   - Cantidad de grupos asignados
   - Icono verde con número destacado

3. **Grupos sin Profesor**
   - Grupos pendientes de asignación
   - Icono amarillo con número destacado

**Visualizaciones:**

1. **Gráfico de Crecimiento Semestral**

   - Evolución histórica de grupos
   - Gráfico de barras interactivo
   - Tooltip con información detallada

2. **Tabla de Estadísticas por Materia**

   - Nombre de la materia
   - Código
   - Nivel
   - Total de grupos
   - Grupos asignados
   - Grupos sin asignar
   - Porcentaje de asignación

3. **Lista de Grupos sin Asignar**
   - Código del grupo
   - Materia
   - Horario
   - Acciones rápidas

**Funcionalidades del Dashboard:**

- 🔄 Actualización en tiempo real
- 📊 Exportación de reportes (próximamente)
- 🔍 Filtros por área y materia
- 📅 Selección de semestre

#### 4.2.2 Gestión de Usuarios

**Acceso:** Menú lateral → "Usuarios"

**Funcionalidades:**

1. **Listar Usuarios**

   - Tabla con todos los usuarios del sistema
   - Columnas: Nombre, Email, Último acceso, Permisos, Estado
   - Búsqueda y filtrado
   - Paginación

2. **Crear Nuevo Usuario**

   **Pasos:**

   1. Clic en botón **"Nuevo Usuario"**
   2. Completar formulario:
      - Tipo de documento
      - Número de documento
      - Nombres
      - Apellidos
      - Correo electrónico
      - Rol(es)
      - Áreas académicas (si es profesor)
   3. Clic en **"Guardar"**
   4. Sistema genera contraseña automática
   5. Copiar contraseña para entregar al usuario

3. **Editar Usuario**

   **Pasos:**

   1. Buscar usuario en la lista
   2. Clic en icono de **"Editar"**
   3. Modificar campos necesarios
   4. Clic en **"Actualizar"**

4. **Activar/Desactivar Usuario**

   - Toggle en la columna "Estado"
   - Confirmación de acción
   - Usuario desactivado no puede acceder

5. **Ver Detalles de Usuario**

   **Información mostrada:**

   - Datos personales completos
   - Historial de acceso
   - Grupos asignados (si es profesor)
   - Áreas académicas

#### 4.2.3 Gestión de Áreas y Materias

**Acceso:** Menú lateral → "Áreas y Materias"

**Estructura:**

- **Áreas**: Agrupaciones de materias (ej: Matemáticas, Física)
- **Materias**: Asignaturas específicas (ej: Cálculo I, Álgebra)
- **Niveles**: Clasificación por nivel académico

**Funcionalidades:**

1. **Crear Nueva Área**

   **Pasos:**

   1. Clic en **"Nueva Área"**
   2. Ingresar descripción del área
   3. Clic en **"Guardar"**

2. **Crear Nueva Materia**

   **Pasos:**

   1. Seleccionar el área correspondiente
   2. Clic en **"Nueva Materia"**
   3. Completar formulario:
      - Código de la materia
      - Nombre de la materia
      - Nivel académico
      - Área asignada
   4. Clic en **"Guardar"**

3. **Editar Área/Materia**

   - Clic en icono de edición
   - Modificar información
   - Guardar cambios

4. **Eliminar Área/Materia**

   ⚠️ **Precaución**: Solo se pueden eliminar áreas/materias sin grupos asociados

5. **Visualización**

   - Vista de árbol: Áreas → Materias
   - Vista de tabla: Lista completa
   - Búsqueda y filtrado
   - Exportación a Excel/PDF

#### 4.2.4 Gestión de Grupos

**Acceso:** Menú lateral → "Grupos"

Un grupo representa una clase específica de una materia en un horario determinado.

**Funcionalidades:**

1. **Crear Nuevo Grupo**

   **Pasos:**

   1. Clic en **"Nuevo Grupo"**
   2. Completar información:
      - Código del grupo (ej: A1, B2)
      - Materia
      - Semestre
      - Profesor asignado (opcional)
      - Horario (días y horas)
   3. Clic en **"Guardar"**

2. **Asignar Profesor a Grupo**

   **Métodos:**

   a) **Asignación Individual:**

   - Seleccionar grupo
   - Clic en **"Asignar Profesor"**
   - Seleccionar profesor de la lista
   - Sistema valida disponibilidad
   - Confirmar asignación

   b) **Asignación Masiva:**

   - Seleccionar múltiples grupos
   - Clic en **"Asignar Profesores"**
   - Sistema sugiere profesores según disponibilidad
   - Confirmar asignaciones

3. **Editar Grupo**

   **Información editable:**

   - Código del grupo
   - Materia
   - Profesor
   - Horario
   - Semestre

4. **Eliminar Grupo**

   - Seleccionar grupo
   - Clic en **"Eliminar"**
   - Confirmar acción

5. **Filtros y Búsqueda**

   - Por materia
   - Por profesor
   - Por estado (asignado/sin asignar)
   - Por horario
   - Por semestre

#### 4.2.5 Horarios de Grupos

**Acceso:** Menú lateral → "Horarios de Grupos"

**Submódulos:**

1. **Horarios por Docentes**

   **Visualización:**

   - Lista de profesores
   - Grupos asignados a cada profesor
   - Horario semanal visual
   - Carga académica (horas/semana)

   **Funcionalidades:**

   - Exportar horario individual
   - Ver conflictos de horario
   - Reasignar grupos

2. **Horarios Generales**

   **Visualización:**

   - Calendario semanal completo
   - Todos los grupos
   - Todas las materias
   - Filtros dinámicos

   **Funcionalidades:**

   - Vista por área
   - Vista por nivel
   - Vista por salón (si aplica)
   - Exportar horario completo
   - Detectar conflictos

**Operaciones:**

1. **Modificar Horario de Grupo**

   **Pasos:**

   1. Seleccionar grupo en el calendario
   2. Arrastrar a nuevo horario (drag & drop)
   3. Sistema valida:
      - Disponibilidad del profesor
      - Conflictos de salón
      - Solapamientos
   4. Confirmar cambio

2. **Detectar Conflictos**

   El sistema automáticamente identifica:

   - Profesores con solapamiento horario
   - Salones sobrecargados
   - Grupos sin asignar

   **Indicadores visuales:**

   - 🔴 Rojo: Conflicto grave
   - 🟡 Amarillo: Advertencia
   - 🟢 Verde: Sin conflictos

3. **Exportar Horarios**

   **Formatos disponibles:**

   - PDF (imprimible)
   - Excel (editable)
   - iCal (calendario)

   **Opciones:**

   - Por profesor
   - Por materia
   - General
   - Por semestre

#### 4.2.6 Gestión de Disponibilidades

**Acceso:** Menú lateral → "Disponibilidades"

Este módulo permite visualizar y gestionar las disponibilidades de todos los profesores.

**Vistas Disponibles:**

1. **Vista General**

   - Calendario consolidado
   - Todos los profesores
   - Disponibilidad agregada por horario
   - Indica cantidad de profesores disponibles por franja

2. **Vista Individual**

   **Funcionalidades:**

   - Seleccionar profesor específico
   - Ver su disponibilidad completa
   - Editar disponibilidad (con permisos)
   - Historial de cambios

3. **Vista por Área**

   - Filtrar profesores por área académica
   - Disponibilidad consolidada del área
   - Identificar franjas con poca cobertura

**Operaciones:**

1. **Consultar Disponibilidad**

   **Pasos:**

   1. Seleccionar semestre
   2. Seleccionar profesor o área
   3. Visualizar calendario de disponibilidad
   4. Estados:
      - 🟢 Verde: Disponible
      - 🟡 Amarillo: Preferiblemente no
      - 🔴 Rojo: No disponible
      - ⚪ Gris: Sin definir

2. **Editar Disponibilidad de Profesor**

   ⚠️ **Nota**: Solo con permisos especiales

   **Pasos:**

   1. Seleccionar profesor
   2. Clic en **"Editar"**
   3. Modificar disponibilidad
   4. Guardar cambios
   5. Sistema notifica al profesor

3. **Reportes de Disponibilidad**

   **Tipos de reportes:**

   - Profesores sin disponibilidad registrada
   - Horas disponibles por área
   - Franjas horarias con baja cobertura
   - Comparación entre semestres

#### 4.2.7 Gestión de Solicitudes

**Acceso:** Menú lateral → "Solicitudes"

Los profesores pueden enviar solicitudes que requieren aprobación administrativa.

**Tipos de Solicitudes:**

1. **Cambio de Horario**

   - Profesor solicita modificar horario de grupo
   - Debe justificar el cambio
   - Propone nuevo horario

2. **Permiso de Ausencia**

   - Solicitud de permiso temporal
   - Indica fechas
   - Propone reemplazo (opcional)

3. **Asignación de Grupo**

   - Profesor solicita ser asignado a grupo específico
   - Indica disponibilidad
   - Justifica solicitud

4. **Actualización de Disponibilidad**

   - Cambios significativos en disponibilidad
   - Justificación de cambios
   - Propone alternativas

5. **Otros**
   - Solicitudes generales
   - Casos especiales

**Funcionalidades:**

1. **Ver Solicitudes Pendientes**

   **Interfaz:**

   - Lista de solicitudes a la izquierda
   - Detalles a la derecha
   - Filtros por tipo
   - Búsqueda por profesor

   **Información mostrada:**

   - Nombre del profesor
   - Tipo de solicitud
   - Fecha de solicitud
   - Estado actual
   - Prioridad

2. **Revisar Solicitud**

   **Detalles incluidos:**

   - Datos del profesor
   - Tipo de solicitud
   - Materia y grupo (si aplica)
   - Fechas solicitadas
   - Comentarios del profesor
   - Impacto en horarios

3. **Aprobar Solicitud**

   **Pasos:**

   1. Seleccionar solicitud
   2. Revisar detalles completos
   3. Verificar impacto en horarios
   4. Clic en **"Aprobar"**
   5. Confirmar acción
   6. Sistema aplica cambios automáticamente
   7. Notifica al profesor

4. **Rechazar Solicitud**

   **Pasos:**

   1. Seleccionar solicitud
   2. Revisar motivos
   3. Clic en **"Rechazar"**
   4. Ingresar motivo del rechazo
   5. Confirmar acción
   6. Sistema notifica al profesor

5. **Filtrar y Buscar**

   **Opciones de filtrado:**

   - Por tipo de solicitud
   - Por profesor
   - Por fecha
   - Por estado (pendiente/procesada)

   **Búsqueda:**

   - Por nombre de profesor
   - Por correo
   - Por contenido de solicitud

#### 4.2.8 Configuración del Sistema

**Acceso:** Menú lateral → "Configuración"

**Secciones de Configuración:**

1. **Configuración de Semestres**

   **Funcionalidades:**

   a) **Crear Nuevo Semestre:**

   - Descripción (ej: 2025-1)
   - Fecha de inicio
   - Fecha de fin
   - Habilitar disponibilidad

   b) **Editar Semestre:**

   - Modificar fechas
   - Cambiar descripción
   - Activar/desactivar

   c) **Semestre Activo:**

   - Marcar semestre actual
   - Solo un semestre activo a la vez
   - Afecta todas las operaciones del sistema

   d) **Habilitar Registro de Disponibilidad:**

   - Permite a profesores registrar disponibilidad
   - Se puede activar/desactivar por semestre
   - Útil para períodos de planificación

2. **Configuración de Tipos de Documento**

   **Funcionalidades:**

   - Agregar tipos de documento (CC, TI, CE, etc.)
   - Editar tipos existentes
   - Activar/desactivar tipos
   - Definir formato y validación

3. **Configuración de Áreas**

   (Ver sección 4.2.3 - Gestión de Áreas y Materias)

4. **Configuración General del Sistema**

   **Parámetros configurables:**

   - Nombre de la escuela
   - Logo institucional
   - Horarios de operación
   - Colores del sistema
   - Notificaciones por correo
   - Políticas de contraseñas
   - Tiempo de sesión

---

## 5. Módulos del Sistema

### 5.1 Módulo de Autenticación

**Características:**

- Login seguro con documento y contraseña
- Cambio obligatorio de contraseña en primer acceso
- Recuperación de contraseña por correo
- Sesiones con tiempo de expiración
- Cierre de sesión seguro

**Seguridad:**

- Encriptación de contraseñas
- Tokens JWT para autenticación
- Protección contra ataques de fuerza bruta
- Bloqueo después de intentos fallidos

### 5.2 Módulo de Disponibilidad

**Para Profesores:**

- Registro de disponibilidad semanal
- Calendario interactivo
- Estados de disponibilidad (disponible, preferiblemente no, no disponible)
- Guardado automático
- Historial de cambios

**Para Administradores:**

- Vista consolidada de disponibilidades
- Análisis por área
- Identificación de brechas de cobertura
- Reportes de disponibilidad

### 5.3 Módulo de Grupos

**Gestión Completa:**

- CRUD de grupos (Crear, Leer, Actualizar, Eliminar)
- Asignación de profesores
- Configuración de horarios
- Validación de disponibilidad
- Detección de conflictos

**Visualización:**

- Lista tabular
- Vista de calendario
- Filtros múltiples
- Búsqueda avanzada

### 5.4 Módulo de Horarios

**Visualizaciones:**

- Calendario semanal
- Vista por profesor
- Vista general
- Vista por salón

**Funcionalidades:**

- Arrastrar y soltar (drag & drop)
- Validación automática
- Detección de conflictos
- Exportación múltiple formato

### 5.5 Módulo de Usuarios

**Administración:**

- CRUD completo de usuarios
- Asignación de roles
- Gestión de permisos
- Activación/desactivación
- Reseteo de contraseñas

**Seguridad:**

- Control de acceso basado en roles
- Auditoría de cambios
- Trazabilidad de acciones

### 5.6 Módulo de Áreas y Materias

**Estructura Académica:**

- Jerarquía Área → Materia
- Clasificación por niveles
- Códigos únicos
- Relación con grupos

**Operaciones:**

- Creación y edición
- Asignación a profesores
- Reportes académicos

### 5.7 Módulo de Solicitudes

**Gestión de Peticiones:**

- Recepción de solicitudes
- Clasificación automática
- Flujo de aprobación
- Notificaciones automáticas

**Tipos de Solicitudes:**

- Académicas
- Administrativas
- Cambios de horario
- Permisos

### 5.8 Módulo de Dashboard

**Analíticas:**

- Métricas en tiempo real
- Gráficos interactivos
- Estadísticas por materia
- Tendencias históricas

**Visualizaciones:**

- Tarjetas de métricas
- Gráficos de barras
- Tablas comparativas
- Listas dinámicas

### 5.9 Módulo de Configuración

**Parámetros del Sistema:**

- Semestres académicos
- Tipos de documento
- Configuración general
- Personalización

---

## 6. Guías de Uso Detalladas

### 6.1 Guía para Profesores: Registrar Disponibilidad

**Objetivo:** Indicar al sistema los horarios en los que está disponible para dictar clases.

**Pasos Detallados:**

1. **Iniciar Sesión**

   - Acceda con su documento y contraseña
   - Si es primer acceso, cambie su contraseña

2. **Acceder al Módulo de Disponibilidad**

   - En el menú lateral, haga clic en "Disponibilidad"
   - Se mostrará un calendario semanal

3. **Seleccionar Semestre**

   - En la parte superior, seleccione el semestre
   - Asegúrese de que el período de registro esté abierto

4. **Marcar Disponibilidad**

   Para cada franja horaria:

   - **1er clic**: Marca como "Disponible" (verde)
     - Puede dictar clases en este horario
   - **2do clic**: Marca como "Preferiblemente no" (amarillo)
     - Puede dictar clases, pero prefiere otros horarios
   - **3er clic**: Marca como "No disponible" (rojo)
     - No puede dictar clases en este horario
   - **4to clic**: Marca como "Sin definir" (gris)
     - Vuelve al estado inicial

5. **Usar Herramientas de Selección**

   - **Selección por día**: Clic en el encabezado del día para marcar todo el día
   - **Selección por hora**: Clic en el encabezado de la hora para marcar toda la fila
   - **Selección múltiple**: Mantenga Shift y haga clic para seleccionar rango

6. **Guardar Cambios**

   - Los cambios se guardan automáticamente
   - Verifique el mensaje de confirmación verde
   - Si hay error, aparecerá mensaje rojo

7. **Revisar Disponibilidad**
   - Puede regresar en cualquier momento para revisar
   - El sistema guarda un historial de cambios

**Consejos:**

- ✅ Sea preciso con su disponibilidad
- ✅ Actualice si hay cambios en su horario
- ✅ Use "Preferiblemente no" para horarios flexibles
- ✅ Consulte con coordinación antes de cambios mayores

### 6.2 Guía para Administradores: Crear y Asignar Grupos

**Objetivo:** Crear grupos de clases y asignarles profesores según disponibilidad.

**Parte 1: Crear Grupo**

1. **Acceder al Módulo de Grupos**

   - Menú lateral → "Grupos"
   - Vista de lista de grupos

2. **Iniciar Creación**

   - Clic en botón "Nuevo Grupo"
   - Se abre formulario modal

3. **Completar Información Básica**

   - **Código del Grupo**: Identificador único (ej: A1, B2, C3)
     - Use nomenclatura consistente
     - Verifique que no exista
   - **Semestre**: Seleccione del dropdown
     - Solo semestres activos aparecen
   - **Materia**: Seleccione de la lista
     - Filtra por área si es necesario
     - Muestra código y nombre

4. **Configurar Horario**

   - **Agregar Bloques Horarios**:
     - Seleccione día (Lunes a Sábado)
     - Seleccione hora (6 AM - 10 PM)
     - Clic en "Agregar"
   - **Editar Bloques**:
     - Modifique día u hora
     - Elimine bloques innecesarios
   - **Validación**:
     - Mínimo 2 horas por semana
     - No permite bloques duplicados

5. **Guardar Grupo**
   - Clic en "Guardar"
   - Sistema valida información
   - Confirmación de creación

**Parte 2: Asignar Profesor**

1. **Seleccionar Grupo Sin Asignar**

   - Use filtro "Sin profesor"
   - O búsqueda por código

2. **Iniciar Asignación**

   - Clic en "Asignar Profesor" (botón o icono)
   - Se abre diálogo de asignación

3. **Ver Profesores Disponibles**

   El sistema muestra:

   - Lista de profesores del área
   - Disponibilidad en horario del grupo
   - Indicadores de compatibilidad:
     - 🟢 Completamente disponible
     - 🟡 Parcialmente disponible
     - 🔴 No disponible
   - Carga académica actual

4. **Seleccionar Profesor**

   - Revise disponibilidad
   - Verifique carga académica
   - Considere distribución equitativa
   - Seleccione profesor del dropdown

5. **Confirmar Asignación**

   - Revise resumen:
     - Grupo
     - Profesor
     - Horario
     - Posibles conflictos
   - Clic en "Confirmar"
   - Sistema valida y asigna
   - Notificación al profesor (opcional)

6. **Verificar Asignación**

   - Grupo aparece como "Asignado"
   - Color verde en la lista
   - Visible en horario del profesor

**Parte 3: Asignación Masiva (Opcional)**

1. **Seleccionar Múltiples Grupos**

   - Use checkboxes en la lista
   - O filtro + "Seleccionar todos"

2. **Iniciar Asignación Masiva**

   - Botón "Asignar Profesores"
   - Sistema analiza disponibilidades

3. **Revisar Sugerencias**

   - Sistema sugiere asignaciones óptimas
   - Basado en:
     - Disponibilidad
     - Carga actual
     - Área de especialidad
     - Distribución equitativa

4. **Ajustar Asignaciones**

   - Modifique sugerencias si es necesario
   - Resuelva conflictos marcados

5. **Confirmar Asignación Masiva**

   - Revise resumen completo
   - Clic en "Confirmar todas"
   - Sistema procesa asignaciones

6. **Verificar Resultados**
   - Revise grupos asignados
   - Verifique notificaciones enviadas
   - Exporte reporte si es necesario

**Consejos:**

- ✅ Verifique disponibilidad antes de asignar
- ✅ Distribuya carga equitativamente
- ✅ Considere especialidad del profesor
- ✅ Comunique cambios a profesores
- ✅ Mantenga respaldo de asignaciones

### 6.3 Guía: Gestionar Horarios

**Objetivo:** Organizar y optimizar los horarios de todos los grupos.

**Acceso:**

- Menú lateral → "Horarios de Grupos" → "General"

**Vista Principal:**

El calendario muestra:

- **Eje horizontal**: Días de la semana (Lun - Sáb)
- **Eje vertical**: Horas del día (6 AM - 10 PM)
- **Celdas**: Grupos programados

**Operaciones:**

1. **Visualizar Horario General**

   - Vista de calendario completo
   - Cada celda muestra:
     - Código del grupo
     - Materia
     - Profesor
     - Salón (si aplica)
   - Códigos de color:
     - Azul: Normal
     - Rojo: Conflicto
     - Amarillo: Advertencia
     - Verde: Confirmado

2. **Modificar Horario de Grupo**

   **Método 1: Edición Directa**

   1. Clic en el grupo en el calendario
   2. Se abre panel de edición
   3. Modificar día/hora
   4. Guardar cambios

   **Método 2: Arrastrar y Soltar**

   1. Clic sostenido en el grupo
   2. Arrastrar a nueva posición
   3. Soltar
   4. Sistema valida automáticamente
   5. Confirmar si es válido

3. **Detectar y Resolver Conflictos**

   **Tipos de conflictos:**

   a) **Conflicto de Profesor**

   - Profesor asignado a 2+ grupos al mismo tiempo
   - Marcado en rojo
   - **Solución**:
     - Cambiar horario de uno de los grupos
     - Asignar otro profesor

   b) **Conflicto de Salón**

   - Mismo salón asignado a 2+ grupos
   - Marcado en naranja
   - **Solución**:
     - Cambiar salón
     - Cambiar horario

   c) **Advertencia de Disponibilidad**

   - Profesor parcialmente disponible
   - Marcado en amarillo
   - **Solución**:
     - Confirmar con profesor
     - Ajustar horario
     - Cambiar profesor

4. **Aplicar Filtros**

   **Filtros disponibles:**

   - Por área académica
   - Por nivel
   - Por profesor
   - Por materia
   - Solo conflictos
   - Solo sin asignar

5. **Exportar Horarios**

   **Pasos:**

   1. Seleccione filtro deseado (opcional)
   2. Clic en "Exportar"
   3. Seleccione formato:
      - PDF (impresión)
      - Excel (edición)
      - iCal (calendario digital)
   4. Seleccione alcance:
      - Todo
      - Solo vista actual
      - Por profesor
   5. Clic en "Descargar"

6. **Ver Horario por Profesor**

   **Pasos:**

   1. Clic en "Vista por Docentes"
   2. Seleccione profesor
   3. Visualiza:
      - Horario semanal
      - Total de horas
      - Grupos asignados
      - Disponibilidad vs asignación
   4. Exportar individual si es necesario

### 6.4 Guía: Procesar Solicitudes

**Objetivo:** Revisar y procesar solicitudes de profesores de manera eficiente.

**Acceso:**

- Menú lateral → "Solicitudes"

**Interfaz:**

- Panel izquierdo: Lista de solicitudes
- Panel derecho: Detalles de solicitud seleccionada

**Flujo de Trabajo:**

1. **Revisar Solicitudes Pendientes**

   - Lista muestra:
     - Nombre del profesor
     - Tipo de solicitud
     - Fecha
     - Prioridad (alta/media/baja)
   - Solicitudes ordenadas por:
     - Fecha (más reciente primero)
     - Prioridad
     - Tipo

2. **Seleccionar Solicitud**

   - Clic en la solicitud
   - Panel derecho muestra detalles completos

3. **Analizar Detalles**

   **Información presentada:**

   - **Datos del Solicitante**:
     - Nombre completo
     - Email
     - Área académica
   - **Detalles de la Solicitud**:
     - Tipo específico
     - Materia/grupo afectado
     - Fechas solicitadas
     - Comentarios del profesor
   - **Análisis de Impacto**:
     - Grupos afectados
     - Estudiantes afectados
     - Profesores afectados
     - Conflictos potenciales

4. **Tomar Decisión**

   **Aprobar Solicitud:**

   1. Revise que cumple requisitos
   2. Verifique factibilidad
   3. Clic en "Aprobar"
   4. Modal de confirmación:
      - Resumen de cambios
      - Impacto
      - Acciones automáticas
   5. Clic en "Confirmar Aprobación"
   6. Sistema:
      - Aplica cambios
      - Notifica al profesor
      - Registra en auditoría

   **Rechazar Solicitud:**

   1. Identifique motivo del rechazo
   2. Clic en "Rechazar"
   3. Modal de rechazo:
      - Campo obligatorio de motivo
      - Sugerencias (opcional)
   4. Escriba motivo claro
   5. Clic en "Confirmar Rechazo"
   6. Sistema:
      - Marca como rechazada
      - Notifica al profesor con motivo
      - Registra en auditoría

5. **Filtrar Solicitudes**

   **Por Tipo:**

   - Cambio de horario
   - Permiso de ausencia
   - Asignación de grupo
   - Actualización de disponibilidad
   - Otros

   **Por Estado:**

   - Pendientes
   - Aprobadas
   - Rechazadas

   **Por Fecha:**

   - Hoy
   - Esta semana
   - Este mes
   - Rango personalizado

6. **Búsqueda Avanzada**

   - Por nombre de profesor
   - Por correo
   - Por materia
   - Por contenido de solicitud

**Tipos de Solicitudes Específicas:**

**A. Cambio de Horario**

- **Validar**:

  - Disponibilidad del profesor en nuevo horario
  - Disponibilidad de salón
  - No afecta a estudiantes significativamente
  - Justificación válida

- **Aprobar**:
  - Sistema actualiza horario automáticamente
  - Notifica a estudiantes (si integrado)
  - Actualiza calendario

**B. Permiso de Ausencia**

- **Validar**:

  - Fechas válidas
  - Justificación apropiada
  - Profesor sustituto disponible

- **Aprobar**:
  - Registra ausencia en el sistema
  - Asigna sustituto si lo hay
  - Genera reporte de clases a reponer

**C. Asignación de Grupo**

- **Validar**:

  - Grupo disponible
  - Profesor cumple requisitos de área
  - Disponibilidad coincide con horario
  - No excede carga máxima

- **Aprobar**:
  - Asigna profesor al grupo
  - Actualiza horario
  - Notifica cambio

**D. Actualización de Disponibilidad**

- **Validar**:

  - No afecta grupos ya asignados
  - Justificación válida
  - Plazo apropiado

- **Aprobar**:
  - Actualiza disponibilidad
  - Alerta si afecta asignaciones futuras

### 6.5 Guía: Configurar Semestres

**Objetivo:** Crear y gestionar períodos académicos.

**Acceso:**

- Menú lateral → "Configuración" → Pestaña "Semestres"

**Operaciones:**

1. **Crear Nuevo Semestre**

   **Pasos:**

   1. Clic en "Nuevo Semestre"
   2. Completar formulario:

      - **Descripción**:
        - Formato recomendado: "YYYY-N" (ej: 2025-1, 2025-2)
        - Debe ser único
        - Claro y descriptivo
      - **Fecha de Inicio**:
        - Primer día del semestre
        - Formato: DD/MM/YYYY
        - Validación: No puede solapar con otro semestre
      - **Fecha de Fin**:
        - Último día del semestre
        - Debe ser posterior a fecha de inicio
        - Mínimo 3 meses de duración
      - **Habilitar Disponibilidad**:
        - ☑️ Activado: Profesores pueden registrar disponibilidad
        - ☐ Desactivado: No se permite registro
        - Útil para períodos de planificación

   3. Clic en "Guardar"
   4. Confirmación de creación

2. **Editar Semestre**

   **Pasos:**

   1. Buscar semestre en la lista
   2. Clic en icono de edición (lápiz)
   3. Modificar campos necesarios:
      - Descripción
      - Fechas (con precaución)
      - Estado de disponibilidad
   4. Clic en "Actualizar"
   5. Confirmación de cambios

   **⚠️ Precauciones:**

   - Cambiar fechas afecta grupos existentes
   - Sistema valida impacto antes de guardar
   - Se recomienda no modificar semestres activos

3. **Activar Semestre**

   **Concepto**: Solo un semestre puede estar activo a la vez. El semestre activo es el período actual de trabajo.

   **Pasos:**

   1. Seleccionar semestre deseado
   2. Clic en "Activar"
   3. Confirmación:
      - Muestra semestre actual activo
      - Advierte sobre cambio
   4. Confirmar cambio
   5. Sistema:
      - Desactiva semestre anterior
      - Activa nuevo semestre
      - Actualiza todas las vistas

   **Efectos**:

   - Dashboard muestra datos del semestre activo
   - Gestión de grupos filtra por semestre activo
   - Disponibilidad se muestra del semestre activo

4. **Habilitar/Deshabilitar Registro de Disponibilidad**

   **Usar cuando:**

   - Período de planificación: HABILITAR
   - Semestre en curso: DESHABILITAR (opcional)
   - Semestre pasado: DESHABILITAR

   **Pasos:**

   1. Seleccionar semestre
   2. Toggle "Registro de Disponibilidad"
   3. Confirmación automática

   **Efectos**:

   - Habilitado: Profesores ven módulo de disponibilidad
   - Deshabilitado: Módulo no visible para profesores

5. **Eliminar Semestre**

   **⚠️ Precaución Extrema:**

   - Solo semestres SIN grupos
   - No se puede recuperar
   - Pérdida permanente de datos

   **Pasos:**

   1. Verificar que no tiene grupos
   2. Clic en icono de eliminar (basurero)
   3. Confirmación múltiple:
      - Primera: "¿Está seguro?"
      - Segunda: "Esta acción es irreversible"
   4. Escribir "ELIMINAR" para confirmar
   5. Clic en "Confirmar Eliminación"

6. **Ver Detalles de Semestre**

   **Información mostrada:**

   - Descripción
   - Fechas (inicio - fin)
   - Duración (días/semanas)
   - Estado (activo/inactivo)
   - Disponibilidad habilitada (sí/no)
   - Total de grupos
   - Total de profesores con disponibilidad
   - Estadísticas de asignación

**Mejores Prácticas:**

- ✅ Crear semestres con anticipación (al menos 2 meses antes)
- ✅ Habilitar disponibilidad 1-2 meses antes del semestre
- ✅ No modificar semestres activos con grupos
- ✅ Mantener nomenclatura consistente
- ✅ Validar fechas cuidadosamente
- ✅ Documentar cambios importantes

---

## 7. Preguntas Frecuentes

### 7.1 Acceso y Seguridad

**P: ¿Qué hago si olvidé mi contraseña?**

R: Haga clic en "¿Olvidaste tu contraseña?" en la pantalla de login, ingrese su documento y siga las instrucciones enviadas a su correo institucional. Si la funcionalidad no está disponible, contacte al administrador del sistema.

**P: ¿Cuánto tiempo dura mi sesión?**

R: Por seguridad, las sesiones expiran después de 2 horas de inactividad. Será redirigido automáticamente al login.

**P: ¿Puedo acceder desde mi teléfono móvil?**

R: Sí, SIGHA es responsive y se adapta a dispositivos móviles. Sin embargo, algunas funcionalidades complejas (como arrastrar horarios) funcionan mejor en computador.

**P: ¿Es seguro el sistema?**

R: Sí, SIGHA implementa:

- Encriptación de datos
- Autenticación segura con JWT
- Protección contra ataques
- Auditoría de acciones
- Respaldos automáticos

### 7.2 Disponibilidad (Profesores)

**P: ¿Puedo cambiar mi disponibilidad después de guardarla?**

R: Sí, puede modificar su disponibilidad en cualquier momento mientras el período de registro esté abierto. Los cambios se guardan automáticamente.

**P: ¿Qué significa cada color en el calendario de disponibilidad?**

R:

- 🟢 Verde: Disponible para dictar clases
- 🟡 Amarillo: Preferiblemente no (flexible)
- 🔴 Rojo: No disponible
- ⚪ Gris: Sin definir

**P: ¿El sistema respeta mi disponibilidad al asignar grupos?**

R: Sí, el sistema solo sugiere y permite asignaciones que coincidan con su disponibilidad marcada en verde o amarillo. Las franjas rojas no se consideran.

**P: ¿Puedo ver mi disponibilidad de semestres anteriores?**

R: Sí, cambie el selector de semestre en la parte superior del módulo de disponibilidad.

**P: ¿Debo marcar disponibilidad todos los semestres?**

R: Sí, cada semestre requiere registro de disponibilidad, ya que sus horarios pueden cambiar.

### 7.3 Grupos y Asignaciones (Administradores)

**P: ¿Puedo asignar un profesor a un grupo fuera de su disponibilidad?**

R: El sistema lo permite con una advertencia clara. Debe confirmar explícitamente y se recomienda coordinar con el profesor primero.

**P: ¿Cómo resuelvo conflictos de horario?**

R: El sistema marca conflictos automáticamente. Puede:

1. Cambiar horario del grupo
2. Reasignar a otro profesor
3. Modificar disponibilidad del profesor (con su consentimiento)

**P: ¿Puedo copiar grupos de un semestre a otro?**

R: Actualmente esta funcionalidad está en desarrollo. Por ahora debe crear grupos nuevos cada semestre.

**P: ¿Qué pasa si elimino un grupo con profesor asignado?**

R: El sistema advierte sobre la eliminación. El profesor pierde esa asignación y sus horas disponibles aumentan.

**P: ¿Cómo distribulyo la carga equitativamente?**

R: En la vista de horarios por docente puede ver la carga de cada profesor. Use esta información para distribuir grupos de manera balanceada.

### 7.4 Horarios

**P: ¿Puedo mover un grupo arrastrándolo en el calendario?**

R: Sí, use la funcionalidad drag & drop:

1. Clic sostenido en el grupo
2. Arrastrar a nueva posición
3. Soltar
4. Confirmar si es válido

**P: ¿Cómo exporto el horario de un profesor específico?**

R:

1. Vaya a "Horarios de Grupos" → "Docentes"
2. Seleccione el profesor
3. Clic en "Exportar"
4. Elija formato (PDF/Excel)
5. Descargar

**P: ¿El calendario muestra festivos o días no laborales?**

R: Esta funcionalidad está planificada para futuras versiones.

### 7.5 Solicitudes

**P: ¿Los profesores pueden enviar solicitudes?**

R: La funcionalidad de envío por parte de profesores está en desarrollo. Actualmente, los administradores gestionan las solicitudes recibidas por otros medios.

**P: ¿Se notifica al profesor cuando proceso su solicitud?**

R: Sí, el sistema envía notificación automática por correo con la decisión y motivos.

**P: ¿Puedo ver el historial de solicitudes?**

R: Sí, use el filtro de estado y seleccione "Aprobadas" o "Rechazadas" para ver solicitudes procesadas.

**P: ¿Las solicitudes aprobadas se aplican automáticamente?**

R: Sí, cuando aprueba una solicitud, el sistema aplica los cambios correspondientes automáticamente (cambios de horario, asignaciones, etc.).

### 7.6 Configuración

**P: ¿Puedo tener dos semestres activos simultáneamente?**

R: No, solo un semestre puede estar activo a la vez. El semestre activo representa el período actual de trabajo.

**P: ¿Qué pasa si cambio las fechas de un semestre activo?**

R: El sistema valida el impacto y advierte si hay grupos afectados. Se recomienda extrema precaución.

**P: ¿Cómo cierro un semestre terminado?**

R: Simplemente active el siguiente semestre. El anterior se desactiva automáticamente y queda como histórico.

### 7.7 Problemas Técnicos

**P: ¿Qué hago si el sistema no guarda mis cambios?**

R:

1. Verifique su conexión a internet
2. Recargue la página (F5)
3. Intente nuevamente
4. Si persiste, contacte soporte

**P: ¿Por qué no veo algunos módulos en el menú?**

R: Los módulos visibles dependen de su rol. Si necesita acceso a funcionalidades adicionales, contacte al administrador para verificar sus permisos.

**P: El sistema está lento, ¿qué puedo hacer?**

R:

1. Cierre pestañas innecesarias del navegador
2. Limpie caché del navegador
3. Verifique su conexión a internet
4. Intente en horario de menor uso
5. Contacte soporte si persiste

**P: ¿Cómo reporto un error o bug?**

R: Contacte al equipo de soporte con:

- Descripción del error
- Pasos para reproducirlo
- Capturas de pantalla
- Navegador y versión utilizada

### 7.8 Datos y Reportes

**P: ¿Puedo exportar datos a Excel?**

R: Sí, la mayoría de tablas y reportes tienen opción de exportación a Excel.

**P: ¿Los datos están respaldados?**

R: Sí, el sistema realiza respaldos automáticos diarios. Los datos están seguros.

**P: ¿Puedo ver estadísticas de semestres anteriores?**

R: Sí, en el dashboard puede cambiar el semestre para ver datos históricos.

**P: ¿Cómo genero un reporte de carga docente?**

R: Vaya a "Horarios de Grupos" → "Docentes" y exporte la vista. Muestra la carga de cada profesor.

---

## 8. Soporte Técnico

### 8.1 Canales de Soporte

**Correo Electrónico:**

- Soporte General: soporte.sigha@[institucion].edu.co
- Soporte Técnico: tech.sigha@[institucion].edu.co

**Horario de Atención:**

- Lunes a Viernes: 8:00 AM - 6:00 PM
- Sábados: 9:00 AM - 1:00 PM
- Domingos y Festivos: Sin atención

**Tiempo de Respuesta:**

- Urgencias: 2 horas
- Prioridad Alta: 4 horas
- Prioridad Media: 24 horas
- Prioridad Baja: 48 horas

### 8.2 Niveles de Soporte

**Nivel 1 - Soporte Básico:**

- Problemas de acceso
- Reseteo de contraseñas
- Preguntas de uso básico
- Errores comunes

**Nivel 2 - Soporte Técnico:**

- Errores del sistema
- Problemas de rendimiento
- Configuraciones avanzadas
- Integraciones

**Nivel 3 - Desarrollo:**

- Bugs críticos
- Nuevas funcionalidades
- Personalizaciones
- Mejoras del sistema

### 8.3 Reporte de Problemas

**Información a Incluir:**

1. **Datos del Usuario:**

   - Nombre completo
   - Correo institucional
   - Rol en el sistema
   - Número de documento

2. **Descripción del Problema:**

   - ¿Qué estaba intentando hacer?
   - ¿Qué esperaba que sucediera?
   - ¿Qué sucedió en realidad?

3. **Pasos para Reproducir:**

   - Liste paso a paso cómo ocurrió
   - Sea lo más específico posible

4. **Información Técnica:**

   - Navegador y versión
   - Sistema operativo
   - Capturas de pantalla
   - Mensajes de error (si aplica)

5. **Impacto:**
   - ¿Qué tan urgente es?
   - ¿A cuántos usuarios afecta?
   - ¿Hay solución temporal?

### 8.4 Recursos Adicionales

**Documentación:**

- Manual de Usuario (este documento)
- Manual Técnico (para administradores)
- Guías de Video (próximamente)
- FAQ Extendido

**Capacitación:**

- Sesiones de inducción
- Talleres semestrales
- Tutoriales en línea
- Webinars mensuales

### 8.5 Mejora Continua

**Sugerencias y Comentarios:**

Su retroalimentación es valiosa. Puede enviarnos:

- Sugerencias de mejora
- Ideas para nuevas funcionalidades
- Comentarios sobre usabilidad
- Casos de uso no contemplados

**Correo para Sugerencias:**
feedback.sigha@[institucion].edu.co

### 8.6 Actualizaciones del Sistema

**Ciclo de Actualizaciones:**

- Parches de seguridad: Según se requiera
- Correcciones de bugs: Quincenal
- Nuevas funcionalidades: Mensual
- Versiones mayores: Semestral

**Notificaciones:**

- Alertas en el sistema
- Correos informativos
- Notas de versión
- Changelog público

---

## 9. Glosario de Términos

**Área Académica:** Agrupación de materias relacionadas (ej: Matemáticas, Física).

**Asignación:** Relación entre un profesor y un grupo específico.

**Bloque Horario:** Período de una hora específico en un día (ej: Lunes 8:00-9:00).

**Conflicto:** Situación donde hay solapamiento o incompatibilidad en horarios o recursos.

**Disponibilidad:** Horarios en los que un profesor puede dictar clases.

**Grupo:** Clase específica de una materia en un horario determinado.

**Materia:** Asignatura o curso académico (ej: Cálculo I).

**Nivel:** Clasificación académica de las materias (ej: Nivel 1, Nivel 2).

**Semestre:** Período académico de aproximadamente 6 meses.

**Solicitud:** Petición formal de un profesor que requiere aprobación administrativa.

---

## 10. Información de Versión

**Manual de Usuario SIGHA**

- Versión: 1.0.0
- Fecha: Octubre 2025
- Sistema: SIGHA Frontend v0.1.0

**Elaborado por:**

- Equipo de Desarrollo SIGHA
- [Institución Educativa]

**Revisado por:**

- Coordinación Académica
- Dirección de Escuela

---

## 11. Apéndices

### Apéndice A: Atajos de Teclado

| Atajo          | Acción                           |
| -------------- | -------------------------------- |
| `Ctrl + S`     | Guardar cambios (en formularios) |
| `Esc`          | Cerrar modal/diálogo             |
| `F5`           | Recargar página                  |
| `Ctrl + F`     | Buscar en página                 |
| `Alt + ←`      | Volver a página anterior         |
| `Shift + Clic` | Selección múltiple               |

### Apéndice B: Códigos de Color

**Estados de Disponibilidad:**

- 🟢 Verde (#67b83c): Disponible
- 🟡 Amarillo (#f59e0b): Preferiblemente no
- 🔴 Rojo (#ef4444): No disponible
- ⚪ Gris (#9ca3af): Sin definir

**Estados de Grupo:**

- 🔵 Azul: Con profesor asignado
- 🟡 Amarillo: Sin profesor asignado
- 🔴 Rojo: Con conflicto
- 🟢 Verde: Confirmado

**Alertas y Notificaciones:**

- 🟢 Verde: Éxito
- 🔴 Rojo: Error
- 🟡 Amarillo: Advertencia
- 🔵 Azul: Información

### Apéndice C: Límites del Sistema

| Parámetro                               | Límite          |
| --------------------------------------- | --------------- |
| Máximo de grupos por semestre           | 1000            |
| Máximo de profesores activos            | 500             |
| Máximo de materias por área             | 100             |
| Duración mínima de semestre             | 3 meses         |
| Duración máxima de semestre             | 12 meses        |
| Horas mínimas por grupo                 | 2 horas/semana  |
| Horas máximas recomendadas por profesor | 20 horas/semana |

### Apéndice D: Requisitos Técnicos Detallados

**Navegadores Soportados:**

- Google Chrome 90+
- Mozilla Firefox 88+
- Safari 14+
- Microsoft Edge 90+

**Resoluciones Recomendadas:**

- Desktop: 1920x1080 (Full HD)
- Laptop: 1366x768 (mínimo)
- Tablet: 1024x768
- Móvil: 375x667 (visualización básica)

**Conexión a Internet:**

- Velocidad mínima: 5 Mbps
- Velocidad recomendada: 10 Mbps
- Latencia máxima: 100ms

---

## 📞 Contacto

Para cualquier consulta, sugerencia o soporte:

**Equipo SIGHA**

- 📧 Email: soporte.sigha@[institucion].edu.co
- 🌐 Web: https://sigha.[institucion].edu.co
- 📱 Teléfono: [Número de contacto]

---

<div style="text-align: center; margin-top: 50px; padding: 20px; border-top: 2px solid #67b83c;">
  <p><strong>SIGHA - Sistema Integral de Gestión de Horarios Académicos</strong></p>
  <p>© 2025 Universidad Industrial de Santander. Todos los derechos reservados.</p>
  <p><em>"Optimizando la gestión académica con tecnología"</em></p>
</div>
