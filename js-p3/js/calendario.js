// Calendario de clases (bm_clases): el líder las crea, edita y borra; el estudiante ve las de su party mes a mes.
// Páginas: estudiante/calendario y lider/calendario (party.js y perfil.js son opcionales: party y nombres).
// Responsable: P3 (Feed y lecciones).

// ===== Elementos =====
// Estudiante
const tablaCalendario = document.querySelector(".cal__tabla");
const cuerpoCalendario = document.querySelector(".cal__tabla tbody");
const tituloMesCalendario = document.querySelector(".cal__mes");
const leyendaTablaCalendario = document.querySelector(".cal__tabla caption");
const botonMesAnterior = document.querySelector(".cal__nav--ant");
const botonMesSiguiente = document.querySelector(".cal__nav--sig");
const subtituloCalendario = document.querySelector(".cal__subtitulo");
const avatarCalendario = document.querySelector(".cal__avatar");
const nombreCalendario = document.querySelector(".cal__nombre");
const nivelCalendario = document.querySelector(".cal__nivel");
const horaProximaClase = document.querySelector(".cal__clase-hora");
const subProximaClase = document.querySelector(".cal__clase-sub");
const botonIngresarClase = document.querySelector(".cal__ingresar .boton");

// Líder
const diasCalendarioLider = document.querySelector(".lcal__dias");
const tituloMesLider = document.querySelector(".lcal__mes");
const lateralCalendarioLider = document.querySelector(".lcal__lateral");
const formClase = document.querySelector(".lcal__formulario");
const campoFechaClase = document.querySelector("#lcal-fecha");
const campoHoraClase = document.querySelector("#lcal-hora");
const campoLinkClase = document.querySelector("#lcal-link");
const botonGuardarClase = document.querySelector(".lcal__acciones .boton:not(.boton--secundario)");
const botonDescartarClase = document.querySelector(".lcal__acciones .boton--secundario");

// Con ?id=3 en la dirección se edita esa clase; sin id (valor 0) se crea una nueva
const idClaseEditar = Number(new URLSearchParams(location.search).get("id"));


// ===== Datos =====
const CLAVE_CLASES = "bm_clases";
const mesesCalendario = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const diasSemanaCalendario = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

// { id, correoLider, titulo, fecha: "2026-11-20", hora: "17:00", horaFin: "19:00", link }
const clasesIniciales = [
  { id: 1, correoLider: "lider1@branchmatch.test", titulo: "Grafos: caminos mínimos", fecha: "2026-11-02", hora: "15:00", horaFin: "17:00", link: "https://meet.google.com/bm-insanos-1" },
  { id: 2, correoLider: "lider1@branchmatch.test", titulo: "Grafos: BFS y DFS", fecha: "2026-11-05", hora: "17:00", horaFin: "19:00", link: "https://meet.google.com/bm-insanos-2" },
  { id: 3, correoLider: "lider1@branchmatch.test", titulo: "Programación dinámica I", fecha: "2026-11-09", hora: "15:00", horaFin: "17:00", link: "https://meet.google.com/bm-insanos-3" },
  { id: 4, correoLider: "lider1@branchmatch.test", titulo: "Programación dinámica II", fecha: "2026-11-12", hora: "17:00", horaFin: "19:00", link: "https://meet.google.com/bm-insanos-4" },
  { id: 5, correoLider: "lider1@branchmatch.test", titulo: "Repaso de concurso", fecha: "2026-11-16", hora: "15:00", horaFin: "17:00", link: "https://meet.google.com/bm-insanos-5" },
  { id: 6, correoLider: "lider1@branchmatch.test", titulo: "Caminos mínimos", fecha: "2026-11-19", hora: "17:00", horaFin: "19:00", link: "https://meet.google.com/bm-insanos-6" },
  { id: 7, correoLider: "lider1@branchmatch.test", titulo: "Strings: KMP", fecha: "2026-11-23", hora: "15:00", horaFin: "17:00", link: "https://meet.google.com/bm-insanos-7" },
  { id: 8, correoLider: "lider1@branchmatch.test", titulo: "Simulacro ICPC", fecha: "2026-11-26", hora: "17:00", horaFin: "19:00", link: "https://meet.google.com/bm-insanos-8" },
  { id: 9, correoLider: "lider1@branchmatch.test", titulo: "Árboles de segmentos", fecha: "2026-12-03", hora: "17:00", horaFin: "19:00", link: "https://meet.google.com/bm-insanos-9" },
  { id: 10, correoLider: "lider2@branchmatch.test", titulo: "DP en grafos", fecha: "2026-11-18", hora: "18:00", horaFin: "20:00", link: "https://meet.google.com/bm-chacales-1" },
];

