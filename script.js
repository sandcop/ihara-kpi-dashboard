// script.js

// --- URL de tu Web App Desplegada ---
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9UyKr-UcWOCvrMGCsgvc38_-HmKZpXjlj9THbGLNK0lhLJ7B-_RSVpxFpP76eWjeP/exec';

// --- Referencias a elementos del DOM (Obtenidas después de que el DOM cargue) ---
let tablaContainer, chartContainer, loader, tablaDatos, kpiChartCanvas, errorContainer;
let miGrafico = null; // Variable para guardar la instancia del gráfico globalmente

// --- FUNCIONES LLAMADAS POR LOS BOTONES (DEFINIDAS GLOBALMENTE) ---

function mostrarKPIs() {
    console.log("Función mostrarKPIs() llamada."); // Log para confirmar que la función se llama
    if (!loader) { // Asegurarse que las refs DOM estén listas
        console.error("DOM aún no cargado completamente para mostrarKPIs.");
        return;
    }
    limpiarContenido();
    loader.style.display = 'block'; // Muestra el loader

    fetch(`${APPS_SCRIPT_URL}?action=kpis`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                   // Intenta parsear el texto como JSON por si GAS devolvió un error JSON
                   try {
                       const errData = JSON.parse(text);
                       if (errData && errData.error) {
                           throw new Error(`Error desde Apps Script: ${errData.error} (Status: ${response.status})`);
                       }
                   } catch (e) { /* No era JSON, usar el texto plano */ }
                   throw new Error(`Error HTTP ${response.status}: ${response.statusText}. Respuesta: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data && data.error) { // Verificar error JSON incluso en respuesta OK
                throw new Error(`Error reportado por Apps Script: ${data.error}`);
            }
            console.log("Datos KPIs recibidos:", data);
            loader.style.display = 'none';
            tablaContainer.style.display = 'block';
            tablaDatos.style.display = 'table';
            chartContainer.style.display = 'block'; // Muestra el contenedor del gráfico
            kpiChartCanvas.style.display = 'block'; // Muestra el canvas en sí
            popularTablaKPIs(data);
            actualizarGraficoKPIs(data);
        })
        .catch(error => {
            console.error("Error al obtener KPIs:", error);
            mostrarError(`Error al cargar KPIs: ${error.message}`);
        });
}

function mostrarFaltantes() {
    console.log("Función mostrarFaltantes() llamada."); // Log para confirmar
     if (!loader) {
        console.error("DOM aún no cargado completamente para mostrarFaltantes.");
        return;
    }
    limpiarContenido();
    loader.style.display = 'block';

    fetch(`${APPS_SCRIPT_URL}?action=faltantes`)
        .then(response => {
            if (!response.ok) {
                 return response.text().then(text => {
                   try {
                       const errData = JSON.parse(text);
                       if (errData && errData.error) {
                           throw new Error(`Error desde Apps Script: ${errData.error} (Status: ${response.status})`);
                       }
                   } catch (e) { /* No era JSON */ }
                   throw new Error(`Error HTTP ${response.status}: ${response.statusText}. Respuesta: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data && data.error) {
                throw new Error(`Error reportado por Apps Script: ${data.error}`);
            }
            console.log("Datos Faltantes recibidos:", data);
            loader.style.display = 'none';
            tablaContainer.style.display = 'block';
            tablaDatos.style.display = 'table';
            popularTablaFaltantes(data);
        })
        .catch(error => {
            console.error("Error al obtener Faltantes:", error);
            mostrarError(`Error al cargar Faltantes: ${error.message}`);
        });
}

// --- FUNCIONES AUXILIARES ---

function limpiarContenido() {
    if (tablaDatos) tablaDatos.innerHTML = '';
    if (tablaDatos) tablaDatos.style.display = 'none';
    if (chartContainer) chartContainer.style.display = 'none'; // Ocultar contenedor del gráfico
    if (kpiChartCanvas) kpiChartCanvas.style.display = 'none'; // Ocultar el canvas
    if (loader) loader.style.display = 'none';
    if (tablaContainer) tablaContainer.style.display = 'none'; // Ocultar contenedor principal de tabla
    if (errorContainer) errorContainer.innerHTML = ''; // Limpiar errores previos
}

function mostrarError(mensaje) {
    console.error("Mostrando Error:", mensaje); // Loguear el error también
    if (loader) loader.style.display = 'none';
    if (tablaContainer) tablaContainer.style.display = 'block'; // Mostrar contenedor para el error
    if (tablaDatos) tablaDatos.style.display = 'none';
    if (chartContainer) chartContainer.style.display = 'none';

    if (errorContainer) {
        errorContainer.innerHTML = `<div style="color: red; background-color: #ffebee; border: 1px solid red; padding: 15px; margin-top: 10px; border-radius: 5px; font-weight: bold;">${mensaje}</div>`;
    } else {
        // Fallback si errorContainer no está listo (poco probable con DOMContentLoaded)
        alert("Error: " + mensaje);
    }
}

