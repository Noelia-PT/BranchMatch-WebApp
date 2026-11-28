// Entregas: datos de las entregas de los estudiantes, tabla de entregas del reto y revisión del líder (aprobar o pedir corrección).
// Páginas: lider/entregas y lider/revisar-entrega (y lo usan retos, resolver y rendimiento).
// Responsable: P4 (Retos y rendimiento).

// ===== Elementos =====
const tablaEntregas = document.querySelector(".ent__tabla tbody");
const bloqueRevision = document.querySelector("main.re");

// Con ?idReto=3 se ven las entregas del reto 3; con ?id=7 se revisa la entrega 7
const parametrosEntregas = new URLSearchParams(location.search);
const idRetoEntregas = Number(parametrosEntregas.get("idReto"));
const idEntregaDireccion = Number(parametrosEntregas.get("id"));


// ===== Datos =====
const CLAVE_ENTREGAS = "bm_entregas";

// Cómo se muestra cada estado de una entrega en la tabla del líder
const estadosEntrega = {
  "por-revisar": { texto: "Por revisar", clase: "ent__estado--revisar" },
  aprobada: { texto: "Aceptado", clase: "ent__estado--aceptado" },
  correccion: { texto: "Corrección pedida", clase: "ent__estado--correccion" },
  incorrecta: { texto: "Incorrecta", clase: "ent__estado--correccion" },
  pendiente: { texto: "Pendiente", clase: "ent__estado--pendiente" },
};
const coloresAvatarEntrega = ["celeste", "menta", "amarillo"];

// Fecha y hora de hoy más N días, a una hora fija: "2026-11-18T18:40:00"
const fechaHoraRelativaEntrega = (dias, hora) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return `${fechaIsoDeReto(fecha)}T${hora}:00`;
};

// estado: "borrador", "por-revisar", "aprobada", "correccion" o "incorrecta".
// Código: "archivo" { nombre, tipo, tamano }. Opción múltiple: "respuesta" ("A", "B"...).
const entregasIniciales = [
  { id: 1, idReto: 1, correoEstudiante: "estudiante1@branchmatch.test", estado: "aprobada", intento: 1, archivo: { nombre: "dfs_tomas.pdf", tipo: "PDF", tamano: 2400 }, respuesta: "", comentario: "Muy bien implementado, ¡buen trabajo!", fecha: fechaHoraRelativaEntrega(-8, "18:40"), fechaRevision: fechaHoraRelativaEntrega(-7, "10:00") },
  { id: 2, idReto: 2, correoEstudiante: "estudiante1@branchmatch.test", estado: "por-revisar", intento: 1, archivo: { nombre: "componentes_tomas.png", tipo: "PNG", tamano: 3100 }, respuesta: "", comentario: "", fecha: fechaHoraRelativaEntrega(-3, "21:40"), fechaRevision: "" },
];

const obtenerEntregas = () => leerDatos(CLAVE_ENTREGAS, entregasIniciales);

const obtenerEntrega = (id) => obtenerEntregas().find((e) => e.id === id) || null;

// Todas las entregas enviadas de un reto (no cuenta los borradores)
const obtenerEntregasDeReto = (idReto) => obtenerEntregas().filter((e) => e.idReto === idReto && e.estado !== "borrador");

// La entrega más reciente de un estudiante en un reto; con "conBorrador" también cuenta el borrador guardado
const obtenerEntregaDe = (idReto, correo, conBorrador = false) => {
  const entregas = obtenerEntregas()
    .filter((e) => e.idReto === idReto && e.correoEstudiante === correo && (conBorrador || e.estado !== "borrador"))
    .sort((a, b) => b.intento - a.intento || b.id - a.id);
  return entregas[0] || null;
};

// Cuántos intentos de envío lleva un estudiante en un reto
const contarIntentosEntrega = (idReto, correo) =>
  obtenerEntregas().filter((e) => e.idReto === idReto && e.correoEstudiante === correo && e.estado !== "borrador").length;

const crearEntrega = (entrega) => {
  const entregas = obtenerEntregas();
  const ids = entregas.map((e) => e.id);
  entrega.id = Math.max(0, ...ids) + 1;
  entregas.push(entrega);
  guardarDatos(CLAVE_ENTREGAS, entregas);
  return entrega;
};