const obtenerClases = () => leerDatos(CLAVE_CLASES, clasesIniciales);

// Clases de un líder, ordenadas por fecha y hora
const obtenerClasesDeLider = (correoLider) =>
  obtenerClases()
    .filter((c) => c.correoLider === correoLider)
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

const obtenerClase = (id) => obtenerClases().find((c) => c.id === id) || null;

const crearClase = (clase) => {
  const clases = obtenerClases();
  const ids = clases.map((c) => c.id);
  clase.id = Math.max(0, ...ids) + 1;
  clases.push(clase);
  guardarDatos(CLAVE_CLASES, clases);
  return clase;
};

const editarClase = (id, cambios) => {
  const clases = obtenerClases();
  const posicion = clases.findIndex((c) => c.id === id);
  if (posicion === -1) return;
  clases[posicion] = { ...clases[posicion], ...cambios, id };
  guardarDatos(CLAVE_CLASES, clases);
};

const borrarClase = (id) => {
  guardarDatos(CLAVE_CLASES, obtenerClases().filter((c) => c.id !== id));
};


// ===== Funciones =====
// Mes que se está mirando (el día 1 de ese mes) y día elegido en el calendario del líder
let mesVisibleCalendario = new Date();
mesVisibleCalendario.setDate(1);
let fechaElegidaLider = "";

// "2026-11-05" con la hora local (sin desfase por zona horaria)
const formatearFechaIso = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

const leerFechaIso = (iso) => {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
};

const hoyIsoCalendario = () => formatearFechaIso(new Date());

// «Jueves 19 nov»
const formatearFechaLarga = (iso) => {
  const fecha = leerFechaIso(iso);
  const dia = diasSemanaCalendario[fecha.getDay()];
  return `${dia[0].toUpperCase()}${dia.slice(1)} ${fecha.getDate()} ${mesesCalendario[fecha.getMonth()].slice(0, 3).toLowerCase()}`;
};

const formatearHorarioClase = (clase) => `${clase.hora} – ${clase.horaFin}`;

// Celdas de un mes empezando en lunes: null para los huecos y el número de día para el resto
const crearCeldasMes = (anio, mes) => {
  const huecos = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const celdas = [...Array(huecos).fill(null), ...Array.from({ length: totalDias }, (_, i) => i + 1)];
  while (celdas.length % 7 !== 0) celdas.push(null);
  return celdas;
};

const obtenerFechaCelda = (anio, mes, dia) => formatearFechaIso(new Date(anio, mes, dia));

// Correo del líder cuyas clases se muestran: el de la party del usuario (o él mismo si es líder)
const obtenerLiderDeClases = (sesion) => {
  if (sesion.rol === "lider") return sesion.correo;
  if (typeof obtenerPartyDe !== "function") return "";
  const party = obtenerPartyDe(sesion.correo);
  return party ? party.correoLider : "";
};

const obtenerNombrePartyCalendario = (correo) => {
  if (typeof obtenerPartyDe !== "function") return "";
  const party = obtenerPartyDe(correo);
  return party ? party.nombre : "";
};

const mostrarTituloMes = (elementoTitulo) => {
  const texto = `${mesesCalendario[mesVisibleCalendario.getMonth()]} ${mesVisibleCalendario.getFullYear()}`;
  elementoTitulo.textContent = texto;
  return texto;
};

