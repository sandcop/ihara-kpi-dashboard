// script.js

// --- URL de tu Web App Desplegada ---
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9UyKr-UcWOCvrMGCsgvc38_-HmKZpXjlj9THbGLNK0lhLJ7B-_RSVpxFpP76eWjeP/exec';

// Referencias a elementos del DOM
const tablaContainer = document.getElementById('tabla-container');
const chartContainer = document.getElementById('chart-container');
const loader = document.getElementById('loader');
const tablaDatos = document.getElementById('tablaDatos');
const kpiChartCanvas = document.getElementById('kpiChart');

let miGrafico = null; // Variable para guardar la instancia del gráfico

// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarGrafico(); // Prepara el gráfico
    // Opcional: Cargar KPIs por defecto al iniciar
    // mostrarKPIs();
});

// --- Funciones llamadas por los botones ---

function mostrarKPIs() {
    console.log("Solicitando KPIs desde Apps Script:", APPS_SCRIPT_URL);
    limpiarContenido();
    loader.style.display = 'block'; // Muestra el loader

    // Llama a la Web App usando fetch para obtener KPIs
    fetch(`${APPS_SCRIPT_URL}?action=kpis`)
        .then(response => {
            if (!response.ok) {
                // Intenta obtener más detalles del error si es posible
                return response.text().then(text => {
                   throw new Error(`Error ${response.status}: ${response.statusText}. Respuesta: ${text}`);
                });
            }
            return response.json(); // Convierte la respuesta a JSON
        })
        .then(data => {
            // Verifica si Apps Script devolvió un error en la estructura JSON esperada
            if (data && data.error) {
                throw new Error(`Error desde Apps Script: ${data.error}`);
            }
            console.log("Datos KPIs recibidos:", data);
            loader.style.display = 'none'; // Oculta el loader
            tablaContainer.style.display = 'block';
            tablaDatos.style.display = 'table';
            chartContainer.style.display = 'block';
            popularTablaKPIs(data); // Pasa los datos reales
            actualizarGraficoKPIs(data); // Pasa los datos reales
        })
        .catch(error => {
            console.error("Error al obtener KPIs:", error);
            mostrarError(`Error al cargar KPIs: ${error.message}`); // Muestra error al usuario
        });
}

