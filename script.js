// script.js

// Referencias a elementos del DOM
const tablaContainer = document.getElementById('tabla-container');
const chartContainer = document.getElementById('chart-container');
const loader = document.getElementById('loader');
const tablaDatos = document.getElementById('tablaDatos');
const kpiChartCanvas = document.getElementById('kpiChart');

let miGrafico = null; // Variable para guardar la instancia del gráfico

// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Puedes ocultar elementos al inicio si lo prefieres
    // tablaContainer.style.display = 'none'; // Oculta tabla al inicio
    // chartContainer.style.display = 'none'; // Oculta gráfico al inicio
    inicializarGrafico(); // Prepara el gráfico
});

// --- Funciones llamadas por los botones ---

function mostrarKPIs() {
    console.log("Mostrando KPIs...");
    limpiarContenido(); // Limpia tabla y oculta gráfico/loader
    loader.style.display = 'block'; // Muestra el loader

    // Simula la carga de datos (reemplaza con tu lógica real)
    setTimeout(() => {
        loader.style.display = 'none'; // Oculta el loader
        tablaContainer.style.display = 'block'; // Muestra contenedor de tabla
        tablaDatos.style.display = 'table'; // Muestra la tabla
        chartContainer.style.display = 'block'; // Muestra contenedor del gráfico
        popularTablaKPIs(); // Llena la tabla con datos KPI
        actualizarGraficoKPIs(); // Actualiza el gráfico con datos KPI
    }, 1000); // Simula 1 segundo de carga
}

function mostrarFaltantes() {
    console.log("Mostrando Faltantes...");
    limpiarContenido(); // Limpia tabla y oculta gráfico/loader
    loader.style.display = 'block'; // Muestra el loader

    // Simula la carga de datos (reemplaza con tu lógica real)
    setTimeout(() => {
        loader.style.display = 'none'; // Oculta el loader
        tablaContainer.style.display = 'block'; // Muestra contenedor de tabla
        tablaDatos.style.display = 'table'; // Muestra la tabla
        popularTablaFaltantes(); // Llena la tabla con datos de Faltantes
    }, 800); // Simula 0.8 segundos de carga
}

// --- Funciones Auxiliares ---

function limpiarContenido() {
    tablaDatos.innerHTML = ''; // Limpia el contenido de la tabla
    tablaDatos.style.display = 'none'; // Oculta la tabla
    chartContainer.style.display = 'none'; // Oculta el gráfico
    loader.style.display = 'none'; // Oculta el loader por si acaso
    tablaContainer.style.display = 'none'; // Oculta el contenedor de tabla
}

function inicializarGrafico() {
    if (miGrafico) {
        miGrafico.destroy(); // Destruye gráfico anterior si existe
    }
    const ctx = kpiChartCanvas.getContext('2d');
    miGrafico = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico (bar, line, pie, etc.)
        data: {
            labels: [], // Etiquetas (eje X) - se llenarán después
            datasets: [{
                label: 'Valor KPI', // Leyenda del dataset
                data: [], // Datos (eje Y) - se llenarán después
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Color barras
                borderColor: 'rgba(54, 162, 235, 1)', // Color borde
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true // Empezar eje Y en 0
                }
            },
            responsive: true, // Hacerlo adaptable
            maintainAspectRatio: false // Permitir que no mantenga relación de aspecto fija
        }
    });
}

function popularTablaKPIs() {
    // Datos de ejemplo - Reemplaza con tus datos reales
    tablaDatos.innerHTML = `
        <thead>
            <tr>
                <th>Indicador</th>
                <th>Valor</th>
                <th>Meta</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Ventas Mes</td>
                <td>$ 550,000</td>
                <td>$ 500,000</td>
                <td>✅ Superado</td>
            </tr>
            <tr>
                <td>Satisfacción Cliente (CSAT)</td>
                <td>88%</td>
                <td>90%</td>
                <td>⚠️ Por mejorar</td>
            </tr>
             <tr>
                <td>Producción Diaria</td>
                <td>1,200 un.</td>
                <td>1,150 un.</td>
                <td>✅ Superado</td>
            </tr>
        </tbody>
    `;
}

function popularTablaFaltantes() {
    // Datos de ejemplo - Reemplaza con tus datos reales
    tablaDatos.innerHTML = `
        <thead>
            <tr>
                <th>Ítem</th>
                <th>Código</th>
                <th>Cantidad Faltante</th>
                <th>Proveedor</th>
                <th>Fecha Estimada</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Tornillo Allen M5x20</td>
                <td>IH-TRN-00520</td>
                <td>250</td>
                <td>Proveedor A</td>
                <td>2024-08-10</td>
            </tr>
            <tr>
                <td>Placa Base ZT-100</td>
                <td>IH-PLB-ZT100</td>
                <td>15</td>
                <td>Proveedor B</td>
                <td>2024-08-15</td>
            </tr>
             <tr>
                <td>Cable Flex 12p</td>
                <td>IH-CBL-F12P</td>
                <td>80</td>
                <td>Proveedor A</td>
                <td>2024-08-12</td>
            </tr>
        </tbody>
    `;
}

function actualizarGraficoKPIs() {
    if (!miGrafico) return; // Si el gráfico no existe, no hacer nada

    // Datos de ejemplo para el gráfico - Reemplaza con tus datos
    const labelsKPI = ['Ventas ($k)', 'CSAT (%)', 'Producción (un.)'];
    const dataKPI = [550, 88, 1200]; // Valores numéricos

    miGrafico.data.labels = labelsKPI;
    miGrafico.data.datasets[0].data = dataKPI;
    miGrafico.data.datasets[0].label = 'Valor Actual KPI'; // Actualiza la leyenda si quieres
    miGrafico.update(); // Redibuja el gráfico con los nuevos datos
    console.log("Gráfico actualizado con datos KPI");
}
