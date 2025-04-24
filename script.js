// script.js
console.log("script.js: Empezando a ejecutar."); // Log inicial

// --- URL de Google Apps Script ---
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9UyKr-UcWOCvrMGCsgvc38_-HmKZpXjlj9THbGLNK0lhLJ7B-_RSVpxFpP76eWjeP/exec';

// --- Referencias a elementos DOM (se asignarán después de cargar el DOM) ---
let navLinks, hamburgerBtn;
let kpiContentSection, ofertasFlashSection, enlacesExternosSection, tablaRemuneracionSection, politicasVentasSection;
let tablaContainer, chartContainer, loader, tablaDatos, kpiChartCanvas, errorContainer;
let miGrafico = null; // Variable global para la instancia del gráfico

// --- CLASE CSS PARA MENÚ MÓVIL ACTIVO ---
const NAV_ACTIVE_CLASS = 'active';

// --- FUNCIONES GLOBALES PARA onclick (Accesibles desde el HTML) ---

function mostrarKPIs() {
    console.log("script.js: mostrarKPIs() llamada.");
    // Verifica si los elementos necesarios para esta función están listos
    if (!kpiContentSection || !loader || !tablaContainer || !errorContainer || !chartContainer || !kpiChartCanvas) {
        console.error("script.js: Elementos DOM esenciales para KPIs no encontrados. ¿Se llamó antes de que DOMContentLoaded terminara o faltan IDs en HTML?");
        alert("Error: La página o los elementos necesarios para KPIs no están listos.");
        return;
    }
    showSection('kpi-content'); // Muestra la sección correcta
    limpiarContenidoKPIs(); // Limpia tabla/gráfico/error de KPIs
    loader.style.display = 'block'; // Muestra loader DENTRO de kpi-content

    fetch(`${APPS_SCRIPT_URL}?action=kpis`)
        .then(response => {
            console.log("script.js: Fetch KPIs - Respuesta recibida, Status:", response.status);
            if (!response.ok) return response.text().then(text => { throw new Error(`Error HTTP ${response.status}: ${response.statusText}. ${text}`); });
            return response.json();
        })
        .then(data => {
            console.log("script.js: Datos KPIs procesados como JSON:", data);
            if (data && data.error) throw new Error(`Error Apps Script: ${data.error}`);

            loader.style.display = 'none';
            // Hacer visibles los contenedores internos
            tablaContainer.style.display = 'block';
            chartContainer.style.display = 'block'; // Mostrar contenedor del gráfico
            kpiChartCanvas.style.display = 'block'; // Mostrar el canvas
            tablaDatos.style.display = 'table';     // Mostrar la tabla

            popularTablaKPIs(data);
            actualizarGraficoKPIs(data); // Intentar actualizar el gráfico
        })
        .catch(error => {
            console.error("script.js: Catch - Error al obtener KPIs:", error);
            if(loader) loader.style.display = 'none'; // Asegurarse de ocultar loader en error
            mostrarErrorKPIs(`Error al cargar KPIs: ${error.message}`);
        });
}

function mostrarFaltantes() {
    console.log("script.js: mostrarFaltantes() llamada.");
     // Verifica si los elementos necesarios para esta función están listos
    if (!kpiContentSection || !loader || !tablaContainer || !errorContainer) {
        console.error("script.js: Elementos DOM esenciales para Faltantes no encontrados.");
        alert("Error: La página o los elementos necesarios para Faltantes no están listos.");
        return;
    }
    showSection('kpi-content'); // Muestra la sección correcta
    limpiarContenidoKPIs(); // Limpia tabla/gráfico/error de KPIs
    loader.style.display = 'block'; // Muestra loader DENTRO de kpi-content
    if (chartContainer) chartContainer.style.display = 'none'; // Ocultar gráfico para faltantes

    fetch(`${APPS_SCRIPT_URL}?action=faltantes`)
       .then(response => {
            console.log("script.js: Fetch Faltantes - Respuesta recibida, Status:", response.status);
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
             console.error("script.js: Catch - Error al obtener Faltantes:", error);
             if(loader) loader.style.display = 'none'; // Ocultar loader en error
             mostrarErrorKPIs(`Error al cargar Faltantes: ${error.message}`);
        });
}

// Funciones para mostrar otras secciones (llamadas desde onclick en HTML)
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

