// script.js
console.log("script.js: Empezando a ejecutar.");

// --- URL de Google Apps Script (La misma que el primer script) ---
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9UyKr-UcWOCvrMGCsgvc38_-HmKZpXjlj9THbGLNK0lhLJ7B-_RSVpxFpP76eWjeP/exec';

// --- Referencias a elementos DOM (se asignarán después de cargar el DOM) ---
let navLinks, hamburgerBtn;
let kpiContentSection, ofertasFlashSection, enlacesExternosSection, tablaRemuneracionSection, politicasVentasSection;
// Elementos DENTRO de kpi-content (IDs del segundo HTML)
let tablaContainer, loader, tablaDatos, errorContainer, chartContainer, kpiChartCanvas;

// Variable para la instancia del gráfico (del primer script)
let currentChart = null;

// --- CLASE CSS PARA MENÚ MÓVIL ACTIVO (Del segundo script) ---
const NAV_ACTIVE_CLASS = 'active';

// --- FUNCIONES GLOBALES PARA onclick (Del segundo script, PERO llaman a la nueva lógica) ---

function mostrarKPIs() {
    console.log("script.js: mostrarKPIs() llamada.");
    showSection('kpi-content'); // Muestra la sección principal #kpi-content
    // Llamamos a la función de carga adaptada del PRIMER script
    cargarDatosAdaptado("kpi");
}

function mostrarFaltantes() {
    console.log("script.js: mostrarFaltantes() llamada.");
    showSection('kpi-content'); // Muestra la sección principal #kpi-content
    // Llamamos a la función de carga adaptada del PRIMER script
    cargarDatosAdaptado("faltantes");
}

// Funciones para mostrar otras secciones (Sin cambios, del segundo script)
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