function mostrarFaltantes() {
    console.log("Solicitando Faltantes desde Apps Script:", APPS_SCRIPT_URL);
    limpiarContenido();
    loader.style.display = 'block'; // Muestra el loader

     // Llama a la Web App usando fetch para obtener Faltantes
    fetch(`${APPS_SCRIPT_URL}?action=faltantes`)
        .then(response => {
             if (!response.ok) {
                // Intenta obtener más detalles del error si es posible
                return response.text().then(text => {
                   throw new Error(`Error ${response.status}: ${response.statusText}. Respuesta: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
             if (data && data.error) {
                throw new Error(`Error desde Apps Script: ${data.error}`);
            }
            console.log("Datos Faltantes recibidos:", data);
            loader.style.display = 'none'; // Oculta el loader
            tablaContainer.style.display = 'block';
            tablaDatos.style.display = 'table';
            popularTablaFaltantes(data); // Pasa los datos reales
        })
        .catch(error => {
            console.error("Error al obtener Faltantes:", error);
            mostrarError(`Error al cargar Faltantes: ${error.message}`); // Muestra error al usuario
        });
}

// --- Funciones Auxiliares ---

function limpiarContenido() {
    tablaDatos.innerHTML = ''; // Limpia el contenido de la tabla
    tablaDatos.style.display = 'none'; // Oculta la tabla
    chartContainer.style.display = 'none'; // Oculta el gráfico
    loader.style.display = 'none'; // Oculta el loader por si acaso
    tablaContainer.style.display = 'none'; // Oculta el contenedor de tabla
    // Limpiar mensaje de error si lo hubiera
    const errorDiv = document.getElementById('error-message');
    if(errorDiv) {
        errorDiv.remove();
    }
}

function mostrarError(mensaje) {
    loader.style.display = 'none'; // Asegúrate que el loader esté oculto
    tablaContainer.style.display = 'block'; // Muestra el contenedor para poner el error
    tablaDatos.style.display = 'none'; // Oculta la tabla
    chartContainer.style.display = 'none'; // Oculta el gráfico

    // Crear y mostrar el mensaje de error (si no existe ya uno)
    if(!document.getElementById('error-message')) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.backgroundColor = '#ffebee'; // Fondo rojo claro
        errorDiv.style.border = '1px solid red';
        errorDiv.style.padding = '15px';
        errorDiv.style.marginTop = '10px';
        errorDiv.style.borderRadius = '5px';
        errorDiv.style.fontWeight = 'bold';
        errorDiv.textContent = mensaje;
        // Insertar el mensaje de error dentro del contenedor de la tabla, antes de la tabla (o loader)
        tablaContainer.insertBefore(errorDiv, tablaContainer.firstChild);
    }
}


function inicializarGrafico() {
    // (Sin cambios)
    if (miGrafico) {
        miGrafico.destroy();
    }
    const ctx = kpiChartCanvas.getContext('2d');
    miGrafico = new Chart(ctx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Valor KPI', data: [], backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 }] },
        options: { scales: { y: { beginAtZero: true } }, responsive: true, maintainAspectRatio: false }
    });
}

function popularTablaKPIs(datosKPI) {
    // --- ¡¡IMPORTANTE!! ---
    // Esta función ASUME que 'datosKPI' es un ARRAY DE OBJETOS,
    // y que cada objeto tiene propiedades llamadas 'indicador', 'valor', 'meta', 'estado'.
    // SI TU APPS SCRIPT DEVUELVE UNA ESTRUCTURA DIFERENTE (p.ej., un array 2D o nombres diferentes),
    // NECESITAS AJUSTAR EL CÓDIGO DENTRO DEL BUCLE forEach.
    //-----------------------

    let tablaHTML = `
        <thead>
            <tr>
                <th>Indicador</th>
                <th>Valor</th>
                <th>Meta</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>`;

    if (Array.isArray(datosKPI) && datosKPI.length > 0) {
        datosKPI.forEach(kpi => {
            // Accede a las propiedades del objeto kpi. Ajusta los nombres si es necesario.
            tablaHTML += `
                <tr>
                    <td>${kpi.indicador || 'N/A'}</td>
                    <td>${kpi.valor || 'N/A'}</td>
                    <td>${kpi.meta || 'N/A'}</td>
                    <td>${kpi.estado || 'N/A'}</td>
                </tr>`;
        });
    } else {
        tablaHTML += '<tr><td colspan="4">No se encontraron datos de KPIs o el formato es incorrecto.</td></tr>';
    }

    tablaHTML += `</tbody>`;
    tablaDatos.innerHTML = tablaHTML;
}

function popularTablaFaltantes(datosFaltantes) {
     // --- ¡¡IMPORTANTE!! ---
    // Esta función ASUME que 'datosFaltantes' es un ARRAY DE OBJETOS,
    // y que cada objeto tiene propiedades: 'item', 'codigo', 'cantidad', 'proveedor', 'fechaEstimada'.
    // SI TU APPS SCRIPT DEVUELVE UNA ESTRUCTURA DIFERENTE, AJUSTA EL CÓDIGO.
    //-----------------------

     let tablaHTML = `
        <thead>
            <tr>
                <th>Ítem</th>
                <th>Código</th>
                <th>Cantidad Faltante</th>
                <th>Proveedor</th>
                <th>Fecha Estimada</th>
            </tr>
        </thead>
        <tbody>`;

    if (Array.isArray(datosFaltantes) && datosFaltantes.length > 0) {
        datosFaltantes.forEach(item => {
            // Accede a las propiedades del objeto item. Ajusta los nombres si es necesario.
            tablaHTML += `
                <tr>
                    <td>${item.item || 'N/A'}</td>
                    <td>${item.codigo || 'N/A'}</td>
                    <td>${item.cantidad || 'N/A'}</td>
                    <td>${item.proveedor || 'N/A'}</td>
                    <td>${item.fechaEstimada || 'N/A'}</td>
                </tr>`;
        });
    } else {
         tablaHTML += '<tr><td colspan="5">No se encontraron datos de Faltantes o el formato es incorrecto.</td></tr>';
    }

    tablaHTML += `</tbody>`;
    tablaDatos.innerHTML = tablaHTML;
}

function actualizarGraficoKPIs(datosKPI) {
    // --- ¡¡IMPORTANTE!! ---
    // Esta función ASUME que 'datosKPI' es un ARRAY DE OBJETOS,
    // que 'kpi.indicador' se usará como etiqueta y 'kpi.valor' como dato numérico.
    // LA LÓGICA PARA CONVERTIR 'kpi.valor' A NÚMERO PUEDE NECESITAR AJUSTES
    // dependiendo de cómo estén formateados los valores en tu hoja (p.ej., "$", "%", ",").
    //-----------------------

    if (!miGrafico || !Array.isArray(datosKPI) || datosKPI.length === 0) {
        miGrafico.data.labels = [];
        miGrafico.data.datasets[0].data = [];
        miGrafico.update();
        console.log("Gráfico limpiado o no actualizado por falta de datos.");
        return;
    }

    const labels = datosKPI.map(kpi => kpi.indicador || 'Sin Etiqueta');
    const data = datosKPI.map(kpi => {
        // Intenta convertir el valor a número (Lógica de ejemplo, ajustar si es necesario)
        let rawValue = kpi.valor;
        let num = 0;
        if (typeof rawValue === 'string') {
            // Quitar símbolos comunes ($, %) y comas de miles, luego convertir a float
            num = parseFloat(rawValue.replace(/[$,%]/g, '').replace(/,/g, ''));
        } else if (typeof rawValue === 'number') {
            num = rawValue;
        }
        return isNaN(num) ? 0 : num; // Si no es número válido, usa 0
    });

    miGrafico.data.labels = labels;
    miGrafico.data.datasets[0].data = data;
    miGrafico.data.datasets[0].label = 'Valor Actual KPI';
    miGrafico.update(); // Redibuja el gráfico
    console.log("Gráfico actualizado con datos KPI.");
}
