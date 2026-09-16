# 🏁 Need for Speed: Most Wanted (2005) - World Records (NFSRANKSMW)

Sitio web oficial de la comunidad para el registro, consulta y verificación de récords mundiales en todas las pistas y categorías de Rockport City en *Need for Speed: Most Wanted (2005)*.

---

## 📁 Estructura del Proyecto

El proyecto está organizado de manera modular para facilitar el mantenimiento y la escalabilidad:

```text
nfs-mw-records/
├── index.html                  # Estructura principal y semántica HTML5
├── README.md                   # Documentación de uso y despliegue
├── .gitignore                  # Archivos excluidos del control de versiones
└── assets/
    ├── css/
    │   └── style.css           # Estilos visuales, variables CSS, animaciones y diseño responsivo
    ├── js/
    │   ├── routes-data.js      # Base de datos con todas las pistas y URLs de Google Sheets
    │   └── app.js              # Lógica de navegación, caché inteligente, tablas y webhook
    └── img/
        ├── nfsranksmwlogo.png  # Logo oficial (copia aquí tu imagen)
        ├── bmw-m3-gtr.jpg      # Portada hero banner (copia aquí tu imagen)
        └── logo.svg            # Fallback vectorial temático
```

---

## 🚀 Cómo abrir y trabajar en Visual Studio Code

1. Abre **Visual Studio Code**.
2. Ve al menú superior y selecciona **Archivo > Abrir carpeta...** (o `Ctrl + K`, `Ctrl + O`).
3. Selecciona la carpeta del proyecto (`nfs-mw-records`).
4. **Para probar la web en tiempo real:**
   - Instala la extensión **Live Server** de *Ritwick Dey* desde la pestaña de Extensiones (`Ctrl + Shift + X`).
   - Haz clic derecho sobre `index.html` y selecciona **Open with Live Server** (o pulsa el botón *"Go Live"* en la barra inferior).
   - Se abrirá automáticamente en tu navegador predeterminado en `http://127.0.0.1:5500`.

---

## 🖼️ Gestión de Imágenes y Assets

Copia tus imágenes existentes dentro de la carpeta `assets/img/`:
- **`assets/img/nfsranksmwlogo.png`**: Logo que aparece en la barra de navegación y pestaña del navegador. Si no está presente, se utilizará automáticamente `logo.svg` como respaldo.
- **`assets/img/bmw-m3-gtr.jpg`**: Imagen de fondo del hero banner en la página de inicio.

---

## 🏎️ Cómo agregar nuevas pistas o modificar enlaces

Todas las rutas están centralizadas en `assets/js/routes-data.js`. No necesitas modificar la lógica del código en `app.js` para añadir pistas:

```javascript
// Ejemplo para un Circuito:
{ 
    name: "Nombre de la Ruta", 
    type: "Circuito", 
    sheets: {
        junkmanSingle: "URL_CSV_GOOGLE_SHEETS",
        junkmanFast:   "URL_CSV_GOOGLE_SHEETS",
        bmwSingle:     "URL_CSV_GOOGLE_SHEETS",
        bmwFast:       "URL_CSV_GOOGLE_SHEETS"
    }
},

// Ejemplo para un Sprint o Drag:
{ 
    name: "Nombre del Sprint", 
    type: "Sprint", // o "Drag"
    sheets: {
        junkman: "URL_CSV_GOOGLE_SHEETS",
        bmw:     "URL_CSV_GOOGLE_SHEETS"
    } 
}
```

---

## 🌐 Cómo subirlo a GitHub y alojarlo gratis (GitHub Pages)

### 1. Inicializar Git y subir el proyecto
Abre la terminal integrada en VS Code (`Ctrl + ñ`) y ejecuta:

```bash
git init
git add .
git commit -m "feat: reestructuración modular de estilos, scripts y assets"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

### 2. Activar GitHub Pages (Web en Vivo)
1. Entra a tu repositorio en GitHub.
2. Ve a la pestaña **Settings** (Configuración) > **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment > Source**, selecciona **Deploy from a branch**.
4. En **Branch**, selecciona `main` y carpeta `/(root)`, luego haz clic en **Save**.
5. En unos segundos, GitHub te dará el enlace público de tu sitio (ejemplo: `https://tu-usuario.github.io/tu-repositorio/`).

---

## 🛠️ Tecnologías y Características

- **HTML5 & CSS3 nativo:** Sin dependencias pesadas ni frameworks, tiempos de carga instantáneos.
- **Caché Híbrida Inteligente:** Consultas a Google Sheets cacheadas en memoria RAM y `localStorage` con expiración de 10 minutos (TTL).
- **Lazy Loading:** Tarjetas de pistas cargadas bajo demanda con `IntersectionObserver`.
- **Búsqueda y Filtros en Tiempo Real:** Filtrado instantáneo por texto y tipo de carrera.
- **Expediente de Piloto:** Consulta individual de estadísticas, podios y participación por conductor.
- **Webhook para Discord:** Formulario de envío de tiempos conectado directamente al canal de revisión de moderadores.
