# Frontend de Tesis - APLICACIÓN DE TÉCNICAS DE INTELIGENCIA ARTIFICIAL SOBRE LOS COMENTARIOS DE LAS EVALUACIONES DOCENTES DE LA UNIVERSIDAD DEL VALLE PARA HACER TEACHING ANALYTICS

Este repositorio contiene el frontend de la tesis, desarrollado con Vite y React JS. Este frontend consume la API REST del backend para mostrar las evaluaciones de los docentes, métricas de comentarios, análisis de sentimientos y extracción de temas.

## Características
- Interfaz de usuario desarrollada en React con Vite.
- Consumo de API REST para visualización de evaluaciones, análisis de sentimientos y extracción de temas.
- Gráficas de comentarios por sentimiento y su distribución a lo largo de los semestres.
- Nubes de palabras.
- Filtros de comentarios según diferentes métricas.

## Requisitos

- Node.js 20.x o superior

## Recomendaciones

- Se recomienda instalar primero el backend de la aplicación https://github.com/santa51107HD/edufeedbackai_back

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/santa51107HD/edufeedbackai_front.git
   cd edufeedbackai_front
   
2. Instalar las dependencias:
   ```bash
   npm install

## Ejecución

1. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev

2. La aplicación estará disponible en http://localhost:5173/

## Notas

1. Para importar nuevas evaluaciones, es necesario iniciar sesión con una cuenta de superusuario.
2. Los usuarios correspondientes a docentes y directores de Escuela se crean automáticamente al realizar la importación de evaluaciones.
3. Las contraseñas de los usuarios docentes y directores de Escuela son idénticas a su nombre de usuario.
4. Los nombres de usuario de los docentes son números secuenciales, desde el 1 hasta el número máximo de usuarios docentes registrados. En caso de realizar la modificación de la "CEDULA" en el backend, los nombres de los usuarios docentes ya no serán secuenciales, pero sus contraseñas seguirán siendo idénticas a su nombre de usuario.
5. A continuación se presenta la lista de Escuelas de la Facultad de Ingeniería junto con el nombre de usuario asignado a cada director de Escuela para acceder a la aplicación:
    - QUÍMICA: dquimica
    - DE RECURSOS NATURALES Y DEL AMBIENTE: dambiente
    - MECÁNICA: dmecanica
    - ELÉCTRICA Y ELECTRÓNICA: delec
    - DE ALIMENTOS: dalimentos
    - CIVIL Y GEOMÁTICA: dcivil
    - DE SISTEMAS Y COMPUTACIÓN: dsistemas
    - INDUSTRIAL: dindustria
    - DE MATERIALES: dmaterial
    - ESTADÍSTICA: destadist
6. Para añadir más registros en el archivo Excel de prueba, la columna "ESCUELA" debe completarse con el nombre de las Escuelas exactamente igual como aparecen en el punto 5.