const editarEntrega = (id, cambios) => {
  const entregas = obtenerEntregas();
  const posicion = entregas.findIndex((e) => e.id === id);
  if (posicion === -1) return;
  entregas[posicion] = { ...entregas[posicion], ...cambios, id };
  guardarDatos(CLAVE_ENTREGAS, entregas);
};

const borrarEntrega = (id) => {
  guardarDatos(CLAVE_ENTREGAS, obtenerEntregas().filter((e) => e.id !== id));
};


// ===== Funciones =====
const nombresMesesCortosEntrega = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// "11 oct · 18:40"
const formatearFechaCortaEntrega = (iso) => {
  const fecha = new Date(iso);
  const hora = `${String(fecha.getHours()).padStart(2, "0")}:${String(fecha.getMinutes()).padStart(2, "0")}`;
  return `${fecha.getDate()} ${nombresMesesCortosEntrega[fecha.getMonth()]} · ${hora}`;
};

// "hace 2 h", "hace 3 días"
const formatearHaceCuantoEntrega = (iso) => {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso)) / 60000));
  if (minutos < 60) return "hace un momento";
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.round(horas / 24);
  return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
};

const formatearTamanoEntrega = (bytes) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const obtenerOrdinalIntento = (n) => (n === 1 ? "1.er intento" : `${n}.° intento`);

// El reto que se muestra en entregas: el de la dirección o el más reciente publicado
const obtenerRetoDeEntregas = (sesion) => {
  const retos = obtenerRetosDeLider(sesion.correo).filter((r) => r.estado === "publicado");
  return retos.find((r) => r.id === idRetoEntregas) || retos[0] || null;
};

// ----- Tabla de entregas de un reto (líder) -----
const crearHtmlFilaEntrega = (reto, correo, indice, party) => {
  const entrega = obtenerEntregaDe(reto.id, correo);
  const estado = estadosEntrega[entrega ? entrega.estado : "pendiente"];
  const nombre = obtenerNombrePerfil(correo);
  const esCodigo = reto.tipo === "codigo";
  const enlaceNombre = entrega && esCodigo ? `<a class="ent__nombre" href="revisar-entrega.html?id=${entrega.id}">${escaparHtml(nombre)}</a>` : `<span class="ent__nombre">${escaparHtml(nombre)}</span>`;
  let archivo = "Sin entrega";
  if (entrega) {
    archivo = esCodigo ? `<a class="ent__archivo" href="revisar-entrega.html?id=${entrega.id}">${escaparHtml(entrega.archivo.nombre)}</a>` : `Respuesta ${escaparHtml(entrega.respuesta)}`;
  }
  return `
    <tr class="ent__fila">
      <th scope="row" class="ent__alumno">
        <span class="ent__avatar ent__avatar--${coloresAvatarEntrega[indice % 3]}">${escaparHtml(obtenerIniciales(nombre))}</span>
        <span class="ent__datos">
          ${enlaceNombre}
          <span class="ent__nivel">Nivel ${obtenerNivelJugador(correo)} · ${escaparHtml(party.nombre)}</span>
        </span>
      </th>
      <td class="ent__celda" data-label="Fecha de entrega">${entrega ? formatearFechaCortaEntrega(entrega.fecha) : "—"}</td>
      <td class="ent__celda" data-label="Archivo subido">${archivo}</td>
      <td class="ent__celda ent__celda--estado"><span class="ent__estado ${estado.clase}">${estado.texto}</span></td>
    </tr>`;
};

