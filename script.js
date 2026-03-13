// script.js
console.log("script.js: Empezando a ejecutar.");

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx8vgrXJo4_q3sO90Aj1u1YaS9zfU6l2exFsnb4DMJBbYn-8E2QdVBpfjgaX8x4LeWI/exec';
const GOOGLE_FORM_URL_HOGAR = "https://docs.google.com/forms/d/e/1FAIpQLSfUnRFmauKoiSii1g9rBSRFmMwmb79ImhVW9U80zY3ABU04aA/viewform?embedded=true";
const GOOGLE_FORM_URL_MOVIL = "https://docs.google.com/forms/d/e/1FAIpQLSexD3YnCTfjZcxbZkUp4684hTLL_UxcprWOtBTTZPOGB1N-eA/viewform?embedded=true";

// ¡¡ADVERTENCIA DE SEGURIDAD CRÍTICA!!
// Esta contraseña (Movistar2025) está hardcodeada y visible en el código fuente del frontend.
// CUALQUIER persona que inspeccione el código puede verla y usarla para registrar ventas.
// Esto es un riesgo de seguridad MUY ALTO. Se recomienda ENCARECIDAMENTE cambiar este
// sistema de autenticación a uno basado en tokens gestionados por el backend, o al menos
// usar una validación de contraseña mucho más robusta que NO exponga la clave en el cliente.
const CORRECT_PASSWORD_B64 = btoa("Movistar2025");
const AUTH_TOKEN_KEY = 'appAuthToken';
const UNPROTECTED_ROUTES = ['inicio', '', 'ofertas-mes', 'prospectos', 'buscador-ventas', 'tabla-remuneracion', 'ofertas-flash']; // 'ofertas-flash' añadido aquí