// --- Estudiante ---
const crearHtmlCeldaEstudiante = (dia, fechasConClase) => {
  if (!dia) return '<td class="cal__vacio"></td>';
  const fecha = obtenerFechaCelda(mesVisibleCalendario.getFullYear(), mesVisibleCalendario.getMonth(), dia);
  const esHoy = fecha === hoyIsoCalendario();
  const hayClase = fechasConClase.includes(fecha);
  const clase = esHoy ? "cal__dia cal__dia--hoy" : hayClase ? "cal__dia cal__dia--clase" : "cal__dia";
  const notas = [esHoy ? "hoy" : "", hayClase ? "clase" : ""].filter(Boolean).join(", ");
  return `<td class="${clase}">${dia}${notas ? `<span class="visualmente-oculto"> (${notas})</span>` : ""}</td>`;
};

const mostrarCalendarioEstudiante = (clases) => {
  const texto = mostrarTituloMes(tituloMesCalendario);
  leyendaTablaCalendario.textContent = texto;
  const fechas = clases.map((c) => c.fecha);
  const celdas = crearCeldasMes(mesVisibleCalendario.getFullYear(), mesVisibleCalendario.getMonth());
  const filas = [];
  for (let i = 0; i < celdas.length; i += 7) {
    filas.push(`<tr>${celdas.slice(i, i + 7).map((dia) => crearHtmlCeldaEstudiante(dia, fechas)).join("")}</tr>`);
  }
  cuerpoCalendario.innerHTML = filas.join("");
};

// Panel con el usuario y la próxima clase (de hoy en adelante)
const mostrarPanelEstudiante = (sesion, clases) => {
  const nombre = typeof obtenerNombrePerfil === "function" ? obtenerNombrePerfil(sesion.correo) : sesion.nombre;
  const nivel = typeof obtenerNivelJugador === "function" ? obtenerNivelJugador(sesion.correo) : calcularNivelNumero(obtenerXp(sesion.correo));
  const party = obtenerNombrePartyCalendario(sesion.correo);
  avatarCalendario.textContent = obtenerIniciales(nombre);
  nombreCalendario.textContent = nombre.split(" ")[0];
  nivelCalendario.textContent = `Nivel ${nivel} · ${obtenerXp(sesion.correo)} XP`;
  subtituloCalendario.textContent = party ? `Tus sesiones con ${party}.` : "Únete a una party para ver sus sesiones.";

  const ahora = `${hoyIsoCalendario()} ${new Date().toTimeString().slice(0, 5)}`;
  const proxima = clases.find((c) => `${c.fecha} ${c.horaFin}` >= ahora);
  if (!proxima) {
    horaProximaClase.textContent = "No hay clases programadas";
    subProximaClase.textContent = party ? "Tu líder aún no agenda la siguiente" : "Aún no estás en una party";
    botonIngresarClase.closest(".cal__ingresar").hidden = true;
    return;
  }
  const cuando = proxima.fecha === hoyIsoCalendario() ? "Hoy" : formatearFechaLarga(proxima.fecha);
  horaProximaClase.textContent = `Clase: ${formatearHorarioClase(proxima)}`;
  subProximaClase.textContent = `${cuando} · ${proxima.titulo}`;
  botonIngresarClase.href = proxima.link;
  botonIngresarClase.target = "_blank";
  botonIngresarClase.rel = "noopener";
};

const cambiarMesEstudiante = (e, salto, clases) => {
  e.preventDefault();
  mesVisibleCalendario.setMonth(mesVisibleCalendario.getMonth() + salto);
  mostrarCalendarioEstudiante(clases);
};

