# PDF Form to CSV

Aplicación web sencilla para extraer datos de formularios PDF y convertirlos en un archivo CSV, directamente desde el navegador. No requiere instalación ni conexión a internet.

## Funcionalidad

Esta herramienta permite:

1. Subir varios formularios PDF (formato AcroForm).
2. Detectar si los archivos contienen los mismos campos; si alguno no es compatible (por ejemplo, texto plano o estructura diferente), se avisará en el listado.
3. Una vez cargados todos los archivos válidos, podrás revisar la estructura de datos y extraer los contenidos.
4. Visualizar los datos extraídos directamente en la ventana del navegador.
5. Descargar los resultados en un archivo `.csv`.

Todo el procesamiento ocurre **localmente en tu navegador**. No se sube ningún archivo a servidores externos.

## Requisitos de los archivos PDF

Para que la aplicación funcione correctamente, los archivos PDF deben:

1. Contener campos de formulario interactivos (AcroForms).
2. Soporta los siguientes tipos de campos:
   - Campos de texto (`PDFTextField`)
   - Casillas de verificación (`PDFCheckBox`)
   - Grupos de radio (`PDFRadioGroup`)
   - Listas desplegables (`PDFDropdown`)
   - Listas de opciones (`PDFOptionList`)

### Soporte para campos tipo "array"

La aplicación reconoce automáticamente campos que forman parte de un array o colección. Para que un campo sea reconocido como parte de un array:

- Debe seguir la nomenclatura `nombreCampo[índice]`, por ejemplo: `nombre[0]`, `nombre[1]`, etc.
- Los índices deben ser números enteros comenzando desde 0.

Estos campos serán tratados como columnas independientes en el CSV resultante, permitiendo representar estructuras de datos más complejas.

### Compatibilidad entre archivos

Para procesar múltiples archivos PDF juntos, estos deben tener una estructura de campos compatible. La aplicación verificará automáticamente esta compatibilidad y solo permitirá procesar conjuntos de archivos con la misma estructura de campos.

## Interfaz en tres pasos

La aplicación guía al usuario a través de tres pasos:

1. **Subir PDFs:** Selecciona uno o más archivos PDF desde tu equipo.
2. **Revisión:** Se mostrarán los archivos cargados, junto con un aviso en los que no sean compatibles.
3. **Extracción:** Podrás previsualizar los datos detectados y exportarlos a CSV con un solo clic.

## Requisitos

* Navegador moderno (Chrome, Firefox, etc.).
* No requiere conexión a internet una vez cargado.

## Cómo usar

1. Abre el archivo `index.html` en tu navegador.
2. Arrastra o selecciona tus archivos PDF.
3. Revisa la tabla de archivos y asegúrate de que todos sean compatibles.
4. Haz clic en “Extraer datos”.
5. Revisa la tabla de resultados.
6. Descarga el archivo CSV si lo deseas.

## Cómo depurar en local

1. Asegúrate de tener Node.js instalado.
2. Abre la terminal y ve a la carpeta del proyecto:

   ```sh
   cd ruta/del/proyecto
   ```
3. Instala el servidor local:

   ```sh
   npm install -g http-server
   ```
4. Ejecuta:

   ```sh
   http-server
   ```
5. Abre la URL que aparece (por ejemplo, [http://127.0.0.1:8080](http://127.0.0.1:8080)) en tu navegador.

## Tests automatizados

El proyecto incluye tests end-to-end (e2e) utilizando Playwright para verificar el correcto funcionamiento de la aplicación:

1. Instala las dependencias de desarrollo:

   ```sh
   npm install
   ```

2. Ejecuta los tests:

   ```sh
   npm test
   ```

Este comando:
- Inicia automáticamente un servidor HTTP local en el puerto 9001
- Ejecuta los tests de Playwright que verifican la funcionalidad principal
- Genera un informe HTML con los resultados

Para ver el último informe de tests:

```sh
npx playwright show-report
```

Los tests verifican:
- La carga correcta de archivos PDF
- La extracción de datos de los formularios
- La generación del archivo CSV
- La visualización de la tabla de datos

## Dependencias

* **Bootstrap** – para el diseño visual.
* **PDF.js** – para la manipulación de archivos PDF.
* **PDF-Lib** – para el procesamiento de formularios PDF.
* **Playwright** – para tests automatizados.

## Licencia

Este proyecto se publica bajo la licencia [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
