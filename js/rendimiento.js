// Rendimiento: resumen del estudiante, resumen grupal del líder y números del panel del líder, calculados con los retos y las entregas.
// Páginas: estudiante/rendimiento, lider/rendimiento y lider/panel (necesita retos.js y entregas.js cargados antes).
// Responsable: P4 (Retos y rendimiento).

// ===== Elementos =====
const principalRendimientoEstudiante = document.querySelector("main.rend");
const principalRendimientoLider = document.querySelector("main.rg");
const principalPanelLider = document.querySelector(".pl__main");


// ===== Datos =====
// Un reto cuenta como aprobado cuando la entrega más reciente del estudiante está aprobada.
// El porcentaje de cada tema es: retos aprobados / (retos del tema × estudiantes).
const UMBRAL_MUY_BIEN = 80;
const UMBRAL_REGULAR = 60;


// ===== Funciones =====
const retoEstaAprobado = (reto, correo) => {
  const entrega = obtenerEntregaDe(reto.id, correo);
  return Boolean(entrega) && entrega.estado === "aprobada";
};

const calcularPorcentaje = (parte, total) => (total ? Math.round((parte / total) * 100) : 0);

// Aprobados y total posible de un grupo de retos para varios estudiantes
const contarAprobados = (retos, correos) => {
  const total = retos.length * correos.length;
  const aprobados = retos.reduce((suma, reto) => suma + correos.filter((c) => retoEstaAprobado(reto, c)).length, 0);
  return { aprobados, total, porcentaje: calcularPorcentaje(aprobados, total) };
};

// Dominio por tema, del más alto al más bajo
const calcularDominioPorTema = (retos, correos) => {
  const temas = [...new Set(retos.map((r) => r.tema))];
  return temas
    .map((tema) => ({ tema, ...contarAprobados(retos.filter((r) => r.tema === tema), correos) }))
    .sort((a, b) => b.porcentaje - a.porcentaje);
};

const obtenerColorBarra = (porcentaje) => (porcentaje >= UMBRAL_MUY_BIEN ? "menta" : porcentaje >= UMBRAL_REGULAR ? "amarillo" : "rosa");

const crearHtmlTemaRendimiento = (prefijo, dominio) => `
  <li class="${prefijo}__tema">
    <span class="${prefijo}__tema-nombre">${escaparHtml(dominio.tema)}</span>
    <span class="${prefijo}__tema-valor">${dominio.porcentaje}%</span>
    <span class="${prefijo}__barra"><span class="${prefijo}__relleno ${prefijo}__relleno--${obtenerColorBarra(dominio.porcentaje)} p4-ancho--${redondearAnchoReto(dominio.porcentaje)}"></span></span>
  </li>`;

const crearHtmlSinRetos = (prefijo, texto) => `<li class="${prefijo}__tema"><span class="${prefijo}__tema-nombre">${escaparHtml(texto)}</span></li>`;

// El tema más flojo (si no hay retos, no hay tema)
const obtenerTemaDebil = (dominios) => dominios.length ? dominios[dominios.length - 1] : null;