const ICON_MOON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
const ICON_SUN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
const KPI_ICONS = {'VOZ': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-signal"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>','FO': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wifi"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg>','N° TERMINALES': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>','ACCESORIOS': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>','SEGUROS': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>','FACTURACION': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>','DEFAULT_KPI': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>'};
const TOAST_ICONS = {'success': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>','info': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>','warning': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>','error': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>','default': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>'};
const ICON_PDF_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text tilt-card-pdf-icon"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';
const ICON_TRASH_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';


// --- Lista de códigos de producto regla ---
let CODIGO_PRODUCTO_REGLA_OPTIONS = [
    "Cod_2WS", "Cod_2WT", "Cod_2WU", "Cod_2WY", "Cod_2XE", "Cod_2XX",
    "Cod_3EX", "Cod_3FJ", "Cod_3FO", "Cod_3JB", "Cod_3JC", "Cod_3JD",
    "Cod_3JE", "Cod_3LF", "Cod_3LG", "Cod_3LH", "Cod_3MA", "Cod_4AW",
    "Cod_Migracion", "Cod_PPT",
    "IFO400/400", "IFO400/400_TV", "IFO500/500", "IFO500/500_TV",
    "IFO600/600", "IFO600/600_TV", "IFO800/800", "IFO800/800_TV",
    "IFO940/940", "IFO940/940_TV",
    "Movistar One", "Movistar One en Boleta", "Pago Contado (con tarjeta)",
    "Pago En Boleta - Recambio", "Pago En Boleta- alta con equipo"
];
// -------------------------------------------------------------------------

const TIPO_ENTRADA_REGLA_OPTIONS = ["Alta Normal", "Portada Prepago", "Portada Postpago", "Alta Totalización", "Porta Pre Tota", "Porta Post Tota", "Alta Completación", "Porta Pre Comple", "Porta Post Comple", "Alta Migrada", "Alta Ppt", "Solo BAF", "BAF+TV Paquet.", "MIXTO", "INTERNO", "FULL PRICE", "PAGO EXTERNO", "DIFERENCIADO", "MONE MIXTO", "Alta Accesorio"];
const TIPO_KPI_PRINCIPAL_OPTIONS = ["VOZ_MOVIL", "FO_TERMINADA", "TOTALIZACION_ALTA/C", "ISN", "ADHESION_NBA", "TERMINALES", "ACCESORIOS"];

// --- CONSTANTE PARA FIREBASE STORAGE (MISMA DEL BACKEND) ---
// Estas constantes se usan para las imágenes de los detalles de KPI (ej. terminales)
// y NO para las ofertas flash, que ahora van a Drive.
const FIREBASE_STORAGE_PROJECT_ID = "seguimiento-ventas-manuel"; 
const FIREBASE_STORAGE_BUCKET = `${FIREBASE_STORAGE_PROJECT_ID}.appspot.com`;
const FIREBASE_STORAGE_BASE_URL = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/`;


// Variables globales para elementos del DOM
let appContainer, sidebarLeft, pageWrapper, mainContent, loginOverlay, loginForm, loginPasswordInput, loginErrorMsg;
let verticalNavbar, mobileNavLinks, hamburgerBtnMobile, sidebarCloseBtn, toastContainer, themeToggleButtonFooter;
let dateTimeDisplay, timeDisplay, dateDisplay;
let ultimaAtencionNombreEl, ultimaAtencionRutEl, ultimaAtencionTelefonoEl;
let inicioContentSection, kpiContentSection, ofertasFlashSection, ofertasMesSection, enlacesExternosSection, tablaRemuneracionSection, politicasVentasSection, prospectosContentSection, buscadorVentasContent, asistenteAIContentSection, adminPanelSection;
let tablaContainer, loader, tablaDatos, errorContainer, kpiCardsContainer;
let prospectoForm, guardarProspectoBtn, prospectoLoader, prospectoMensaje;
let buscadorVentasForm, buscarNombreInput, buscarOrdenAlohaInput, buscarRutInput, limpiarBuscadorBtn;
let resultadosVentasLoader, resultadosVentasMensaje, resultadosVentasContainer;
let btnOpenAddSale, addSaleOverlay, addSalePopup, btnCloseAddSale, addSaleForm, btnSubmitSale, addSaleLoader, addSaleMensaje;
let kpiDetailsOverlay, kpiDetailsPopup, btnCloseKpiDetails, kpiDetailsTitle, kpiDetailsContent, kpiDetailsLoader;
let graficoPesosKPIInstance = null; 
let graficoPesosLoader, graficoPesosErrorElem;
let kpisFijosLoader, kpisFijosErrorElem, kpiDisplayGrid;
let simEntradasVozInput, simEntradasFoInput, simEntradasTotalizacionInput, simEntradasIsnInput, simEntradasAdhesionInput, btnSimularComision;
let simulacionLoader, simulacionErrorElem, outputSimulacion;
let resSimPorcentaje, resSimIncentivo;
let tablaReglasRemuneracion, remuneracionLoaderTablaEntradas, listaNotasRemuneracion;
let remuneracionLoaderTablaPPM, tablaFactoresPPMRefElem;
let aiPrompt, aiGenerateBtn, aiLoader, aiChatLog, aiNewChatBtn;
let chatHistory = []; 
let slideshowInicio = { element: null, slides: [], currentIndex: 0, timeoutId: null, interval: 10000 };

// --- NUEVAS VARIABLES PARA LA SECCIÓN DE OFERTAS FLASH ---
let btnOpenUploadOffer, uploadOfferOverlay, uploadOfferPopup, btnCloseUploadOffer;
let uploadOfferForm, uploadOfferFile, uploadOfferTitle, uploadOfferDescription;
let btnSubmitUploadOffer, uploadOfferLoader, uploadOfferMessage;
let flashOffersCardsContainer, flashOffersDisplayLoader;
const TILT_THRESHOLD = 12; // Valor para el efecto de inclinación 3D
// -----------------------------------------------------

let notificationInterval;
const NAV_ACTIVE_CLASS = 'active'; 
let kpiDataGlobal = null;

let hogarPagePlansData = {fibra:[{id:"hogar-fibra-600",velocidad:"Fibra 600 Mbps",precio:"$16.990",descuento:"26%",detalles:"Ideal para streaming y gaming."},{id:"hogar-fibra-800",velocidad:"Fibra 800 Mbps",precio:"$17.990",descuento:"35%",detalles:"Perfecto para hogares conectados."},{id:"hogar-fibra-940",velocidad:"Fibra 940 Mbps",precio:"$21.990",descuento:"43%",detalles:"Máxima velocidad."}],duo:[{id:"hogar-duo-600",velocidad:"600 Mbps + TV",precio:"$33.990",descuento:"31%",detalles:"Internet y TV."},{id:"hogar-duo-800",velocidad:"800 Mbps + TV",precio:"$38.990",descuento:"31%",detalles:"Más velocidad y canales."},{id:"hogar-duo-940",velocidad:"940 Mbps + TV",precio:"$41.990",descuento:"38%",detalles:"Experiencia completa."}],trio:[{id:"hogar-trio-600",velocidad:"600 Mbps+TV+Tel",precio:"$38.990",descuento:"30%",detalles:"Conectividad total."},{id:"hogar-trio-800",velocidad:"800 Mbps+TV+Tel",precio:"$40.990",descuento:"32%",detalles:"Alta velocidad, TV y fijo."},{id:"hogar-trio-940",velocidad:"940 Mbps+TV+Tel",precio:"$43.990",descuento:"38%",detalles:"Paquete completo."}]};

// ===== BLOQUE DE PLANES MÓVILES (permanece igual) =====
let movilPagePlansData = {
    monolinea: [
        { id: "movil-mono-ultra", nombre: "5G Libre Ultra", precio: "$20.990", caracteristicas: ["Umbral de Navegación: 700GB", "Minutos Libres y 1.000 SMS", "Roaming: Datos Ilimitado por 21 días al año", "MONE (externo): Disponible según evaluación comercial", "Código: Cod_2WM"], descuento: "" }, 
        { id: "movil-mono-pro", nombre: "5G Libre Pro", precio: "$16.990", caracteristicas: ["Umbral de Navegación: 550GB", "Minutos Libres y 1.000 SMS", "Roaming: Datos Ilimitado por 10 días al año", "MONE (externo): Disponible según evaluación comercial", "Código: Cod_3HC"], descuento: "Oferta/s: 30% dcto x 6 meses ($11.893) – Código: Cod_3GZ" }, 
        { id: "movil-mono-full", nombre: "5G Libre Full", precio: "$13.990", caracteristicas: ["Umbral de Navegación: 450GB", "Minutos Libres y 1.000 SMS", "Roaming: Datos Ilimitado por 7 días al año", "MONE (externo): Disponible según evaluación comercial", "Código: Cod_2WB"], descuento: "Oferta/s: Ofertas: 1 Línea 30% dcto (Cod_2VY), 2 Líneas 50% dcto (Cod_2WA)" }, 
        { id: "movil-mono-inicia", nombre: "5G Libre Inicia", precio: "$10.990", caracteristicas: ["Umbral de Navegación: 200GB", "1.000 Minutos y 1.000 SMS", "Roaming: No incluye", "MONE: No Disponible", "Código: Cod_2VV"], descuento: "Oferta/s: Oferta 1 Línea 10% dcto (Cod_2VQ), 1 Línea 20% dcto (Cod_2VR)" }
    ], 
    multilinea: [
        { id: "movil-multi-ultra", nombre: "5G Libre Ultra", precio: "Línea principal: $20.990", precioAdicional: "Líneas adicionales: $4.990 (desde mes 7: $9.990)", caracteristicas: ["Umbral de Navegación: 700GB", "Minutos Libres y 1.000 SMS", "Roaming: Datos Ilimitado por 21 días al año", "MONE (externo): Disponible según evaluación comercial", "Código: Cod_3Lk"], descuento: "" }, 
        { id: "movil-multi-pro", nombre: "5G Libre Pro", precio: "Línea principal: $16.990", precioAdicional: "Líneas adicionales: $4.990 (desde mes 7: $9.990)", caracteristicas: ["Umbral de Navegación: 550GB", "Minutos Libres y 1.000 SMS", "Roaming: Datos Ilimitado por 10 días al año", "MONE (externo): Disponible según evaluación comercial", "Código: Cod_3LJ"], descuento: "" }, 
        { id: "movil-multi-full", nombre: "5G Libre Full", precio: "Línea principal: $13.990", precioAdicional: "Líneas adicionales: $4.990 (desde mes 7: $9.990)", caracteristicas: ["Umbral de Navegación: 450GB", "Minutos Libres y 1.000 SMS", "Roaming: Datos Ilimitado por 7 días al año", "MONE (externo): Disponible según evaluación comercial", "Código: Cod_3LI"], descuento: "" }, 
        { id: "movil-multi-inicia", nombre: "5G Libre Inicia", precio: "Línea principal: $10.990", precioAdicional: "Líneas adicionales: $4.990 (desde mes 7: $9.990)", caracteristicas: ["Umbral de Navegación: 200GB", "1.000 Minutos y 1.000 SMS", "Roaming: No incluye", "MONE: No Disponible", "Código: Cod_3MB"], descuento: "" }
    ],
    general: [
        { id: "movil-porta-pro", nombre: "5G Libre Pro", precio: "$16.990", caracteristicas: ["Umbral de Navegación: 550GB", "Minutos Libres y 1.000 SMS", "Roaming: Datos Ilimitado por 10 días al año", "MONE (externo): Disponible según evaluación comercial", "Código: Cod_3HC"], descuento: "Oferta/s: 50% dcto x 6 meses ($8.495) – Código: Cod_3HB" },
        { id: "movil-porta-inicia", nombre: "5G Libre Inicia", precio: "$10.990", caracteristicas: ["Umbral de Navegación: 200GB", "1.000 Minutos y 1.000 SMS", "Roaming: No incluye", "MONE: No Disponible", "Código: Cod_2VV"], descuento: "Oferta/s: Oferta 1 Línea 30% dcto x 12 meses  (Cod_3KJ)" }
    ],
    totalizacion: [
        { id: "movil-total-ultra", nombre: "5G Libre Ultra", precio: "Precio normal: $20.990", caracteristicas: ["Umbral de Navegación: 700GB", "Minutos Libres y 1.000 SMS", "Roaming: Datos Ilimitado por 21 días al año"], descuento: "Oferta: 30% dcto x 12 meses ($14.693) - Código: Cod_3JE" }, 
        { id: "movil-total-pro", nombre: "5G Libre Pro", precio: "Precio normal: $16.990", caracteristicas: ["Umbral de Navegación: 550GB", "Minutos Libres y 1.000 SMS", "Roaming: Datos Ilimitado por 10 días al año"], descuento: "Ofertas: 30% dcto x 12 meses ($11.893 - Cod_3DJ) o 50% dcto x 6 meses ($8.495 - Cod_3HB)"}, 
        { id: "movil-total-inicia", precio: "Precio normal: $10.990", caracteristicas: ["Umbral de Navegación: 200GB", "1.000 Minutos y 1.000 SMS", "Roaming: No incluye"], descuento: "Oferta: 30% dcto x 12 meses ($7.693) - Código: Cod_3JB" }
    ], 
    migracion: [
        { id: "migra-inicia-a-full", tipo: "Migración", origen: "SALTA 5G Libre Inicia (Normal: $10.990)", destino: "SALTA 5G Libre Full", oferta: "Contraoferta 30%: $9.793 x12 meses", precioNormalDestino: "$13.990", caracteristicasDestino: ["Minutos Libres y 1.000 SMS", "Umbral de Navegación: 450GB", "Roaming: Whatsapp por 7 días al año"] }, 
        { id: "migra-full-a-ultra", tipo: "Migración", origen: "SALTA 5G Libre Full (Normal: $13.990)", destino: "5G Libre Ultra", oferta: "40%x12 meses: $12.594 x12 meses", precioNormalDestino: "$20.990", caracteristicasDestino: ["Minutos Libres y 1.000 Minutos y 1.000 SMS", "Umbral de Navegación: 700GB", "Roaming: Datos Ilimitado por 21 días al año"] }, 
        { id: "migra-x-a-pro", tipo: "Migración", origen: "Desde otro plan", destino: "5G Libre Pro", oferta: "40% x 12 meses: $10.194 x12 meses", precioNormalDestino: "$16.990", caracteristicasDestino: ["Minutos Libres y 1.000 SMS", "Umbral de Navegación: 550GB", "Roaming: Datos Ilimitado por 10 días al año"] }, 
        { id: "migra-x-a-inicia-oferta", tipo: "Migración", origen: "Desde otro plan", destino: "SALTA 5G Libre Inicia", oferta: "Contraoferta 20%: $8.792 x12 meses", precioNormalDestino: "$10.990", caracteristicasDestino: ["1.000 Minutos y 1.000 SMS", "Umbral de Navegación: 200GB", "Roaming: Sin beneficio"] }, 
        { id: "migra-inicia-oferta-propia", tipo: "Oferta Migración/Retención", origen: "SALTA 5G Libre Inicia", destino: "SALTA 5G Libre Inicia (Mantiene Plan)", oferta: "Oferta 30%: $7.693 x12 meses", precioNormalDestino: "$10.990", caracteristicasDestino: ["1.000 Minutos y 1.000 SMS", "Umbral de Navegación: 200GB", "Roaming: Sin beneficio"] }
    ]
};
// =================================================

function formatNumber(value) { if (value === null || typeof value === 'undefined' || String(value).trim() === '') return '-'; if (typeof value === 'string') { const cleaned = value.replace(/[$.]/g, '').replace(',', '.'); const num = parseFloat(cleaned); if (!isNaN(num)) value = num; else return String(value); } if (typeof value === 'number') { return value.toLocaleString('es-CL', (value % 1 === 0) ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : { minimumFractionDigits: 0, maximumFractionDigits: 2 }); } return String(value); }
function showToast(message, type = 'info', duration = 7000) { if (!toastContainer) { console.error("Contenedor Toasts no hallado."); return; } const toast = document.createElement('div'); toast.classList.add('toast', type); const iconSVG = TOAST_ICONS[type] || TOAST_ICONS['default']; toast.innerHTML = `<span class="toast-icon-wrapper">${iconSVG}</span><span class="toast-message">${message}</span>`; toastContainer.appendChild(toast); requestAnimationFrame(() => { toast.classList.add('show'); }); setTimeout(() => { toast.classList.remove('show'); toast.classList.add('hide'); toast.addEventListener('transitionend', () => { if (toast.parentElement) toast.remove(); }, { once: true }); }, duration); }
function showSection(sectionIdToShow) { const sections = [inicioContentSection, kpiContentSection, ofertasFlashSection, ofertasMesSection, enlacesExternosSection, tablaRemuneracionSection, politicasVentasSection, prospectosContentSection, buscadorVentasContent, asistenteAIContentSection, adminPanelSection]; sections.forEach(section => { if (section) { if (section.id === sectionIdToShow) { section.style.display = 'block'; requestAnimationFrame(() => { section.classList.remove('section-hidden'); section.classList.add('section-active'); }); } else { section.classList.remove('section-active'); section.classList.add('section-hidden'); section.addEventListener('transitionend', function onTransitionEnd() { if(section.classList.contains('section-hidden')) { section.style.display = 'none'; } section.removeEventListener('transitionend', onTransitionEnd); }, { once: true }); if (getComputedStyle(section).opacity === "0" || section.classList.contains('section-hidden')) { section.style.display = 'none'; } } } }); if (!document.getElementById(sectionIdToShow)) { console.error(`Sección con ID '${sectionIdToShow}' no encontrada en el DOM.`); } const navItems = document.querySelectorAll('.vnav-item, .mobile-nav-links a'); navItems.forEach(item => { item.classList.remove(NAV_ACTIVE_CLASS); let targetHashForNav = sectionIdToShow.replace('-content', ''); if (sectionIdToShow === 'inicio-content') targetHashForNav = 'inicio'; if (item.getAttribute('href') === `#${targetHashForNav}`) { item.classList.add(NAV_ACTIVE_CLASS); } }); }
function closeMobileSidebar() { if (sidebarLeft && sidebarLeft.classList.contains('open')) { sidebarLeft.classList.remove('open'); document.body.classList.remove('sidebar-left-open'); if (hamburgerBtnMobile) hamburgerBtnMobile.setAttribute('aria-expanded', String(sidebarLeft.classList.contains('open'))); } }
function isAuthenticated() { return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true'; }
function attemptLogin(password) { try { if (btoa(password) === CORRECT_PASSWORD_B64) { sessionStorage.setItem(AUTH_TOKEN_KEY, 'true'); if (loginErrorMsg) loginErrorMsg.style.display = 'none'; showAppContent(); const requestedHash = sessionStorage.getItem('requestedHash'); sessionStorage.removeItem('requestedHash'); window.location.hash = requestedHash || 'inicio'; return true; } else { if (loginErrorMsg) { loginErrorMsg.textContent = "Contraseña incorrecta."; loginErrorMsg.style.display = 'block'; } return false; } } catch (e) { console.error("Error en btoa durante login:", e); if (loginErrorMsg) { loginErrorMsg.textContent = "Error procesando la contraseña."; loginErrorMsg.style.display = 'block'; } return false; } }
function showLogin() { if (loginOverlay) { loginOverlay.style.display = 'flex'; requestAnimationFrame(() => loginOverlay.classList.add('visible')); } if (appContainer) appContainer.style.display = 'none'; document.body.classList.add('login-overlay-active'); }
function showAppContent() { if (loginOverlay) { loginOverlay.classList.remove('visible'); loginOverlay.addEventListener('transitionend', function onEnd() { if (!loginOverlay.classList.contains('visible')) loginOverlay.style.display = 'none'; loginOverlay.removeEventListener('transitionend', onEnd); }, { once: true }); } if (appContainer) appContainer.style.display = 'flex'; document.body.classList.remove('login-overlay-active'); }
function updateDateTime() { const now = new Date(); if (timeDisplay) timeDisplay.textContent = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }); if (dateDisplay) dateDisplay.textContent = now.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function cargarYMostrarUltimaAtencion() { if (!ultimaAtencionNombreEl || !ultimaAtencionRutEl || !ultimaAtencionTelefonoEl) { return; } ultimaAtencionNombreEl.textContent = "Cargando..."; ultimaAtencionRutEl.textContent = "-"; ultimaAtencionTelefonoEl.textContent = "-"; fetch(`${APPS_SCRIPT_URL}?action=getultimaatencion`).then(response => response.ok ? response.json() : response.text().then(text => { throw new Error(`Error: ${response.status} ${text}`) })).then(result => { if (result.success && result.data) { const atencion = result.data; ultimaAtencionNombreEl.textContent = atencion.nombre || "No disponible"; ultimaAtencionRutEl.textContent = atencion.rut || "-"; ultimaAtencionTelefonoEl.textContent = atencion.telefono || "-"; } else { ultimaAtencionNombreEl.textContent = result.message || "Datos no disponibles"; } }).catch(error => { console.error("Error al cargar última atención:", error); ultimaAtencionNombreEl.textContent = "Error al cargar"; }); }
function initializeSlideshow(slideshowInstance, containerSelector, contentDivSelector = null) {
  slideshowInstance.element = document.querySelector(containerSelector);
  if (!slideshowInstance.element) {
    return false;
  }
  slideshowInstance.contentDiv = contentDivSelector ? slideshowInstance.element.querySelector(contentDivSelector) : slideshowInstance.element;
  
  if (!slideshowInstance.contentDiv) {
    console.error(`Contenedor de slides '${contentDivSelector}' no encontrado dentro de '${containerSelector}'.`);
    return false;
  }

  slideshowInstance.slides = slideshowInstance.contentDiv.querySelectorAll('.slide');
  if (!slideshowInstance.slides || slideshowInstance.slides.length === 0) {
    return false;
  }
  slideshowInstance.currentIndex = 0;
  clearTimeout(slideshowInstance.timeoutId);
  showNextSlide(slideshowInstance, 0); 
  return true;
}
function showNextSlide(slideshowInstance, direction = 1) {
  if (!slideshowInstance.slides || slideshowInstance.slides.length === 0) {
    return;
  }

  for (let i = 0; i < slideshowInstance.slides.length; i++) {
    slideshowInstance.slides[i].style.display = "none";
  }

  slideshowInstance.currentIndex += direction;

  if (slideshowInstance.currentIndex < 0) {
    slideshowInstance.currentIndex = slideshowInstance.slides.length - 1;
  } else if (slideshowInstance.currentIndex >= slideshowInstance.slides.length) {
    slideshowInstance.currentIndex = 0;
  }

  slideshowInstance.slides[slideshowInstance.currentIndex].style.display = "block";

  clearTimeout(slideshowInstance.timeoutId);
  slideshowInstance.timeoutId = setTimeout(() => showNextSlide(slideshowInstance, 1), slideshowInstance.interval);
}

function mostrarInicio() { 
  showSection('inicio-content'); 
  if (!slideshowInicio.element) { 
    initializeSlideshow(slideshowInicio, '#inicio-content .slideshow-container'); 
  } else { 
    clearTimeout(slideshowInicio.timeoutId); 
    showNextSlide(slideshowInicio); 
  } 
}

// --- Modificación de mostrarOfertasFlash para el nuevo comportamiento de tarjetas ---
async function mostrarOfertasFlash() {
  showSection('ofertas-flash');
  if (!flashOffersCardsContainer || !flashOffersDisplayLoader) {
    console.error("Elementos del DOM para ofertas flash no encontrados.");
    return;
  }

  flashOffersCardsContainer.innerHTML = ''; // Limpiar ofertas anteriores
  flashOffersDisplayLoader.style.display = 'flex';

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getflashofferswithmetadata`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();

    if (result.success && result.data) {
      if (result.data.length > 0) {
        result.data.forEach((offer, index) => {
          const card = createFlashOfferCard(offer);
          flashOffersCardsContainer.appendChild(card);
          requestAnimationFrame(() => {
            setTimeout(() => { card.classList.add('vcard-visible'); }, index * 100);
          });
        });
      } else {
        flashOffersCardsContainer.innerHTML = '<p style="text-align:center;padding:20px; color: var(--text-color-secondary); grid-column: 1 / -1;">No hay ofertas flash disponibles.</p>';
      }
    } else {
      throw new Error(result.error || 'Error desconocido al obtener ofertas flash.');
    }
  } catch (error) {
    console.error("Error al cargar ofertas flash:", error);
    flashOffersCardsContainer.innerHTML = `<div class="mensaje-estado error" style="display:block; grid-column: 1 / -1;">Error al cargar ofertas flash: ${error.message}</div>`;
  } finally {
    flashOffersDisplayLoader.style.display = 'none';
  }
}
// ---------------------------------------------------------------------------------

/**
 * Crea una tarjeta de oferta flash con efecto de inclinación 3D.
 * @param {Object} offer - Objeto con los datos de la oferta (fileId, fileName, title, description, url, fileType).
 * @returns {HTMLElement} El elemento HTML de la tarjeta.
 */
function createFlashOfferCard(offer) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'tilt-card-wrapper';
    // El data-file-id se usará ahora para el ID del archivo de Drive
    cardWrapper.dataset.fileId = offer.fileId; 
    cardWrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`; // Estado inicial

    // Lógica para el efecto de inclinación 3D
    let currentTilt = { x: 0, y: 0 }; // Estado interno para el tilt

    const handleMove = (e) => {
        const { left, top, width, height } = cardWrapper.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        currentTilt = { x: y * -TILT_THRESHOLD, y: x * TILT_THRESHOLD };
        cardWrapper.style.transform = `perspective(1000px) rotateX(${currentTilt.x}deg) rotateY(${currentTilt.y}deg)`;
    };

    const handleLeave = () => {
        currentTilt = { x: 0, y: 0 };
        cardWrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    };

    cardWrapper.addEventListener('mousemove', handleMove);
    cardWrapper.addEventListener('mouseleave', handleLeave);

    let mediaContent;
    const isPDF = offer.fileType === 'application/pdf';

    if (isPDF) {
        mediaContent = `
            <div class="tilt-card-pdf-placeholder">
                ${ICON_PDF_SVG}
                <p>Haz clic para ver el PDF</p>
            </div>
        `;
    } else {
        // La URL de Drive para imágenes funciona directamente
        mediaContent = `<img src="${offer.url}" alt="${offer.title || 'Oferta Flash'}" class="tilt-card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/400x220?text=Imagen+No+Disponible'">`;
    }

    cardWrapper.innerHTML = `
        <div class="tilt-card-image-container">
            ${mediaContent}
        </div>
        <h3 class="tilt-card-title">${offer.title || 'Oferta sin Título'}</h3>
        <p class="tilt-card-description">${offer.description || 'No hay descripción disponible para esta oferta.'}</p>
        <div class="card-actions">
            <button class="btn-principal view-offer-btn" data-offer-url="${offer.url}" data-file-type="${offer.fileType}">Ver Oferta</button>
            <button class="btn-secundario btn-delete-flash-offer" data-file-id="${offer.fileId}">
                ${ICON_TRASH_SVG} Eliminar
            </button>
        </div>
    `;

    return cardWrapper;
}


function mostrarKPIs() { showSection('kpi-content'); if (kpiCardsContainer) kpiCardsContainer.style.display = 'grid'; if (tablaContainer) tablaContainer.style.display = 'none'; if (!kpiDataGlobal || !kpiDataGlobal.datos) { cargarDatosAdaptado("kpi"); } else { if (kpiDataGlobal.datos) popularKPICards(kpiDataGlobal.datos); if (kpiDataGlobal.facturacion) popularFacturacionCard(kpiDataGlobal.facturacion.total); } }
function mostrarFaltantes() { showSection('kpi-content'); if (kpiCardsContainer) kpiCardsContainer.style.display = 'none'; if (tablaContainer) tablaContainer.style.display = 'block'; cargarDatosAdaptado("faltantes");  }
function mostrarOfertasMes() { showSection('ofertas-mes'); cargarPlanesDesdeSheets().then(() => { if (!document.getElementById('movil-plans-cards-container').hasChildNodes()) showMovilPlans('monolinea'); if (!document.getElementById('hogar-plans-cards-container').hasChildNodes()) showHogarPlans('fibra'); }); }
function mostrarBuscadorVentas() { showSection('buscador-ventas-content'); }
function mostrarSimuladorComision() { showSection('tabla-remuneracion'); if (outputSimulacion) outputSimulacion.style.display = 'none'; if (simEntradasVozInput) simEntradasVozInput.value = ""; if (simEntradasFoInput) simEntradasFoInput.value = ""; if (simEntradasTotalizacionInput) simEntradasTotalizacionInput.value = ""; if (simEntradasIsnInput) simEntradasIsnInput.value = ""; if (simEntradasAdhesionInput) simEntradasAdhesionInput.value = ""; cargarYMostrarKPIsFijos(); cargarYMostrarTablaFactoresPPM(); crearGraficoPesosKPI(); }
function mostrarEnlacesExternos() { showSection('enlaces-externos'); }
function mostrarPoliticasVentas() { showSection('politicas-ventas'); }
function mostrarProspectos() { showSection('prospectos-content'); if (prospectoMensaje) { prospectoMensaje.innerHTML = ''; prospectoMensaje.className = 'mensaje-estado'; } }
function mostrarAsistenteAI() { showSection('asistente-ai-content'); if (aiChatLog && aiChatLog.children.length === 0) { startNewAIChat(); } }
function calcularYMostrarObjetivosDiarios(kpis) {
  if (!kpis || kpis.length === 0) {
    document.querySelectorAll('.meta-diaria-texto').forEach(el => el.textContent = 'N/D');
    return;
  }

  const hoy = new Date();
  const diasDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  const diasRestantes = Math.max(1, hoy.getDate()); // Corregido: dias restantes es cuántos días del mes han pasado para el promedio
                                                   // o Math.max(1, diasDelMes - hoy.getDate() + 1) para la meta diaria restante.
                                                   // Lo dejare como tu logica original lo procesa
  const kpisParaObjetivos = [
    { nombreHoja: 'VOZ', idElemento: 'objetivo-voz', unidad: ' Und.' },
    { nombreHoja: 'FO', idElemento: 'objetivo-fo', unidad: ' Und.' },
    { nombreHoja: 'N° TERMINALES', idElemento: 'objetivo-terminales', unidad: ' Und.' },
    { nombreHoja: 'ACCESORIOS', idElemento: 'objetivo-accesorios', formatoMoneda: true, unidad: '$' },
    { nombreHoja: 'SEGUROS', idElemento: 'objetivo-seguros', unidad: ' Und.' }
  ];

  kpisParaObjetivos.forEach(objKpi => {
    const kpiData = kpis.find(k => k.kpi && k.kpi.trim().toUpperCase() === objKpi.nombreHoja.trim().toUpperCase());
    const elItem = document.getElementById(objKpi.idElemento);

    if (!elItem) return;
    const elTxt = elItem.querySelector('.meta-diaria-texto');
    if (!elTxt) return;

    if (kpiData) {
      const metaM = parseFloat(kpiData.valor100) || 0;
      const resActSinArr = parseFloat(kpiData.resultado) || 0; // Se usa 'resultado' en tu backend para este cálculo

      const faltanteT = metaM - resActSinArr;

      if (faltanteT <= 0) {
        elTxt.textContent = "¡Meta Cumplida!";
        elTxt.style.color = "var(--sidebar-left-border)"; // Color de éxito
      } else {
        const diasRestantesParaMeta = Math.max(1, diasDelMes - hoy.getDate() + 1); // Días restantes incluyendo hoy
        const metaD = Math.ceil(faltanteT / diasRestantesParaMeta); // Meta diaria para cumplir lo que falta
        let txtMeta = objKpi.formatoMoneda ? formatNumber(metaD) : metaD;
        
        elTxt.textContent = `${txtMeta}${objKpi.unidad || ''}`;
        elTxt.style.color = "var(--sidebar-left-heading)"; // Color estándar
      }
    } else {
      elTxt.textContent = 'N/D';
      elTxt.style.color = 'var(--text-color-secondary)';
    }
  });
}

function cargarDatosParaObjetivosDiarios() { document.querySelectorAll('.meta-diaria-texto').forEach(el => el.textContent = 'Calculando...'); fetch(`${APPS_SCRIPT_URL}?tipo=kpi`).then(response => response.ok ? response.json() : response.text().then(text => { throw new Error(`HTTP ${response.status}: ${text}`) })).then(data => { if (data.error && !data.success) throw new Error(data.error); kpiDataGlobal = data; if(data.datos && Array.isArray(data.datos)) calcularYMostrarObjetivosDiarios(data.datos); else calcularYMostrarObjetivosDiarios([]); }).catch(err => { console.error("Error cargando datos para Objetivos Diarios:", err); document.querySelectorAll('.meta-diaria-texto').forEach(el => { el.textContent = 'Error'; el.style.color = 'var(--kpi-progress-rojo)';}); }); }
function popularKPICards(kpis) { if (!kpiCardsContainer) return; Array.from(kpiCardsContainer.querySelectorAll('.card:not(.facturacion-card)')).forEach(card => card.remove()); const kpisRelevantes = ['VOZ', 'FO', 'N° TERMINALES', 'ACCESORIOS', 'SEGUROS']; const hoy = new Date(), diaAct = hoy.getDate(), diasMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate(); let kpiCardElements = []; kpisRelevantes.forEach(nomKpiRel => { const kpiD = kpis.find(k => k.kpi && k.kpi.trim().toUpperCase() === nomKpiRel.trim().toUpperCase()); const iconSvg = KPI_ICONS[nomKpiRel.toUpperCase()] || KPI_ICONS['DEFAULT_KPI']; const kpiIdentifier = nomKpiRel.toUpperCase().replace(/[^A-Z0-9\s]/g, '').replace(/\s+/g, '_'); const meta = kpiD ? (parseFloat(kpiD.valor100) || 0) : 0;
        const resConArr = kpiD ? (parseFloat(kpiD.total) || 0) : 0;
        const esMon = nomKpiRel.toUpperCase().includes('ACCESORIOS');
        let porcCumpl = meta > 0 ? (resConArr / meta) * 100 : (resConArr > 0 ? 100 : 0);
        porcCumpl = Math.max(0, porcCumpl);
        const propDiasTr = diasMes > 0 ? diaAct / diasMes : 0;
        const metaEspHoy = meta * propDiasTr;
        const resActSinArr = kpiD ? (parseFloat(kpiD.resultado) || 0) : 0;
        let colorUrgencia = (resActSinArr >= meta && meta > 0) || (meta === 0 && resConArr > 0) ? 'verde' : (resActSinArr >= metaEspHoy ? 'amarillo' : 'rojo');
        let proyeccionValor = 0;
        if (diaAct > 0 && resConArr > 0 && diasMes > 0) proyeccionValor = (resConArr / diaAct) * diasMes;
        else if (resConArr > 0) proyeccionValor = resConArr;
        const valorDisplay = kpiD ? `${esMon ? '$' : ''}${formatNumber(resConArr)}` : 'N/D';
        const metaDisplay = kpiD ? `${esMon ? '$' : ''}${formatNumber(meta)}` : '-';
        const proyDisplay = kpiD ? `${esMon ? '$' : ''}${formatNumber(proyeccionValor)}` : '-';
        const porcDisplay = kpiD ? porcCumpl.toFixed(1) + '%' : '0%';
        const barWidth = Math.min(porcCumpl, 100);

        let cardHTML = `
        <div class="card kpi-uiverse-card kpi-urgencia-${colorUrgencia}">
          <div class="kpi-blob kpi-blob-${colorUrgencia}"></div>
          <div class="kpi-bg"></div>
          <div class="kpi-top-section">
            <div class="kpi-top-header">
              <div class="kpi-icon-uiverse">${iconSvg}</div>
              <span class="kpi-nombre-top">${kpiD ? kpiD.kpi : nomKpiRel}</span>
            </div>
            <div class="kpi-valor-grande">${valorDisplay}</div>
          </div>
          <div class="kpi-bottom-section">
            <div class="kpi-barra-wrap">
              <div class="kpi-barra-track">
                <div class="kpi-barra-fill kpi-barra-${colorUrgencia}" style="width:${barWidth}%"></div>
              </div>
              <span class="kpi-porc-label">${porcDisplay}</span>
            </div>
            <div class="kpi-row-stats">
              <div class="kpi-stat-item">
                <span class="kpi-stat-big">${metaDisplay}</span>
                <span class="kpi-stat-label">Meta</span>
              </div>
              <div class="kpi-stat-item">
                <span class="kpi-stat-big">${proyDisplay}</span>
                <span class="kpi-stat-label">Proyección</span>
              </div>
              <div class="kpi-stat-item kpi-stat-action">
                <button class="btn-details kpi-btn-ver" data-kpi="${kpiIdentifier}">Ver más</button>
              </div>
            </div>
          </div>
        </div>`; const tempDiv = document.createElement('div'); tempDiv.innerHTML = cardHTML.trim(); if (tempDiv.firstChild) { kpiCardElements.push(tempDiv.firstChild); } }); const factCard = kpiCardsContainer.querySelector('.facturacion-card'); kpiCardElements.forEach(cardEl => { if (factCard) { kpiCardsContainer.insertBefore(cardEl, factCard); } else { kpiCardsContainer.appendChild(cardEl); } }); kpiCardElements.forEach((card, index) => { requestAnimationFrame(() => { setTimeout(() => { card.classList.add('card-visible'); }, index * 75); }); }); }
function popularFacturacionCard(totalFacturacion) { if (!kpiCardsContainer) return; let factCardElement = kpiCardsContainer.querySelector('.facturacion-card'); const iconSvg = KPI_ICONS['FACTURACION'] || KPI_ICONS['DEFAULT_KPI']; const valForm = totalFacturacion != null ? formatNumber(totalFacturacion) : 'N/D'; let cardContentHTML = `<div class="kpi-icon-wrapper" aria-hidden="true">${iconSvg}</div>`; cardContentHTML += `<h3>Total Facturación</h3><p class="valor">$${valForm}</p>`; let barraHTML = '<p class="detalle-kpi">Monto total facturado este mes.</p>', proyeccionFactHTML = ''; const hoy = new Date(), diaAct = hoy.getDate(), diasMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate(); if (kpiDataGlobal && kpiDataGlobal.datos) { const kpiMetaFac = kpiDataGlobal.datos.find(k => k.kpi && k.kpi.trim().toUpperCase() === "FACTURACIÓN META MENSUAL"); if (kpiMetaFac) { const metaF = parseFloat(kpiMetaFac.valor100) || 0; if (metaF > 0) { const resF = parseFloat(totalFacturacion) || 0, porcF = (resF / metaF) * 100; const propDT = diasMes > 0 ? diaAct / diasMes : 0, metaEHFac = metaF * propDT; let colorF = resF >= metaF ? 'verde' : (resF >= metaEHFac ? 'amarillo' : 'rojo'); barraHTML = `<div class="barra-progreso-kpi"><div class="progreso-kpi ${colorF}" style="width:${Math.min(porcF,100)}%;" title="${porcF.toFixed(1)}%">${porcF > 15 ? porcF.toFixed(0) + '%' : ''}</div></div><p class="detalle-kpi">Meta Fact.: $${formatNumber(metaF)} (${porcF.toFixed(1)}%)</p>`; } } } if (totalFacturacion != null) { let proyValFact = 0; const factAct = parseFloat(totalFacturacion) || 0; if (diaAct > 0 && factAct > 0 && diasMes > 0) proyValFact = (factAct / diaAct) * diasMes; else if (factAct > 0) proyValFact = factAct; proyeccionFactHTML = `<p class="detalle-kpi proyeccion-kpi">Proyección Fact.: $${formatNumber(proyValFact)}</p>`; } cardContentHTML += `${barraHTML}${proyeccionFactHTML}`; if (!factCardElement) { factCardElement = document.createElement('div'); factCardElement.className = 'card facturacion-card'; kpiCardsContainer.appendChild(factCardElement); } factCardElement.innerHTML = cardContentHTML; if (factCardElement && !factCardElement.classList.contains('card-visible')) { requestAnimationFrame(() => { const numKPIcards = kpiCardsContainer.querySelectorAll('.card:not(.facturacion-card)').length; setTimeout(() => factCardElement.classList.add('card-visible'), numKPIcards * 75); }); } }
function _mostrarTablaDatosFaltantes(datos) { if (tablaDatos && errorContainer) { if (!Array.isArray(datos) || datos.length === 0) { errorContainer.innerHTML = `<div class='info-message'>ℹ️ No hay datos de faltantes.</div>`; tablaDatos.innerHTML = ''; return; } errorContainer.innerHTML = ''; let html = "<thead><tr><th>KPI</th><th>Faltante 100%</th><th>Faltante 150%</th><th>Faltante 250%</th></tr></thead><tbody>"; datos.forEach(fila => { const kpiNameUpper = (fila.kpi || '').trim().toUpperCase(); const iconSvg = KPI_ICONS[kpiNameUpper] || KPI_ICONS['DEFAULT_KPI']; const kpiCellContent = `<span class="kpi-icon-wrapper" aria-hidden="true">${iconSvg}</span> ${fila.kpi || '-'}`; html += `<tr><td>${kpiCellContent}</td><td>${formatNumber(fila.faltante100)}</td><td>${formatNumber(fila.faltante150)}</td><td>${formatNumber(fila.faltante250)}</td></tr>`; }); html += "</tbody>"; tablaDatos.innerHTML = html; } }
function cargarDatosAdaptado(tipo) { if (loader) loader.style.display = 'flex'; if (tablaDatos) tablaDatos.innerHTML = ''; if (errorContainer) errorContainer.innerHTML = ''; if (tipo === "kpi" && kpiCardsContainer) { Array.from(kpiCardsContainer.querySelectorAll('.card:not(.facturacion-card)')).forEach(card => card.remove()); const factCard = kpiCardsContainer.querySelector('.facturacion-card'); if (factCard) factCard.remove(); } fetch(`${APPS_SCRIPT_URL}?tipo=${tipo}`).then(response => response.ok ? response.json() : response.text().then(text => { throw new Error(`HTTP ${response.status} para '${tipo}': ${text}`) })).then(data => { if (data.error && !data.success) throw new Error(`API Error '${tipo}': ${data.error}`); if (loader) loader.style.display = 'none'; if (tipo === "kpi") { kpiDataGlobal = data; if (data.datos && Array.isArray(data.datos) && data.datos.length > 0) { popularKPICards(data.datos); } else if (kpiCardsContainer && !kpiCardsContainer.querySelector('.facturacion-card')) { kpiCardsContainer.innerHTML = "<p>No hay datos KPI para mostrar en tarjetas.</p>"; } if (data.facturacion) { popularFacturacionCard(data.facturacion.total); } } else if (tipo === "faltantes") { if (data.datos && Array.isArray(data.datos)) _mostrarTablaDatosFaltantes(data.datos); else if (errorContainer) errorContainer.innerHTML = `<div class='info-message'>ℹ️ No hay datos de faltantes para mostrar.</div>`; } }).catch(err => { console.error(`Error cargando datos para '${tipo}':`, err); if (loader) loader.style.display = 'none'; if (tipo === "kpi" && kpiCardsContainer) kpiCardsContainer.innerHTML = `<div class="mensaje-estado error" style="display:block; grid-column:1/-1;">❌ Error al cargar tarjetas KPI: ${err.message}</div>`; if (errorContainer) errorContainer.innerHTML = `<div class="mensaje-estado error">❌ Error al cargar tabla (${tipo}): ${err.message}</div>`; }); }
function showHogarPlans(type){ const c=document.getElementById('hogar-plans-cards-container'); if(!c)return; c.innerHTML=''; c.dataset.currentType = type;  if(!hogarPagePlansData[type]||hogarPagePlansData[type].length===0){c.innerHTML='<p style="text-align:center;padding:20px;">No hay planes de este tipo para mostrar.</p>';return} hogarPagePlansData[type].forEach(p=>{ const cd=document.createElement('div'); cd.className='card'; cd.innerHTML=`<h3>${p.velocidad}</h3><p>${p.detalles||''}</p><p>Desc: <strong>${p.descuento}</strong></p><p class="plan-precio">Precio: ${p.precio}/mes</p><button onclick="openHogarForm('${p.id}', '${encodeURIComponent(p.velocidad)}')">Solicitar</button>`; c.appendChild(cd);}); }
function openHogarForm(planId = null, planNombreEncoded = '') { const popup = document.getElementById('hogar-plan-formPopup'); const overlay = document.getElementById('hogar-plan-overlay'); const iframe = document.getElementById('hogar-plan-google-form-iframe'); if (!popup || !overlay || !iframe) { console.error("Elementos del popup hogar no encontrados"); return; } let formUrl = GOOGLE_FORM_URL_HOGAR; if (iframe.src !== formUrl) iframe.src = formUrl; popup.style.display = 'flex'; requestAnimationFrame(() => popup.classList.add('visible')); overlay.style.display = 'block'; requestAnimationFrame(() => overlay.classList.add('visible')); document.body.style.overflow = 'hidden'; }
function closeHogarForm() { const popup = document.getElementById('hogar-plan-formPopup'); const overlay = document.getElementById('hogar-plan-overlay'); if (popup) { popup.classList.remove('visible'); popup.addEventListener('transitionend', function onEnd() { if (!popup.classList.contains('visible')) popup.style.display = 'none'; popup.removeEventListener('transitionend', onEnd);}, { once: true }); } if (overlay) { overlay.classList.remove('visible'); overlay.addEventListener('transitionend', function onEnd() { if (!overlay.classList.contains('visible')) overlay.style.display = 'none'; overlay.removeEventListener('transitionend', onEnd);}, { once: true }); } document.body.style.overflow = ''; }
function toggleOriginalHogarIframe(buttonClicked){ const ic=document.getElementById('parrilla-hogar-iframe-original-container'); const pc=document.getElementById('parrilla-planes-hogar-integrada'); if(!ic || !pc) return; const isPlanesCurrentlyVisible = pc.style.display === 'block'; if(isPlanesCurrentlyVisible){ pc.style.display = 'none'; ic.style.display = 'block'; const btnEnIframe = ic.querySelector('.boton-simple'); if(btnEnIframe) btnEnIframe.textContent = '← Volver a Planes'; cargarParrillaFile('hogar'); } else { ic.style.display = 'none'; pc.style.display = 'block'; const btnEnPlanes = pc.querySelector('.boton-simple'); if(btnEnPlanes) btnEnPlanes.textContent = 'Más detalles'; const hogarCardsContainer = document.getElementById('hogar-plans-cards-container'); if (hogarCardsContainer && hogarCardsContainer.children.length === 0) showHogarPlans('fibra'); } }



function copiarCodigo(btn, codigo) {
    navigator.clipboard.writeText(codigo).then(() => {
        btn.textContent = '✅ Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '📋 ' + codigo;
            btn.classList.remove('copied');
        }, 1800);
    }).catch(() => {
        btn.textContent = '✅ ' + codigo;
    });
}
function showMovilPlans(type) {
    const container = document.getElementById('movil-plans-cards-container');
    if (!container) return;
    container.innerHTML = '';
    container.dataset.currentType = type;
    const plans = movilPagePlansData[type];
    if (!plans || plans.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:20px;">No hay planes de este tipo para mostrar.</p>';
        return;
    }
    plans.forEach(plan => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card parrilla-movil-card-item';
        const caracteristicasSource = plan.caracteristicas || plan.caracteristicasDestino || [];
        const caracteristicasHTML = caracteristicasSource.length > 0
            ? '<ul class="plan-features">' + caracteristicasSource.map(c => `<li>${c}</li>`).join('') + '</ul>'
            : '';
        const tituloPlan = type === 'migracion' ? (plan.destino || plan.nombre || '') : (plan.nombre || '');
        const codigoMatch = caracteristicasSource.find(c => c.toLowerCase().includes('código:'));
        const codigoVal = codigoMatch ? codigoMatch.split('Código:')[1]?.trim() : null;
        const btnCopiar = codigoVal ? `<button class="btn-copy-codigo" onclick="copiarCodigo(this, '${codigoVal}')">📋 ${codigoVal}</button>` : '';
        let innerContent = '';
        if (type === 'migracion') {
            innerContent = `<div class="plan-inner">
                <h3>${tituloPlan}</h3>
                <p style="font-size:0.82em;color:var(--text-color-secondary);margin:0"><strong>Desde:</strong> ${plan.origen || 'Plan Actual'}</p>
                <p style="font-size:0.85em;color:var(--color-orange-accent);margin:0"><strong>Oferta:</strong> ${plan.oferta || plan.descuento || ''}</p>
                ${caracteristicasHTML}
                <div class="plan-action"><button class="btn-solicitar-plan" onclick="openMovilForm('${plan.id}', '${encodeURIComponent(tituloPlan)}')">Solicitar Plan</button>${btnCopiar}</div>
            </div>`;
        } else {
            const precio = plan.precio || '';
            innerContent = `<div class="plan-inner">
                ${precio ? `<div class="plan-pricing-badge">${precio}</div>` : ''}
                <h3>${tituloPlan}</h3>
                ${plan.precioAdicional ? `<p style="font-size:0.8em;color:var(--text-color-secondary);margin:0">${plan.precioAdicional}</p>` : ''}
                ${caracteristicasHTML}
                ${plan.descuento ? `<p class="plan-descuento">🏷️ ${plan.descuento}</p>` : ''}
                <div class="plan-action"><button class="btn-solicitar-plan" onclick="openMovilForm('${plan.id}', '${encodeURIComponent(tituloPlan)}')">Solicitar Plan</button>${btnCopiar}</div>
            </div>`;
        }
        cardDiv.innerHTML = innerContent;
        container.appendChild(cardDiv);
    });
}
function openMovilForm(planId = null, planNombreEncoded = '') { const popup = document.getElementById('movil-plan-formPopup'); const overlay = document.getElementById('movil-plan-overlay'); const iframe = document.getElementById('movil-plan-google-form-iframe'); if (!popup || !overlay || !iframe) { console.error("Elementos del popup móvil no encontrados"); return; } let formUrl = GOOGLE_FORM_URL_MOVIL; if (iframe.src !== formUrl) { iframe.src = formUrl; } popup.style.display = 'flex'; requestAnimationFrame(() => popup.classList.add('visible')); overlay.style.display = 'block'; requestAnimationFrame(() => overlay.classList.add('visible')); document.body.style.overflow = 'hidden'; }
function closeMovilForm() { const popup = document.getElementById('movil-plan-formPopup'); const overlay = document.getElementById('movil-plan-overlay'); if (popup) { popup.classList.remove('visible'); popup.addEventListener('transitionend', function onEnd() { if (!popup.classList.contains('visible')) popup.style.display = 'none'; popup.removeEventListener('transitionend', onEnd); }, { once: true }); } if (overlay) { overlay.classList.remove('visible'); overlay.addEventListener('transitionend', function onEnd() { if (!overlay.classList.contains('visible')) overlay.style.display = 'none'; overlay.removeEventListener('transitionend', onEnd); }, { once: true }); } document.body.style.overflow = ''; }
function toggleOriginalMovilIframe(buttonClicked) { const ic = document.getElementById('parrilla-movil-iframe-original-container'); const pc = document.getElementById('parrilla-planes-movil-integrada'); if (!ic || !pc) return; const isPlanesCurrentlyVisible = pc.style.display === 'block'; if(isPlanesCurrentlyVisible){ pc.style.display = 'none'; ic.style.display = 'block'; const btnEnIframe = ic.querySelector('.boton-simple'); if(btnEnIframe) btnEnIframe.textContent = '← Volver a Planes Destacados'; cargarParrillaFile('movil'); } else { ic.style.display = 'none'; pc.style.display = 'block'; const btnEnPlanes = pc.querySelector('.boton-simple'); if(btnEnPlanes) btnEnPlanes.textContent = 'Ver Parrilla Completa (Hoja de Cálculo)'; const movilCardsContainer = document.getElementById('movil-plans-cards-container'); if (movilCardsContainer && movilCardsContainer.children.length === 0) showMovilPlans('monolinea'); } }
function guardarProspecto(event) { if (event) event.preventDefault(); const nomIn = document.getElementById('prospecto-nombre'), rutIn = document.getElementById('prospecto-rut'), telIn = document.getElementById('prospecto-telefono'), mailIn = document.getElementById('prospecto-email'), notIn = document.getElementById('prospecto-notas'); if (!nomIn || !rutIn || !telIn || !mailIn || !notIn || !prospectoMensaje || !prospectoLoader || !guardarProspectoBtn || !prospectoForm) { if (prospectoMensaje) { prospectoMensaje.textContent = "Error: Elementos del formulario no encontrados."; prospectoMensaje.className = 'mensaje-estado error'; prospectoMensaje.style.display = 'block'; } return;  } const nom = nomIn.value.trim(); if (!nom) { prospectoMensaje.textContent = "El campo Nombre es obligatorio."; prospectoMensaje.className = 'mensaje-estado error'; prospectoMensaje.style.display = 'block'; nomIn.focus(); return; } prospectoMensaje.innerHTML = ''; prospectoMensaje.className = 'mensaje-estado'; prospectoLoader.style.display = 'inline'; guardarProspectoBtn.disabled = true; const payload = { action: 'addProspect', data: { nombre: nom, rut: rutIn.value.trim(), telefono: telIn.value.trim(), email: mailIn.value.trim(), notas: notIn.value.trim() }}; fetch(APPS_SCRIPT_URL, { method: 'POST', cache: 'no-cache', redirect: 'follow', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify(payload)}) .then(res => res.json()) .then(result => { if (!result) { throw new Error("Respuesta vacía del servidor."); } prospectoMensaje.textContent = result.message || (result.success ? "Prospecto guardado con éxito." : "Error desconocido al guardar prospecto."); prospectoMensaje.className = result.success ? 'mensaje-estado exito' : 'mensaje-estado error'; prospectoMensaje.style.display = 'block'; if (result.success) { prospectoForm.reset(); showToast("Prospecto guardado con éxito", "success"); } else { showToast(result.message || "Error al guardar prospecto", "error"); } }) .catch(err => { console.error("Error en fetch guardarProspecto:", err); prospectoMensaje.textContent = `Error al guardar: ${err.message}`; prospectoMensaje.className = 'mensaje-estado error'; prospectoMensaje.style.display = 'block'; showToast(`Error al guardar prospecto: ${err.message}`, "error"); }) .finally(() => { prospectoLoader.style.display = 'none';  guardarProspectoBtn.disabled = false; }); }
function buscarVentas(event) { if (event) event.preventDefault(); const nombre = buscarNombreInput ? buscarNombreInput.value.trim() : ""; const ordenAloha = buscarOrdenAlohaInput ? buscarOrdenAlohaInput.value.trim() : ""; const rut = buscarRutInput ? buscarRutInput.value.trim() : ""; if (!nombre && !ordenAloha && !rut) { if (resultadosVentasMensaje) { resultadosVentasMensaje.textContent = "Por favor, ingresa al menos un criterio de búsqueda."; resultadosVentasMensaje.className = 'mensaje-estado info'; resultadosVentasMensaje.style.display = 'block'; } if (resultadosVentasContainer) resultadosVentasContainer.innerHTML = ''; return; } if (resultadosVentasLoader) resultadosVentasLoader.style.display = 'flex'; if (resultadosVentasMensaje) resultadosVentasMensaje.style.display = 'none'; if (resultadosVentasContainer) resultadosVentasContainer.innerHTML = ''; const params = new URLSearchParams({ action: 'buscarventas', nombre: nombre, ordenAloha: ordenAloha, rut: rut }); fetch(`${APPS_SCRIPT_URL}?${params.toString()}`).then(response => response.ok ? response.json() : response.text().then(text => { throw new Error(`Error de red o servidor: ${response.status} ${text}`); })).then(result => { if (resultadosVentasLoader) resultadosVentasLoader.style.display = 'none'; if (result.success && result.data) { if (result.count > 0) { if (resultadosVentasMensaje) resultadosVentasMensaje.style.display = 'none'; displayVentasResults(result.data); } else { if (resultadosVentasMensaje) { resultadosVentasMensaje.textContent = result.message || "No se encontraron ventas con los criterios ingresados."; resultadosVentasMensaje.className = 'mensaje-estado info'; resultadosVentasMensaje.style.display = 'block';} } } else { throw new Error(result.error || "Error desconocido al buscar ventas."); } }).catch(error => { console.error("Error en buscarVentas:", error); if (resultadosVentasLoader) resultadosVentasLoader.style.display = 'none'; if (resultadosVentasMensaje) { resultadosVentasMensaje.textContent = `Error: ${error.message}`; resultadosVentasMensaje.className = 'mensaje-estado error'; resultadosVentasMensaje.style.display = 'block';} }); }
function displayVentasResults(ventas) { if (!resultadosVentasContainer) return; resultadosVentasContainer.innerHTML = ''; if (!ventas || ventas.length === 0) return; ventas.forEach((venta, index) => { const vcard = document.createElement('div'); vcard.className = 'vcard'; let headerHTML = `<div class="vcard-header"><h4 class="vcard-name">${venta.nombreCompleto || 'Nombre no disponible'}</h4><span class="vcard-rut">${venta.rutCliente || 'RUT no disponible'}</span></div>`; let contactInfoHTML = `<div class="vcard-contact-info"><span class="vcard-info-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg> ${venta.fecha || 'N/A'}</span>`; if (venta.suscripcion && venta.suscripcion !== '-') contactInfoHTML += `<span class="vcard-info-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Suscripción: ${venta.suscripcion}</span>`; if (venta.numeroOrden && venta.numeroOrden !== '-') contactInfoHTML += `<span class="vcard-info-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg> N° Orden: ${venta.numeroOrden}</span>`; if (venta.aloha && venta.aloha !== '-') contactInfoHTML += `<span class="vcard-info-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hash"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg> N° Aloha: ${venta.aloha}</span>`; contactInfoHTML += `</div>`; let bodyHTML = `<div class="vcard-body">`; if (venta.tipoVenta && venta.tipoVenta !== '-') bodyHTML += `<div class="vcard-section"><span class="vcard-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Detalle Venta</span><p class="vcard-detail-item"><span class="vcard-label">Tipo:</span> ${venta.tipoVenta}</p>${(venta.terminales && venta.terminales !== '-') ? `<p class="vcard-detail-item"><span class="vcard-label">Terminales:</span> ${venta.terminales}</p>` : ''}<p class="vcard-detail-item"><span class="vcard-label">Firma:</span> ${venta.firma}</p>${(venta.maestro && venta.maestro !== '-') ? `<p class="vcard-detail-item"><span class="vcard-label">Maestro:</span> ${venta.maestro}</p>` : ''}${(venta.cantidadMovil && venta.cantidadMovil !== '-') ? `<p class="vcard-detail-item"><span class="vcard-label">Cant. Móvil:</span> ${venta.cantidadMovil}</p>` : ''}</div>`; let otrosDetalles = ''; if (venta.accesorio && venta.accesorio !== '-') otrosDetalles += `<p class="vcard-detail-item"><span class="vcard-label">Accesorio:</span> ${venta.accesorio}</p>`; if (venta.seguro && venta.seguro !== '-') otrosDetalles += `<p class="vcard-detail-item"><span class="vcard-label">Seguro:</span> ${venta.seguro}</p>`; if (venta.instalacion && venta.instalacion !== '-') otrosDetalles += `<p class="vcard-detail-item"><span class="vcard-label">Instalación:</span> ${venta.instalacion}</p>`; if (venta.rgu && venta.rgu !== '-') otrosDetalles += `<p class="vcard-detail-item"><span class="vcard-label">RGU:</span> ${venta.rgu}</p>`; if (venta.qCelulares && venta.qCelulares !== '-') otrosDetalles += `<p class="vcard-detail-item"><span class="vcard-label">Q Celulares:</span> ${venta.qCelulares}</p>`; if (otrosDetalles) { bodyHTML += `<div class="vcard-section"><span class="vcard-section-title"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-plus"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/></svg> Adicionales</span>${otrosDetalles}</div>`; } bodyHTML += `</div>`; vcard.innerHTML = headerHTML + contactInfoHTML + bodyHTML; resultadosVentasContainer.appendChild(vcard); requestAnimationFrame(() => { setTimeout(() => { vcard.classList.add('vcard-visible'); }, index * 100); }); }); }
function cargarYMostrarKPIsFijos() { if (!kpisFijosLoader || !kpisFijosErrorElem) return; kpisFijosLoader.style.display = 'flex'; kpisFijosErrorElem.style.display = 'none'; const kpiSpansIds = [ 'kpi-fijo-voz-real-val', 'kpi-fijo-voz-meta-val', 'kpi-fijo-fo-real-val', 'kpi-fijo-fo-meta-val', 'kpi-fijo-gestionvalor-real-val', 'kpi-fijo-gestionvalor-meta-val', 'kpi-fijo-isn-real-val', 'kpi-fijo-isn-meta-val', 'kpi-fijo-adhesion-real-val', 'kpi-fijo-adhesion-meta-val', 'kpi-fijo-terminales-real-val', 'kpi-fijo-accesorios-real-val' ]; kpiSpansIds.forEach(id => { const span = document.getElementById(id); if (span) span.textContent = '-'; }); fetch(`${APPS_SCRIPT_URL}?action=getfixedkpisfordisplay`).then(response => response.json()).then(result => { if (kpisFijosLoader) kpisFijosLoader.style.display = 'none'; if (result.success && result.data) { const data = result.data; const idsTargets = { 'kpi-fijo-voz-real-val': data.vozReal, 'kpi-fijo-voz-meta-val': data.vozMeta, 'kpi-fijo-fo-real-val': data.foReal, 'kpi-fijo-fo-meta-val': data.foMeta, 'kpi-fijo-gestionvalor-real-val': data.gestionValorReal, 'kpi-fijo-gestionvalor-meta-val': data.gestionValorMeta, 'kpi-fijo-isn-real-val': data.isnReal, 'kpi-fijo-isn-meta-val': data.isnMeta, 'kpi-fijo-adhesion-real-val': data.adhesionReal, 'kpi-fijo-adhesion-meta-val': data.adhesionMeta, 'kpi-fijo-terminales-real-val': data.terminalesReal, 'kpi-fijo-accesorios-real-val': data.accesoriosReal }; for (const id in idsTargets) { const span = document.getElementById(id); if (span) span.textContent = formatNumber(idsTargets[id]) || '-'; } } else { throw new Error(result.error || "No se pudieron cargar los KPIs fijos."); } }).catch(error => { console.error("Error cargando KPIs fijos:", error); if (kpisFijosLoader) kpisFijosLoader.style.display = 'none'; if (kpisFijosErrorElem) { kpisFijosErrorElem.textContent = `Error al cargar KPIs actuales: ${error.message}`; kpisFijosErrorElem.className = 'mensaje-estado error'; kpisFijosErrorElem.style.display = 'block'; } }); }
function simularComision() { const inputs = { voz: simEntradasVozInput, fo: simEntradasFoInput, totalizacion: simEntradasTotalizacionInput, isn: simEntradasIsnInput, adhesion: simEntradasAdhesionInput }; if (!outputSimulacion || !simulacionLoader || !simulacionErrorElem || Object.values(inputs).some(input => !input) ) { console.error("Elementos del DOM para simulación no encontrados."); if(simulacionErrorElem) { simulacionErrorElem.textContent = "Error: Componentes de UI del simulador no encontrados."; simulacionErrorElem.className = 'mensaje-estado error'; simulacionErrorElem.style.display = 'block'; } return; } const params = new URLSearchParams({ action: 'calculatesimulatedcommission' }); let validInputs = true; for (const key in inputs) { const value = inputs[key].value.trim(); if (value === '' || isNaN(parseFloat(value))) { validInputs = false; break; } params.append(key, parseFloat(value)); } if (!validInputs) { if (simulacionErrorElem) { simulacionErrorElem.textContent = "Por favor, ingrese valores numéricos válidos para todas las entradas de simulación."; simulacionErrorElem.className = 'mensaje-estado error'; simulacionErrorElem.style.display = 'block'; } if (outputSimulacion) outputSimulacion.style.display = 'none'; return; } if (simulacionLoader) simulacionLoader.style.display = 'flex'; if (simulacionErrorElem) simulacionErrorElem.style.display = 'none'; if (outputSimulacion) outputSimulacion.style.display = 'none'; fetch(`${APPS_SCRIPT_URL}?${params.toString()}`).then(response => { if (!response.ok) { return response.text().then(text => { throw new Error(`Error del servidor en simulación: ${response.status} - ${text || response.statusText}`); }); } return response.json(); }).then(result => { if (simulacionLoader) simulacionLoader.style.display = 'none'; if (result.success && typeof result.porcentajeCumplimiento !== 'undefined' && typeof result.incentivoCLP !== 'undefined') { if (outputSimulacion) outputSimulacion.style.display = 'block'; if (resSimPorcentaje) resSimPorcentaje.textContent = formatNumber(result.porcentajeCumplimiento * 100); if (resSimIncentivo) resSimIncentivo.textContent = formatNumber(result.incentivoCLP); } else { throw new Error(result.error || "Respuesta inesperada del servidor al simular comisión."); } }).catch(error => { console.error("Error en simularComision fetch:", error); if (simulacionLoader) simulacionLoader.style.display = 'none'; if (simulacionErrorElem) { simulacionErrorElem.textContent = `Error en simulación: ${error.message}`; simulacionErrorElem.className = 'mensaje-estado error'; simulacionErrorElem.style.display = 'block'; } }); }
function cargarYMostrarTablaFactoresPPM() { if (!remuneracionLoaderTablaPPM || !tablaFactoresPPMRefElem) return; remuneracionLoaderTablaPPM.style.display = 'flex'; const thead = tablaFactoresPPMRefElem.querySelector('thead'); const tbody = tablaFactoresPPMRefElem.querySelector('tbody'); if (thead && tbody) { thead.innerHTML = '<tr><th>% Cumplimiento Desde</th><th>Factor</th><th>Incentivo CLP</th></tr>'; tbody.innerHTML = ''; } else { console.error("Thead/Tbody no encontrado para tablaFactoresPPMRefElem"); remuneracionLoaderTablaPPM.style.display = 'none'; return; } fetch(`${APPS_SCRIPT_URL}?action=getfactoresppm`).then(response => response.json()).then(result => { if (remuneracionLoaderTablaPPM) remuneracionLoaderTablaPPM.style.display = 'none'; if (result.success && result.data) { const tbody = tablaFactoresPPMRefElem.querySelector('tbody'); if (tbody) { result.data.forEach(fila => { const row = tbody.insertRow(); row.insertCell().textContent = (fila.porcentajecumplimientodesde !== undefined ? fila.porcentajecumplimientodesde : '-') + "%"; row.insertCell().textContent = formatNumber(fila.factor); row.insertCell().textContent = "$ " + formatNumber(fila.incentivoclp); }); } } else { throw new Error(result.error || "No se pudo cargar la tabla de factores PPM."); } }).catch(error => { console.error("Error cargando tabla de factores PPM:", error); if (remuneracionLoaderTablaPPM) remuneracionLoaderTablaPPM.style.display = 'none'; }); }
function crearGraficoPesosKPI() { if (!graficoPesosLoader || !graficoPesosErrorElem) return; graficoPesosLoader.style.display = 'flex'; graficoPesosErrorElem.style.display = 'none'; const ctx = document.getElementById('graficoPesosKPI'); if (!ctx) { console.error("Elemento canvas 'graficoPesosKPI' no encontrado."); if (graficoPesosLoader) graficoPesosLoader.style.display = 'none'; if (graficoPesosErrorElem) { graficoPesosErrorElem.textContent = "Error: No se pudo encontrar el lienzo del gráfico."; graficoPesosErrorElem.className = 'mensaje-estado error'; graficoPesosErrorElem.style.display = 'block'; } return; } const datosPesos = { labels: [ 'VOZ (' + (35).toFixed(0) + '%)', 'FO Terminada (' + (25).toFixed(0) + '%)', 'Totalización/Alta Conj. (' + (20).toFixed(0) + '%)', 'ISN (' + (10).toFixed(0) + '%)', 'Adhesión NBA (' + (10).toFixed(0) + '%)' ], datasets: [{ label: 'Peso del KPI', data: [35, 25, 20, 10, 10], backgroundColor: [ 'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)' ], borderColor: [ 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)' ], borderWidth: 1 }] }; if (graficoPesosKPIInstance) { graficoPesosKPIInstance.destroy(); } try { graficoPesosKPIInstance = new Chart(ctx, { type: 'doughnut', data: datosPesos, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { font: { size: 11 }, padding: 10 } }, tooltip: { callbacks: { label: function(context) { let label = context.dataset.label || ''; if (label) { label += ': '; } if (context.parsed !== null) { label += context.parsed + '%'; } return label; } } } } } }); if (graficoPesosLoader) graficoPesosLoader.style.display = 'none'; } catch (error) { console.error("Error creando el gráfico de pesos:", error); if (graficoPesosLoader) graficoPesosLoader.style.display = 'none'; if (graficoPesosErrorElem) { graficoPesosErrorElem.textContent = "Error al generar el gráfico de pesos."; graficoPesosErrorElem.style.display = 'block'; } } }
function handleHashChange() { const hash = window.location.hash.substring(1); const parts = hash.split('/'); const mainRoute = parts[0] || 'inicio'; closeMobileSidebar(); if (!isAuthenticated() && !UNPROTECTED_ROUTES.includes(mainRoute)) { sessionStorage.setItem('requestedHash', hash || 'inicio'); showLogin(); return; } showAppContent(); if (mainRoute !== 'kpis' && mainRoute !== 'faltantes') { if (kpiCardsContainer) kpiCardsContainer.style.display = 'grid'; if (tablaContainer) tablaContainer.style.display = 'none'; } if (mainRoute !== 'inicio' && slideshowInicio.timeoutId) clearTimeout(slideshowInicio.timeoutId); switch (mainRoute) { case 'inicio': mostrarInicio(); break; case 'kpis': mostrarKPIs(); break; case 'faltantes': mostrarFaltantes(); break; case 'ofertas-flash': mostrarOfertasFlash(); break; case 'ofertas-mes': mostrarOfertasMes(); break; case 'buscador-ventas': mostrarBuscadorVentas(); break; case 'tabla-remuneracion': mostrarSimuladorComision(); break; case 'enlaces-externos': mostrarEnlacesExternos(); break; case 'politicas-ventas': mostrarPoliticasVentas(); break; case 'prospectos': mostrarProspectos(); break; case 'asistente-ai': mostrarAsistenteAI(); break; case 'admin-panel': mostrarAdminPanel(); break; default: console.warn("Router: Ruta desconocida:", mainRoute, ". Redirigiendo a inicio."); window.location.hash = 'inicio'; break; } }
function appendMessageToLog(text, role) { if (!aiChatLog) return; const messageDiv = document.createElement('div'); messageDiv.className = `chat-message ${role}-message`; if (role === 'user') { messageDiv.textContent = text; } else { const cursor = document.createElement('span'); cursor.className = 'typing-cursor'; messageDiv.appendChild(cursor); } aiChatLog.appendChild(messageDiv); aiChatLog.scrollTop = aiChatLog.scrollHeight; if (role === 'ai') { typewriterEffect(messageDiv, text, 15); } }
function typewriterEffect(container, text, speed) { let i = 0; container.textContent = ''; const cursor = document.createElement('span'); cursor.className = 'typing-cursor'; container.appendChild(cursor); function type() { if (i < text.length) { cursor.insertAdjacentText('beforebegin', text.charAt(i)); i++; aiChatLog.scrollTop = aiChatLog.scrollHeight; setTimeout(type, speed); } else { container.removeChild(cursor); } } type(); }
function startNewAIChat() { chatHistory = []; if (aiChatLog) { aiChatLog.innerHTML = ''; appendMessageToLog("¡Hola, Manu! Soy tu asistente de ventas. ¿En qué te puedo ayudar hoy?", 'ai'); } showToast("Nuevo chat iniciado.", "info"); }
// ===== IHARA - GENERADOR DE INTERACCIONES =====
const FRASES_INTERACCION = [
  'voy a hacer una venta', 'necesito una interaccion', 'necesito una interacción',
  'genera una interaccion', 'genera una interacción', 'redactar interaccion',
  'redactar interacción', 'interaccion de venta', 'interacción de venta',
  'nueva venta', 'registrar interaccion', 'hacer una venta'
];

function detectaFraseInteraccion(texto) {
  const t = texto.toLowerCase().trim();
  return FRASES_INTERACCION.some(f => t.includes(f));
}

function mostrarSelectorInteraccion() {
  if (!aiChatLog) return;

  // Mensaje de Ihara
  appendMessageToLog('¡Perfecto! Marca los tipos de venta que incluye esta interacción y te ayudo a redactarla 👇', 'ai');

  // Crear el componente de casillas
  const selectorDiv = document.createElement('div');
  selectorDiv.className = 'ihara-selector';
  selectorDiv.id = 'ihara-tipo-selector';
  selectorDiv.innerHTML = `
    <p class="ihara-selector-title">¿Qué tipo(s) de venta incluye?</p>
    <div class="ihara-checks">
      <label class="ihara-check-item"><input type="checkbox" value="movil"> 📱 Venta Móvil</label>
      <label class="ihara-check-item"><input type="checkbox" value="fibra"> 🌐 Venta Fibra Óptica</label>
      <label class="ihara-check-item"><input type="checkbox" value="equipo"> 📦 Venta Equipo / Smartphone</label>
      <label class="ihara-check-item"><input type="checkbox" value="seguro_total"> 🛡️ Seguro Total</label>
      <label class="ihara-check-item"><input type="checkbox" value="antidano"> 🔧 Antidaño</label>
      <label class="ihara-check-item"><input type="checkbox" value="cambio_plan"> 🔄 Cambio de Plan</label>
    </div>
    <button class="ihara-selector-btn" id="ihara-confirmar-tipos">Continuar →</button>
  `;
  aiChatLog.appendChild(selectorDiv);
  aiChatLog.scrollTop = aiChatLog.scrollHeight;

  // Evento del botón confirmar
  document.getElementById('ihara-confirmar-tipos').addEventListener('click', () => {
    const checks = selectorDiv.querySelectorAll('input[type=checkbox]:checked');
    const tipos = Array.from(checks).map(c => c.value);
    if (tipos.length === 0) {
      showToast('Marca al menos un tipo de venta', 'warning');
      return;
    }
    selectorDiv.remove();
    solicitarDatosInteraccion(tipos);
  });
}

function solicitarDatosInteraccion(tipos) {
  if (!aiChatLog) return;

  // Campos según tipo
  const campos = {
    movil: [
      { id: 'cli_nombre', label: 'Nombre cliente', placeholder: 'Juan Pérez' },
      { id: 'cli_rut', label: 'RUT', placeholder: '12.345.678-9' },
      { id: 'cli_telefono', label: 'N° teléfono', placeholder: '569XXXXXXXX' },
      { id: 'tipo_venta', label: 'Tipo venta', placeholder: 'Portabilidad / Alta / Migración' },
      { id: 'plan_nombre', label: 'Plan contratado', placeholder: 'Ej: Plan 30GB' },
      { id: 'plan_codigo', label: 'Código plan', placeholder: 'Ej: COD_3NA' },
      { id: 'precio_real', label: 'Precio real', placeholder: 'Ej: 19.990' },
      { id: 'precio_oferta', label: 'Precio oferta', placeholder: 'Ej: 14.990' },
      { id: 'duracion_oferta', label: 'Duración oferta', placeholder: 'Ej: 6 meses' },
      { id: 'num_orden', label: 'N° orden', placeholder: 'Ej: 123456' },
    ],
    fibra: [
      { id: 'cli_nombre', label: 'Nombre cliente', placeholder: 'Juan Pérez' },
      { id: 'cli_rut', label: 'RUT', placeholder: '12.345.678-9' },
      { id: 'cli_telefono', label: 'N° contacto', placeholder: '569XXXXXXXX' },
      { id: 'fo_velocidad', label: 'Velocidad plan', placeholder: 'Ej: 600 megas simétricos' },
      { id: 'precio_real', label: 'Precio real', placeholder: 'Ej: 21.990' },
      { id: 'precio_oferta', label: 'Precio oferta', placeholder: 'Ej: 16.990' },
      { id: 'duracion_oferta', label: 'Duración oferta', placeholder: 'Ej: 6 meses' },
      { id: 'num_orden', label: 'N° orden', placeholder: 'Ej: 123456' },
    ],
    equipo: [
      { id: 'equipo_modelo', label: 'Modelo smartphone', placeholder: 'Ej: Samsung Galaxy A55' },
      { id: 'equipo_modalidad', label: 'Modalidad', placeholder: 'Cuotas / Contado / Subsidio' },
      { id: 'equipo_precio', label: 'Precio equipo', placeholder: 'Ej: 399.990' },
      { id: 'equipo_cuotas', label: 'N° cuotas (si aplica)', placeholder: 'Ej: 24' },
    ],
    seguro_total: [
      { id: 'seguro_precio', label: 'Precio mensual seguro', placeholder: 'Ej: 4.990' },
    ],
    antidano: [
      { id: 'antidano_equipo', label: 'Equipo cubierto', placeholder: 'Ej: Samsung Galaxy A55' },
      { id: 'antidano_precio', label: 'Precio mensual', placeholder: 'Ej: 2.990' },
    ],
    cambio_plan: [
      { id: 'plan_anterior', label: 'Plan anterior', placeholder: 'Ej: Plan 15GB' },
      { id: 'plan_nuevo', label: 'Plan nuevo', placeholder: 'Ej: Plan 30GB' },
      { id: 'precio_nuevo', label: 'Precio nuevo', placeholder: 'Ej: 19.990' },
    ],
  };

  const labels = { movil:'Venta Móvil', fibra:'Venta Fibra Óptica', equipo:'Venta Equipo', seguro_total:'Seguro Total', antidano:'Antidaño', cambio_plan:'Cambio de Plan' };

  // Construir formulario inline
  let fieldsHTML = '';
  const camposUsados = [];
  tipos.forEach(tipo => {
    if (!campos[tipo]) return;
    fieldsHTML += `<div class="ihara-form-section"><span class="ihara-form-section-title">${labels[tipo]}</span>`;
    campos[tipo].forEach(campo => {
      // Evitar duplicar campos comunes (nombre, rut, telefono, orden)
      if (!camposUsados.includes(campo.id)) {
        camposUsados.push(campo.id);
        fieldsHTML += `<div class="ihara-form-field">
          <label class="ihara-field-label">${campo.label}</label>
          <input class="ihara-field-input" id="ifield_${campo.id}" type="text" placeholder="${campo.placeholder}">
        </div>`;
      }
    });
    fieldsHTML += '</div>';
  });

  const formDiv = document.createElement('div');
  formDiv.className = 'ihara-form';
  formDiv.innerHTML = `
    <p class="ihara-form-title">📋 Completa los datos y genero la interacción al tiro</p>
    <div class="ihara-form-fields">${fieldsHTML}</div>
    <button class="ihara-selector-btn" id="ihara-generar-btn">⚡ Generar interacción</button>
  `;
  aiChatLog.appendChild(formDiv);
  aiChatLog.scrollTop = aiChatLog.scrollHeight;

  document.getElementById('ihara-generar-btn').addEventListener('click', () => {
    // Recopilar datos
    const datos = {};
    camposUsados.forEach(id => {
      const el = document.getElementById('ifield_' + id);
      if (el) datos[id] = el.value.trim();
    });

    // Construir prompt directo para generar la interacción
    const tiposTexto = tipos.map(t => labels[t]).join(' + ');
    let promptFinal = `Genera el texto de interacción para sistema interno con estos datos. Vendedor: ate_manroj. Tipos: ${tiposTexto}.

DATOS:
`;
    Object.entries(datos).forEach(([k, v]) => { if (v) promptFinal += `- ${k}: ${v}
`; });
    promptFinal += `
GENERA el texto de interacción directamente, sin preguntar nada más. Formato profesional, tercera persona, listo para copiar. Sé concisa y directa.`;

    formDiv.remove();
    appendMessageToLog(`Generando interacción: ${tiposTexto}`, 'user');
    chatHistory.push({ role: 'user', parts: [{ text: promptFinal }] });

    if (aiLoader) aiLoader.style.display = 'flex';
    if (aiGenerateBtn) aiGenerateBtn.disabled = true;

    fetch(APPS_SCRIPT_URL, {
      method: 'POST', cache: 'no-cache',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'askGemini', prompt: promptFinal, history: chatHistory.slice(0,-1) })
    })
    .then(r => r.json())
    .then(result => {
      if (aiLoader) aiLoader.style.display = 'none';
      if (aiGenerateBtn) aiGenerateBtn.disabled = false;
      if (result.success && result.text) {
        appendMessageToLog(result.text, 'ai');
        chatHistory.push({ role: 'model', parts: [{ text: result.text }] });
      }
    })
    .catch(() => {
      if (aiLoader) aiLoader.style.display = 'none';
      if (aiGenerateBtn) aiGenerateBtn.disabled = false;
      appendMessageToLog('Error al conectar con Ihara.', 'ai');
    });
  });
}

async function askGemini() { if (!aiPrompt || !aiLoader || !aiChatLog || !aiGenerateBtn) { console.error("Faltan elementos del DOM para el Asistente AI."); return; } const promptText = aiPrompt.value.trim(); if (!promptText) { showToast("Por favor, escribe un mensaje.", "warning"); return; }
  if (detectaFraseInteraccion(promptText)) { appendMessageToLog(promptText, 'user'); aiPrompt.value = ''; mostrarSelectorInteraccion(); return; }
  appendMessageToLog(promptText, 'user'); aiPrompt.value = ''; chatHistory.push({ role: 'user', parts: [{ text: promptText }] }); aiLoader.style.display = 'flex'; aiGenerateBtn.disabled = true; try { const response = await fetch(APPS_SCRIPT_URL, { method: 'POST', cache: 'no-cache', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'askGemini', prompt: promptText, history: chatHistory }) }); if (!response.ok) { throw new Error(`Error de red: ${response.statusText}`); } const result = await response.json(); aiLoader.style.display = 'none'; if (result.success && result.text) { appendMessageToLog(result.text, 'ai'); chatHistory.push({ role: 'model', parts: [{ text: result.text }] }); } else { throw new Error(result.error || "La IA devolvió un error desconocido."); } } catch (error) { aiLoader.style.display = 'none'; console.error("Error al llamar a la IA:", error); const errorMessage = `Hubo un error al procesar tu solicitud: ${error.message}`; appendMessageToLog(errorMessage, 'ai'); } finally { aiGenerateBtn.disabled = false; aiPrompt.focus(); } }
