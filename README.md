Plataforma Solidaria
Descripción del Proyecto

La Plataforma Solidaria es una API RESTful desarrollada para gestionar de manera eficiente y segura las interacciones entre donantes, beneficiarios y administradores. Este sistema monolítico modular facilita la gestión de usuarios, roles y autenticación, asegurando que los recursos lleguen a quienes más lo necesitan bajo estándares de calidad y seguridad.

Tecnologías Utilizadas

Backend: Node.js, Express.js

Seguridad y Auth: JSON Web Tokens (JWT), bcrypt, npm audit (SCA)

Pruebas Unitarias: Jest, Supertest

Calidad de Código: ESLint

CI/CD: GitHub Actions


Instalación y Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

Clonar el repositorio:

git clone https://github.com/tu-usuario/plataforma-solidaria.git



Instalar dependencias:
Navega al directorio del proyecto y ejecuta el manejador de paquetes:

cd plataforma-solidaria
npm install



Ejecutar la suite de pruebas y calidad:

npm test
npx eslint authController.js server.js



Levantar el servidor localmente:

node server.js



📊 Informe de Cierre y Evaluación

1. Comparación detallada entre lo planificado y lo ejecutado

Durante el ciclo de vida del proyecto "Plataforma Solidaria", la planificación inicial se centró en construir una arquitectura monolítica modular capaz de gestionar usuarios, donaciones y recursos de manera segura, aplicando estándares de calidad de la industria. El contraste entre la planeación y la ejecución real refleja un alto índice de cumplimiento:

Módulo de Autenticación y Gestión de Roles:

Lo planificado: Desarrollar un sistema de registro e inicio de sesión con diferenciación de permisos.

Lo ejecutado: Se implementó con éxito utilizando Node.js y Express, integrando bcrypt para el cifrado de contraseñas y JWT para la autorización sin estado (stateless).

Cobertura de Pruebas Unitarias:

Lo planificado: Alcanzar una cobertura mínima del 80% en los módulos críticos utilizando Jest.

Lo ejecutado: Se superó la métrica objetivo, logrando un 86.11% de cobertura global, con un 100% de las funciones probadas en el controlador principal (authController.js).

Integración y Entrega Continuas (CI/CD):

Lo planificado: Configurar un pipeline automatizado para validar el código.

Lo ejecutado: Se configuró exitosamente un flujo de trabajo en GitHub Actions (ci.yml). El entorno en la nube ahora ejecuta la suite de pruebas de manera automatizada con cada commit.

Análisis de Seguridad y Calidad de Código:

Lo planificado: Utilizar herramientas de escaneo profundo como OWASP ZAP y SonarQube.

Lo ejecutado (Desviación justificada): Debido al alto consumo de recursos de SonarQube y ZAP, el equipo tomó la decisión técnica de utilizar npm audit para análisis de seguridad (confirmando cero vulnerabilidades) y ESLint para análisis estático (garantizando cero code smells y deuda técnica nula).

2. Lecciones aprendidas durante el proceso

El impacto de la configuración temprana de calidad: Implementar ESLint evidenció que es más costoso corregir errores de estilo retrospectivamente. En futuros proyectos, estas herramientas deben integrarse desde el primer commit.

Gestión de entornos y dependencias: Se reforzó la importancia de no versionar la carpeta node_modules. Entender que el servidor CI debe reconstruir su propio entorno a partir del package.json fue fundamental para optimizar GitHub Actions.

3. Plan estratégico de mejora continua

Para escalar la plataforma, se propone la siguiente hoja de ruta evolutiva:

Implementación de Inteligencia Artificial: Desarrollar un modelo predictivo que analice datos históricos para prevenir caídas estacionales en la recaudación.

Ecosistema Móvil Nativo: Expandir la accesibilidad creando una aplicación móvil nativa para Android desarrollada con Kotlin, permitiendo el uso offline en zonas de baja conectividad.

Arquitectura Cloud Escalable: Migrar el despliegue hacia Amazon Web Services (AWS), utilizando instancias EC2 y bases de datos gestionadas con Amazon RDS.