function popularTablaKPIs(datosKPI) {
    if (!tablaDatos) return;
    // ASUME que datosKPI es un array de objetos con {indicador, valor, meta, estado}
    let tablaHTML = `<thead><tr><th>Indicador</th><th>Valor</th><th>Meta</th><th>Estado</th></tr></thead><tbody>`;
    if (Array.isArray(datosKPI) && datosKPI.length > 0) {
        datosKPI.forEach(kpi => {
            tablaHTML += `
                <tr>
                    <td>${kpi.indicador ?? 'N/A'}</td>
                    <td>${kpi.valor ?? 'N/A'}</td>
                    <td>${kpi.meta ?? 'N/A'}</td>
                    <td>${kpi.estado ?? 'N/A'}</td>
                </tr>`;
        });
    } else {
        tablaHTML += '<tr><td colspan="4">No se encontraron datos de KPIs válidos.</td></tr>';
    }
    tablaHTML += `</tbody>`;
    tablaDatos.innerHTML = tablaHTML;
}

function popularTablaFaltantes(datosFaltantes) {
    if (!tablaDatos) return;
    // ASUME que datosFaltantes es array de objetos con {item, codigo, cantidad, proveedor, fechaEstimada}
     let tablaHTML = `<thead><tr><th>Ítem</th><th>Código</th><th>Cantidad Faltante</th><th>Proveedor</th><th>Fecha Estimada</th></tr></thead><tbody>`;
    if (Array.isArray(datosFaltantes) && datosFaltantes.length > 0) {
        datosFaltantes.forEach(item => {
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
         tablaHTML += '<tr><td colspan="5">No se encontraron datos de Faltantes válidos.</td></tr>';
    }
    tablaHTML += `</tbody>`;
    tablaDatos.innerHTML = tablaHTML;
}

function actualizarGraficoKPIs(datosKPI) {
    if (!miGrafico || !Array.isArray(datosKPI) || datosKPI.length === 0) {
       if(miGrafico) {
           miGrafico.data.labels = [];
           miGrafico.data.datasets[0].data = [];
           miGrafico.update();
       }
       console.log("Gráfico no actualizado por falta de datos válidos.");
       return;
    }
    // ASUME que kpi.indicador es la etiqueta y kpi.valor necesita ser convertido a número
    const labels = datosKPI.map(kpi => kpi.indicador ?? 'Sin Etiqueta');
    const data = datosKPI.map(kpi => {
        let rawValue = kpi.valor;
        let num = NaN; // Empezar como NaN
        if (typeof rawValue === 'string') {
            // Limpiar símbolos ($, %), comas de miles, y convertir a número de punto flotante
            // Manejar potencialmente diferentes formatos de miles/decimales si es necesario
            num = parseFloat(rawValue.replace(/[$,%]/g, '').replace(/,/g, ''));
        } else if (typeof rawValue === 'number') {
            num = rawValue;
        }
        return isNaN(num) ? 0 : num; // Si no es número válido, usar 0
    });

    miGrafico.data.labels = labels;
    miGrafico.data.datasets[0].data = data;
    miGrafico.data.datasets[0].label = 'Valor Actual KPI';
    miGrafico.update();
    console.log("Gráfico actualizado con datos KPI.");
}

function inicializarGrafico() {
    if (!kpiChartCanvas) return; // No intentar si el canvas no existe
    const ctx = kpiChartCanvas.getContext('2d');
    if (miGrafico) {
        miGrafico.destroy(); // Destruir instancia previa si existe
    }
    miGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Valor KPI',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            responsive: true,
            maintainAspectRatio: false, // Importante para ajustar al contenedor
             plugins: {
                title: {
                    display: true,
                    text: 'Resumen Gráfico KPIs'
                }
            }
        }
    });
    console.log("Gráfico inicializado.");
    // Ocultar el contenedor y el canvas al inicio hasta que haya datos
    if (chartContainer) chartContainer.style.display = 'none';
    if (kpiChartCanvas) kpiChartCanvas.style.display = 'none';
}

// --- INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente cargado y parseado.");

    // Obtener referencias a los elementos ahora que existen
    tablaContainer = document.getElementById('tabla-container');
    chartContainer = document.getElementById('chart-container');
    loader = document.getElementById('loader');
    tablaDatos = document.getElementById('tablaDatos');
    kpiChartCanvas = document.getElementById('kpiChart');
    errorContainer = document.getElementById('error-container'); // Obtener ref al contenedor de errores

    // Ocultar elementos inicialmente
    if(loader) loader.style.display = 'none';
    if(tablaContainer) tablaContainer.style.display = 'none'; // Ocultar al inicio
    if(chartContainer) chartContainer.style.display = 'none'; // Ocultar al inicio

    // Inicializar el gráfico una vez que el canvas existe
    inicializarGrafico();

    // Opcional: Cargar KPIs por defecto al inicio descomentando la siguiente línea
    // mostrarKPIs();
});

console.log("script.js cargado y parseado (definiciones globales listas).");