const mensajesEstimulantes = ["¡Sigue así, Manu! Cada paso cuenta.", "¡Tu esfuerzo de hoy construye el éxito de mañana!", "Recuerda tu 'por qué'. ¡Ellos te inspiran!"];
function getMensajeKPI(data) { if (data && data.datos && data.datos.length > 0) { const kpiVoz = data.datos.find(k => k.kpi && k.kpi.toUpperCase() === 'VOZ'); if (kpiVoz && parseFloat(kpiVoz.total) < (parseFloat(kpiVoz.valor100) * 0.5) ) { return "¡Ánimo con las ventas de Voz, Manu! Tú puedes."; } } return mensajesEstimulantes[Math.floor(Math.random() * mensajesEstimulantes.length)]; }
function startPeriodicNotifications() { const mostrarNotificacion = () => { let msg = (kpiDataGlobal && kpiDataGlobal.datos) ? getMensajeKPI(kpiDataGlobal) : mensajesEstimulantes[Math.floor(Math.random() * mensajesEstimulantes.length)]; showToast(msg, 'info', 8000); }; const intervaloMs = 59 * 60 * 1000; if (notificationInterval) clearInterval(notificationInterval); notificationInterval = setInterval(mostrarNotificacion, intervaloMs); console.log(`Notificaciones periódicas iniciadas.`); }