// ----- Rendimiento del estudiante -----
const mostrarRendimientoEstudiante = (sesion) => {
  const retos = obtenerRetosDeEstudiante(sesion.correo);
  const general = contarAprobados(retos, [sesion.correo]);
  const dominios = calcularDominioPorTema(retos, [sesion.correo]);
  const debil = obtenerTemaDebil(dominios);

  document.querySelector(".rend__kpi-valor").textContent = `${general.porcentaje}%`;
  document.querySelector(".rend__lista").innerHTML = dominios.length
    ? dominios.map((d) => crearHtmlTemaRendimiento("rend", d)).join("")
    : crearHtmlSinRetos("rend", "Aún no hay retos en tu party.");

  const titulo = document.querySelector(".rend__plan-titulo");
  const texto = document.querySelector(".rend__plan-texto");
  const acciones = document.querySelectorAll(".rend__acciones .boton");
  if (!debil) {
    titulo.textContent = "Todavía no hay datos";
    texto.textContent = "Cuando tu líder publique retos y los entregues, aquí verás cómo vas en cada tema.";
    acciones[0].remove();
    acciones[1].textContent = "Ver retos";
  } else if (debil.porcentaje >= UMBRAL_MUY_BIEN) {
    titulo.textContent = "¡Vas muy bien en todos los temas!";
    texto.textContent = "Tu desempeño más bajo es del " + debil.porcentaje + "% en " + debil.tema + ". Sigue entregando tus retos para mantener el ritmo.";
    acciones[0].textContent = `Ir a lección de ${debil.tema}`;
    acciones[1].textContent = "Ver mis retos";
  } else {
    titulo.textContent = `Tema a reforzar: ${debil.tema}`;
    texto.textContent = `Notamos que tu desempeño en ${debil.tema} es del ${debil.porcentaje}%. Te sugerimos repasar la lección y reintentar los retos pendientes.`;
    acciones[0].textContent = `Ir a lección de ${debil.tema}`;
    acciones[1].textContent = `Ver retos de ${debil.tema}`;
  }
};

// ----- Rendimiento grupal del líder -----
const mostrarRendimientoLider = (sesion) => {
  const party = obtenerPartyDe(sesion.correo);
  const retos = obtenerRetosDeLider(sesion.correo).filter((r) => r.estado === "publicado");
  const estudiantes = obtenerEstudiantesDeLider(sesion.correo);
  const general = contarAprobados(retos, estudiantes);
  const dominios = calcularDominioPorTema(retos, estudiantes);
  const debil = obtenerTemaDebil(dominios);

  document.querySelector(".rg__subtitulo").textContent = `${party ? party.nombre : "Tu party"} · ${retos.length} ${retos.length === 1 ? "reto publicado" : "retos publicados"}`;
  document.querySelector(".rg__kpi-valor").textContent = `${general.porcentaje}%`;
  document.querySelector(".rg__lista").innerHTML = dominios.length
    ? dominios.map((d) => crearHtmlTemaRendimiento("rg", d)).join("")
    : crearHtmlSinRetos("rg", estudiantes.length ? "Aún no hay retos publicados." : "Aún no hay integrantes en tu party.");

  const titulo = document.querySelector(".rg__plan-titulo");
  const texto = document.querySelector(".rg__plan-texto");
  if (!debil) {
    titulo.textContent = "Todavía no hay datos";
    texto.textContent = "Publica retos y espera las entregas de tu party para ver el rendimiento del grupo.";
  } else if (debil.porcentaje >= UMBRAL_MUY_BIEN) {
    titulo.textContent = "Tu grupo va muy bien";
    texto.textContent = `El tema más bajo es ${debil.tema}, con ${debil.porcentaje}% de aprobación. Puedes subir material extra para seguir mejorando.`;
  } else {
    titulo.textContent = `Tema a reforzar: ${debil.tema}`;
    texto.textContent = `El ${100 - debil.porcentaje}% del grupo tiene problemas en el tema: ${debil.tema}. Se sugiere programar una sesión de repaso o subir material adicional antes del próximo examen.`;
  }
};

// ----- Panel del líder -----
const crearHtmlAvisoPanel = (icono, texto, enlace, textoEnlace) => `
  <li class="pl__aviso">
    <p class="pl__aviso-texto"><img class="pl__aviso-icono" src="../../assets/icons/${icono}" alt="">${escaparHtml(texto)}</p>
    <a class="pl__aviso-link" href="${enlace}">${textoEnlace}</a>
  </li>`;