// Función para cerrar el menú móvil (Sin cambios, del segundo script)
function closeMobileMenu() {
    if (navLinks && navLinks.classList.contains(NAV_ACTIVE_CLASS)) {
        console.log("script.js: closeMobileMenu() llamada.");
        navLinks.classList.remove(NAV_ACTIVE_CLASS);
        if(hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
}

// --- FUNCIONES ADAPTADAS DEL PRIMER SCRIPT ---

// Función principal de carga (adaptada del primer script)
function cargarDatosAdaptado(tipo) {
    console.log(`script.js: cargarDatosAdaptado(${tipo}) llamada.`);

    // Verificar si los elementos necesarios existen
    if (!tablaContainer || !loader || !errorContainer || !chartContainer || !kpiChartCanvas || !tablaDatos) {
        console.error("Error crítico: Faltan elementos DOM necesarios para cargar datos (tablaContainer, loader, etc.).");
        // Mostrar error en un lugar visible si es posible
        if (errorContainer) {
           errorContainer.innerHTML = '<div class="error-message">Error interno: No se pueden cargar los datos. Falta un componente de la página.</div>';
        } else {
           alert("Error crítico: Faltan elementos en la página.");
        }
        return;
    }

    // 1. Mostrar animación de carga DENTRO de #tabla-container
    loader.style.display = 'flex'; // Usar flex si el CSS lo usa para centrar
    tablaDatos.innerHTML = ''; // Limpiar tabla anterior
    tablaDatos.style.display = 'none'; // Ocultar tabla
    errorContainer.innerHTML = ''; // Limpiar errores anteriores

    // 2. Ocultar contenedor del gráfico y destruir gráfico anterior
    chartContainer.style.display = 'none';
    if (currentChart) {
        console.log("Destruyendo gráfico anterior.");
        currentChart.destroy();
        currentChart = null;
    }

    // 3. Realizar la llamada fetch (usando ?tipo= como en el primer script)
    fetch(`${APPS_SCRIPT_URL}?tipo=${tipo}`)
        .then(res => {
            console.log(`Fetch ${tipo} - Respuesta recibida, Status:`, res.status);
            if (!res.ok) {
                // Intentar obtener más detalles del error si es posible
                return res.text().then(text => {
                    throw new Error(`Error HTTP ${res.status}: ${res.statusText}. Respuesta: ${text}`);
                });
            }
            return res.json();
        })
        .then(data => {
            console.log(`Datos ${tipo} procesados como JSON:`, data);
            loader.style.display = 'none'; // Ocultar loader

            if (data.error) {
                throw new Error(`Error desde API: ${data.error}`);
            }

            // 4. Mostrar datos en la tabla (usando la función adaptada)
            // Pasamos los elementos DOM como argumentos para claridad
            mostrarDatosAdaptado(data.datos, tipo, tablaDatos, errorContainer);

            // 5. Si son KPIs y hay datos, mostrar el gráfico (usando la función adaptada)
            if (tipo === 'kpi' && data.datos && data.datos.length > 0) {
                mostrarGraficoKPIAdaptado(data.datos, kpiChartCanvas, chartContainer);
            }
        })
        .catch(err => {
            console.error(`Catch - Error al cargar ${tipo}:`, err);
            loader.style.display = 'none'; // Ocultar loader en caso de error
            // Mostrar error en el contenedor de errores
            errorContainer.innerHTML = `<div class="error-message">❌ Error al cargar datos: ${err.message}</div>`;
            // Asegurar que tabla y gráfico estén ocultos
            tablaDatos.style.display = 'none';
            chartContainer.style.display = 'none';
        });
}

// Función para mostrar datos en tabla (adaptada del primer script)
function mostrarDatosAdaptado(datos, tipo, tablaElement, errorElement) {
    console.log(`script.js: mostrarDatosAdaptado(${tipo}) llamada.`);

    // Limpiar errores previos y asegurar que la tabla esté visible (si hay datos)
    errorElement.innerHTML = '';

    // Si no hay datos o no es un array, mostrar mensaje informativo
    if (!Array.isArray(datos) || datos.length === 0) {
        // Usamos el contenedor de errores para mostrar el mensaje de info
        errorElement.innerHTML = "<div class='info-message'>ℹ️ No hay datos disponibles para mostrar.</div>";
        tablaElement.style.display = 'none'; // Ocultar la tabla si no hay datos
        return;
    }

    // Calcular proporción del mes (lógica del primer script)
    const hoy = new Date();
    const diaActual = hoy.getDate();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    const diasTotalesMes = new Date(anioActual, mesActual + 1, 0).getDate();
    const proporcionMes = diasTotalesMes > 0 ? diaActual / diasTotalesMes : 0;
    console.log(`Proporción del mes calculada: ${proporcionMes.toFixed(2)}`);

    // Construir HTML de la tabla (lógica del primer script)
    let html = "<thead><tr>";
    if (tipo === "kpi") {
        html += "<th>KPI</th><th>Meta (100%)</th><th>125%</th><th>70%</th><th>Resultado Actual</th><th>Arrastre</th><th>Total</th>";
    } else { // tipo === "faltantes"
        html += "<th>KPI</th><th>Faltante 100%</th><th>Faltante 150%</th><th>Faltante 250%</th>";
    }
    html += "</tr></thead><tbody>";

    datos.forEach(fila => {
        html += "<tr>";
        if (tipo === "kpi") {
            const metaKPI = parseFloat(fila.valor100);
            const resultadoActual = parseFloat(fila.resultado);
            let claseExtraResultado = '';
            if (!isNaN(metaKPI) && metaKPI > 0 && !isNaN(resultadoActual)) {
                const resultadoEsperadoHoy = metaKPI * proporcionMes;
                if (resultadoActual < resultadoEsperadoHoy) {
                    claseExtraResultado = 'kpi-atrasado'; // ¡Aplicar la clase CSS!
                }
            }
            html += `<td>${fila.kpi || '-'}</td>`;
            html += `<td>${formatNumber(fila.valor100)}</td>`;
            html += `<td>${formatNumber(fila.valor125)}</td>`;
            html += `<td>${formatNumber(fila.valor70)}</td>`;
            html += `<td class="${claseExtraResultado}">${formatNumber(fila.resultado)}</td>`; // Celda con posible clase
            html += `<td>${formatNumber(fila.arrastre)}</td>`;
            html += `<td>${formatNumber(fila.total)}</td>`;
        } else { // tipo === "faltantes"
            html += `<td>${fila.kpi || '-'}</td>`;
            html += `<td>${formatNumber(fila.faltante100)}</td>`;
            html += `<td>${formatNumber(fila.faltante150)}</td>`;
            html += `<td>${formatNumber(fila.faltante250)}</td>`;
        }
        html += "</tr>";
    });

    html += "</tbody>";
    tablaElement.innerHTML = html; // Insertar en el elemento tabla correcto
    tablaElement.style.display = 'table'; // Asegurar que la tabla sea visible
    console.log("Tabla populada exitosamente.");
}

// Función auxiliar para formatear números (del primer script)
function formatNumber(value) {
    if (value === null || typeof value === 'undefined') return '-';
    if (typeof value === 'number') {
        return value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    // Manejar strings que podrían ser números con formato (ej: "$1,234.56")
    if (typeof value === 'string') {
        const num = parseFloat(value.replace(/[^0-9.,-]+/g, '').replace('.', '').replace(',', '.'));
        if (!isNaN(num)) {
            return num.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        }
    }
    return value; // Devuelve como string si no es número convertible
}

// Función para mostrar gráfico (adaptada del primer script)
function mostrarGraficoKPIAdaptado(datosKPI, canvasElement, chartContainerElement) {
    console.log("script.js: mostrarGraficoKPIAdaptado() llamada.");
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
        console.error("No se pudo obtener el contexto del canvas para el gráfico.");
        // Mostrar error en el contenedor de errores
        if(errorContainer) errorContainer.innerHTML = `<div class="error-message">❌ Error al inicializar gráfico.</div>`;
        return;
    }

    // Preparar datos (lógica del primer script)
    const labels = datosKPI.map(item => item.kpi || 'Sin nombre');
    const dataResultados = datosKPI.map(item => parseFloat(item.resultado) || 0);
    const dataTotales = datosKPI.map(item => parseFloat(item.total) || 0);

    // Mostrar el contenedor del gráfico
    chartContainerElement.style.display = 'block';

    // Crear la instancia del gráfico (lógica del primer script con dos ejes)
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
              {
                label: 'Resultado Actual',
                data: dataResultados,
                backgroundColor: 'rgba(40, 167, 69, 0.6)', // Verde
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1,
                yAxisID: 'yValuesPrimary' // Eje izquierdo
              },
              {
                  label: 'Total',
                  data: dataTotales,
                  backgroundColor: 'rgba(0, 123, 255, 0.6)', // Azul
                  borderColor: 'rgba(0, 123, 255, 1)',
                  borderWidth: 1,
                  yAxisID: 'yValuesSecondary' // Eje derecho
              }
          ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                 x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 30 } },
                 yValuesPrimary: { // Eje Y izquierdo (Resultado)
                    type: 'linear', position: 'left', beginAtZero: true,
                    title: { display: true, text: 'Resultado Actual' },
                    grid: { drawOnChartArea: true }
                 },
                 yValuesSecondary: { // Eje Y derecho (Total)
                    type: 'linear', position: 'right', beginAtZero: true,
                    title: { display: true, text: 'Total' },
                    grid: { drawOnChartArea: false } // No superponer rejillas
                 }
            },
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { mode: 'index', intersect: false }
            }
        }
    });
    console.log("Gráfico KPI creado/actualizado exitosamente.");
}