const mostrarEntregasDeReto = (sesion) => {
  const reto = obtenerRetoDeEntregas(sesion);
  const party = obtenerPartyDe(sesion.correo);
  if (!reto || !party) {
    document.querySelector(".ent__intro .titulo-1").textContent = "Aún no hay retos publicados";
    document.querySelector(".ent__subtitulo").textContent = "Cuando publiques un reto, aquí verás las entregas de tu party.";
    tablaEntregas.innerHTML = "";
    return;
  }
  const estudiantes = obtenerEstudiantesDeLider(sesion.correo);
  document.title = `Entregas · ${reto.titulo} · BranchMatch`;
  document.querySelector(".ent__intro .titulo-1").textContent = obtenerNombreReto(reto);
  document.querySelector(".ent__subtitulo").textContent = `Tema: ${reto.tema} · Entrega: ${formatearFechaReto(reto.fecha)}`;
  document.querySelector(".ent__tabla caption").textContent = `Entregas del reto «${reto.titulo}»`;
  tablaEntregas.innerHTML = estudiantes.length
    ? estudiantes.map((correo, i) => crearHtmlFilaEntrega(reto, correo, i, party)).join("")
    : '<tr class="ent__fila"><td class="ent__celda" colspan="4">Aún no hay integrantes en tu party.</td></tr>';
};

// ----- Revisar una entrega (líder) -----
const mostrarEntregaParaRevisar = (sesion, entrega, reto) => {
  const nombre = obtenerNombrePerfil(entrega.correoEstudiante);
  const primerNombre = nombre.split(" ")[0];
  const revisada = entrega.estado !== "por-revisar";
  const enviadas = obtenerEntregasDeReto(reto.id).filter((e) => reto.tipo === "codigo").sort((a, b) => a.fecha.localeCompare(b.fecha));
  const posicion = enviadas.findIndex((e) => e.id === entrega.id);

  // Solo se muestra una entrega: la segunda copia del diseño sobra
  bloqueRevision.querySelector(".re__entrega--segunda").remove();
  document.title = `Entrega de ${primerNombre} · BranchMatch`;

  const migas = bloqueRevision.querySelectorAll(".re__migas-lista li");
  migas[1].firstElementChild.textContent = reto.titulo;
  migas[1].firstElementChild.href = `entregas.html?idReto=${reto.id}`;
  migas[2].textContent = `Entrega de ${primerNombre}`;

  const pager = bloqueRevision.querySelector(".re__pager");
  const anterior = enviadas[posicion - 1];
  const siguiente = enviadas[posicion + 1];
  const enlaceAnterior = pager.querySelectorAll("a")[0];
  const enlaceSiguiente = pager.querySelectorAll("a")[1];
  [[enlaceAnterior, anterior], [enlaceSiguiente, siguiente]].forEach(([enlace, destino]) => {
    enlace.href = destino ? `revisar-entrega.html?id=${destino.id}` : "#";
    enlace.classList.toggle("re__pager-link--activo", Boolean(destino));
    enlace.classList.toggle("re__pager-link--apagado", !destino);
    if (destino) enlace.removeAttribute("aria-disabled");
    else enlace.setAttribute("aria-disabled", "true");
  });
  pager.querySelector(".re__pager-cuenta").textContent = `${posicion + 1} de ${enviadas.length}`;

  bloqueRevision.querySelector(".re__avatar").textContent = obtenerIniciales(nombre);
  bloqueRevision.querySelector(".re__alumno-datos h1").textContent = nombre;
  bloqueRevision.querySelector(".re__alumno-sub").textContent = `Entregó ${formatearHaceCuantoEntrega(entrega.fecha)} · ${obtenerOrdinalIntento(entrega.intento)}`;
  const estado = bloqueRevision.querySelector(".re__estado");
  estado.textContent = estadosEntrega[entrega.estado].texto;
  estado.className = `re__estado${entrega.estado === "aprobada" ? " re__estado--aceptado" : entrega.estado === "correccion" ? " re__estado--correccion" : ""}`;

  // No se guarda el contenido del archivo, solo sus datos
  const captura = bloqueRevision.querySelector(".re__captura");
  captura.setAttribute("aria-label", `Archivo subido por ${nombre}`);
  captura.innerHTML = `<p class="re__alumno-sub">${escaparHtml(entrega.archivo.nombre)} · ${escaparHtml(entrega.archivo.tipo)} · ${formatearTamanoEntrega(entrega.archivo.tamano)}</p>`;

  // El reto no tiene casos de prueba guardados: se quita esa caja
  bloqueRevision.querySelector(".re__caja").remove();

  const etiqueta = bloqueRevision.querySelector(".re__comentario .re__caja-titulo");
  etiqueta.textContent = `Comentario para ${primerNombre}`;
  const comentario = bloqueRevision.querySelector(".re__textarea");
  comentario.value = entrega.comentario;
  comentario.readOnly = revisada;

  const acciones = bloqueRevision.querySelector(".re__acciones");
  if (revisada) {
    acciones.innerHTML = `<a class="boton re__boton" href="entregas.html?idReto=${reto.id}">Volver a entregas</a>`;
  } else {
    bloqueRevision.querySelector(".boton:not(.boton--peligro)").textContent = `Aprobar +${reto.xp} XP`;
  }
};

