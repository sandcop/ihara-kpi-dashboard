const apiUrl = "https://script.google.com/macros/s/AKfycby9UyKr-UcWOCvrMGCsgvc38_-HmKZpXjlj9THbGLNK0lhLJ7B-_RSVpxFpP76eWjeP/exec";

const btnKPIs = document.getElementById("btn-kpis");
const btnFaltantes = document.getElementById("btn-faltantes");
const content = document.getElementById("data-content");
const chartContainer = document.getElementById('chart-container'); // Para futuros gráficos
const kpiChartCanvas = document.getElementById('kpiChart').getContext('2d'); // Contexto para Chart.js
let currentChart = null; // Para destruir gráficos anteriores

btnKPIs.addEventListener("click", () => {
  cargarDatos("kpi");
});

btnFaltantes.addEventListener("click", () => {
  cargarDatos("faltantes");
});

function cargarDatos(tipo) {
  // Muestra el texto de carga con la clase CSS para el spinner
  content.innerHTML = "<p class='loading'>Cargando datos...</p>";
  chartContainer.style.display = 'none'; // Oculta el área del gráfico mientras carga
  if (currentChart) {
    currentChart.destroy(); // Destruye gráfico anterior si existe
  }

  fetch(`${apiUrl}?tipo=${tipo}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (data.error) {
         throw new Error(`Error desde API: ${data.error}`);
      }
      mostrarDatos(data.datos, tipo);

      // (Opcional - Paso 3) Si son KPIs, intenta mostrar un gráfico
      if (tipo === 'kpi' && data.datos && data.datos.length > 0) {
         // mostrarGraficoKPI(data.datos); // Descomentar para usar Chart.js
      }

    })
    .catch(err => {
      console.error("Error detallado:", err);
      content.innerHTML = `<p class='error'>Error al cargar datos. ${err.message}</p>`;
    });
}

function mostrarDatos(datos, tipo) {
  if (!Array.isArray(datos) || datos.length === 0) {
    content.innerHTML = "<p class='info'>No hay datos disponibles para mostrar.</p>";
    return;
  }

  let html = "<table><thead><tr>";

  // Definir cabeceras basado en el tipo
  if (tipo === "kpi") {
    html += "<th>KPI</th><th>100%</th><th>125%</th><th>70%</th><th>Resultado (%)</th><th>Arrastre</th><th>Total</th>";
  } else { // faltantes
    html += "<th>KPI</th><th>Faltante 100%</th><th>Faltante 150%</th><th>Faltante 250%</th>";
  }
  html += "</tr></thead><tbody>";

  // Construir filas
  datos.forEach(fila => {
    html += "<tr>";
    if (tipo === "kpi") {
      // Acceso por nombre de propiedad para claridad
      html += `<td>${fila.kpi || ''}</td>`;
      html += `<td>${formatNumber(fila.valor100)}</td>`;
      html += `<td>${formatNumber(fila.valor125)}</td>`;
      html += `<td>${formatNumber(fila.valor70)}</td>`;

      // --- Celda de Resultado con Barra de Progreso ---
      let resultadoNum = parseFloat(fila.resultado); // Convertir a número
      if (isNaN(resultadoNum)) {
          html += `<td>${fila.resultado}</td>`; // Mostrar como texto si no es número
      } else {
          // Asegurarse que el porcentaje esté entre 0 y 100 para la barra
          const progressPercent = Math.max(0, Math.min(100, resultadoNum));
          html += `<td>
                     <div class="progress-bar-container">
                       <div class="progress-bar" style="width: ${progressPercent}%;">${progressPercent.toFixed(1)}%</div>
                     </div>
                     <!-- <span class="progress-value">${resultadoNum.toFixed(2)}%</span> --> <!-- Opcional: mostrar valor numérico aparte -->
                   </td>`;
      }
      // --- Fin Celda Resultado ---

      html += `<td>${formatNumber(fila.arrastre)}</td>`;
      html += `<td>${formatNumber(fila.total)}</td>`;

    } else { // faltantes
      // Usar Object.values aquí es seguro si el orden es siempre el mismo
      // O acceder por nombre si la estructura es fija: fila.faltante100, etc.
      html += `<td>${fila.kpi || ''}</td>`;
      html += `<td>${formatNumber(fila.faltante100)}</td>`;
      html += `<td>${formatNumber(fila.faltante150)}</td>`;
      html += `<td>${formatNumber(fila.faltante250)}</td>`;
    }
    html += "</tr>";
  });

  html += "</tbody></table>";
  content.innerHTML = html; // Reemplaza el loader con la tabla
}

// Función auxiliar para formatear números (opcional, para mejorar lectura)
function formatNumber(value) {
  if (typeof value === 'number') {
    // Puedes ajustar el formato como necesites (decimales, separador de miles)
    return value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  return value; // Devuelve el valor original si no es número
}


// --- PASO 3: Integración con Chart.js (Opcional) ---
function mostrarGraficoKPI(datosKPI) {
    chartContainer.style.display = 'block'; // Muestra el contenedor del gráfico

    const labels = datosKPI.map(item => item.kpi); // Nombres de KPI para eje X
    const dataResultados = datosKPI.map(item => parseFloat(item.resultado) || 0); // Datos de resultado para las barras
    const dataTotales = datosKPI.map(item => parseFloat(item.total) || 0); // Datos de total para las barras

    if (currentChart) {
        currentChart.destroy(); // Destruir el gráfico anterior
    }

    currentChart = new Chart(kpiChartCanvas, {
        type: 'bar', // Tipo de gráfico: barras
        data: {
            labels: labels,
            datasets: [
              {
                label: 'Resultado (%)', // Etiqueta para esta serie de datos
                data: dataResultados,
                backgroundColor: 'rgba(40, 167, 69, 0.7)', // Verde con transparencia
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1,
                yAxisID: 'yPercentage' // Asignar a un eje Y específico
              },
              {
                  label: 'Total', // Etiqueta para esta serie de datos
                  data: dataTotales,
                  backgroundColor: 'rgba(0, 123, 255, 0.7)', // Azul con transparencia
                  borderColor: 'rgba(0, 123, 255, 1)',
                  borderWidth: 1,
                  yAxisID: 'yValues' // Asignar a otro eje Y
              }
          ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permitir que el gráfico se ajuste al contenedor
            scales: {
                 x: { // Eje X (KPIs)
                    ticks: {
                        autoSkip: false, // Mostrar todas las etiquetas si caben
                        maxRotation: 45, // Rotar etiquetas si son largas
                        minRotation: 45
                    }
                },
                // Eje Y para Porcentajes
                yPercentage: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    max: 100, // Máximo 100 para porcentaje
                    title: {
                        display: true,
                        text: 'Resultado (%)'
                    }
                },
                // Eje Y para Valores Totales
                yValues: {
                    type: 'linear',
                    position: 'right', // Ponerlo a la derecha
                    beginAtZero: true,
                    grid: { // Ocultar la cuadrícula de este eje para no sobrecargar
                       drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Total'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top', // Posición de la leyenda
                },
                tooltip: { // Información al pasar el ratón
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });
}