// --- FUNCIONES AUXILIARES DEL SEGUNDO SCRIPT (sin cambios) ---

// Muestra una sección principal por ID y oculta las demás
function showSection(sectionIdToShow) {
    console.log(`script.js: showSection llamada para '${sectionIdToShow}'`);
    const sections = [
        kpiContentSection, ofertasFlashSection, enlacesExternosSection,
        tablaRemuneracionSection, politicasVentasSection
    ];
    let sectionFound = false;
    sections.forEach(section => {
        if (section) {
            if (section.id === sectionIdToShow) {
                section.style.display = 'block';
                sectionFound = true;
                console.log(`script.js: Mostrando sección '${section.id}'`);
            } else {
                section.style.display = 'none';
            }
        } else {
             console.warn(`script.js: Referencia a sección es null/undefined en showSection.`);
        }
    });
     if (!sectionFound) {
         console.error(`script.js: No se encontró el elemento de sección con ID '${sectionIdToShow}'.`);
     }
}

// --- INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO (Adaptado del segundo script) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js: DOMContentLoaded evento disparado.");

    // Asignar referencias DOM (IDs del segundo HTML)
    navLinks = document.getElementById('nav-links');
    hamburgerBtn = document.getElementById('hamburger-btn');
    kpiContentSection = document.getElementById('kpi-content');
    ofertasFlashSection = document.getElementById('ofertas-flash');
    enlacesExternosSection = document.getElementById('enlaces-externos');
    tablaRemuneracionSection = document.getElementById('tabla-remuneracion');
    politicasVentasSection = document.getElementById('politicas-ventas');
    // Elementos dentro de kpi-content
    tablaContainer = document.getElementById('tabla-container');
    loader = document.getElementById('loader');
    tablaDatos = document.getElementById('tablaDatos');
    errorContainer = document.getElementById('error-container');
    chartContainer = document.getElementById('chart-container');
    kpiChartCanvas = document.getElementById('kpiChart');

    // Verificar referencias esenciales
    const elementsToCheck = {
        navLinks, hamburgerBtn, kpiContentSection, tablaContainer, loader, tablaDatos, errorContainer, chartContainer, kpiChartCanvas
        // No incluimos las otras secciones como 'críticas' aquí
    };
    let criticalElementsFound = true;
    for (const key in elementsToCheck) {
        if (!elementsToCheck[key]) {
            console.error(`script.js: ¡Error crítico! Elemento DOM esencial con ID '${key}' no encontrado.`);
            criticalElementsFound = false;
        }
    }

    if (!criticalElementsFound) {
         alert("Error crítico: No se pudieron encontrar elementos esenciales en la página (navbar, contenedor kpi, tabla, etc.). Funcionalidad limitada.");
         return; // Detener si falta algo crítico
    } else {
        console.log("script.js: Referencias DOM esenciales obtenidas.");
    }

    // Configurar listener para hamburguesa
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle(NAV_ACTIVE_CLASS);
            hamburgerBtn.setAttribute('aria-expanded', navLinks.classList.contains(NAV_ACTIVE_CLASS));
        });
    }
    // --- INICIO: Listener para Dropdowns en Móvil ---
    const dropdownToggles = document.querySelectorAll('.dropdown > a'); // Selecciona los enlaces directos dentro de .dropdown

    if (dropdownToggles.length > 0 && navLinks) { // Asegúrate que existen toggles y navLinks
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (event) => {
                // Solo actuar si el menú móvil está activo
                if (navLinks.classList.contains(NAV_ACTIVE_CLASS)) {
                    // Prevenir navegación si es un enlace tipo #
                    if (toggle.getAttribute('href') === '#') {
                         event.preventDefault();
                    }

                    const parentDropdown = toggle.closest('.dropdown'); // Encuentra el <li> padre .dropdown

                    if (parentDropdown) {
                        // Alternar la clase 'open' en el <li> padre
                        parentDropdown.classList.toggle('open');

                        // Opcional: Cerrar otros submenús que puedan estar abiertos
                        document.querySelectorAll('.dropdown.open').forEach(otherDropdown => {
                            if (otherDropdown !== parentDropdown) {
                                otherDropdown.classList.remove('open');
                            }
                        });
                    }

                    // Detener la propagación para no cerrar el menú principal accidentalmente
                    event.stopPropagation();
                }
                // Si el menú móvil NO está activo, el comportamiento por defecto del enlace funcionará
                // y el :hover del CSS se encargará en la vista de escritorio.
            });
        });
        console.log("script.js: Listeners para dropdowns móviles configurados.");
    } else {
        console.warn("script.js: No se encontraron elementos '.dropdown > a' o 'navLinks' para configurar los listeners de submenús móviles.");
    }
    // --- FIN: Listener para Dropdowns en Móvil ---

    // Estado Inicial: Mostrar KPIs por defecto (esto ya estaba)
    console.log("script.js: Llamando a mostrarKPIs() por defecto al cargar.");
    mostrarKPIs();

    console.log("script.js: Inicialización post-DOM completa.");
}); // Fin de DOMContentLoaded
    // Estado Inicial: Mostrar KPIs por defecto
    console.log("script.js: Llamando a mostrarKPIs() por defecto al cargar.");
    mostrarKPIs(); // Esto llamará a cargarDatosAdaptado("kpi")

    console.log("script.js: Inicialización post-DOM completa.");
}); // Fin de DOMContentLoaded

console.log("script.js: Fin del archivo alcanzado.");
