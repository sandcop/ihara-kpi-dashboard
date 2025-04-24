/* styles.css */

/* --- Reset Básico y Body --- */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: sans-serif; background-color: #f4f7f6; color: #333; padding-top: 60px; /* Ajusta según altura navbar */ }

/* --- Estilos de la Barra de Navegación --- */
.navbar { background-color: #0056b3; color: white; padding: 0 20px; position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; display: flex; justify-content: space-between; align-items: center; height: 60px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
.navbar-brand h1 { color: white; font-size: 1.3em; /* Puede necesitar ajuste */ margin: 0; white-space: nowrap; /* Evitar que se parta */ overflow: hidden; text-overflow: ellipsis; /* Puntos suspensivos si no cabe */ max-width: calc(100% - 50px); /* Evitar que choque con hamburguesa */ }

/* --- Estilos de los Enlaces de Navegación (sin cambios) --- */
.nav-links { list-style: none; display: flex; margin: 0; padding: 0; }
.nav-links li { margin-left: 15px; position: relative; }
.nav-links a { color: white; text-decoration: none; padding: 10px 15px; display: block; transition: background-color 0.3s ease; white-space: nowrap; }
.nav-links a:hover, .nav-links li:hover > a { background-color: #007bff; border-radius: 4px; }
.nav-links a .fa-chevron-down { margin-left: 5px; }
li.dropdown .dropdown-menu { display: none; position: absolute; top: 100%; left: 0; background-color: white; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border-radius: 4px; padding: 5px 0; min-width: 180px; z-index: 1001; }
li.dropdown:hover .dropdown-menu, li.dropdown:focus-within .dropdown-menu { display: block; }
.dropdown-menu li { margin-left: 0; width: 100%; }
.dropdown-menu a { color: #333; padding: 10px 20px; border-radius: 0; }
.dropdown-menu a:hover { background-color: #e9ecef; color: #0056b3; }

/* --- Botón Hamburguesa (sin cambios) --- */
.hamburger-btn { display: none; background: none; border: none; color: white; font-size: 24px; cursor: pointer; }

/* --- NUEVO: Estilos Saludo Usuario --- */
.user-greeting {
  padding: 10px 20px;
  background-color: #f8f9fa; /* Fondo gris muy claro */
  border-bottom: 1px solid #dee2e6; /* Línea separadora sutil */
  text-align: right; /* Alineado a la derecha */
}

.user-greeting p {
  margin: 0;
  font-size: 0.9em;
  color: #495057; /* Gris oscuro */
  font-weight: 500; /* Un poco más de peso */
}
.user-greeting p i { /* Estilo para el ícono */
  margin-right: 5px;
  color: #6c757d; /* Gris medio */
}


/* --- Contenido Principal --- */
.main-content { padding: 20px; }

/* --- Media Query para Móviles --- */
@media (max-width: 992px) {
  .hamburger-btn { display: block; }
  .nav-links { display: none; flex-direction: column; width: 100%; position: absolute; top: 60px; left: 0; background-color: #004a9a; padding: 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
  .nav-links.show-menu { display: flex; }
  .nav-links li { margin-left: 0; width: 100%; text-align: left; border-top: 1px solid rgba(255, 255, 255, 0.1); }
  .nav-links li:first-child { border-top: none; }
  .nav-links a { padding: 15px 20px; border-radius: 0; }
  .nav-links a .fa-chevron-down { float: right; margin-top: 4px; }
  li.dropdown .dropdown-menu { position: static; display: block; background-color: rgba(0, 0, 0, 0.1); box-shadow: none; border-radius: 0; padding: 0; min-width: unset; width: 100%; }
  .dropdown-menu li { border-top: 1px solid rgba(255, 255, 255, 0.05); }
  .dropdown-menu a { padding-left: 40px; color: #eee; }
  .dropdown-menu a:hover { background-color: rgba(0, 0, 0, 0.2); color: white; }

  /* Ajuste del título de la navbar en móvil si es necesario */
  .navbar-brand h1 {
      font-size: 1.1em; /* Más pequeño en móvil */
      max-width: calc(100% - 60px); /* Asegurar espacio para hamburguesa */
  }

  /* Ajuste Saludo Usuario en móvil */
  .user-greeting {
      text-align: center; /* Centrado en móvil */
      padding: 8px 15px;
  }
   .user-greeting p {
      font-size: 0.85em;
   }
}

/* --- Botón Flotante de WhatsApp (sin cambios) --- */
.whatsapp-button { position: fixed; bottom: 20px; right: 20px; background-color: #25D366; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 30px; text-decoration: none; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); z-index: 1050; transition: transform 0.2s ease-in-out, background-color 0.2s; }
.whatsapp-button:hover { background-color: #128C7E; transform: scale(1.1); }

/* --- Otros estilos (Loader, Tabla, Errores, Chart, etc.) --- */
/* ... (Mantén tus estilos previos aquí) ... */
.loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; display: none; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
#error-container { margin-top: 15px; }
.error-message { color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; margin-top: 10px; border-radius: 5px; font-weight: bold; }
#kpi-content { /* Estilos para el contenedor si es necesario */ }
#tabla-container { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 20px; /* Espacio antes del gráfico */ }
#chart-container { width: 80%; margin: 0 auto 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

@media (max-width: 992px) {
  #chart-container { width: 95%; height: 300px; }
  #tablaDatos th, #tablaDatos td { padding: 6px; font-size: 0.9em; }
}

/* Estilos básicos para las secciones ocultas (mejora si las usas) */
.main-content > section[id]:not(#kpi-content) {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}