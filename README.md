# Cashly — Sistema de gestión financiera personal

Cashly es una aplicación web desarrollada para ayudar a las personas a administrar sus finanzas personales de manera organizada. Permite registrar ingresos y gastos, crear presupuestos, establecer metas de ahorro y consultar estadísticas para mejorar los hábitos financieros.

## Objetivo del proyecto

Desarrollar un sistema web de gestión financiera que permita a los usuarios controlar sus movimientos económicos, planificar sus gastos y llevar un seguimiento de sus metas de ahorro mediante una interfaz intuitiva y organizada.

## Tecnologías utilizadas

- **PHP 8+:** lógica del servidor y procesamiento de las solicitudes.
- **MySQL / MariaDB:** almacenamiento y gestión de la información.
- **HTML5:** estructura de las páginas.
- **CSS3:** estilos y diseño de la interfaz.
- **JavaScript:** interactividad y actualización de elementos de la aplicación.
- **Apache:** servidor web, mediante XAMPP durante el desarrollo.
- **Arquitectura MVC:** organización del proyecto mediante modelos, vistas y controladores.
- **Modelo Entidad-Relación (MER):** diseño y organización de la base de datos.

## Funcionalidades

### Gestión de usuarios
- Registro de usuarios.
- Inicio y cierre de sesión.
- Recuperación de contraseña.
- Perfil personal y actualización de información.
- Roles de usuario y administrador.

### Panel principal
- Consulta del saldo total.
- Resumen de ingresos y gastos.
- Gráfica de ingresos y gastos de los últimos siete días.
- Historial de movimientos financieros.

### Movimientos financieros
- Registro de ingresos y gastos.
- Edición y eliminación de movimientos.
- Clasificación por categoría.
- Registro del monto, método de pago, fecha y descripción opcional.
- Actualización de los resúmenes y estadísticas según los movimientos registrados.

### Presupuestos
- Creación y administración de presupuestos.
- Seguimiento del dinero gastado y disponible.
- Edición y eliminación de presupuestos.
- Organización de presupuestos por periodos.

### Metas de ahorro
- Creación de metas financieras.
- Registro de aportes a cada meta.
- Seguimiento del progreso.
- Consulta de fechas límite y dinero restante.
- Notificación visual al completar una meta.

### Calendario financiero
- Visualización de movimientos por fecha.
- Consulta de los movimientos asociados a cada día.
- Organización de recordatorios financieros.

### Consejos financieros
- Contenido sobre ahorro, gastos, inversiones y educación financiera.
- Consulta de recomendaciones para mejorar la administración del dinero.

### Ayuda y soporte
- Guía de funcionamiento.
- Comentarios.
- Contacto con el administrador.
- Políticas de privacidad.

### Administración
- Panel administrativo.
- Consulta y gestión de usuarios.
- Estadísticas de registro de usuarios.
- Gestión de solicitudes de soporte y respuestas.
- Administración de consejos financieros.

## Requisitos del sistema

- PHP 8.0 o superior.
- MySQL 8.0 o MariaDB 10.5 o superior.
- Apache.
- XAMPP u otro entorno compatible.
- Navegador web actualizado.
- Git, si se desea clonar el proyecto.

## Instalación y configuración

### 1. Descargar el proyecto

Clona el repositorio de GitHub:

```bash
git clone https://github.com/SrAng3ls/cashly.git
```

También puedes descargar el proyecto como archivo ZIP desde GitHub.

### 2. Ubicar los archivos

Si utilizas XAMPP, coloca la carpeta del proyecto dentro de:

```text
C:\xampp\htdocs\cashly
```

### 3. Iniciar los servicios

Abre el panel de control de XAMPP e inicia:

- Apache.
- MySQL.

### 4. Crear la base de datos

Abre phpMyAdmin desde:

```text
http://localhost/phpmyadmin
```

Crea la base de datos y ejecuta el script SQL disponible en:

```text
database/schema.sql
```

Si el proyecto incluye otros scripts SQL necesarios para su funcionamiento, ejecútalos según las instrucciones correspondientes.

### 5. Configurar la conexión

Abre el archivo de configuración de la base de datos y ajusta los parámetros de conexión según tu entorno local.

La configuración debe incluir el servidor, el nombre de la base de datos, el usuario y la contraseña correspondientes.

**Importante:** no publiques contraseñas reales, credenciales privadas ni datos sensibles en el repositorio.

### 6. Abrir la aplicación

Desde el navegador, ingresa a:

```text
http://localhost/cashly/
```

Si tu configuración utiliza una ruta de entrada diferente, accede a la dirección correspondiente a la estructura actual del proyecto.

## Estructura general del proyecto

La organización puede variar según la versión actual de los archivos.

```text
cashly/
├── app/
│   ├── controllers/
│   ├── models/
│   └── views/
├── config/
├── database/
│   └── schema.sql
├── docs/
│   └── MER.md
├── public/
├── index.php
└── README.md
```

- **Controllers:** reciben las solicitudes y coordinan las acciones de la aplicación.
- **Models:** gestionan la información y las operaciones con la base de datos.
- **Views:** contienen las interfaces que utiliza el usuario.
- **Config:** almacena la configuración de la aplicación.
- **Database:** contiene los scripts relacionados con la base de datos.
- **Docs:** contiene la documentación técnica, incluido el modelo entidad-relación.
- **Index.php:** punto de entrada de la aplicación, según la configuración del proyecto.

## Arquitectura del sistema

Cashly utiliza el patrón Modelo-Vista-Controlador (MVC) para separar las responsabilidades del sistema y facilitar el mantenimiento del código.

El modelo entidad-relación permite representar las entidades principales de la base de datos y las relaciones entre ellas.

La documentación del MER se encuentra en:

```text
docs/MER.md
```

## Propósito académico

Cashly se desarrolla como proyecto formativo para aplicar conocimientos de programación, desarrollo web, bases de datos, arquitectura de software y gestión de información financiera.

El proyecto busca integrar funcionalidades prácticas en una aplicación organizada, segura y fácil de utilizar.

## Repositorio

GitHub: https://github.com/SrAng3ls/cashly