const revisarEntrega = (sesion, entrega, reto, decision) => {
  const comentario = bloqueRevision.querySelector(".re__textarea");
  const texto = comentario.value.trim();
  limpiarErroresRevision();
  if (!validarRevision(comentario, decision)) return;

  const nombreLider = sesion.nombre.split(" ")[0];
  if (decision === "aprobar") {
    editarEntrega(entrega.id, { estado: "aprobada", comentario: texto || "¡Buen trabajo!", fechaRevision: new Date().toISOString() });
    sumarXp(entrega.correoEstudiante, reto.xp);
    crearNotificacion(entrega.correoEstudiante, `${nombreLider} aprobó tu entrega y ganaste +${reto.xp} XP.`, {
      tipo: "reto",
      titulo: "¡Tu entrega fue aprobada!",
      datos: [{ nombre: "Reto", valor: reto.titulo }, { nombre: "XP", valor: `+${reto.xp}` }],
      enlace: `estudiante/reto-codigo.html?id=${reto.id}`,
      textoEnlace: "Ver mi entrega",
    });
  } else {
    editarEntrega(entrega.id, { estado: "correccion", comentario: texto, fechaRevision: new Date().toISOString() });
    crearNotificacion(entrega.correoEstudiante, `${nombreLider} te pidió una corrección en «${reto.titulo}». Lee su comentario y vuelve a enviar.`, {
      tipo: "correccion",
      titulo: "Te pidieron una corrección",
      datos: [{ nombre: "Reto", valor: reto.titulo }],
      enlace: `estudiante/reto-codigo.html?id=${reto.id}&reenviar=1`,
      textoEnlace: "Corregir mi entrega",
    });
  }
  location.href = `entregas.html?idReto=${reto.id}`;
};


// ===== Validaciones =====
const limpiarErroresRevision = () => {
  bloqueRevision.querySelectorAll(".campo--error").forEach((c) => c.classList.remove("campo--error"));
};

// Para pedir una corrección el comentario es obligatorio (mínimo 10 caracteres); para aprobar es opcional
const validarRevision = (comentario, decision) => {
  if (decision === "corregir" && comentario.value.trim().length < 10) {
    comentario.closest(".campo").classList.add("campo--error");
    comentario.focus();
    return false;
  }
  return true;
};


// ===== Registro de eventos =====
document.addEventListener("DOMContentLoaded", () => {
  const sesion = obtenerSesion();
  if (!sesion) return;

  if (tablaEntregas) mostrarEntregasDeReto(sesion);

  if (bloqueRevision) {
    const entrega = obtenerEntrega(idEntregaDireccion);
    const reto = entrega ? obtenerReto(entrega.idReto) : null;
    if (!entrega || !reto || reto.correoLider !== sesion.correo || entrega.estado === "borrador") {
      location.replace("retos.html");
      return;
    }
    mostrarEntregaParaRevisar(sesion, entrega, reto);
    if (entrega.estado === "por-revisar") {
      bloqueRevision.querySelector(".re__comentario").addEventListener("submit", (e) => e.preventDefault());
      bloqueRevision.querySelector(".boton--peligro").addEventListener("click", (e) => {
        e.preventDefault();
        revisarEntrega(sesion, entrega, reto, "corregir");
      });
      bloqueRevision.querySelector(".re__acciones .boton:not(.boton--peligro)").addEventListener("click", (e) => {
        e.preventDefault();
        revisarEntrega(sesion, entrega, reto, "aprobar");
      });
    }
  }
});