// --- Líder ---
const crearHtmlDiaLider = (dia, fechasConClase) => {
  if (!dia) return '<li class="lcal__dia lcal__dia--vacio" aria-hidden="true"></li>';
  const fecha = obtenerFechaCelda(mesVisibleCalendario.getFullYear(), mesVisibleCalendario.getMonth(), dia);
  const esHoy = fecha === hoyIsoCalendario();
  const hayClase = fechasConClase.includes(fecha);
  const clase = esHoy ? "lcal__dia lcal__dia--hoy" : hayClase ? "lcal__dia lcal__dia--clase" : "lcal__dia";
  const notas = [esHoy ? "hoy" : "", hayClase ? "hay clase" : ""].filter(Boolean).join(", ");
  const elegido = fecha === fechaElegidaLider ? ' aria-current="date"' : "";
  return `<li class="${clase}"><a class="p3cal__dia" href="#" data-fecha="${fecha}"${elegido}>${dia}${notas ? `<span class="visualmente-oculto"> (${notas})</span>` : ""}</a></li>`;
};

const mostrarCalendarioLider = (sesion) => {
  mostrarTituloMes(tituloMesLider);
  const fechas = obtenerClasesDeLider(sesion.correo).map((c) => c.fecha);
  const celdas = crearCeldasMes(mesVisibleCalendario.getFullYear(), mesVisibleCalendario.getMonth());
  diasCalendarioLider.innerHTML = celdas.map((dia) => crearHtmlDiaLider(dia, fechas)).join("");
};

const crearHtmlClaseLider = (clase) => `
  <li class="lcal__clase p3cal__clase">
    <span class="lcal__clase-hora">Clase: ${formatearHorarioClase(clase)}<span class="p3cal__titulo">${escaparHtml(clase.titulo)}</span></span>
    <span class="p3cal__acciones">
      <a class="lcal__editar" href="calendario.html?id=${clase.id}">Editar</a>
      <a class="lcal__editar p3cal__borrar" href="#" data-accion="borrar-clase" data-id="${clase.id}">Borrar</a>
    </span>
  </li>`;

// Lista de clases del día elegido (por defecto, hoy)
const mostrarClasesDelDia = (sesion) => {
  const fecha = fechaElegidaLider || hoyIsoCalendario();
  const clases = obtenerClasesDeLider(sesion.correo).filter((c) => c.fecha === fecha);
  const titulo = fecha === hoyIsoCalendario() ? "Clases creadas para hoy:" : `Clases del ${formatearFechaLarga(fecha)}:`;
  const contenido = clases.length
    ? `<ul class="p3cal__lista">${clases.map(crearHtmlClaseLider).join("")}</ul>`
    : '<p class="lcal__clase">No hay clases este día.</p>';
  let zona = lateralCalendarioLider.querySelector(".p3cal__dia-elegido");
  if (!zona) {
    // Se reemplazan el título y la clase de ejemplo del diseño por una zona que se vuelve a pintar
    lateralCalendarioLider.querySelectorAll(":scope > .lcal__subtitulo-tarjeta, :scope > .lcal__clase").forEach((n) => n.remove());
    lateralCalendarioLider.insertAdjacentHTML("afterbegin", '<div class="p3cal__dia-elegido" aria-live="polite"></div>');
    zona = lateralCalendarioLider.querySelector(".p3cal__dia-elegido");
  }
  zona.innerHTML = `<h2 class="lcal__subtitulo-tarjeta">${titulo}</h2>${contenido}`;
};

const elegirDiaLider = (e, sesion) => {
  const enlace = e.target.closest(".p3cal__dia");
  if (!enlace) return;
  e.preventDefault();
  fechaElegidaLider = enlace.dataset.fecha;
  mostrarCalendarioLider(sesion);
  mostrarClasesDelDia(sesion);
  // En modo «crear», el día elegido se copia a la fecha del formulario
  if (!idClaseEditar) campoFechaClase.value = fechaElegidaLider;
  diasCalendarioLider.querySelector(`[data-fecha="${fechaElegidaLider}"]`)?.focus();
};

const accionarClasesLider = (e, sesion) => {
  const enlace = e.target.closest('[data-accion="borrar-clase"]');
  if (!enlace) return;
  e.preventDefault();
  if (!confirm("¿Borrar esta clase? Tu party ya no la verá en su calendario.")) return;
  const id = Number(enlace.dataset.id);
  borrarClase(id);
  if (id === idClaseEditar) {
    location.href = "calendario.html";
    return;
  }
  mostrarCalendarioLider(sesion);
  mostrarClasesDelDia(sesion);
  mostrarAvisoClase("Clase borrada.");
};