// Función para cerrar el menú móvil (llamada desde onclick en HTML)
function closeMobileMenu() {
    // Verifica si navLinks existe y tiene la clase activa
    if (navLinks && navLinks.classList.contains(NAV_ACTIVE_CLASS)) {
        console.log("script.js: closeMobileMenu() llamada.");
        navLinks.classList.remove(NAV_ACTIVE_CLASS);
        // Actualizar aria-expanded en el botón hamburguesa si existe
        if(hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
}

// --- FUNCIONES AUXILIARES ---

// Muestra una sección principal por ID y oculta las demás
function showSection(sectionIdToShow) {
    console.log(`script.js: showSection llamada para '${sectionIdToShow}'`);
    // Array de todas las referencias a las secciones principales
    const sections = [
        kpiContentSection, ofertasFlashSection, enlacesExternosSection,
        tablaRemuneracionSection, politicasVentasSection
    ];
    let sectionFound = false;
    sections.forEach(section => {
        // Comprobar que la referencia al elemento exista antes de intentar usarla
        if (section) {
            if (section.id === sectionIdToShow) {
                section.style.display = 'block'; // Mostrar la sección deseada
                sectionFound = true;
                console.log(`script.js: Mostrando sección '${section.id}'`);
            } else {
                section.style.display = 'none'; // Ocultar las otras secciones
            }
        } else {
             // Esto no debería pasar si las verificaciones en DOMContentLoaded son correctas
             console.warn(`script.js: Referencia a sección es null/undefined en showSection.`);
        }
    });
     if (!sectionFound) {
         console.error(`script.js: No se encontró el elemento de sección con ID '${sectionIdToShow}'. Verifica los IDs en HTML.`);
     }
}

// Limpia específicamente el contenido DENTRO de #kpi-content
function limpiarContenidoKPIs() {
    console.log("script.js: limpiarContenidoKPIs() llamada.");
    // Comprobar si las referencias existen antes de usarlas
    if (tablaDatos) tablaDatos.innerHTML = '';
    if (errorContainer) errorContainer.innerHTML = '';
    if (loader) loader.style.display = 'none';
    // Opcional: Limpiar el gráfico si existe
    if (kpiChartCanvas && miGrafico) {
        console.log("script.js: Limpiando datos del gráfico.");
        miGrafico.data.labels = [];
        miGrafico.data.datasets[0].data = [];
        miGrafico.update();
        // Mantener chartContainer y kpiChartCanvas potencialmente visibles,
        // mostrarKPIs/mostrarFaltantes decidirán si ocultar chartContainer.
    }
    // No ocultar tablaContainer, loader, etc. aquí, las funciones principales lo manejan
}

// Muestra errores DENTRO del #error-container de la sección #kpi-content
function mostrarErrorKPIs(mensaje) {
    console.error("script.js: mostrarErrorKPIs() llamada:", mensaje);
    // Comprobar si errorContainer existe
    if (errorContainer) {
        errorContainer.innerHTML = `<div class="error-message">${mensaje}</div>`;
        // Asegurar que el contenedor principal kpi-content sea visible para mostrar el error
        if (kpiContentSection) kpiContentSection.style.display = 'block';
         // Asegurar que tablaContainer sea visible para que errorContainer se vea
        if (tablaContainer) tablaContainer.style.display = 'block';
    } else {
        console.error("script.js: errorContainer no encontrado para mostrar el error.");
        alert("Error: " + mensaje); // Fallback si todo falla
    }
    // Ocultar otros elementos dentro de kpi-content en caso de error
    if(loader) loader.style.display = 'none';
    if(tablaDatos) tablaDatos.style.display = 'none';
    if(chartContainer) chartContainer.style.display = 'none';
}


// --- Funciones para popular tablas y gráfico ---

function popularTablaKPIs(datosKPI) {
     console.log("script.js: popularTablaKPIs() con datos:", datosKPI);
     if (!tablaDatos) { console.error("Elemento tablaDatos no encontrado."); return; }
     let tablaHTML = `<thead><tr><th>Indicador</th><th>Valor</th><th>Meta</th><th>Estado</th></tr></thead><tbody>`;
     if (Array.isArray(datosKPI) && datosKPI.length > 0) {
         datosKPI.forEach((kpi, index) => {
             tablaHTML += `
                 <tr>
                     <td>${kpi.indicador ?? 'N/A'}</td>
                     <td>${kpi.valor ?? 'N/A'}</td>
                     <td>${kpi.meta ?? 'N/A'}</td>
                     <td>${kpi.estado ?? 'N/A'}</td>
                 </tr>`;
         });
     } else {
         console.warn("script.js: No se encontraron datos de KPIs válidos o no es un array.");
         tablaHTML += '<tr><td colspan="4">No se encontraron datos de KPIs válidos.</td></tr>';
     }
     tablaHTML += `</tbody>`;
     tablaDatos.innerHTML = tablaHTML;
     console.log("script.js: Tabla KPIs populada.");
}

function popularTablaFaltantes(datosFaltantes) {
    console.log("script.js: popularTablaFaltantes() con datos:", datosFaltantes);
    if (!tablaDatos) { console.error("Elemento tablaDatos no encontrado."); return; }
    let tablaHTML = `<thead><tr><th>Ítem</th><th>Código</th><th>Cantidad Faltante</th><th>Proveedor</th><th>Fecha Estimada</th></tr></thead><tbody>`;
    if (Array.isArray(datosFaltantes) && datosFaltantes.length > 0) {
        datosFaltantes.forEach((item, index) => {
            tablaHTML += `
                <tr>
                    <td>${item.item ?? 'N/A'}</td>
                    <td>${item.codigo ?? 'N/A'}</td>
                    <td>${item.cantidad ?? 'N/A'}</td>
                    <td>${item.proveedor ?? 'N/A'}</td>
                    <td>${item.fechaEstimada ?? 'N/A'}</td>
                </tr>`;
        });
    } else {
        console.warn("script.js: No se encontraron datos de Faltantes válidos o no es un array.");
         tablaHTML += '<tr><td colspan="5">No se encontraron datos de Faltantes válidos.</td></tr>';
    }
    tablaHTML += `</tbody>`;
    tablaDatos.innerHTML = tablaHTML;
    console.log("script.js: Tabla Faltantes populada.");
}

function actualizarGraficoKPIs(datosKPI) {
    console.log("script.js: actualizarGraficoKPIs() llamada con datos:", datosKPI);
    // PRIMERO verificar si la instancia del gráfico existe
    if (!miGrafico) {
        // Este es el log que estabas viendo
        console.warn("script.js: Gráfico no listo (miGrafico es null). No se puede actualizar.");
        // Intentar inicializarlo de nuevo si el canvas existe? Podría ser una opción, pero
        // es mejor entender por qué falló la primera vez.
        // if(kpiChartCanvas) inicializarGrafico(); // Ojo: podría causar bucles si falla siempre
        return; // Salir si el gráfico no está listo
    }

    // Si el gráfico existe, proceder a actualizar
    if (!Array.isArray(datosKPI) || datosKPI.length === 0) {
       console.warn("script.js: No hay datos válidos para actualizar el gráfico. Limpiando gráfico.");
       miGrafico.data.labels = [];
       miGrafico.data.datasets[0].data = [];
       miGrafico.update();
       return;
    }

    // Extraer etiquetas y datos (asumiendo estructura de datosKPI)
    const labels = datosKPI.map(kpi => kpi.indicador ?? 'Sin Etiqueta');
    const data = datosKPI.map(kpi => {
        let rawValue = kpi.valor;
        let num = NaN;
        if (typeof rawValue === 'string') {
            num = parseFloat(rawValue.replace(/[$,%]/g, '').replace(/,/g, ''));
        } else if (typeof rawValue === 'number') {
            num = rawValue;
        }
        // console.log(`script.js: Grafico - Convirtiendo valor "${rawValue}" a número: ${isNaN(num) ? 0 : num}`);
        return isNaN(num) ? 0 : num; // Usar 0 si no es número válido
    });

    // Actualizar datos y redibujar
    miGrafico.data.labels = labels;
    miGrafico.data.datasets[0].data = data;
    miGrafico.data.datasets[0].label = 'Valor Actual KPI'; // Asegurar etiqueta dataset
    miGrafico.update();
    console.log("script.js: Gráfico actualizado con datos KPI.");
}

function inicializarGrafico() {
    console.log("script.js: inicializarGrafico() llamada.");
    // Verificar si el elemento canvas existe ANTES de intentar usarlo
    if (!kpiChartCanvas) {
        console.error("script.js: Canvas para gráfico (kpiChartCanvas) NO encontrado en inicializarGrafico. No se puede crear gráfico.");
        return; // Salir si el canvas no existe
    }

    try {
        const ctx = kpiChartCanvas.getContext('2d');
        if (!ctx) {
             console.error("script.js: No se pudo obtener el contexto 2D del canvas.");
             return; // Salir si no se obtiene contexto
        }

        // Destruir instancia previa si existe (importante si se re-inicializa)
        if (miGrafico) {
            console.log("script.js: Destruyendo instancia de gráfico anterior.");
            miGrafico.destroy();
            miGrafico = null; // Asegurar que quede null si la nueva creación falla
        }

        // Crear nueva instancia del gráfico
        miGrafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [], // Empezar vacío
                datasets: [{
                    label: 'Valor KPI',
                    data: [], // Empezar vacío
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } },
                responsive: true,
                maintainAspectRatio: false,
                plugins: { title: { display: true, text: 'Resumen Gráfico KPIs' } }
            }
        });
        console.log("script.js: Nueva instancia de gráfico creada exitosamente.");
        // Ocultar contenedor y canvas inicialmente (se mostrarán cuando haya datos)
        if (chartContainer) chartContainer.style.display = 'none';
        if (kpiChartCanvas) kpiChartCanvas.style.display = 'none';

    } catch (error) {
         console.error("script.js: Error al crear la instancia de Chart.js:", error);
         miGrafico = null; // Asegurar que miGrafico es null si hubo error
    }
}

