let chart;

function mostrarKPIs() {
  document.getElementById('loader').style.display = 'block';
  document.getElementById('tablaDatos').innerHTML = '';
  if (chart) chart.destroy();

  google.script.run.withSuccessHandler(data => {
    document.getElementById('loader').style.display = 'none';
    const tabla = document.getElementById('tablaDatos');
    let html = `<tr>
      <th>KPI</th><th>100%</th><th>125%</th><th>70%</th>
      <th>Resultado</th><th>Arrastre</th><th>Total</th>
    </tr>`;

    const labels = [];
    const dataset = [];

    data.forEach(d => {
      html += `<tr>
        <td>${d.kpi}</td><td>${d.valor100}</td><td>${d.valor125}</td>
        <td>${d.valor70}</td><td>${d.resultado}</td><td>${d.arrastre}</td><td>${d.total}</td>
      </tr>`;
      labels.push(d.kpi);
      dataset.push(Number(d.total));
    });

    tabla.innerHTML = html;
    renderChart(labels, dataset, 'Totales por KPI');
  }).getKPIData();
}

function mostrarFaltantes() {
  document.getElementById('loader').style.display = 'block';
  document.getElementById('tablaDatos').innerHTML = '';
  if (chart) chart.destroy();

  google.script.run.withSuccessHandler(data => {
    document.getElementById('loader').style.display = 'none';
    const tabla = document.getElementById('tablaDatos');
    let html = `<tr>
      <th>KPI</th><th>Faltante 100%</th><th>Faltante 150%</th><th>Faltante 250%</th>
    </tr>`;

    const labels = [];
    const dataset = [];

    data.forEach(d => {
      html += `<tr>
        <td>${d.kpi}</td><td>${d.faltante100}</td><td>${d.faltante150}</td><td>${d.faltante250}</td>
      </tr>`;
      labels.push(d.kpi);
      dataset.push(Number(d.faltante100));
    });

    tabla.innerHTML = html;
    renderChart(labels, dataset, 'Faltante 100% por KPI');
  }).getFaltantesData();
}

function renderChart(labels, data, label) {
  const ctx = document.getElementById('kpiChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: '#3b82f6',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}