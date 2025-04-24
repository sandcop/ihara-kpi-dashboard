// script.js
console.log("script.js: Empezando a ejecutar.");

// --- URL de Google Apps Script ---
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9UyKr-UcWOCvrMGCsgvc38_-HmKZpXjlj9THbGLNK0lhLJ7B-_RSVpxFpP76eWjeP/exec';

// --- Referencias a elementos DOM (se asignan en DOMContentLoaded) ---
let navLinks, hamburgerBtn;
let kpiContentSection, ofertasFlashSection, enlacesExternosSection, tablaRemuneracionSection, politicasVentasSection;
let tablaContainer, chartContainer, loader, tablaDatos, kpiChartCanvas, errorContainer;
let miGrafico = null;

// --- CLASE CSS PARA MENÚ MÓVIL ACTIVO ---
const NAV_ACTIVE_CLASS = 'active'; // Clase que se añadirá a nav-links

// --- FUNCIONES GLOBALES PARA onclick ---

function mostrarKPIs() {
    console.log("script.js: mostrarKPIs() llamada.");
    showSection('kpi-content'); // Muestra la sección correcta
    // Verificar si los elementos DOM están listos
    if (!loader || !tablaContainer || !errorContainer) {
        console.error("script.js: Elementos DOM para KPIs no listos.");
        return;
    }
    limpiarContenidoKPIs(); // Limpia solo la tabla/gráfico/error de KPIs
    loader.style.display = 'block'; // Muestra loader DENTRO de kpi-content

    fetch(`${APPS_SCRIPT_URL}?action=kpis`)
        .then(response => {
            console.log("script.js: Fetch KPIs - Status:", response.status);
            if (!response.ok) return response.text().then(text => { throw new Error(`Error HTTP ${response.status}: ${response.statusText}. ${text}`); });
            return response.json();
        })
        .then(data => {
            console.log("script.js: Datos KPIs JSON:", data);
            if (data && data.error) throw new Error(`Error Apps Script: ${data.error}`);
            loader.style.display = 'none';
            // Asegurar que los contenedores internos son visibles si hay datos
            tablaContainer.style.display = 'block';
            chartContainer.style.display = 'block';
            kpiChartCanvas.style.display = 'block';
            tablaDatos.style.display = 'table';

            popularTablaKPIs(data);
            actualizarGraficoKPIs(data);
        })
        .catch(error => {
            console.error("script.js: Catch KPIs:", error);
            loader.style.display = 'none'; // Ocultar loader en caso de error
            mostrarErrorKPIs(`Error al cargar KPIs: ${error.message}`); // Mostrar error DENTRO de kpi-content
        });
}

function mostrarFaltantes() {
    console.log("script.js: mostrarFaltantes() llamada.");
    showSection('kpi-content'); // Muestra la sección correcta
     // Verificar si los elementos DOM están listos
    if (!loader || !tablaContainer || !errorContainer) {
        console.error("script.js: Elementos DOM para Faltantes no listos.");
        return;
    }
    limpiarContenidoKPIs(); // Limpia la tabla/gráfico/error de KPIs
    loader.style.display = 'block'; // Muestra loader DENTRO de kpi-content
    chartContainer.style.display = 'none'; // Ocultar gráfico para faltantes

    fetch(`${APPS_SCRIPT_URL}?action=faltantes`)
       .then(response => {
            console.log("script.js: Fetch Faltantes - Status:", response.status);
            if (!response.ok) return response.text().then(text => { throw new Error(`Error HTTP ${response.status}: ${response.statusText}. ${text}`); });
            return response.json();
        })
        .then(data => {
            console.log("script.js: Datos Faltantes JSON:", data);
            if (data && data.error) throw new Error(`Error Apps Script: ${data.error}`);
            loader.style.display = 'none';
            tablaContainer.style.display = 'block'; // Mostrar contenedor tabla
            tablaDatos.style.display = 'table';   // Mostrar tabla
            popularTablaFaltantes(data);
        })
        .catch(error => {
             console.error("script.js: Catch Faltantes:", error);
             loader.style.display = 'none'; // Ocultar loader en caso de error
             mostrarErrorKPIs(`Error al cargar Faltantes: ${error.message}`); // Mostrar error DENTRO de kpi-content
        });
}