async function cargarCodigosProductoReglaEnSelect() {
    const select = document.getElementById('sale-codigoProductoRegla');
    if (!select) return;
    try {
        const res = await fetch(`${APPS_SCRIPT_URL}?action=getCodigosProductoRegla`);
        const data = await res.json();
        if (data.success && data.codigos && data.codigos.length > 0) {
            CODIGO_PRODUCTO_REGLA_OPTIONS = data.codigos;
            select.innerHTML = CODIGO_PRODUCTO_REGLA_OPTIONS.map(c => `<option value="${c}">${c}</option>`).join('');
        }
    } catch(e) {
        console.warn("No se pudieron cargar códigos desde Sheets, usando lista local.", e);
    }
}

function toggleSalePopup(show) { if (!addSalePopup || !addSaleOverlay) return; if (show) { const fechaInput = document.getElementById('sale-fecha'); if(fechaInput) fechaInput.valueAsDate = new Date(); cargarCodigosProductoReglaEnSelect(); addSaleOverlay.style.display = 'block'; addSalePopup.style.display = 'flex'; requestAnimationFrame(() => { addSaleOverlay.classList.add('visible'); addSalePopup.classList.add('visible'); }); document.body.style.overflow = 'hidden'; } else { addSaleOverlay.classList.remove('visible'); addSalePopup.classList.remove('visible'); addSalePopup.addEventListener('transitionend', function onEnd() { if (!addSalePopup.classList.contains('visible')) { addSalePopup.style.display = 'none'; addSaleOverlay.style.display = 'none'; if(addSaleForm) addSaleForm.reset(); if(addSaleMensaje) addSaleMensaje.style.display = 'none'; } addSalePopup.removeEventListener('transitionend', onEnd); }, { once: true }); document.body.style.overflow = ''; } }
function handleSaleSubmit(event) { event.preventDefault(); if (!addSaleForm || !btnSubmitSale || !addSaleLoader || !addSaleMensaje) return; const enteredPassword = prompt("Por favor, ingresa la clave para registrar la venta:"); if (enteredPassword === null) { showToast("Registro de venta cancelado.", "info"); return; } const fecha = document.getElementById('sale-fecha').value; const nombre = document.getElementById('sale-nombreCompleto').value.trim(); if (!fecha || !nombre) { addSaleMensaje.textContent = 'La fecha y el nombre completo son obligatorios.'; addSaleMensaje.className = 'mensaje-estado error'; addSaleMensaje.style.display = 'block'; return; } const saleData = { fecha: fecha, suscripcion: document.getElementById('sale-suscripcion').value.trim(), maestro: document.getElementById('sale-maestro').value.trim(), aloha: document.getElementById('sale-aloha').value.trim(), rutCliente: document.getElementById('sale-rutCliente').value.trim(), nombreCompleto: nombre, firma: document.getElementById('sale-firma').checked, cantidadMovil: document.getElementById('sale-cantidadMovil').value, tipoVenta: document.getElementById('sale-tipoVenta').value.trim(), terminales: document.getElementById('sale-terminales').value.trim(), numeroOrden: document.getElementById('sale-numeroOrden').value.trim(), instalacion: document.getElementById('sale-instalacion').checked, accesorio: document.getElementById('sale-accesorio').value.trim(), nombreAccesorio: document.getElementById('sale-nombreAccesorio').value.trim(), seguro: document.getElementById('sale-seguro').checked, rgu: document.getElementById('sale-rgu').value.trim(), qCelulares: document.getElementById('sale-qCelulares').checked, codigoProductoRegla: document.getElementById('sale-codigoProductoRegla').value, tipoEntradaRegla: document.getElementById('sale-tipoEntradaRegla').value, cantidadVendida: document.getElementById('sale-cantidadVendida').value, tipoKPIPrincipal: document.getElementById('sale-tipoKPIPrincipal').value }; addSaleLoader.style.display = 'flex'; btnSubmitSale.disabled = true; addSaleMensaje.style.display = 'none'; const payload = { action: 'addSale', password: enteredPassword, data: saleData }; fetch(APPS_SCRIPT_URL, { method: 'POST', cache: 'no-cache', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }).then(res => res.json()).then(result => { if (result.success) { showToast('¡Venta registrada con éxito!', 'success'); addSaleForm.reset(); toggleSalePopup(false); cargarDatosAdaptado("kpi"); cargarDatosParaObjetivosDiarios(); cargarYMostrarUltimaAtencion(); } else { throw new Error(result.error || 'Error desconocido al guardar la venta.'); } }).catch(error => { console.error('Error al registrar la venta:', error); addSaleMensaje.textContent = `Error: ${error.message}`; addSaleMensaje.className = 'mensaje-estado error'; addSaleMensaje.style.display = 'block'; showToast(`Error al registrar la venta: ${error.message}`, 'error'); }).finally(() => { addSaleLoader.style.display = 'none'; btnSubmitSale.disabled = false; }); }
function populateSaleFormDropdowns() {
    const selects = {
        'sale-codigoProductoRegla': CODIGO_PRODUCTO_REGLA_OPTIONS,
        'sale-tipoEntradaRegla': TIPO_ENTRADA_REGLA_OPTIONS,
        'sale-tipoKPIPrincipal': TIPO_KPI_PRINCIPAL_OPTIONS
    };

    for (const id in selects) {
        const selectElement = document.getElementById(id);
        if (selectElement) {
            selectElement.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = `Seleccione una opción...`;
            selectElement.appendChild(defaultOption);

            selects[id].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                selectElement.appendChild(option);
            });
        }
    }
}
function toggleKpiDetailsPopup(show) { if (!kpiDetailsPopup || !kpiDetailsOverlay) return; if (show) { kpiDetailsOverlay.style.display = 'block'; kpiDetailsPopup.style.display = 'flex'; requestAnimationFrame(() => { kpiDetailsOverlay.classList.add('visible'); kpiDetailsPopup.classList.add('visible'); }); document.body.style.overflow = 'hidden'; } else { kpiDetailsOverlay.classList.remove('visible'); kpiDetailsPopup.classList.remove('visible'); kpiDetailsPopup.addEventListener('transitionend', function onEnd() { if (!kpiDetailsPopup.classList.contains('visible')) { kpiDetailsPopup.style.display = 'none'; kpiDetailsOverlay.style.display = 'none'; } kpiDetailsPopup.removeEventListener('transitionend', onEnd); }, { once: true }); document.body.style.overflow = ''; } }
async function showKpiDetails(kpiIdentifier) { toggleKpiDetailsPopup(true); kpiDetailsTitle.textContent = `Detalles de ${kpiIdentifier.replace(/_/g, ' ')}`; kpiDetailsContent.innerHTML = ''; kpiDetailsLoader.style.display = 'flex'; kpiDetailsContent.appendChild(kpiDetailsLoader); try { const response = await fetch(`${APPS_SCRIPT_URL}?action=getKpiDetails&kpi=${kpiIdentifier}`); if (!response.ok) { throw new Error(`Error del servidor: ${response.statusText}`); } const result = await response.json(); if (!result.success) { throw new Error(result.error || 'El servidor devolvió un error desconocido.'); } renderKpiDetails(kpiIdentifier, result.data); } catch (error) { console.error(`Error al obtener detalles del KPI ${kpiIdentifier}:`, error); kpiDetailsContent.innerHTML = `<div class="mensaje-estado error" style="display:block;">Error al cargar detalles: ${error.message}</div>`; } finally { kpiDetailsLoader.style.display = 'none'; } }
function renderKpiDetails(kpi, data) { let contentHTML = ''; switch (kpi) { case 'VOZ': contentHTML = ` <div class="kpi-details-grid"> <div class="kpi-detail-card"> <h4>Resumen de Entradas</h4> <ul> <li><span class="label">Entrada Real:</span> <span class="value">${formatNumber(data.entradaReal)}</span></li> <li><span class="label">Total Entradas Registradas:</span> <span class="value">${formatNumber(data.totalEntradas)}</span></li> </ul> </div> <div class="kpi-detail-card"> <h4>Desglose por Tipo</h4> <ul> <li><span class="label">Portabilidades:</span> <span class="value">${formatNumber(data.desglose.portabilidad || 0)}</span></li> <li><span class="label">Altas Nuevas:</span> <span class="value">${formatNumber(data.desglose.alta || 0)}</span></li> <li><span class="label">Migraciones:</span> <span class="value">${formatNumber(data.desglose.migracion || 0)}</span></li> <li><span class="label">Otros:</span> <span class="value">${formatNumber(data.desglose.otro || 0)}</span></li> </ul> </div> </div>`; break; case 'FO': contentHTML = ` <div class="kpi-details-grid"> <div class="kpi-detail-card"> <h4>Estado de Instalaciones</h4> <ul> <li><span class="label">Total Ventas FO Registradas:</span> <span class="value">${formatNumber(data.total)}</span></li> <li><span class="label">Instaladas (OK):</span> <span class="value">${formatNumber(data.instaladas)}</span></li> <li><span class="label">Pendientes / No Confirmadas:</span> <span class="value">${formatNumber(data.pendientes)}</span></li> <li><span class="label">Canceladas (Ej: No Instalado):</span> <span class="value">${formatNumber(data.canceladas)}</span></li> </ul> </div> </div>`; break; case 'N_TERMINALES': contentHTML = ` <h4>Desglose de Terminales Vendidos</h4> <p style="font-size: 0.8em; color: var(--text-color-secondary); text-align: center; margin-top: -10px; margin-bottom: 15px;">Agrupados por modelo y modalidad de venta.</p> <div class="tabla-responsive-wrapper"> <table class="kpi-details-table"> <thead> <tr> <th>Imagen</th> <th>Modelo de Terminal</th> <th>Modalidad de Venta</th> <th>Cantidad</th> </tr> </thead> <tbody> ${data.length > 0 ? data.map(item => ` <tr> <td> <div class="terminal-image-container"> <img src="${item.imageUrl}" alt="${item.modelo}" class="terminal-image" loading="lazy" onerror="this.src='https://via.placeholder.com/60x60?text=IMG'"> </div> </td> <td>${item.modelo || 'No especificado'}</td> <td>${item.modalidad || 'No especificada'}</td> <td style="text-align: center; font-weight: bold;">${item.cantidad}</td> </tr> `).join('') : '<tr><td colspan="4">No hay datos de terminales vendidos este mes.</td></tr>'} </tbody> </table> </div>`; break; case 'ACCESORIOS': contentHTML = ` <h4>Desglose de Accesorios Vendidos</h4> <div class="tabla-responsive-wrapper"> <table class="kpi-details-table"> <thead><tr><th>Accesorio</th><th>N° Factura/Orden</th><th>Cliente</th><th>Monto</th></tr></thead> <tbody> ${data.length > 0 ? data.map(item => ` <tr> <td>${item.modelo || 'No especificado'}</td> <td>${item.factura || 'N/A'}</td> <td>${item.cliente || '-'}</td> <td style="text-align: right;">$${formatNumber(item.monto)}</td> </tr> `).join('') : '<tr><td colspan="4">No hay datos de accesorios vendidos este mes.</td></tr>'} </tbody> </table> </div>`; break; case 'SEGUROS': contentHTML = ` <div class="kpi-detail-card"> <h4>Tipos de Seguros Vendidos</h4> <ul> ${Object.keys(data).length > 0 ? Object.entries(data).map(([tipo, cantidad]) => ` <li><span class="label">${tipo || 'No especificado'}:</span> <span class="value">${formatNumber(cantidad)}</span></li> `).join('') : '<li>No hay datos de seguros vendidos este mes.</li>'} </ul> </div>`; break; default: contentHTML = `<p>No hay una vista de detalles disponible para este KPI.</p>`; } kpiDetailsContent.innerHTML = contentHTML; }