// Valor del <select> de hora: "17-19" ↔ { hora: "17:00", horaFin: "19:00" }
const leerHoraSeleccionada = () => {
  const [desde, hasta] = campoHoraClase.value.split("-");
  return { hora: `${desde.padStart(2, "0")}:00`, horaFin: `${hasta.padStart(2, "0")}:00` };
};

const elegirHoraEnSelect = (clase) => {
  const valor = `${Number(clase.hora.slice(0, 2))}-${Number(clase.horaFin.slice(0, 2))}`;
  // Si la hora guardada no está entre las opciones, se añade para poder editarla
  if (![...campoHoraClase.options].some((o) => o.value === valor)) {
    campoHoraClase.insertAdjacentHTML("beforeend", `<option value="${valor}">${formatearHorarioClase(clase)}</option>`);
  }
  campoHoraClase.value = valor;
};

const zonaAvisoClase = () => {
  let aviso = formClase.querySelector(".p3cal__aviso");
  if (!aviso) {
    formClase.insertAdjacentHTML("beforeend", '<p class="p3cal__aviso" role="status"></p>');
    aviso = formClase.querySelector(".p3cal__aviso");
  }
  return aviso;
};

const mostrarAvisoClase = (texto) => {
  zonaAvisoClase().textContent = texto;
};

// Prepara el formulario: fechas desde hoy y, si hay ?id=, los datos de la clase a editar
const prepararFormularioClase = (sesion) => {
  campoFechaClase.min = hoyIsoCalendario();
  campoFechaClase.removeAttribute("max");
  if (!idClaseEditar) {
    campoFechaClase.value = hoyIsoCalendario();
    return;
  }
  const clase = obtenerClase(idClaseEditar);
  if (!clase || clase.correoLider !== sesion.correo) {
    location.href = "calendario.html";
    return;
  }
  formClase.querySelector(".lcal__subtitulo-tarjeta").textContent = "Editar clase:";
  campoFechaClase.min = "";
  campoFechaClase.value = clase.fecha;
  elegirHoraEnSelect(clase);
  campoLinkClase.value = clase.link;
  botonDescartarClase.textContent = "Cancelar";
  fechaElegidaLider = clase.fecha;
  mesVisibleCalendario = leerFechaIso(clase.fecha);
  mesVisibleCalendario.setDate(1);
};

const guardarClase = (e, sesion) => {
  e.preventDefault();
  if (!validarFormularioClase(sesion)) return;
  const { hora, horaFin } = leerHoraSeleccionada();
  const datos = { fecha: campoFechaClase.value, hora, horaFin, link: campoLinkClase.value.trim() };
  if (idClaseEditar) {
    editarClase(idClaseEditar, datos);
    location.href = "calendario.html";
    return;
  }
  const party = obtenerNombrePartyCalendario(sesion.correo);
  crearClase({ correoLider: sesion.correo, titulo: party ? `Sesión de ${party}` : "Sesión de la party", ...datos });
  fechaElegidaLider = datos.fecha;
  mesVisibleCalendario = leerFechaIso(datos.fecha);
  mesVisibleCalendario.setDate(1);
  formClase.reset();
  campoFechaClase.value = datos.fecha;
  mostrarCalendarioLider(sesion);
  mostrarClasesDelDia(sesion);
  mostrarAvisoClase(`Clase guardada para el ${formatearFechaLarga(datos.fecha)}. Tu party ya la ve en su calendario.`);
};

const descartarClase = (e) => {
  e.preventDefault();
  if (idClaseEditar) {
    location.href = "calendario.html";
    return;
  }
  formClase.reset();
  campoFechaClase.value = hoyIsoCalendario();
  limpiarErroresClase();
  mostrarAvisoClase("");
};

