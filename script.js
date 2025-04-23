const apiUrl = "https://script.google.com/macros/s/AKfycby9UyKr-UcWOCvrMGCsgvc38_-HmKZpXjlj9THbGLNK0lhLJ7B-_RSVpxFpP76eWjeP/exec";

const btnKPIs = document.getElementById("btn-kpis");
const btnFaltantes = document.getElementById("btn-faltantes");
const content = document.getElementById("data-content");

btnKPIs.addEventListener("click", () => {
  cargarDatos("kpi");
});

btnFaltantes.addEventListener("click", () => {
  cargarDatos("faltantes");
});

function cargarDatos(tipo) {
  content.innerHTML = "<p class='loading'>Cargando datos...</p>";
  
  fetch(`${apiUrl}?tipo=${tipo}`)
    .then(res => res.json())
    .then(data => {
      mostrarDatos(data.datos, tipo);
    })
    .catch(err => {
      console.error(err);
      content.innerHTML = "<p class='error'>Error al cargar datos</p>";
    });
}

function mostrarDatos(datos, tipo) {
  if (!Array.isArray(datos)) {
    content.innerHTML = "<p class='error'>Datos no disponibles</p>";
    return;
  }

  let html = "<table>";
  html += "<thead><tr>";

  if (tipo === "kpi") {
    html += "<th>KPI</th><th>100%</th><th>125%</th><th>70%</th><th>Resultado</th><th>Arrastre</th><th>Total</th>";
  } else {
    html += "<th>KPI</th><th>Faltante 100%</th><th>Faltante 150%</th><th>Faltante 250%</th>";
  }

  html += "</tr></thead><tbody>";

  datos.forEach(fila => {
    html += "<tr>";
    for (const valor of Object.values(fila)) {
      html += `<td>${valor}</td>`;
    }
    html += "</tr>";
  });

  html += "</tbody></table>";
  content.innerHTML = html;
}