// Funciones simples para mostrar las otras secciones
function mostrarOfertasFlash() {
    console.log("script.js: mostrarOfertasFlash() llamada.");
    showSection('ofertas-flash');
}
function mostrarEnlacesExternos() {
    console.log("script.js: mostrarEnlacesExternos() llamada.");
    showSection('enlaces-externos');
}
function mostrarTablaRemuneracion() {
    console.log("script.js: mostrarTablaRemuneracion() llamada.");
    showSection('tabla-remuneracion');
}
function mostrarPoliticasVentas() {
     console.log("script.js: mostrarPoliticasVentas() llamada.");
    showSection('politicas-ventas');
}


// Función para cerrar el menú móvil (llamada desde onclick)
function closeMobileMenu() {
    if (navLinks && navLinks.classList.contains(NAV_ACTIVE_CLASS)) {
        console.log("script.js: closeMobileMenu() llamada.");
        navLinks.classList.remove(NAV_ACTIVE_CLASS);
        // Opcional: Cambiar aria-expanded en el botón hamburguesa
        if(hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
}

// --- FUNCIONES AUXILIARES ---

// Muestra una sección principal y oculta las demás
function showSection(sectionIdToShow) {
    console.log(`script.js: showSection llamada para '${sectionIdToShow}'`);
    const sections = [
        kpiContentSection, ofertasFlashSection, enlacesExternosSection,
        tablaRemuneracionSection, politicasVentasSection
    ];
    let sectionFound = false;
    sections.forEach(section => {
        if (section) { // Comprobar que la referencia existe
            if (section.id === sectionIdToShow) {
                section.style.display = 'block';
                sectionFound = true;
                console.log(`script.js: Mostrando sección '${section.id}'`);
            } else {
                section.style.display = 'none';
            }
        } else {
             console.warn(`script.js: Referencia a sección no encontrada en showSection.`);
        }
    });
     if (!sectionFound) {
         console.error(`script.js: No se encontró la sección con ID '${sectionIdToShow}' para mostrar.`);
     }
}


// Limpia específicamente el contenido dentro de #kpi-content
function limpiarContenidoKPIs() {
    console.log("script.js: limpiarContenidoKPIs() llamada.");
    if (tablaDatos) tablaDatos.innerHTML = '';
    if (errorContainer) errorContainer.innerHTML = '';
    if (loader) loader.style.display = 'none'; // Ocultar loader por defecto
    if (kpiChartCanvas && miGrafico) { // Opcional: Limpiar gráfico
        miGrafico.data.labels = [];
        miGrafico.data.datasets[0].data = [];
        miGrafico.update();
    }
     // No ocultar tablaContainer o chartContainer aquí, showSection lo maneja
}

// Muestra errores dentro del #error-container de la sección KPIs
function mostrarErrorKPIs(mensaje) {
    console.error("script.js: mostrarErrorKPIs() llamada:", mensaje);
    if (errorContainer) {
        errorContainer.innerHTML = `<div class="error-message">${mensaje}</div>`;
    } else {
        console.error("script.js: errorContainer no encontrado para mostrar el error.");
        alert("Error: " + mensaje); // Fallback
    }
    // Asegurarse que el contenedor de la tabla esté visible para mostrar el error
    if(tablaContainer) tablaContainer.style.display = 'block';
    if(loader) loader.style.display = 'none'; // Ocultar loader si había error
    if(chartContainer) chartContainer.style.display = 'none'; // Ocultar gráfico si había error
}


// --- Funciones para popular tablas y gráfico (sin cambios mayores) ---
function popularTablaKPIs(datosKPI) { /* ... como antes, con logs ... */
     console.log("script.js: popularTablaKPIs() con datos:", datosKPI);
     if (!tablaDatos) return;
     // ... resto del código ...
}
function popularTablaFaltantes(datosFaltantes) { /* ... como antes, con logs ... */
    console.log("script.js: popularTablaFaltantes() con datos:", datosFaltantes);
     if (!tablaDatos) return;
    // ... resto del código ...
}
function actualizarGraficoKPIs(datosKPI) { /* ... como antes, con logs ... */
    console.log("script.js: actualizarGraficoKPIs() con datos:", datosKPI);
    if (!miGrafico) { console.warn("Gráfico no listo."); return; }
    // ... resto del código ...
}
function inicializarGrafico() { /* ... como antes, con logs ... */
    console.log("script.js: inicializarGrafico() llamada.");
     if (!kpiChartCanvas) { console.error("Canvas no listo."); return; }
    // ... resto del código ...
     if (chartContainer) chartContainer.style.display = 'none'; // Ocultar al inicio
     if (kpiChartCanvas) kpiChartCanvas.style.display = 'none';
}

// --- INICIALIZACIÓN POST-DOM ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js: DOMContentLoaded evento disparado.");

    // --- Asignar referencias DOM ---
    navLinks = document.getElementById('nav-links');
    hamburgerBtn = document.getElementById('hamburger-btn');

    kpiContentSection = document.getElementById('kpi-content');
    ofertasFlashSection = document.getElementById('ofertas-flash');
    enlacesExternosSection = document.getElementById('enlaces-externos');
    tablaRemuneracionSection = document.getElementById('tabla-remuneracion');
    politicasVentasSection = document.getElementById('politicas-ventas');

    // Elementos dentro de kpi-content
    tablaContainer = document.getElementById('tabla-container'); // Contenedor de tabla/loader/error
    chartContainer = document.getElementById('chart-container');
    loader = document.getElementById('loader');
    tablaDatos = document.getElementById('tablaDatos');
    kpiChartCanvas = document.getElementById('kpiChart');
    errorContainer = document.getElementById('error-container');

    // --- Verificar referencias esenciales ---
    if (!navLinks || !hamburgerBtn || !kpiContentSection || !tablaContainer || !chartContainer || !loader || !tablaDatos || !kpiChartCanvas || !errorContainer) {
         console.error("script.js: ¡Error crítico! Uno o más elementos DOM esenciales (navbar, kpi-content, tabla, gráfico, loader, error) no se encontraron por ID.");
         alert("Error crítico: No se pudieron encontrar elementos esenciales en la página.");
         return; // Detener si falta algo crucial
    }
     console.log("script.js: Referencias DOM obtenidas.");

    // --- Configurar Event Listeners ---
    // Listener para el botón hamburguesa
    hamburgerBtn.addEventListener('click', () => {
        console.log("script.js: Botón hamburguesa clickeado.");
        navLinks.classList.toggle(NAV_ACTIVE_CLASS);
        // Actualizar aria-expanded
        const isExpanded = navLinks.classList.contains(NAV_ACTIVE_CLASS);
        hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Añadir onclicks a los enlaces que faltan (si prefieres JS sobre HTML onclick)
    // O puedes añadirlos directamente en el HTML como tienes ahora para KPIs/Faltantes.
    // Ejemplo si quisieras añadirlos aquí:
    const ofertasLink = document.querySelector('a[href="#ofertas-flash"]');
    if(ofertasLink) ofertasLink.addEventListener('click', (e) => {
        // e.preventDefault(); // Prevenir salto de ancla si no se desea
        mostrarOfertasFlash();
        closeMobileMenu();
    });
    // Repetir para otros enlaces... (Enlaces Externos, Tabla Remuneracion, Políticas)

    // --- Estado Inicial ---
    inicializarGrafico();
    console.log("script.js: Mostrando KPIs por defecto al cargar.");
    mostrarKPIs(); // Mostrar KPIs por defecto al cargar la página

    console.log("script.js: Inicialización post-DOM completa.");
});

console.log("script.js: Fin del archivo alcanzado.");