// Al cambiar la fecha del formulario, el calendario va a ese mes
const seguirFechaFormulario = (sesion) => {
  if (!campoFechaClase.value) return;
  mesVisibleCalendario = leerFechaIso(campoFechaClase.value);
  mesVisibleCalendario.setDate(1);
  fechaElegidaLider = campoFechaClase.value;
  mostrarCalendarioLider(sesion);
  mostrarClasesDelDia(sesion);
};


// ===== Validaciones =====
const marcarErrorClase = (campo, texto) => {
  const contenedor = campo.closest(".campo");
  contenedor.classList.add("campo--error");
  if (texto) contenedor.querySelector(".campo__error").textContent = texto;
  campo.setAttribute("aria-invalid", "true");
};

const limpiarErroresClase = () => {
  formClase.querySelectorAll(".campo--error").forEach((c) => c.classList.remove("campo--error"));
  formClase.querySelectorAll("[aria-invalid]").forEach((c) => c.removeAttribute("aria-invalid"));
};

const esLinkValido = (texto) => {
  try {
    const url = new URL(texto);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch (error) {
    return false;
  }
};

const validarFormularioClase = (sesion) => {
  limpiarErroresClase();
  const errores = [];
  if (!campoFechaClase.value) {
    marcarErrorClase(campoFechaClase, "Elige la fecha de la clase.");
    errores.push(campoFechaClase);
  } else if (!idClaseEditar && campoFechaClase.value < hoyIsoCalendario()) {
    marcarErrorClase(campoFechaClase, "La fecha no puede ser anterior a hoy.");
    errores.push(campoFechaClase);
  }
  if (!campoHoraClase.value) {
    marcarErrorClase(campoHoraClase, "Selecciona la hora de la clase.");
    errores.push(campoHoraClase);
  } else if (campoFechaClase.value) {
    const { hora } = leerHoraSeleccionada();
    const repetida = obtenerClasesDeLider(sesion.correo).some((c) => c.fecha === campoFechaClase.value && c.hora === hora && c.id !== idClaseEditar);
    if (repetida) {
      marcarErrorClase(campoHoraClase, "Ya tienes una clase ese día a esa hora.");
      errores.push(campoHoraClase);
    }
  }
  if (!esLinkValido(campoLinkClase.value.trim())) {
    marcarErrorClase(campoLinkClase, "Escribe un enlace válido que empiece con https://");
    errores.push(campoLinkClase);
  }
  if (errores.length) errores[0].focus();
  return errores.length === 0;
};


// ===== Registro de eventos =====
document.addEventListener("DOMContentLoaded", () => {
  const sesion = obtenerSesion();
  if (!sesion) return;

  if (tablaCalendario) {
    const correoLider = obtenerLiderDeClases(sesion);
    const clases = correoLider ? obtenerClasesDeLider(correoLider) : [];
    mostrarCalendarioEstudiante(clases);
    mostrarPanelEstudiante(sesion, clases);
    botonMesAnterior.addEventListener("click", (e) => cambiarMesEstudiante(e, -1, clases));
    botonMesSiguiente.addEventListener("click", (e) => cambiarMesEstudiante(e, 1, clases));
  }

  if (diasCalendarioLider && formClase) {
    prepararFormularioClase(sesion);
    mostrarCalendarioLider(sesion);
    mostrarClasesDelDia(sesion);
    diasCalendarioLider.addEventListener("click", (e) => elegirDiaLider(e, sesion));
    lateralCalendarioLider.addEventListener("click", (e) => accionarClasesLider(e, sesion));
    formClase.addEventListener("submit", (e) => guardarClase(e, sesion));
    botonGuardarClase.addEventListener("click", (e) => guardarClase(e, sesion));
    botonDescartarClase.addEventListener("click", descartarClase);
    campoFechaClase.addEventListener("change", () => seguirFechaFormulario(sesion));
    formClase.addEventListener("input", (e) => {
      e.target.closest(".campo")?.classList.remove("campo--error");
      e.target.removeAttribute("aria-invalid");
    });
  }
});
