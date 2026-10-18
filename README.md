# Cashly — Gestión personal de finanzas

Aplicación web de finanzas personales construida desde cero con PHP 8+, MySQL, arquitectura MVC, CSS y JavaScript. Diseño adaptable con paleta azul y mascota ilustrativa.

## Funciones incluidas
- Registro, login, cierre de sesión, recuperación local de contraseña y sesiones seguras.
- Inicio con balance, ingresos/gastos, gráfico de 7 días, gráficos por categoría con intensidad proporcional al valor (gastos en rosas e ingresos en azules), y CRUD de movimientos con categorías fijas por tipo y categorías personalizadas.
- Metas de ahorro, abonos, progreso calculado y alertas visuales de fechas próximas.
- Presupuestos semanales/mensuales/anuales y gastos asociados.
- Calendario de movimientos, pagos, suscripciones y recordatorios.
- Perfil editable, fotografía, teléfono y temas azul claro/normal/oscuro.
- Consejos financieros, guía de ayuda, PQRS y contacto con administración.
- Panel administrativo con usuarios, estados de cuenta, estadísticas, artículos y solicitudes de soporte.
- Modelo entidad-relación en `docs/MER.md`.

## Instalación local con XAMPP
1. Copia la carpeta `cashly` en `C:/xampp/htdocs/cashly`.
2. Inicia Apache y MySQL desde el panel de XAMPP.
3. Abre `http://localhost/phpmyadmin` e importa `database/schema.sql`.
4. Revisa `config/config.php`; por defecto usa `root` sin contraseña y base de datos `cashly`.
5. Abre `http://localhost/cashly/public/`.
6. Registra una cuenta desde la pantalla inicial.

## Crear la cuenta administradora
Por seguridad, el registro público siempre crea cuentas de usuario normales. Después de registrar tu propia cuenta, abre phpMyAdmin, selecciona la base `cashly`, ejecuta esta consulta reemplazando el correo por el tuyo:

```sql
UPDATE users SET role='admin' WHERE email='tu-correo@ejemplo.com';
```

Cierra sesión e inicia de nuevo para que se cargue el rol. No se incluye una cuenta administradora de prueba ni una contraseña fija.

## Notas importantes
- La recuperación de contraseña incluida es un flujo local de demostración: verifica el correo en la base y permite establecer una clave nueva dentro de la sesión. Para producción se debe implementar un token aleatorio con vencimiento y envío por SMTP; nunca publiques este flujo tal cual en Internet.
- Las alertas de vencimiento se muestran en la interfaz al consultar el calendario/metas. Las notificaciones automáticas por correo/push requieren un servicio de correo o un proceso programado adicional.
- Los gráficos utilizan Chart.js desde CDN, por lo que la primera carga de gráficos necesita conexión a Internet.
- Antes de producción: configurar HTTPS, credenciales dedicadas, SMTP, límites de carga, copias de seguridad, auditoría y protección adicional contra abuso.

## Estructura MVC
- `app/models`: acceso a datos y autenticación.
- `app/controllers`: autenticación y controlador de módulos.
- `app/views`: vistas de autenticación, layout y pantallas.
- `app/core`: conexión PDO y funciones comunes.
- `config/config.php`: configuración local.
- `database/schema.sql`: base de datos.
- `docs/MER.md`: diagrama MER.
- `public/assets`: CSS y JavaScript.