// --- Nuevas funciones para la gestión de Ofertas Flash (Subida y Eliminación) ---

function toggleUploadOfferPopup(show) {
    if (!uploadOfferPopup || !uploadOfferOverlay) return;
    if (show) {
        // Reiniciar formulario y mensajes
        if (uploadOfferForm) uploadOfferForm.reset();
        if (uploadOfferMessage) { uploadOfferMessage.style.display = 'none'; uploadOfferMessage.textContent = ''; }
        if (uploadOfferLoader) uploadOfferLoader.style.display = 'none';

        uploadOfferOverlay.style.display = 'block';
        uploadOfferPopup.style.display = 'flex';
        requestAnimationFrame(() => {
            uploadOfferOverlay.classList.add('visible');
            uploadOfferPopup.classList.add('visible');
        });
        document.body.style.overflow = 'hidden';
    } else {
        uploadOfferOverlay.classList.remove('visible');
        uploadOfferPopup.classList.remove('visible');
        uploadOfferPopup.addEventListener('transitionend', function onEnd() {
            if (!uploadOfferPopup.classList.contains('visible')) {
                uploadOfferPopup.style.display = 'none';
                uploadOfferOverlay.style.display = 'none';
            }
            uploadOfferPopup.removeEventListener('transitionend', onEnd);
        }, { once: true });
        document.body.style.overflow = '';
    }
}