const mostrarPanelLider = (sesion) => {
  const party = obtenerPartyDe(sesion.correo);
  const retos = obtenerRetosDeLider(sesion.correo).filter((r) => r.estado === "publicado");
  const estudiantes = obtenerEstudiantesDeLider(sesion.correo);
  const pendientes = party ? obtenerSolicitudesDeParty(party.id, "pendiente") : [];
  const entregas = retos.flatMap((r) => obtenerEntregasDeReto(r.id).filter((e) => r.tipo === "codigo" && estudiantes.includes(e.correoEstudiante)));
  const porRevisar = entregas.filter((e) => e.estado === "por-revisar");
  const general = contarAprobados(retos, estudiantes);

  document.querySelector(".pl__saludo h1").textContent = `Hola, ${sesion.nombre.split(" ")[0]}`;
  document.querySelector(".pl__subtitulo").textContent = party ? `Esto es lo que pasa hoy en ${party.nombre}.` : "Crea tu party para empezar a recibir solicitudes y entregas.";

  const valores = document.querySelectorAll(".pl__stat-valor");
  valores[0].textContent = pendientes.length;
  valores[1].textContent = porRevisar.length;
  valores[2].textContent = `${general.porcentaje}%`;

  // Avisos: primero las solicitudes y luego las entregas por revisar (máximo 4)
  const avisos = [
    ...pendientes.slice(0, 2).map((s) => crearHtmlAvisoPanel("panel-item-solicitud.svg", `${obtenerNombrePerfil(s.correoEstudiante)} quiere unirse a tu party`, "solicitudes.html", "Revisar →")),
    ...porRevisar.slice(0, 3).map((e) => crearHtmlAvisoPanel("panel-item-entrega.svg", `${obtenerNombrePerfil(e.correoEstudiante).split(" ")[0]} entregó «${obtenerReto(e.idReto).titulo}»`, `revisar-entrega.html?id=${e.id}`, "Revisar →")),
  ].slice(0, 4);
  document.querySelector(".pl__avisos").innerHTML = avisos.length
    ? avisos.join("")
    : '<li class="pl__aviso"><p class="pl__aviso-texto">Todo al día: no hay solicitudes ni entregas pendientes.</p></li>';

  // Próxima sesión de la party
  const proxima = party ? calcularProximaSesion(party.horarios) : null;
  document.querySelector(".pl__sesion p.titulo-3").textContent = proxima
    ? `${proxima.horario.dia} ${proxima.fecha.getDate()} ${nombresMesesCortosEntrega[proxima.fecha.getMonth()]} · ${proxima.horario.desde} – ${proxima.horario.hasta}`
    : "Sin sesiones programadas";
  document.querySelector(".pl__sesion-tema").textContent = party && party.descripcion ? `Tema: ${party.descripcion}` : "Tema: por definir";
  document.querySelector(".pl__chip").textContent = party ? `${party.integrantes.length} de ${party.cupo} integrantes` : "Sin party";

  // Progreso: retos entregados y aprobados entre todos los que se podrían entregar
  const totalPosible = retos.length * estudiantes.length;
  const entregados = retos.reduce((suma, reto) => suma + estudiantes.filter((c) => obtenerEntregaDe(reto.id, c)).length, 0);
  const metricas = document.querySelectorAll(".pl__metrica");
  const datos = [
    { nombre: "Retos entregados", valor: entregados, color: "menta" },
    { nombre: "Retos aprobados", valor: general.aprobados, color: "celeste" },
  ];
  metricas.forEach((metrica, i) => {
    const porcentaje = calcularPorcentaje(datos[i].valor, totalPosible);
    metrica.querySelector(".pl__metrica-nombre").textContent = datos[i].nombre;
    metrica.querySelector(".pl__metrica-valor").textContent = `${datos[i].valor} / ${totalPosible}`;
    metrica.querySelector(".pl__relleno").className = `pl__relleno pl__relleno--${datos[i].color} p4-ancho--${redondearAnchoReto(porcentaje)}`;
  });
};


// ===== Registro de eventos =====
document.addEventListener("DOMContentLoaded", () => {
  const sesion = obtenerSesion();
  if (!sesion) return;

  if (principalRendimientoEstudiante) mostrarRendimientoEstudiante(sesion);
  if (principalRendimientoLider) mostrarRendimientoLider(sesion);
  if (principalPanelLider) mostrarPanelLider(sesion);
});