// --- INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js: DOMContentLoaded evento disparado.");

    // --- Asignar referencias DOM ---
    // Navbar
    navLinks = document.getElementById('nav-links');
    hamburgerBtn = document.getElementById('hamburger-btn');
    // Secciones Principales
    kpiContentSection = document.getElementById('kpi-content');
    ofertasFlashSection = document.getElementById('ofertas-flash');
    enlacesExternosSection = document.getElementById('enlaces-externos');
    tablaRemuneracionSection = document.getElementById('tabla-remuneracion');
    politicasVentasSection = document.getElementById('politicas-ventas');
    // Elementos dentro de kpi-content
    tablaContainer = document.getElementById('tabla-container');
    chartContainer = document.getElementById('chart-container');
    loader = document.getElementById('loader');
    tablaDatos = document.getElementById('tablaDatos');
    kpiChartCanvas = document.getElementById('kpiChart'); // Referencia crucial para el gráfico
    errorContainer = document.getElementById('error-container');

    // --- Verificar TODAS las referencias ---
    const elementsToCheck = {
        navLinks, hamburgerBtn, kpiContentSection, ofertasFlashSection, enlacesExternosSection,
        tablaRemuneracionSection, politicasVentasSection, tablaContainer, chartContainer,
        loader, tablaDatos, kpiChartCanvas, errorContainer
    };
    let allElementsFound = true;
    for (const key in elementsToCheck) {
        if (!elementsToCheck[key]) {
            console.error(`script.js: ¡Error crítico! Elemento DOM con ID '${key}' no encontrado. Verifica el ID en index.html.`);
            allElementsFound = false;
        }
    }

    if (!allElementsFound) {
         alert("Error crítico: No se pudieron encontrar uno o más elementos esenciales en la página. Funcionalidad limitada. Revisa la consola (F12).");
         // Podrías decidir detener la ejecución aquí si elementos cruciales faltan
         // return;
    } else {
        console.log("script.js: Todas las referencias DOM esenciales obtenidas.");
    }

    // --- Configurar Event Listeners ---
    // Listener para el botón hamburguesa (solo si se encontró)
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            console.log("script.js: Botón hamburguesa clickeado.");
            navLinks.classList.toggle(NAV_ACTIVE_CLASS);
            const isExpanded = navLinks.classList.contains(NAV_ACTIVE_CLASS);
            hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        });
    } else {
         console.warn("script.js: Botón hamburguesa o navLinks no encontrado, listener no añadido.");
    }

    // Añadir listeners JS a otros enlaces (alternativa a onclick en HTML)
    // Lo dejamos comentado ya que los onclick están en el HTML, pero es otra opción:
    /*
    const ofertasLink = document.querySelector('a[href="#ofertas-flash"]');
    if(ofertasLink) ofertasLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenir comportamiento de ancla
        mostrarOfertasFlash();
        closeMobileMenu();
    });
    // ... repetir para otros ...
    */

    // --- Estado Inicial ---
    // Intentar inicializar el gráfico (la función ahora verifica si el canvas existe)
    inicializarGrafico();

    // Verificar si el gráfico se inicializó correctamente DESPUÉS de llamar a la función
    if (!miGrafico) {
        console.error("script.js: Post-inicialización - La instancia del gráfico (miGrafico) sigue siendo null. El gráfico no funcionará.");
        // Podrías mostrar un error al usuario aquí si el gráfico es esencial
        // mostrarErrorKPIs("No se pudo inicializar el componente de gráficos.");
    } else {
         console.log("script.js: Post-inicialización - Instancia de gráfico (miGrafico) verificada.");
    }

    // Mostrar la sección de KPIs por defecto al cargar la página
    console.log("script.js: Llamando a mostrarKPIs() por defecto al cargar.");
    mostrarKPIs(); // Esto intentará cargar datos y actualizar el gráfico (que podría fallar si miGrafico es null)

    console.log("script.js: Inicialización post-DOM completa.");
}); // Fin de DOMContentLoaded

console.log("script.js: Fin del archivo alcanzado."); // Log final