async function handleUploadOfferSubmit(event) {
    event.preventDefault();
    if (!uploadOfferFile || !uploadOfferTitle || !uploadOfferDescription || !btnSubmitUploadOffer || !uploadOfferLoader || !uploadOfferMessage) {
        showToast("Error: Elementos del formulario no encontrados.", "error");
        return;
    }

    const file = uploadOfferFile.files[0];
    const title = uploadOfferTitle.value.trim();
    const description = uploadOfferDescription.value.trim();

    if (!file) {
        uploadOfferMessage.textContent = 'Por favor, selecciona un archivo.';
        uploadOfferMessage.className = 'mensaje-estado info';
        uploadOfferMessage.style.display = 'block';
        return;
    }
    if (!title) {
        uploadOfferMessage.textContent = 'Por favor, introduce un título para la oferta.';
        uploadOfferMessage.className = 'mensaje-estado info';
        uploadOfferMessage.style.display = 'block';
        uploadOfferTitle.focus();
        return;
    }

    const adminPassword = prompt("Por favor, ingresa la contraseña de administrador para cargar la oferta:");
    if (adminPassword === null) { showToast("Carga cancelada.", "info"); return; }
    if (btoa(adminPassword) !== CORRECT_PASSWORD_B64) {
        showToast("Contraseña incorrecta.", "error");
        return;
    }

    uploadOfferLoader.style.display = 'flex';
    btnSubmitUploadOffer.disabled = true;
    uploadOfferMessage.style.display = 'none';

    try {
        // 1. Subir archivo directo a Firebase Storage
        const fileExtension = file.name.split('.').pop();
        const fileName = `ofertas_flash/oferta_${Date.now()}.${fileExtension}`;
        const FIREBASE_BUCKET = 'seguimiento-ventas-manuel.firebasestorage.app';
        const FIREBASE_UPLOAD_URL = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET}/o/${encodeURIComponent(fileName)}?uploadType=media`;

        const uploadResponse = await fetch(FIREBASE_UPLOAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file
        });

        if (!uploadResponse.ok) {
            const errData = await uploadResponse.json();
            throw new Error(`Error subiendo archivo: ${errData.error?.message || uploadResponse.statusText}`);
        }

        const uploadData = await uploadResponse.json();
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET}/o/${encodeURIComponent(uploadData.name)}?alt=media&token=${uploadData.downloadTokens}`;

        // 2. Guardar metadatos en Google Sheets via Apps Script
        const payload = {
            action: 'saveFlashOfferMetadata',
            password: adminPassword,
            data: {
                fileName: fileName,
                title: title,
                description: description,
                fileType: file.type,
                url: fileUrl
            }
        };

        const metaResponse = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        const metaResult = await metaResponse.json();
        if (!metaResult.success) throw new Error(metaResult.error || 'Error guardando metadatos.');

        showToast(`¡Oferta "${title}" subida con éxito!`, 'success');
        toggleUploadOfferPopup(false);
        mostrarOfertasFlash();

    } catch (error) {
        console.error("Error al subir oferta flash:", error);
        uploadOfferMessage.textContent = `Error: ${error.message}`;
        uploadOfferMessage.className = 'mensaje-estado error';
        uploadOfferMessage.style.display = 'block';
        showToast(`Error al subir oferta: ${error.message}`, 'error');
    } finally {
        uploadOfferLoader.style.display = 'none';
        btnSubmitUploadOffer.disabled = false;
    }
}

