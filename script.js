// script.js
console.log("script.js: Empezando a ejecutar.");

// --- URL de Google Apps Script ---
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9UyKr-UcWOCvrMGCsgvc38_-HmKZpXjlj9THbGLNK0lhLJ7B-_RSVpxFpP76eWjeP/exec';

// --- Referencias a elementos DOM ---
let navLinks, hamburgerBtn;
let kpiContentSection, ofertasFlashSection, enlacesExternosSection, tablaRemuneracionSection, politicasVentasSection;
let tablaContainer, loader, tablaDatos, errorContainer, chartContainer, kpiChartCanvas;
let currentChart = null;

// --- Constantes ---
const NAV_ACTIVE_CLASS = 'active';

// --- FUNCIONES GLOBALES PARA onclick (llamadas desde HTML) ---
function mostrarKPIs() {
    console.log("script.js: mostrarKPIs() llamada.");
    showSection('kpi-content');
    cargarDatosAdaptado("kpi");
}

function mostrarFaltantes() {
    console.log("script.js: mostrarFaltantes() llamada.");
    showSection('kpi-content');
    cargarDatosAdaptado("faltantes");
}

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

// Función para cerrar el menú móvil
function closeMobileMenu() {
    if (navLinks && navLinks.classList.contains(NAV_ACTIVE_CLASS)) {
        console.log("script.js: closeMobileMenu() llamada.");
        navLinks.classList.remove(NAV_ACTIVE_CLASS);
        if(hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
        // Cerrar también dropdowns abiertos al cerrar el menú
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }
}

// --- FUNCIONES DE CARGA DE DATOS Y GRÁFICOS ---

function cargarDatosAdaptado(tipo) {
    console.log(`script.js: cargarDatosAdaptado(${tipo}) llamada.`);
    if (!tablaContainer || !loader || !errorContainer || !chartContainer || !kpiChartCanvas || !tablaDatos) {
        console.error("Error crítico: Faltan elementos DOM necesarios para cargar datos.");
        if (errorContainer) errorContainer.innerHTML = '<div class="error-message">Error interno: No se pueden cargar los datos. Falta un componente de la página.</div>';
        else alert("Error crítico: Faltan elementos en la página.");
        return;
    }

    loader.style.display = 'flex';
    tablaDatos.innerHTML = '';
    tablaDatos.style.display = 'none';
    errorContainer.innerHTML = '';
    chartContainer.style.display = 'none';
    if (currentChart) {
        console.log("Destruyendo gráfico anterior.");
        currentChart.destroy();
        currentChart = null;
    }

    fetch(`${APPS_SCRIPT_URL}?tipo=${tipo}`)
        .then(res => {
            console.log(`Fetch ${tipo} - Respuesta:`, res.status);
            if (!res.ok) return res.text().then(text => { throw new Error(`Error HTTP ${res.status}: ${res.statusText}. Respuesta: ${text}`); });
            return res.json();
        })
        .then(data => {
            console.log(`Datos ${tipo} JSON:`, data);
            loader.style.display = 'none';
            if (data.error) throw new Error(`Error API: ${data.error}`);
            mostrarDatosAdaptado(data.datos, tipo, tablaDatos, errorContainer);
            if (tipo === 'kpi' && data.datos && data.datos.length > 0) {
                mostrarGraficoKPIAdaptado(data.datos, kpiChartCanvas, chartContainer);
            }
        })
        .catch(err => {
            console.error(`Catch - Error al cargar ${tipo}:`, err);
            loader.style.display = 'none';
            errorContainer.innerHTML = `<div class="error-message">❌ Error al cargar datos: ${err.message}</div>`;
            tablaDatos.style.display = 'none';
            chartContainer.style.display = 'none';
        });
}

function mostrarDatosAdaptado(datos, tipo, tablaElement, errorElement) {
    console.log(`script.js: mostrarDatosAdaptado(${tipo}) llamada.`);
    errorElement.innerHTML = '';
    if (!Array.isArray(datos) || datos.length === 0) {
        errorElement.innerHTML = "<div class='info-message'>ℹ️ No hay datos disponibles.</div>";
        tablaElement.style.display = 'none';
        return;
    }

    const hoy = new Date(), diaActual = hoy.getDate(), mesActual = hoy.getMonth(), anioActual = hoy.getFullYear();
    const diasTotalesMes = new Date(anioActual, mesActual + 1, 0).getDate();
    const proporcionMes = diasTotalesMes > 0 ? diaActual / diasTotalesMes : 0;
    console.log(`Proporción mes: ${proporcionMes.toFixed(2)}`);

    let html = "<thead><tr>";
    if (tipo === "kpi") html += "<th>KPI</th><th>Meta(100%)</th><th>125%</th><th>70%</th><th>Resultado</th><th>Arrastre</th><th>Total</th>";
    else html += "<th>KPI</th><th>Faltante 100%</th><th>Faltante 150%</th><th>Faltante 250%</th>";
    html += "</tr></thead><tbody>";

    datos.forEach(fila => {
        html += "<tr>";
        if (tipo === "kpi") {
            const metaKPI = parseFloat(fila.valor100), resultadoActual = parseFloat(fila.resultado);
            let claseExtraResultado = '';
            if (!isNaN(metaKPI) && metaKPI > 0 && !isNaN(resultadoActual)) {
                if (resultadoActual < (metaKPI * proporcionMes)) claseExtraResultado = 'kpi-atrasado';
            }
            html += `<td>${fila.kpi || '-'}</td><td>${formatNumber(fila.valor100)}</td><td>${formatNumber(fila.valor125)}</td><td>${formatNumber(fila.valor70)}</td>`;
            html += `<td class="${claseExtraResultado}">${formatNumber(fila.resultado)}</td><td>${formatNumber(fila.arrastre)}</td><td>${formatNumber(fila.total)}</td>`;
        } else {
            html += `<td>${fila.kpi || '-'}</td><td>${formatNumber(fila.faltante100)}</td><td>${formatNumber(fila.faltante150)}</td><td>${formatNumber(fila.faltante250)}</td>`;
        }
        html += "</tr>";
    });

    html += "</tbody>";
    tablaElement.innerHTML = html;
    tablaElement.style.display = 'table';
    console.log("Tabla populada.");
}

function formatNumber(value) {
    if (value === null || typeof value === 'undefined') return '-';
    if (typeof value === 'number') return value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    if (typeof value === 'string') {
        const num = parseFloat(value.replace(/[^0-9.,-]+/g, '').replace('.', '').replace(',', '.'));
        if (!isNaN(num)) return num.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
    return value;
}

function mostrarGraficoKPIAdaptado(datosKPI, canvasElement, chartContainerElement) {
    console.log("script.js: mostrarGraficoKPIAdaptado() llamada.");
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
        console.error("No se pudo obtener contexto canvas.");
        if(errorContainer) errorContainer.innerHTML = `<div class="error-message">❌ Error al inicializar gráfico.</div>`;
        return;
    }

    const labels = datosKPI.map(item => item.kpi || 'Sin nombre');
    const dataResultados = datosKPI.map(item => parseFloat(item.resultado) || 0);
    const dataTotales = datosKPI.map(item => parseFloat(item.total) || 0);

    chartContainerElement.style.display = 'block';

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [
              { label: 'Resultado Actual', data: dataResultados, backgroundColor: 'rgba(40, 167, 69, 0.6)', borderColor: 'rgba(40, 167, 69, 1)', borderWidth: 1, yAxisID: 'yValuesPrimary' },
              { label: 'Total', data: dataTotales, backgroundColor: 'rgba(0, 123, 255, 0.6)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1, yAxisID: 'yValuesSecondary' } ] },
        options: { responsive: true, maintainAspectRatio: false,
            scales: {
                 x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 30 } },
                 yValuesPrimary: { type: 'linear', position: 'left', beginAtZero: true, title: { display: true, text: 'Resultado Actual' }, grid: { drawOnChartArea: true } },
                 yValuesSecondary: { type: 'linear', position: 'right', beginAtZero: true, title: { display: true, text: 'Total' }, grid: { drawOnChartArea: false } } },
            plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false } } }
    });
    console.log("Gráfico KPI creado/actualizado.");
}

