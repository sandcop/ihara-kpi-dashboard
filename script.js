// --- Función para mostrar los datos en la tabla ---
function mostrarDatos(datos, tipo) {
  // Si no hay datos o no es un array, mostrar mensaje informativo
  if (!Array.isArray(datos) || datos.length === 0) {
    content.innerHTML = "<p class='info'>ℹ️ No hay datos disponibles para mostrar.</p>";
    return;
  }

  // Construir el HTML de la tabla
  let html = "<table><thead><tr>";

  // Definir las cabeceras de la tabla según el tipo de datos
  if (tipo === "kpi") {
    // Cambiamos la cabecera para que no diga (%) si no quieres que lo implique
    html += "<th>KPI</th><th>100%</th><th>125%</th><th>70%</th><th>Resultado</th><th>Arrastre</th><th>Total</th>";
  } else { // tipo === "faltantes"
    html += "<th>KPI</th><th>Faltante 100%</th><th>Faltante 150%</th><th>Faltante 250%</th>";
  }
  html += "</tr></thead><tbody>";

  // Llenar las filas de la tabla con los datos
  datos.forEach(fila => {
    html += "<tr>";
    if (tipo === "kpi") {
      // Acceso por nombre de propiedad para KPIs
      html += `<td>${fila.kpi || '-'}</td>`;
      html += `<td>${formatNumber(fila.valor100)}</td>`;
      html += `<td>${formatNumber(fila.valor125)}</td>`;
      html += `<td>${formatNumber(fila.valor70)}</td>`;

      // ***** INICIO DE LA MODIFICACIÓN *****
      // --- Celda de Resultado (AHORA COMO NÚMERO SIMPLE) ---
      // Simplemente formateamos el número, igual que las otras columnas numéricas
      html += `<td>${formatNumber(fila.resultado)}</td>`; 
      // ***** FIN DE LA MODIFICACIÓN *****

      html += `<td>${formatNumber(fila.arrastre)}</td>`;
      html += `<td>${formatNumber(fila.total)}</td>`;

    } else { // tipo === "faltantes"
      // Acceso por nombre de propiedad para Faltantes
      html += `<td>${fila.kpi || '-'}</td>`;
      html += `<td>${formatNumber(fila.faltante100)}</td>`;
      html += `<td>${formatNumber(fila.faltante150)}</td>`;
      html += `<td>${formatNumber(fila.faltante250)}</td>`;
    }
    html += "</tr>";
  });

  html += "</tbody></table>";
  // Insertar la tabla construida en el contenedor
  content.innerHTML = html;
}