async function handleDeleteFlashOffer(fileId) {
    if (!confirm(`¿Estás seguro de que quieres eliminar esta oferta?`)) return;

    const adminPassword = prompt("Por favor, ingresa la contraseña de administrador para eliminar la oferta:");
    if (adminPassword === null) { showToast("Eliminación cancelada.", "info"); return; }
    if (btoa(adminPassword) !== CORRECT_PASSWORD_B64) {
        showToast("Contraseña incorrecta.", "error");
        return;
    }

    flashOffersDisplayLoader.style.display = 'flex';
    flashOffersCardsContainer.innerHTML = '';

    try {
        // 1. Eliminar archivo de Firebase Storage
        const FIREBASE_BUCKET = 'seguimiento-ventas-manuel.firebasestorage.app';
        const FIREBASE_DELETE_URL = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET}/o/${encodeURIComponent(fileId)}`;
        await fetch(FIREBASE_DELETE_URL, { method: 'DELETE' });

        // 2. Eliminar metadatos de Google Sheets
        const payload = {
            action: 'deleteFlashOffer',
            password: adminPassword,
            fileId: fileId
        };
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            cache: 'no-cache',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Error eliminando metadatos.');

        showToast('Oferta eliminada correctamente.', 'success');
        mostrarOfertasFlash();
    } catch (error) {
        console.error("Error al eliminar oferta flash:", error);
        showToast(`Error al eliminar: ${error.message}`, 'error');
        mostrarOfertasFlash();
    } finally {
        flashOffersDisplayLoader.style.display = 'none';
    }
}



// ========== PARRILLAS - SUBIR ARCHIVOS ==========
const FIREBASE_BUCKET_PARRILLAS = 'seguimiento-ventas-manuel.firebasestorage.app';

function toggleParrillaAdminUpload(tipo) {
    const adminDiv = document.getElementById(`parrilla-${tipo}-admin-upload`);
    if (!adminDiv) return;
    const pwd = prompt("Contraseña de administrador:");
    if (pwd === null) return;
    if (btoa(pwd) !== CORRECT_PASSWORD_B64) { showToast("Contraseña incorrecta.", "error"); return; }
    adminDiv.style.display = adminDiv.style.display === 'none' ? 'block' : 'none';
}

async function subirParrillaFile(tipo) {
    const input = document.getElementById(`parrilla-${tipo}-file-input`);
    const msgEl = document.getElementById(`parrilla-${tipo}-upload-msg`);
    if (!input || !input.files[0]) { msgEl.textContent = "Selecciona un archivo."; return; }
    const file = input.files[0];
    msgEl.textContent = "⏳ Subiendo...";
    msgEl.style.color = "var(--text-color-secondary)";

    try {
        const ext = file.name.split('.').pop();
        const fileName = `parrillas/${tipo}/parrilla_${tipo}.${ext}`;
        const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET_PARRILLAS}/o/${encodeURIComponent(fileName)}?uploadType=media`;

        const res = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET_PARRILLAS}/o/${encodeURIComponent(data.name)}?alt=media&token=${data.downloadTokens}`;

        // Guardar URL en Apps Script
        const payload = { action: 'saveParrillaUrl', password: atob(CORRECT_PASSWORD_B64), data: { tipo, url: fileUrl, fileType: file.type } };
        const saveRes = await fetch(APPS_SCRIPT_URL, { method: 'POST', cache: 'no-cache', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
        const saveResult = await saveRes.json();
        if (!saveResult.success) throw new Error(saveResult.error);

        msgEl.textContent = "✅ Parrilla actualizada.";
        msgEl.style.color = "green";
        mostrarParrillaFile(tipo, fileUrl, file.type);
    } catch(e) {
        msgEl.textContent = "❌ Error: " + e.message;
        msgEl.style.color = "red";
    }
}

async function cargarParrillaFile(tipo) {
    try {
        const res = await fetch(`${APPS_SCRIPT_URL}?action=getParrillaUrl&tipo=${tipo}`);
        const data = await res.json();
        if (data.success && data.url) {
            mostrarParrillaFile(tipo, data.url, data.fileType);
        }
    } catch(e) {
        console.warn("Error cargando parrilla:", e);
    }
}

function mostrarParrillaFile(tipo, url, fileType) {
    const noFileMsg = document.getElementById(`parrilla-${tipo}-no-file-msg`);
    const iframeEl = document.getElementById(`parrilla-${tipo}-iframe-viewer`);
    const imgEl = document.getElementById(`parrilla-${tipo}-img-viewer`);
    if (noFileMsg) noFileMsg.style.display = 'none';

    const isImage = fileType && fileType.startsWith('image/');
    const isPDF = fileType === 'application/pdf';
    const isExcel = fileType && (fileType.includes('spreadsheet') || fileType.includes('excel'));

    if (isImage) {
        if (imgEl) { imgEl.src = url; imgEl.style.display = 'block'; }
        if (iframeEl) iframeEl.style.display = 'none';
    } else if (isPDF) {
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        if (iframeEl) { iframeEl.src = viewerUrl; iframeEl.style.display = 'block'; }
        if (imgEl) imgEl.style.display = 'none';
    } else {
        // Excel: mostrar botón de descarga directa
        if (iframeEl) iframeEl.style.display = 'none';
        if (imgEl) imgEl.style.display = 'none';
        const containerId = `parrilla-${tipo}-download-container`;
        let dlContainer = document.getElementById(containerId);
        if (!dlContainer) {
            dlContainer = document.createElement('div');
            dlContainer.id = containerId;
            dlContainer.style.cssText = 'text-align:center;padding:30px;';
            const parent = iframeEl ? iframeEl.parentElement : document.getElementById(`parrilla-${tipo}-iframe-original-container`);
            if (parent) parent.appendChild(dlContainer);
        }
        dlContainer.style.display = 'block';
        dlContainer.innerHTML = `
            <p style="color:var(--text-color-secondary);margin-bottom:16px;">📊 Los archivos Excel no se pueden previsualizar directamente.</p>
            <a href="${url}" target="_blank" download style="background:var(--color-orange-accent);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
                ⬇️ Descargar Parrilla Excel
            </a>
            <br><br>
            <a href="https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true" target="_blank" style="color:var(--color-orange-accent);font-size:0.9em;">
                🔍 Intentar abrir en Google Docs Viewer
            </a>`;
    }
}

// ========== ADMIN - CÓDIGOS PRODUCTO REGLA ==========
async function cargarCodigosProductoReglaAdmin() {
    const lista = document.getElementById('admin-codigos-lista');
    const msg = document.getElementById('admin-codigos-msg');
    if (!lista) return;
    lista.innerHTML = '<span style="color:var(--text-color-secondary)">Cargando...</span>';
    try {
        const res = await fetch(`${APPS_SCRIPT_URL}?action=getCodigosProductoRegla`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        CODIGO_PRODUCTO_REGLA_OPTIONS = data.codigos;
        // Actualizar el select del formulario de venta
        const select = document.getElementById('sale-codigoProductoRegla');
        if (select) {
            select.innerHTML = CODIGO_PRODUCTO_REGLA_OPTIONS.map(c => `<option value="${c}">${c}</option>`).join('');
        }
        lista.innerHTML = CODIGO_PRODUCTO_REGLA_OPTIONS.map(c =>
            `<span style="display:inline-block;background:var(--bg-content);border:1px solid var(--border-color-dark);border-radius:6px;padding:4px 10px;margin:3px;font-size:0.85em;">${c}</span>`
        ).join('');
        if (msg) { msg.textContent = `✅ ${CODIGO_PRODUCTO_REGLA_OPTIONS.length} códigos cargados desde Sheets.`; msg.style.color = 'green'; }
    } catch(e) {
        lista.innerHTML = `<span style="color:red;">Error: ${e.message}</span>`;
        if (msg) { msg.textContent = "❌ " + e.message; msg.style.color = 'red'; }
    }
}



// ========== PLANES OFERTAS MES - DESDE SHEETS ==========
async function cargarPlanesDesdeSheets() {
    try {
        const res = await fetch(`${APPS_SCRIPT_URL}?action=getPlanesOfertasMes`);
        const data = await res.json();
        if (!data.success || !data.planes) return;

        // Resetear datos
        const nuevoMovil = { monolinea: [], multilinea: [], general: [], totalizacion: [], migracion: [] };
        const nuevoHogar = { fibra: [], duo: [], trio: [] };

        data.planes.forEach((p, idx) => {
            const caracteristicas = p.caracteristicas ? p.caracteristicas.split(';').map(c => c.trim()).filter(c => c) : [];
            const esMigracion = p.categoria === 'migracion';
            const plan = {
                id: `plan-${p.tipo}-${p.categoria}-${idx}`,
                nombre: p.nombre || '',
                precio: esMigracion ? '' : (p.precio || ''),
                descuento: p.descuento || '',
                detalles: p.detalles || '',
                caracteristicas,
                velocidad: p.nombre || '',
                // Campos específicos migración
                destino: esMigracion ? (p.nombre || '') : undefined,
                origen: esMigracion ? (p.precio || 'Plan Actual') : undefined,
                oferta: esMigracion ? (p.descuento || '') : undefined,
                caracteristicasDestino: esMigracion ? caracteristicas : undefined
            };
            if (p.tipo === 'movil' && nuevoMovil[p.categoria]) {
                nuevoMovil[p.categoria].push(plan);
            } else if (p.tipo === 'hogar' && nuevoHogar[p.categoria]) {
                nuevoHogar[p.categoria].push(plan);
            }
        });

        // Solo reemplazar si hay datos
        if (Object.values(nuevoMovil).some(arr => arr.length > 0)) movilPagePlansData = nuevoMovil;
        if (Object.values(nuevoHogar).some(arr => arr.length > 0)) hogarPagePlansData = nuevoHogar;

        // Refrescar vista si ya está visible
        const movilContainer = document.getElementById('movil-plans-cards-container');
        const hogarContainer = document.getElementById('hogar-plans-cards-container');
        if (movilContainer && movilContainer.hasChildNodes()) showMovilPlans(movilContainer.dataset.currentType || 'monolinea');
        if (hogarContainer && hogarContainer.hasChildNodes()) showHogarPlans(hogarContainer.dataset.currentType || 'fibra');

    } catch(e) {
        console.warn("No se pudieron cargar planes desde Sheets, usando datos locales.", e);
    }
}

// ========== ADMIN - GESTIÓN DE PLANES ==========
async function cargarPlanesAdmin() {
    const container = document.getElementById('admin-planes-lista');
    const msg = document.getElementById('admin-planes-msg');
    if (!container) return;
    container.innerHTML = '<span style="color:var(--text-color-secondary)">Cargando...</span>';

    try {
        const res = await fetch(`${APPS_SCRIPT_URL}?action=getPlanesOfertasMes`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        if (!data.planes || data.planes.length === 0) {
            container.innerHTML = '<p style="color:var(--text-color-secondary);font-size:0.9em;">No hay planes cargados aún. Agrégalos desde la hoja <strong>PlanesOfertasMes</strong> en Google Sheets.</p>';
            return;
        }

        // Agrupar por tipo y categoría
        const grupos = {};
        data.planes.forEach(p => {
            const key = `${p.tipo} - ${p.categoria}`;
            if (!grupos[key]) grupos[key] = [];
            grupos[key].push(p);
        });

        container.innerHTML = Object.entries(grupos).map(([grupo, planes]) => `
            <div style="margin-bottom:16px;">
                <h4 style="text-transform:capitalize;color:var(--color-orange-accent);margin-bottom:8px;">${grupo}</h4>
                ${planes.map(p => `
                    <div style="background:var(--bg-content);border:1px solid var(--border-color-dark);border-radius:8px;padding:10px 14px;margin-bottom:6px;font-size:0.85em;">
                        <strong>${p.nombre}</strong> — ${p.precio}
                        ${p.descuento ? `<span style="color:var(--text-color-secondary);"> | ${p.descuento}</span>` : ''}
                        ${p.detalles ? `<div style="color:var(--text-color-secondary);margin-top:2px;">${p.detalles}</div>` : ''}
                        ${p.caracteristicas ? `<div style="color:var(--text-color-secondary);margin-top:2px;font-size:0.9em;">${p.caracteristicas.split(';').join(' · ')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `).join('');

        if (msg) { msg.textContent = `✅ ${data.planes.length} planes cargados.`; msg.style.color = 'green'; }
        // Actualizar vista en ofertasMes también
        await cargarPlanesDesdeSheets();

    } catch(e) {
        container.innerHTML = `<span style="color:red;">Error: ${e.message}</span>`;
    }
}

function mostrarAdminPanel() {
    showSection('admin-panel');
}

function openFlashOfferDocViewer(viewerUrl) {
    let overlay = document.getElementById('flash-offer-docviewer-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'flash-offer-docviewer-overlay';
        overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;align-items:center;justify-content:center;flex-direction:column;';
        overlay.innerHTML = '<button id="flash-offer-docviewer-close" style="position:fixed;top:18px;right:22px;background:rgba(255,255,255,0.15);border:none;color:white;font-size:2em;width:44px;height:44px;border-radius:50%;cursor:pointer;">&times;</button><iframe id="flash-offer-docviewer-iframe" src="" style="width:90vw;height:88vh;border:none;border-radius:8px;background:white;" allowfullscreen></iframe>';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.id === 'flash-offer-docviewer-close') {
                overlay.style.display = 'none';
                document.getElementById('flash-offer-docviewer-iframe').src = '';
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                overlay.style.display = 'none';
                document.getElementById('flash-offer-docviewer-iframe').src = '';
            }
        });
    }
    document.getElementById('flash-offer-docviewer-iframe').src = viewerUrl;
    overlay.style.display = 'flex';
}

function openFlashOfferFullscreen(imageUrl) {
    let overlay = document.getElementById('flash-offer-fullscreen-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'flash-offer-fullscreen-overlay';
        overlay.innerHTML = `
            <button id="flash-offer-fullscreen-close" aria-label="Cerrar">&times;</button>
            <img id="flash-offer-fullscreen-img" src="" alt="Oferta Flash">
        `;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.id === 'flash-offer-fullscreen-close') {
                overlay.classList.remove('visible');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') overlay.classList.remove('visible');
        });
    }
    document.getElementById('flash-offer-fullscreen-img').src = imageUrl;
    overlay.classList.add('visible');
}

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos generales del DOM
    appContainer = document.querySelector('.app-container');
    sidebarLeft = document.getElementById('sidebar-left');
    pageWrapper = document.querySelector('.page-wrapper');
    mainContent = document.querySelector('.main-content');
    hamburgerBtnMobile = document.getElementById('hamburger-btn-mobile');
    sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    verticalNavbar = document.getElementById('vertical-navbar');
    mobileNavLinks = document.getElementById('mobile-nav-links');
    themeToggleButtonFooter = document.getElementById('theme-toggle-btn-footer');
    dateTimeDisplay = document.getElementById('datetime-container');
    timeDisplay = document.getElementById('time');
    dateDisplay = document.getElementById('date');
    ultimaAtencionNombreEl = document.getElementById('ultima-atencion-nombre');
    ultimaAtencionRutEl = document.getElementById('ultima-atencion-rut');
    ultimaAtencionTelefonoEl = document.getElementById('ultima-atencion-telefono');
    loginOverlay = document.getElementById('login-overlay');
    loginForm = document.getElementById('login-form');
    loginPasswordInput = document.getElementById('login-password');
    loginErrorMsg = document.getElementById('login-error');
    toastContainer = document.getElementById('toast-container');

    // Referencias a secciones principales
    inicioContentSection = document.getElementById('inicio-content');
    kpiContentSection = document.getElementById('kpi-content');
    ofertasFlashSection = document.getElementById('ofertas-flash');
    ofertasMesSection = document.getElementById('ofertas-mes');
    enlacesExternosSection = document.getElementById('enlaces-externos');
    adminPanelSection = document.getElementById('admin-panel');
    tablaRemuneracionSection = document.getElementById('tabla-remuneracion');
    politicasVentasSection = document.getElementById('politicas-ventas');
    prospectosContentSection = document.getElementById('prospectos-content');
    buscadorVentasContent = document.getElementById('buscador-ventas-content');
    asistenteAIContentSection = document.getElementById('asistente-ai-content');

    // Referencias a elementos específicos de KPI
    if (kpiContentSection) {
        tablaContainer = document.getElementById('tabla-container');
        loader = document.getElementById('loader');
        tablaDatos = document.getElementById('tablaDatos');
        errorContainer = document.getElementById('error-container');
        kpiCardsContainer = document.getElementById('kpi-cards-container');
    }

    // Referencias a elementos específicos de Prospectos
    if (prospectosContentSection) {
        prospectoForm = document.getElementById('prospecto-form');
        guardarProspectoBtn = document.getElementById('guardar-prospecto-btn');
        prospectoLoader = document.getElementById('prospecto-loader');
        prospectoMensaje = document.getElementById('prospecto-mensaje');
    }

    // Referencias a elementos específicos de Buscador de Ventas
    if (buscadorVentasContent) {
        buscadorVentasForm = document.getElementById('buscador-ventas-form');
        buscarNombreInput = document.getElementById('buscar-nombre');
        buscarOrdenAlohaInput = document.getElementById('buscar-orden-aloha');
        buscarRutInput = document.getElementById('buscar-rut');
        limpiarBuscadorBtn = document.getElementById('limpiar-buscador-btn');
        resultadosVentasLoader = document.getElementById('resultados-ventas-loader');
        resultadosVentasMensaje = document.getElementById('resultados-ventas-mensaje');
        resultadosVentasContainer = document.getElementById('resultados-ventas-container');
    }

    // Referencias a elementos específicos de Simulador de Comisión
    if (tablaRemuneracionSection) {
        kpisFijosLoader = document.getElementById('kpis-fijos-loader');
        kpisFijosErrorElem = document.getElementById('kpis-fijos-error');
        kpiDisplayGrid = document.getElementById('kpi-display-grid');
        simEntradasVozInput = document.getElementById('sim-entradas-voz');
        simEntradasFoInput = document.getElementById('sim-entradas-fo');
        simEntradasTotalizacionInput = document.getElementById('sim-entradas-totalizacion');
        simEntradasIsnInput = document.getElementById('sim-entradas-isn');
        simEntradasAdhesionInput = document.getElementById('sim-entradas-adhesion');
        btnSimularComision = document.getElementById('btn-simular-comision');
        simulacionLoader = document.getElementById('simulacion-loader');
        simulacionErrorElem = document.getElementById('simulacion-error');
        outputSimulacion = document.getElementById('output-simulacion');
        resSimPorcentaje = document.getElementById('res-sim-porcentaje');
        resSimIncentivo = document.getElementById('res-sim-incentivo');
        remuneracionLoaderTablaPPM = document.getElementById('remuneracion-loader-tabla-ppm');
        tablaFactoresPPMRefElem = document.getElementById('tablaFactoresPPMRef');
        graficoPesosLoader = document.getElementById('grafico-pesos-loader');
        graficoPesosErrorElem = document.getElementById('grafico-pesos-error');
    }

    // Referencias a elementos específicos de Asistente AI
    if (asistenteAIContentSection) {
        aiPrompt = document.getElementById('ai-prompt');
        aiGenerateBtn = document.getElementById('ai-generate-btn');
        aiLoader = document.getElementById('ai-loader');
        aiChatLog = document.getElementById('ai-chat-log');
        aiNewChatBtn = document.getElementById('ai-new-chat-btn');

        // Chips de sugerencias
        document.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                if (aiPrompt) {
                    aiPrompt.value = chip.dataset.prompt;
                    aiPrompt.focus();
                    const suggestions = document.getElementById('ai-suggestions');
                    if (suggestions) suggestions.style.display = 'none';
                }
            });
        });

        // Enter para enviar (Shift+Enter = nueva línea)
        if (aiPrompt) {
            aiPrompt.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (aiGenerateBtn) aiGenerateBtn.click();
                }
            });
        }
    }

    // Referencias a elementos específicos del formulario de Agregar Venta
    btnOpenAddSale = document.getElementById('btn-open-add-sale');
    addSaleOverlay = document.getElementById('add-sale-overlay');
    addSalePopup = document.getElementById('add-sale-popup');
    btnCloseAddSale = document.getElementById('btn-close-add-sale');
    addSaleForm = document.getElementById('add-sale-form');
    btnSubmitSale = document.getElementById('btn-submit-sale');
    addSaleLoader = document.getElementById('add-sale-loader');
    addSaleMensaje = document.getElementById('add-sale-mensaje');

    // Referencias a elementos específicos del popup de Detalles de KPI
    kpiDetailsOverlay = document.getElementById('kpi-details-overlay');
    kpiDetailsPopup = document.getElementById('kpi-details-popup');
    btnCloseKpiDetails = document.getElementById('btn-close-kpi-details');
    kpiDetailsTitle = document.getElementById('kpi-details-title');
    kpiDetailsContent = document.getElementById('kpi-details-content');
    kpiDetailsLoader = document.getElementById('kpi-details-loader');
    
    // --- Nuevas referencias de DOM para Ofertas Flash ---
    btnOpenUploadOffer = document.getElementById('btn-open-upload-offer');
    uploadOfferOverlay = document.getElementById('upload-offer-overlay');
    uploadOfferPopup = document.getElementById('upload-offer-popup');
    btnCloseUploadOffer = document.getElementById('btn-close-upload-offer');
    uploadOfferForm = document.getElementById('upload-offer-form');
    uploadOfferFile = document.getElementById('upload-offer-file');
    uploadOfferTitle = document.getElementById('upload-offer-title');
    uploadOfferDescription = document.getElementById('upload-offer-description');
    btnSubmitUploadOffer = document.getElementById('btn-submit-upload-offer');
    uploadOfferLoader = document.getElementById('upload-offer-loader');
    uploadOfferMessage = document.getElementById('upload-offer-message');
    flashOffersCardsContainer = document.getElementById('flash-offers-cards-container');
    flashOffersDisplayLoader = document.getElementById('flash-offers-display-loader');
    // ---------------------------------------------------

    // Lógica del tema (claro/oscuro)
    const LSTORAGE_THEME_KEY = 'themePreference';
    function applyTheme(theme) { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem(LSTORAGE_THEME_KEY, theme); }
    window.toggleTheme = function toggleTheme() { const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'; const newTheme = currentTheme === 'dark' ? 'light' : 'dark'; applyTheme(newTheme); };
    const savedTheme = localStorage.getItem(LSTORAGE_THEME_KEY);
    applyTheme(savedTheme || 'light');

    // --- Listeners de eventos ---
    if (themeToggleButtonFooter) themeToggleButtonFooter.addEventListener('click', toggleTheme);
    if (loginForm) loginForm.addEventListener('submit', (e) => { e.preventDefault(); attemptLogin(loginPasswordInput.value); });
    if (hamburgerBtnMobile) hamburgerBtnMobile.addEventListener('click', () => { sidebarLeft.classList.toggle('open'); document.body.classList.toggle('sidebar-left-open'); hamburgerBtnMobile.setAttribute('aria-expanded', String(sidebarLeft.classList.contains('open'))); });
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
    // Cierre de sidebar al hacer click fuera
    document.addEventListener('click', (e) => { if (sidebarLeft && sidebarLeft.classList.contains('open') && !sidebarLeft.contains(e.target) && hamburgerBtnMobile && !hamburgerBtnMobile.contains(e.target)) { closeMobileSidebar(); } });
    
    // Clonar items de navegación para móvil
    if (verticalNavbar && mobileNavLinks) { const desktopNavItems = verticalNavbar.querySelectorAll('.vnav-item'); desktopNavItems.forEach(item => { if (item.getAttribute('href') !== '#inicio') { const clone = item.cloneNode(true); clone.classList.remove('vnav-item'); clone.addEventListener('click', closeMobileSidebar); mobileNavLinks.appendChild(clone); } }); }
    
    // Formularios y botones de acción
    if (prospectoForm) prospectoForm.addEventListener('submit', guardarProspecto);
    if (buscadorVentasForm) buscadorVentasForm.addEventListener('submit', buscarVentas);
    if (limpiarBuscadorBtn) limpiarBuscadorBtn.addEventListener('click', () => { if (buscadorVentasForm) buscadorVentasForm.reset(); if (resultadosVentasContainer) resultadosVentasContainer.innerHTML = ''; if (resultadosVentasMensaje) { resultadosVentasMensaje.style.display = 'none'; resultadosVentasMensaje.textContent = ''; } });
    if (btnSimularComision) btnSimularComision.addEventListener('click', simularComision);
    if (aiGenerateBtn) aiGenerateBtn.addEventListener('click', askGemini);
    if (aiNewChatBtn) aiNewChatBtn.addEventListener('click', startNewAIChat);
    if(btnOpenAddSale) btnOpenAddSale.addEventListener('click', () => toggleSalePopup(true));
    if(btnCloseAddSale) btnCloseAddSale.addEventListener('click', () => toggleSalePopup(false));
    if(addSaleOverlay) addSaleOverlay.addEventListener('click', () => toggleSalePopup(false));
    if(addSaleForm) addSaleForm.addEventListener('submit', handleSaleSubmit);
    if(btnCloseKpiDetails) btnCloseKpiDetails.addEventListener('click', () => toggleKpiDetailsPopup(false));
    if(kpiDetailsOverlay) kpiDetailsOverlay.addEventListener('click', () => toggleKpiDetailsPopup(false));
    
    // Delegación de eventos para botones de detalles de KPI
    if(kpiCardsContainer) { kpiCardsContainer.addEventListener('click', (event) => { if (event.target && event.target.classList.contains('btn-details')) { const kpiIdentifier = event.target.dataset.kpi; if (kpiIdentifier) { showKpiDetails(kpiIdentifier); } } }); }
    
    // Lógica de pestañas para Ofertas del Mes
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    tabLinks.forEach(link => { link.addEventListener('click', () => { const tabId = link.dataset.tab; tabLinks.forEach(item => item.classList.remove('active')); link.classList.add('active'); tabContents.forEach(content => { if (content.id === tabId) { content.classList.add('active'); } else { content.classList.remove('active'); } }); }); });
    const subTabLinks = document.querySelectorAll('.sub-tab-link');
    subTabLinks.forEach(link => { link.addEventListener('click', (e) => { const siblings = e.target.parentElement.children; for (let sibling of siblings) { sibling.classList.remove('active'); } e.target.classList.add('active'); }); });
    
    // --- Event Listeners para la nueva gestión de Ofertas Flash ---
    if (btnOpenUploadOffer) btnOpenUploadOffer.addEventListener('click', () => toggleUploadOfferPopup(true));
    if (btnCloseUploadOffer) btnCloseUploadOffer.addEventListener('click', () => toggleUploadOfferPopup(false));
    if (uploadOfferOverlay) uploadOfferOverlay.addEventListener('click', () => toggleUploadOfferPopup(false));
    if (uploadOfferForm) uploadOfferForm.addEventListener('submit', handleUploadOfferSubmit);

    // Delegación de eventos para los botones de las tarjetas de ofertas flash
    if (flashOffersCardsContainer) {
        flashOffersCardsContainer.addEventListener('click', (event) => {
            // Botón "Ver Oferta"
            const viewBtn = event.target.closest('.view-offer-btn');
            if (viewBtn) {
                const offerUrl = viewBtn.dataset.offerUrl;
                const fileType = viewBtn.dataset.fileType || '';
                if (offerUrl) {
                    const excelTypes = [
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    ];
                    if (fileType === 'application/pdf' || excelTypes.includes(fileType)) {
                        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(offerUrl)}&embedded=true`;
                        openFlashOfferDocViewer(viewerUrl);
                    } else {
                        openFlashOfferFullscreen(offerUrl);
                    }
                }
            }

            // Botón "Eliminar"
            const deleteBtn = event.target.closest('.btn-delete-flash-offer');
            if (deleteBtn) {
                const fileId = deleteBtn.dataset.fileId; // <--- Cambiado a data-file-id
                if (fileId) {
                    handleDeleteFlashOffer(fileId);
                }
            }
        });
    }
    // ------------------------------------------

    // Inicialización de selectores del formulario de ventas
    populateSaleFormDropdowns(); 
    // Actualización de fecha y hora
    updateDateTime(); 
    setInterval(updateDateTime, 60000); 
    // Carga inicial de datos
    cargarDatosParaObjetivosDiarios(); 
    cargarYMostrarUltimaAtencion();
    
    // Manejo del hash de URL para navegación
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Llama al manejador en la carga inicial

    // Iniciar notificaciones periódicas
    if (toastContainer && typeof startPeriodicNotifications === 'function') { startPeriodicNotifications(); }
    
    console.log("script.js: Inicialización completa.");
    
});