// --- FUNCIONES AUXILIARES ---

function showSection(sectionIdToShow) {
    console.log(`script.js: showSection '${sectionIdToShow}'`);
    const sections = [kpiContentSection, ofertasFlashSection, enlacesExternosSection, tablaRemuneracionSection, politicasVentasSection];
    let sectionFound = false;
    sections.forEach(section => {
        if (section) {
            if (section.id === sectionIdToShow) { section.style.display = 'block'; sectionFound = true; }
            else section.style.display = 'none';
        } else console.warn(`Referencia sección null en showSection.`);
    });
     if (!sectionFound) console.error(`No se encontró sección ID '${sectionIdToShow}'.`);
}

// ========================================================================
// ===== INICIO: EJECUCIÓN CUANDO EL DOM ESTÁ LISTO ========================
// ========================================================================
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
    tablaContainer = document.getElementById('tabla-container');
    loader = document.getElementById('loader');
    tablaDatos = document.getElementById('tablaDatos');
    errorContainer = document.getElementById('error-container');
    chartContainer = document.getElementById('chart-container');
    kpiChartCanvas = document.getElementById('kpiChart');

    // --- Verificar referencias esenciales ---
    const elementsToCheck = { navLinks, hamburgerBtn, kpiContentSection, tablaContainer, loader, tablaDatos, errorContainer, chartContainer, kpiChartCanvas };
    let criticalElementsFound = true;
    for (const key in elementsToCheck) {
        if (!elementsToCheck[key]) {
            console.error(`¡Error crítico! Elemento DOM ID '${key}' no encontrado.`);
            criticalElementsFound = false;
        }
    }
    if (!criticalElementsFound) {
         alert("Error crítico: Faltan elementos esenciales. Funcionalidad limitada.");
         return;
    } else {
        console.log("script.js: Referencias DOM esenciales obtenidas.");
    }

    // --- Listener para hamburguesa (touchstart) ---
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('touchstart', (event) => {
             console.log("Hamburguesa touchstart INICIADO"); // LOG DE DEBUG
            event.preventDefault();
            navLinks.classList.toggle(NAV_ACTIVE_CLASS);
            hamburgerBtn.setAttribute('aria-expanded', navLinks.classList.contains(NAV_ACTIVE_CLASS));
            if (!navLinks.classList.contains(NAV_ACTIVE_CLASS)) { // Si se cierra el menú
                document.querySelectorAll('.dropdown.open').forEach(dropdown => {
                    dropdown.classList.remove('open'); // Cerrar submenús
                });
            }
        }, { passive: false });
        console.log("script.js: Listener 'touchstart' para hamburguesa configurado.");
    }

    // --- Listener para Dropdowns en Móvil (touchstart CON LOGS) ---
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    if (dropdownToggles.length > 0 && navLinks) {
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('touchstart', (event) => {
                console.log("Dropdown touchstart INICIADO en:", event.target); // LOG 1
                if (navLinks.classList.contains(NAV_ACTIVE_CLASS)) {
                    console.log("Menú móvil ACTIVO. Procesando toque."); // LOG 2
                    event.preventDefault();
                    const parentDropdown = toggle.closest('.dropdown');
                    if (parentDropdown) {
                        console.log("Elemento padre encontrado:", parentDropdown); // LOG 3
                        console.log("Clases ANTES:", parentDropdown.className); // LOG 3.1
                        parentDropdown.classList.toggle('open');
                        console.log("Clases DESPUÉS:", parentDropdown.className); // LOG 4
                        // Cerrar otros dropdowns
                        document.querySelectorAll('.dropdown.open').forEach(otherDropdown => {
                            if (otherDropdown !== parentDropdown) otherDropdown.classList.remove('open');
                        });
                    } else {
                        console.error("¡No se encontró el elemento padre .dropdown!");
                    }
                    event.stopPropagation();
                } else {
                     console.log("Menú móvil INACTIVO. No se procesa toque dropdown."); // LOG 5
                }
            }, { passive: false });
        });
        console.log("script.js: Listeners 'touchstart' con LOGS para dropdowns móviles configurados.");
    } else {
        console.warn("script.js: No se encontraron elementos '.dropdown > a' o 'navLinks' para configurar listeners de submenús móviles.");
    }

    // --- Llamadas al hacer clic en enlaces del menú (para cerrar menú móvil) ---
     if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
                // Si el enlace NO es de un dropdown O si es un enlace final dentro de un dropdown
                const parentDropdown = link.closest('.dropdown');
                const isDropdownToggle = parentDropdown && parentDropdown.querySelector('a') === link;

                // Solo cerrar el menú si NO es un toggle de dropdown en móvil
                // O si es un enlace final (que no sea toggle)
                if (!isDropdownToggle || (parentDropdown && !isDropdownToggle)) {
                     // Si es un enlace que no sea #, permite la navegación antes de cerrar
                     if (link.getAttribute('href') !== '#') {
                         // Pequeña demora para permitir navegación o llamada a función antes de cerrar
                         setTimeout(closeMobileMenu, 100);
                     } else {
                         // Si es solo # (como los toggles), cierra inmediatamente si no es un toggle
                         if(!isDropdownToggle) closeMobileMenu();
                     }
                }
                // No usamos stopPropagation aquí para permitir que las funciones onclick del HTML se ejecuten
            });
        });
        console.log("Listeners 'click' en enlaces para cerrar menú móvil configurados.");
    }


    // --- Estado Inicial: Mostrar KPIs por defecto ---
    console.log("script.js: Llamando a mostrarKPIs() por defecto al cargar.");
    mostrarKPIs(); // Esto llamará a cargarDatosAdaptado("kpi")

    console.log("script.js: Inicialización post-DOM completa.");
}); // Fin de DOMContentLoaded
// ========================================================================
// ===== FIN: EJECUCIÓN CUANDO EL DOM ESTÁ LISTO ==========================
// ========================================================================

console.log("script.js: Fin del archivo alcanzado.");
