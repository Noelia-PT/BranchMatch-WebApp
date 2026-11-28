// Parties y solicitudes: datos, crear y editar party, unirse, revisar solicitudes, mi party y party completa.
// Páginas: lider/crea-party, editar-party, solicitudes, integrantes; estudiante/unete-party, mi-party, party-completa; perfil (datos de la party).
// Responsable: P2 (Perfiles y party).

// ===== Elementos =====
const formCreaParty = document.querySelector("form.crea__tarjeta");
const formEditaParty = document.querySelector("form.edit__tarjeta");
const zonaUnete = document.querySelector(".unete__grupos");
const zonaSolicitudes = document.querySelector(".sol__der");
const principalMiParty = document.querySelector("main.mi-party");
const principalPartyCompleta = document.querySelector("main.party-completa");
const principalIntegrantes = document.querySelector("main.integ");


// ===== Datos =====
const CLAVE_PARTIES = "bm_lista_parties";
const CLAVE_SOLICITUDES = "bm_solicitudes";

const diasSemanaParty = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const rangosNivelParty = ["1-3", "3-5", "5-8"];
// Cada nivel de la prueba diagnóstica corresponde a un rango de nivel de party
const rangoPorNivelPrueba = { Principiante: "1-3", Intermedio: "3-5", Avanzado: "5-8" };
const coloresAvatarParty = ["amarillo", "celeste", "menta", "rosa", "lila"];

// "integrantes" incluye al líder; "cupo" es el máximo de integrantes (entre 2 y 5)
const partiesIniciales = [
  { id: 1, correoLider: "lider1@branchmatch.test", nombre: "Los Insanos", descripcion: "Rumbo a la ICPC regional", nivel: "3-5", cupo: 5, integrantes: ["lider1@branchmatch.test", "estudiante1@branchmatch.test"], horarios: [{ dia: "Lunes", desde: "15:00", hasta: "17:00" }, { dia: "Jueves", desde: "17:00", hasta: "19:00" }] },
  { id: 2, correoLider: "lider2@branchmatch.test", nombre: "Los Chacales", descripcion: "Grafos y programación dinámica cada semana", nivel: "3-5", cupo: 5, integrantes: ["lider2@branchmatch.test"], horarios: [{ dia: "Miércoles", desde: "18:00", hasta: "20:00" }] },
  { id: 3, correoLider: "lider3@branchmatch.test", nombre: "Code Ninjas", descripcion: "Para empezar sin miedo", nivel: "1-3", cupo: 5, integrantes: ["lider3@branchmatch.test"], horarios: [{ dia: "Martes", desde: "16:00", hasta: "18:00" }, { dia: "Viernes", desde: "15:00", hasta: "17:00" }] },
  { id: 4, correoLider: "lider4@branchmatch.test", nombre: "Merge Masters", descripcion: "Matemática y estructuras de datos", nivel: "1-3", cupo: 4, integrantes: ["lider4@branchmatch.test"], horarios: [{ dia: "Sábado", desde: "10:00", hasta: "12:00" }] },
  { id: 5, correoLider: "lider5@branchmatch.test", nombre: "Los Algoritmos", descripcion: "Entrenamiento avanzado para concursos", nivel: "5-8", cupo: 5, integrantes: ["lider5@branchmatch.test"], horarios: [{ dia: "Miércoles", desde: "18:00", hasta: "20:00" }, { dia: "Sábado", desde: "10:00", hasta: "12:00" }] },
];

// estado: "pendiente", "aceptada", "rechazada" o "expirada"
const solicitudesIniciales = [
  { id: 1, idParty: 1, correoEstudiante: "jack@branchmatch.test", estado: "pendiente", fecha: "2026-11-15T09:00:00.000Z" },
  { id: 2, idParty: 1, correoEstudiante: "lucia@branchmatch.test", estado: "pendiente", fecha: "2026-11-15T10:00:00.000Z" },
  { id: 3, idParty: 1, correoEstudiante: "mateo@branchmatch.test", estado: "pendiente", fecha: "2026-11-15T11:00:00.000Z" },
  { id: 4, idParty: 3, correoEstudiante: "estudiante2@branchmatch.test", estado: "pendiente", fecha: "2026-11-14T10:00:00.000Z" },
  { id: 5, idParty: 1, correoEstudiante: "estudiante1@branchmatch.test", estado: "aceptada", fecha: "2026-11-01T10:00:00.000Z" },
];

const obtenerParties = () => leerDatos(CLAVE_PARTIES, partiesIniciales);

const obtenerParty = (id) => obtenerParties().find((p) => p.id === id) || null;

// La party donde está la persona, sea líder o integrante (null si no está en ninguna)
const obtenerPartyDe = (correo) => obtenerParties().find((p) => p.integrantes.includes(correo)) || null;

const crearParty = (party) => {
  const parties = obtenerParties();
  const ids = parties.map((p) => p.id);
  party.id = Math.max(0, ...ids) + 1;
  parties.push(party);
  guardarDatos(CLAVE_PARTIES, parties);
  return party;
};

const editarParty = (id, cambios) => {
  const parties = obtenerParties();
  const posicion = parties.findIndex((p) => p.id === id);
  if (posicion === -1) return;
  parties[posicion] = { ...parties[posicion], ...cambios, id };
  guardarDatos(CLAVE_PARTIES, parties);
};

// Al borrar una party también se borran sus solicitudes
const borrarParty = (id) => {
  guardarDatos(CLAVE_PARTIES, obtenerParties().filter((p) => p.id !== id));
  guardarDatos(CLAVE_SOLICITUDES, obtenerSolicitudes().filter((s) => s.idParty !== id));
};

const obtenerSolicitudes = () => leerDatos(CLAVE_SOLICITUDES, solicitudesIniciales);

const obtenerSolicitudesDeParty = (idParty, estado) =>
  obtenerSolicitudes().filter((s) => s.idParty === idParty && (!estado || s.estado === estado));

const obtenerSolicitud = (idParty, correo) =>
  obtenerSolicitudes().find((s) => s.idParty === idParty && s.correoEstudiante === correo) || null;

const crearSolicitud = (solicitud) => {
  const solicitudes = obtenerSolicitudes();
  const ids = solicitudes.map((s) => s.id);
  solicitud.id = Math.max(0, ...ids) + 1;
  solicitudes.push(solicitud);
  guardarDatos(CLAVE_SOLICITUDES, solicitudes);
  return solicitud;
};

const editarSolicitud = (id, cambios) => {
  const solicitudes = obtenerSolicitudes();
  const posicion = solicitudes.findIndex((s) => s.id === id);
  if (posicion === -1) return;
  solicitudes[posicion] = { ...solicitudes[posicion], ...cambios, id };
  guardarDatos(CLAVE_SOLICITUDES, solicitudes);
};

const borrarSolicitud = (id) => {
  guardarDatos(CLAVE_SOLICITUDES, obtenerSolicitudes().filter((s) => s.id !== id));
};


// ===== Funciones =====
const formatearRangoNivel = (nivel) => String(nivel).replace("-", "–");

const formatearHorario = (horario) => `${horario.dia}: ${horario.desde} - ${horario.hasta}`;

const partyEstaLlena = (party) => party.integrantes.length >= party.cupo;

const obtenerPrimerNombre = (correo) => obtenerNombrePerfil(correo).split(" ")[0];

// Suma a la persona como integrante si hay cupo; devuelve false si la party ya está llena
const unirseAParty = (idParty, correo) => {
  const party = obtenerParty(idParty);
  if (!party || partyEstaLlena(party) || party.integrantes.includes(correo)) return false;
  editarParty(idParty, { integrantes: [...party.integrantes, correo] });
  return true;
};

const salirDeParty = (idParty, correo) => {
  const party = obtenerParty(idParty);
  if (!party) return;
  editarParty(idParty, { integrantes: party.integrantes.filter((c) => c !== correo) });
};

// Las solicitudes pendientes que ya no tienen sentido pasan a "expirada" y avisan al estudiante
const expirarSolicitudes = (solicitudes, party) => {
  solicitudes.forEach((solicitud) => {
    editarSolicitud(solicitud.id, { estado: "expirada" });
    crearNotificacion(solicitud.correoEstudiante, "La party ya no tiene lugares libres, así que esta solicitud se cerró automáticamente.", {
      tipo: "expirada",
      titulo: "Tu solicitud expiró",
      datos: [{ nombre: "Grupo", valor: party.nombre }, { nombre: "Líder", valor: obtenerNombrePerfil(party.correoLider) }],
    });
  });
};

// Muestra una lista de horarios (con botón para quitar cada uno si "conQuitar")
const pintarListaHorarios = (lista, horarios, conQuitar) => {
  lista.innerHTML = horarios
    .map(
      (h, i) => `
      <li class="edit__horario"><span>${escaparHtml(formatearHorario(h))}</span>${conQuitar ? `<a class="edit__quitar" href="#" data-accion="quitar-horario" data-indice="${i}" aria-label="Quitar este horario">✕</a>` : ""}</li>`
    )
    .join("");
};

// ----- Crear y editar party (horarios que se añaden y se quitan) -----
let horariosEnEdicion = [];

const crearHtmlControlesHorario = () => `
  <div class="campo party-horario">
    <label class="campo__label" for="horario-dia">Día</label>
    <select class="campo__input" id="horario-dia">${diasSemanaParty.map((d) => `<option value="${d}">${d}</option>`).join("")}</select>
    <label class="campo__label" for="horario-desde">Desde</label>
    <input class="campo__input" id="horario-desde" type="time" value="15:00">
    <label class="campo__label" for="horario-hasta">Hasta</label>
    <input class="campo__input" id="horario-hasta" type="time" value="17:00">
    <p class="campo__error"></p>
    <a class="boton boton--secundario" href="#" data-accion="anadir-horario">Añadir horario</a>
  </div>`;

const refrescarHorariosEnEdicion = () => {
  pintarListaHorarios(document.querySelector("#lista-horarios-party"), horariosEnEdicion, true);
};

const anadirHorario = () => {
  const dia = document.querySelector("#horario-dia");
  const desde = document.querySelector("#horario-desde");
  const hasta = document.querySelector("#horario-hasta");
  const contenedor = dia.closest(".campo");
  contenedor.classList.remove("campo--error");

  const horario = { dia: dia.value, desde: desde.value, hasta: hasta.value };
  const repetido = horariosEnEdicion.some((h) => h.dia === horario.dia && h.desde === horario.desde && h.hasta === horario.hasta);
  const mensaje = !horario.desde || !horario.hasta ? "Elige la hora de inicio y de fin." : horario.desde >= horario.hasta ? "La hora de fin debe ser después de la de inicio." : repetido ? "Ese horario ya está en la lista." : "";
  if (mensaje) {
    contenedor.querySelector(".campo__error").textContent = mensaje;
    contenedor.classList.add("campo--error");
    return;
  }
  horariosEnEdicion.push(horario);
  refrescarHorariosEnEdicion();
  document.querySelector("#error-horarios")?.classList.remove("campo--error");
};

const quitarHorario = (indice) => {
  horariosEnEdicion.splice(indice, 1);
  refrescarHorariosEnEdicion();
};

// Conecta los clics de añadir y quitar horarios dentro de un formulario
const conectarHorarios = (formulario) => {
  formulario.addEventListener("click", (e) => {
    const accion = e.target.closest("a[data-accion]");
    if (!accion) return;
    if (accion.dataset.accion === "anadir-horario") {
      e.preventDefault();
      anadirHorario();
    } else if (accion.dataset.accion === "quitar-horario") {
      e.preventDefault();
      quitarHorario(Number(accion.dataset.indice));
    }
  });
};

const llenarSelectNivel = (select, valorActual) => {
  select.innerHTML = rangosNivelParty
    .map((r) => `<option value="${r}"${r === valorActual ? " selected" : ""}>Nivel ${formatearRangoNivel(r)}</option>`)
    .join("");
};

const iniciarFormularioCreaParty = (sesion) => {
  if (obtenerPartyDe(sesion.correo)) {
    location.replace("editar-party.html");
    return;
  }
  document.querySelector(".crea__nombre").textContent = sesion.nombre.split(" ")[0];
  formCreaParty.noValidate = true;

  // El enlace "Crear horario de práctica" abre el editor de horarios debajo de él
  const enlaceHorario = formCreaParty.querySelector(".crea__horario");
  enlaceHorario.insertAdjacentHTML(
    "afterend",
    `<div id="zona-horarios" hidden><ul class="edit__horarios-lista" id="lista-horarios-party"></ul>${crearHtmlControlesHorario()}<div class="campo" id="error-horarios"><p class="campo__error">Añade al menos un horario de práctica.</p></div></div>`
  );
  const zonaHorarios = formCreaParty.querySelector("#zona-horarios");
  enlaceHorario.addEventListener("click", (e) => {
    e.preventDefault();
    zonaHorarios.hidden = !zonaHorarios.hidden;
  });
  conectarHorarios(formCreaParty);

  const botonCrear = formCreaParty.querySelector(".crea__boton");
  botonCrear.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarErroresParty(formCreaParty);
    if (!validarFormularioCreaParty(zonaHorarios)) return;
    crearParty({
      correoLider: sesion.correo,
      nombre: formCreaParty.querySelector("#nombre").value.trim(),
      descripcion: formCreaParty.querySelector("#descripcion").value.trim(),
      nivel: formCreaParty.querySelector("#nivel").value,
      cupo: Number(formCreaParty.querySelector("#integrantes").value),
      integrantes: [sesion.correo],
      horarios: horariosEnEdicion,
    });
    location.href = botonCrear.href;
  });
};

const iniciarFormularioEditaParty = (sesion) => {
  const party = obtenerPartyDe(sesion.correo);
  if (!party || party.correoLider !== sesion.correo) {
    location.replace("crea-party.html");
    return;
  }
  document.querySelector(".edit__nombre").textContent = sesion.nombre.split(" ")[0];
  document.querySelector(".edit__lider-nombre").textContent = `Líder: ${sesion.nombre}`;
  formEditaParty.noValidate = true;
  formEditaParty.querySelector("#nombre").value = party.nombre;
  formEditaParty.querySelector("#descripcion").value = party.descripcion;
  llenarSelectNivel(formEditaParty.querySelector("#nivel"), party.nivel);

  // "Miembros" cambia el cupo: no puede ser menor que los integrantes que ya hay (ni que 2)
  const selectCupo = formEditaParty.querySelector("#miembros");
  const minimo = Math.max(2, party.integrantes.length);
  selectCupo.innerHTML = [2, 3, 4, 5]
    .filter((n) => n >= minimo)
    .map((n) => `<option value="${n}"${n === party.cupo ? " selected" : ""}>Miembros: ${party.integrantes.length} / ${n}</option>`)
    .join("");

  horariosEnEdicion = party.horarios.map((h) => ({ ...h }));
  const lista = formEditaParty.querySelector(".edit__horarios-lista");
  lista.id = "lista-horarios-party";
  lista.insertAdjacentHTML("afterend", `${crearHtmlControlesHorario()}<div class="campo" id="error-horarios"><p class="campo__error">Deja al menos un horario de práctica.</p></div>`);
  refrescarHorariosEnEdicion();
  conectarHorarios(formEditaParty);

  const botonGuardar = formEditaParty.querySelector(".edit__boton");
  botonGuardar.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarErroresParty(formEditaParty);
    if (!validarFormularioEditaParty()) return;
    editarParty(party.id, {
      nombre: formEditaParty.querySelector("#nombre").value.trim(),
      descripcion: formEditaParty.querySelector("#descripcion").value.trim(),
      nivel: formEditaParty.querySelector("#nivel").value,
      cupo: Number(selectCupo.value),
      horarios: horariosEnEdicion,
    });
    location.href = botonGuardar.href;
  });

  const papelera = formEditaParty.querySelector(".edit__papelera");
  papelera.addEventListener("click", (e) => {
    e.preventDefault();
    if (!confirm("¿Eliminar este grupo? Se perderán sus solicitudes y no se puede deshacer.")) return;
    party.integrantes
      .filter((correo) => correo !== sesion.correo)
      .forEach((correo) => crearNotificacion(correo, `El líder eliminó la party ${party.nombre}.`, { tipo: "aviso", titulo: "Tu party fue eliminada", enlace: "estudiante/unete-party.html", textoEnlace: "Buscar otra party" }));
    borrarParty(party.id);
    location.href = papelera.href;
  });
};

// ----- Unirse a una party (estudiante) -----
let partiesParaUnirse = [];
let posicionParty = 0;
let escenaUnete = "radar";

const cargarPartiesParaUnirse = (correo) => {
  const nivelPrueba = typeof obtenerNivel === "function" ? obtenerNivel(correo) : null;
  const rango = nivelPrueba ? rangoPorNivelPrueba[nivelPrueba] : null;
  partiesParaUnirse = obtenerParties().filter((party) => {
    const solicitud = obtenerSolicitud(party.id, correo);
    if (solicitud && solicitud.estado !== "pendiente") return false;
    if (solicitud) return true;
    return (!rango || party.nivel === rango) && !partyEstaLlena(party);
  });
};

const crearHtmlEscenaUnete = (escena) => {
  if (escena === "enviada") {
    return `<section class="unete__escena unete__escena--enviada" aria-label="Solicitud enviada">
      <img class="unete__popa" src="../../assets/img/popa-solicitud-enviada.gif" alt="Popa con corazones en los ojos y los brazos abiertos">
      <p class="unete__mensaje" role="status">Enviaste una solicitud!</p>
    </section>`;
  }
  if (escena === "final") {
    return `<section class="unete__escena unete__escena--final" aria-label="Sigue buscando">
      <img class="unete__popa" src="../../assets/img/popa-sigue-buscando.gif" alt="Popa con los ojos cerrados, buscando otra party">
      <p class="unete__mensaje" role="status">Sigue buscando</p>
    </section>`;
  }
  return `<section class="unete__escena unete__escena--radar" aria-label="Buscando party">
    <img class="unete__popa" src="../../assets/img/popa-radar.gif" alt="Popa buscando una party con su radar">
    <p class="unete__teclado texto-secundario">
      <a class="unete__tecla" href="#" data-accion="descartar" aria-label="Descartar party">←</a>
      <a class="unete__tecla" href="#" data-accion="enviar" aria-label="Enviar solicitud">→</a>
      también con el teclado
    </p>
  </section>`;
};

const crearHtmlTarjetaParty = (party, posicion, total, pendiente) => {
  const lleno = party.integrantes.length;
  const cupos = Array.from({ length: party.cupo }, (_, i) => `<span class="unete__cupo${i < lleno ? " unete__cupo--lleno" : ""}"></span>`).join("");
  return `<article class="tarjeta unete__party">
    <header class="unete__encabezado">
      <h2 class="unete__nombre">${escaparHtml(party.nombre)}</h2>
      <p class="chip chip--rosa unete__etiqueta">Party ${posicion + 1} de ${total}</p>
    </header>
    <ul class="unete__datos">
      <li class="unete__dato"><img class="unete__icono" src="../../assets/icons/party-lider.svg" alt="">Líder: ${escaparHtml(obtenerNombrePerfil(party.correoLider))}</li>
      <li class="unete__dato"><img class="unete__icono" src="../../assets/icons/party-nivel.svg" alt="">Nivel ${formatearRangoNivel(party.nivel)}</li>
      <li class="unete__dato">
        <img class="unete__icono" src="../../assets/icons/party-miembros.svg" alt="">Miembros: ${lleno} / ${party.cupo}
        <span class="unete__cupos" role="img" aria-label="${lleno} de ${party.cupo} lugares ocupados">${cupos}</span>
      </li>
    </ul>
    <section class="unete__horarios" aria-labelledby="horarios-titulo">
      <h3 class="unete__dato unete__horarios-titulo" id="horarios-titulo"><img class="unete__icono" src="../../assets/icons/party-horarios.svg" alt="">Horarios:</h3>
      ${party.horarios.map((h) => `<p class="unete__horario texto-secundario">${escaparHtml(formatearHorario(h))}</p>`).join("") || '<p class="unete__horario texto-secundario">Sin horarios todavía</p>'}
    </section>
    <div class="unete__acciones">
      <a class="unete__accion" href="#" data-accion="descartar" aria-label="Descartar esta party y seguir buscando"><img class="unete__accion-icono" src="../../assets/icons/party-x.svg" alt=""></a>
      <a class="unete__accion" href="#" data-accion="enviar" ${pendiente ? 'aria-disabled="true" ' : ""}aria-label="${pendiente ? "Ya enviaste una solicitud a esta party" : "Enviar solicitud a esta party"}"><img class="unete__accion-icono" src="../../assets/icons/party-check.svg" alt=""></a>
    </div>
  </article>`;
};

// Tarjeta con un mensaje cuando no hay una party para mostrar (ya estás en una, o no quedan más)
const crearHtmlTarjetaMensaje = (titulo, texto, enlace, textoEnlace, accion) => `
  <article class="tarjeta unete__party">
    <h2 class="unete__nombre">${escaparHtml(titulo)}</h2>
    <p class="texto-secundario">${escaparHtml(texto)}</p>
    <a class="boton" href="${enlace}"${accion ? ` data-accion="${accion}"` : ""}>${escaparHtml(textoEnlace)}</a>
  </article>`;

// Un grupo con la escena de Popa y, debajo o al lado según el ancho, la tarjeta del mensaje
const crearHtmlGrupoMensaje = (...datos) => `
  <div class="unete__grupo unete__grupo--final">
    <div class="unete__escenas">${crearHtmlEscenaUnete("final")}</div>
    ${crearHtmlTarjetaMensaje(...datos)}
  </div>`;

const mostrarUnete = (sesion) => {
  const partyActual = obtenerPartyDe(sesion.correo);
  if (partyActual) {
    zonaUnete.innerHTML = crearHtmlGrupoMensaje(
      "Ya estás en una party",
      `Eres parte de ${partyActual.nombre}. Para buscar otra, primero deja tu party actual.`,
      "mi-party.html",
      "Ir a mi party"
    );
    return;
  }
  cargarPartiesParaUnirse(sesion.correo);

  if (posicionParty >= partiesParaUnirse.length) {
    zonaUnete.innerHTML = crearHtmlGrupoMensaje(
      "No hay más parties por ahora",
      "Ya viste todas las parties de tu nivel con lugares libres. Vuelve más tarde o empieza de nuevo.",
      "#",
      "Volver a empezar",
      "reiniciar"
    );
    return;
  }

  const party = partiesParaUnirse[posicionParty];
  const pendiente = Boolean(obtenerSolicitud(party.id, sesion.correo));
  const escena = pendiente ? "enviada" : escenaUnete;
  zonaUnete.innerHTML = `<div class="unete__grupo unete__grupo--${escena}">
    <div class="unete__escenas">${crearHtmlEscenaUnete(escena)}</div>
    ${crearHtmlTarjetaParty(party, posicionParty, partiesParaUnirse.length, pendiente)}
  </div>`;
};

const enviarSolicitudParty = (sesion) => {
  const party = partiesParaUnirse[posicionParty];
  if (!party || obtenerSolicitud(party.id, sesion.correo)) return;
  crearSolicitud({ idParty: party.id, correoEstudiante: sesion.correo, estado: "pendiente", fecha: new Date().toISOString() });
  crearNotificacion(party.correoLider, `${sesion.nombre} quiere unirse a ${party.nombre}.`, {
    tipo: "nueva",
    titulo: "Un estudiante quiere unirse",
    datos: [{ nombre: "Estudiante", valor: sesion.nombre }, { nombre: "Party", valor: party.nombre }],
    enlace: "lider/solicitudes.html",
    textoEnlace: "Ver solicitudes",
  });
  mostrarUnete(sesion);
};

const descartarParty = (sesion) => {
  posicionParty += 1;
  escenaUnete = "final";
  mostrarUnete(sesion);
};

const accionarUnete = (e, sesion) => {
  const accion = e.target.closest("[data-accion]");
  if (!accion) return;
  e.preventDefault();
  if (accion.dataset.accion === "descartar") descartarParty(sesion);
  if (accion.dataset.accion === "enviar") enviarSolicitudParty(sesion);
  if (accion.dataset.accion === "reiniciar") {
    posicionParty = 0;
    escenaUnete = "radar";
    mostrarUnete(sesion);
  }
};

// ----- Solicitudes (líder) -----
const crearHtmlVacioSolicitudes = (titulo, texto, enlace, textoEnlace) => `
  <div class="sol__item" id="sin-solicitudes">
    <section class="sol__vacio" aria-labelledby="vacio-titulo">
      <h2 class="sol__vacio-titulo" id="vacio-titulo">${escaparHtml(titulo)}</h2>
      <p class="sol__vacio-texto">${escaparHtml(texto)}</p>
      <a class="boton boton--secundario sol__vacio-boton" href="${enlace}">${escaparHtml(textoEnlace)}</a>
    </section>
  </div>`;

const crearHtmlSolicitud = (solicitud) => {
  const correo = solicitud.correoEstudiante;
  const perfil = obtenerPerfil(correo);
  const nombre = obtenerNombrePerfil(correo);
  const intereses = [...new Set([...perfil.temas, ...perfil.lenguajes, ...perfil.intereses])].slice(0, 6);
  const enlacePerfil = `player-card.html?correo=${encodeURIComponent(correo)}`;
  const foto = perfil.foto
    ? `<img class="sol__foto-img" src="../../${escaparHtml(perfil.foto)}" alt="Foto de perfil de ${escaparHtml(nombre)}">`
    : `<img class="sol__foto-img sol__foto-img--avatar" src="../../assets/icons/foto-perfil.svg" alt="Foto de perfil de ${escaparHtml(nombre)}">`;
  return `
  <div class="sol__item" data-id="${solicitud.id}">
    <article class="sol__tarjeta" aria-label="Solicitud de ${escaparHtml(nombre)}">
      <div class="sol__foto">
        ${foto}
        <a class="sol__ver" href="${enlacePerfil}" aria-label="Ver la Player Card de ${escaparHtml(nombre)}"><img class="sol__ver-icono" src="../../assets/icons/solicitud-ojo.svg" alt=""></a>
        <div class="sol__nombre-barra">
          <h2 class="sol__nombre"><a href="${enlacePerfil}">${escaparHtml(nombre)}</a></h2>
          <span class="chip chip--amarillo sol__nivel">LV ${obtenerNivelJugador(correo)}</span>
        </div>
      </div>
      <div class="sol__intereses">
        <h3 class="sol__intereses-titulo">Intereses</h3>
        <ul class="sol__intereses-lista">${intereses.map((i) => `<li class="sol__interes">${escaparHtml(i)}</li>`).join("") || '<li class="sol__interes">Sin intereses</li>'}</ul>
      </div>
    </article>
    <div class="sol__acciones">
      <a class="sol__accion" href="#" data-accion="rechazar" aria-label="Rechazar la solicitud de ${escaparHtml(nombre)}"><img class="sol__accion-icono" src="../../assets/icons/party-x.svg" alt=""></a>
      <a class="sol__accion" href="#" data-accion="aceptar" aria-label="Aceptar la solicitud de ${escaparHtml(nombre)}"><img class="sol__accion-icono" src="../../assets/icons/party-check.svg" alt=""></a>
    </div>
    <p class="sol__teclado texto-secundario">
      <a class="sol__tecla" href="#" data-accion="rechazar" aria-label="Rechazar">←</a>
      <a class="sol__tecla" href="#" data-accion="aceptar" aria-label="Aceptar">→</a>
      también con el teclado
    </p>
  </div>`;
};

const mostrarCupoSolicitudes = (party) => {
  const lleno = party.integrantes.length;
  const libres = party.cupo - lleno;
  const casillas = Array.from({ length: party.cupo }, (_, i) => `<span class="sol__cupo-casilla${i < lleno ? " sol__cupo-casilla--llena" : ""}"></span>`).join("");
  const contenedor = document.querySelector(".sol__cupos");
  contenedor.innerHTML = casillas;
  contenedor.setAttribute("aria-label", `${lleno} de ${party.cupo} lugares ocupados`);
  document.querySelector(".sol__libres").textContent = libres === 1 ? "1 libre" : `${libres} libres`;
};

const mostrarSolicitudes = (sesion) => {
  const party = obtenerPartyDe(sesion.correo);
  if (!party || party.correoLider !== sesion.correo) {
    zonaSolicitudes.innerHTML = crearHtmlVacioSolicitudes("Aún no tienes party", "Crea tu party para empezar a recibir solicitudes.", "crea-party.html", "Crear mi party");
    return;
  }
  mostrarCupoSolicitudes(party);
  const pendientes = obtenerSolicitudesDeParty(party.id, "pendiente");
  zonaSolicitudes.innerHTML = pendientes.length
    ? crearHtmlSolicitud(pendientes[0])
    : crearHtmlVacioSolicitudes("No tienes más solicitudes", "Cuando alguien quiera unirse a tu party, aparecerá aquí.", "panel.html", "Volver al panel");
};

const aceptarSolicitud = (solicitud, party) => {
  if (partyEstaLlena(party)) {
    alert("Tu party ya está completa. Rechaza la solicitud o aumenta el cupo desde «Editar party».");
    return;
  }
  unirseAParty(party.id, solicitud.correoEstudiante);
  editarSolicitud(solicitud.id, { estado: "aceptada" });
  const partyNueva = obtenerParty(party.id);
  crearNotificacion(solicitud.correoEstudiante, "Ya puedes entrar al espacio del grupo y conocer a tus compañeros.", {
    tipo: "aceptada",
    titulo: "¡Bienvenido/a al equipo!",
    datos: [{ nombre: "Grupo", valor: party.nombre }, { nombre: "Líder", valor: obtenerNombrePerfil(party.correoLider) }],
    enlace: partyEstaLlena(partyNueva) ? "estudiante/party-completa.html" : "estudiante/mi-party.html",
    textoEnlace: partyEstaLlena(partyNueva) ? "Ir al espacio del grupo" : "Ir a mi party",
  });
  // La persona ya tiene party: sus otras solicitudes pendientes se cierran
  obtenerSolicitudes()
    .filter((s) => s.correoEstudiante === solicitud.correoEstudiante && s.estado === "pendiente")
    .forEach((s) => editarSolicitud(s.id, { estado: "expirada" }));
  if (partyEstaLlena(partyNueva)) expirarSolicitudes(obtenerSolicitudesDeParty(party.id, "pendiente"), partyNueva);
};

const rechazarSolicitud = (solicitud, party) => {
  editarSolicitud(solicitud.id, { estado: "rechazada" });
  crearNotificacion(solicitud.correoEstudiante, "No eres tú: el grupo no tiene cupo por ahora. ¡Hay más grupos esperándote!", {
    tipo: "rechazada",
    titulo: "Esta vez no hubo match",
    datos: [{ nombre: "Grupo", valor: party.nombre }, { nombre: "Líder", valor: obtenerNombrePerfil(party.correoLider) }],
    enlace: "estudiante/unete-party.html",
    textoEnlace: "Explorar grupos",
  });
};

const accionarSolicitud = (e, sesion) => {
  const accion = e.target.closest("[data-accion]");
  const item = e.target.closest(".sol__item");
  if (!accion || !item || !item.dataset.id) return;
  e.preventDefault();
  const solicitud = obtenerSolicitudes().find((s) => s.id === Number(item.dataset.id));
  const party = obtenerPartyDe(sesion.correo);
  if (!solicitud || !party) return;
  if (accion.dataset.accion === "aceptar") aceptarSolicitud(solicitud, party);
  if (accion.dataset.accion === "rechazar") rechazarSolicitud(solicitud, party);
  mostrarSolicitudes(sesion);
};

// ----- Mi party e integrantes (líder) -----
const crearHtmlIntegrante = (correo, party, indice) => {
  const perfil = obtenerPerfil(correo);
  const nombre = obtenerNombrePerfil(correo);
  const esLider = correo === party.correoLider;
  const lenguajes = perfil.lenguajes.slice(0, 3);
  return `
    <li class="tarjeta integ__integrante">
      <span class="integ__avatar integ__avatar--${coloresAvatarParty[indice % coloresAvatarParty.length]}" aria-hidden="true">${escaparHtml(obtenerIniciales(nombre))}</span>
      <div class="integ__datos-integrante">
        <h3 class="integ__nombre">${escaparHtml(nombre)}</h3>
        <ul class="integ__chips">
          <li class="chip chip--amarillo">LV ${obtenerNivelJugador(correo)}</li>
          ${esLider ? '<li class="chip chip--rosa">Líder</li>' : ""}
        </ul>
        <p class="integ__usuario texto-secundario">${escaparHtml([perfil.jugador || "@sin_usuario", perfil.carrera].filter(Boolean).join(" · "))}</p>
        <p class="integ__lenguajes texto-secundario">${lenguajes.length ? escaparHtml(lenguajes.join(" · ")) : "Sin lenguajes"}</p>
      </div>
      <a class="boton boton--secundario integ__boton" href="player-card.html?correo=${encodeURIComponent(correo)}">Ver Player Card</a>
    </li>`;
};

const mostrarIntegrantes = (sesion) => {
  const party = obtenerPartyDe(sesion.correo);
  if (!party || party.correoLider !== sesion.correo) {
    principalIntegrantes.innerHTML = `
      <section class="tarjeta integ__party">
        <h1 class="integ__titulo">Aún no tienes party</h1>
        <p class="integ__descripcion texto-secundario">Crea tu party para ver aquí a tus integrantes.</p>
        <div class="integ__acciones"><a class="boton" href="crea-party.html">Crear mi party</a></div>
      </section>`;
    return;
  }
  const llena = partyEstaLlena(party);
  const libres = party.cupo - party.integrantes.length;
  const estado = document.querySelector(".integ__estado");
  estado.textContent = `${llena ? "Party completa" : "Party en formación"} · ${party.integrantes.length}/${party.cupo}`;
  estado.className = `chip ${llena ? "chip--menta" : "chip--celeste"} integ__estado`;

  document.title = `${party.nombre} · BranchMatch`;
  document.querySelector(".integ__titulo").textContent = party.nombre;
  document.querySelector(".integ__descripcion").textContent = party.descripcion || "Sin descripción.";
  document.querySelector(".integ__datos").innerHTML = `
    <li>Nivel ${formatearRangoNivel(party.nivel)}</li>
    <li>Cupo: ${party.integrantes.length} de ${party.cupo} · ${llena ? "sin lugares libres" : `${libres} ${libres === 1 ? "libre" : "libres"}`}</li>
    <li>Solicitudes pendientes: ${obtenerSolicitudesDeParty(party.id, "pendiente").length}</li>`;
  document.querySelector(".integ__horarios").innerHTML = party.horarios.length
    ? party.horarios.map((h) => `<li>${escaparHtml(formatearHorario(h))}</li>`).join("")
    : "<li>Aún no hay horarios.</li>";
  document.querySelector(".integ__lista").innerHTML = party.integrantes.map((correo, i) => crearHtmlIntegrante(correo, party, i)).join("");
};

// ----- Mi party (estudiante) -----
const letrasDiasParty = ["L", "M", "M", "J", "V", "S", "D"];
const mesesCortosParty = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

// Fecha de la próxima sesión: la más cercana a partir de ahora entre los horarios de la party
const calcularProximaSesion = (horarios) => {
  const ahora = new Date();
  const candidatas = horarios.map((h) => {
    const [hora, minuto] = h.desde.split(":").map(Number);
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), hora, minuto);
    const diaDeseado = diasSemanaParty.indexOf(h.dia);
    const diaHoy = (ahora.getDay() + 6) % 7;
    let falta = (diaDeseado - diaHoy + 7) % 7;
    if (falta === 0 && fecha <= ahora) falta = 7;
    fecha.setDate(fecha.getDate() + falta);
    return { fecha, horario: h };
  });
  return candidatas.sort((a, b) => a.fecha - b.fecha)[0] || null;
};

const crearHtmlSinParty = () => `
  <section class="tarjeta mi-party__cabecera">
    <h1 class="mi-party__nombre">Aún no estás en una party</h1>
    <p class="mi-party__detalle texto-secundario">Explora las parties de tu nivel y envía tu solicitud.</p>
    <a class="boton" href="unete-party.html">Buscar party</a>
  </section>`;

const mostrarMiParty = (sesion, party) => {
  const llena = partyEstaLlena(party);
  const perfil = obtenerPerfil(sesion.correo);
  const estado = document.querySelector(".mi-party__estado");
  estado.textContent = `${llena ? "Party completa" : "Party en formación"} · ${party.integrantes.length}/${party.cupo}`;
  estado.className = `chip ${llena ? "chip--menta" : "chip--celeste"} mi-party__estado`;

  document.querySelector(".mi-party__nombre").textContent = party.nombre;
  document.querySelector(".mi-party__detalle").textContent = [`Líder: ${obtenerNombrePerfil(party.correoLider)}`, `Nivel ${formatearRangoNivel(party.nivel)}`, party.descripcion].filter(Boolean).join(" · ");

  const colores = ["amarillo", "celeste", "menta", "rosa", "claro"];
  document.querySelector(".mi-party__miembros").innerHTML = party.integrantes
    .map((correo, i) => `<li class="mi-party__miembro mi-party__miembro--${colores[i % colores.length]}" title="${escaparHtml(obtenerNombrePerfil(correo))}"><a href="player-card.html?correo=${encodeURIComponent(correo)}" aria-label="Ver la Player Card de ${escaparHtml(obtenerNombrePerfil(correo))}">${escaparHtml(obtenerIniciales(obtenerNombrePerfil(correo)))}</a></li>`)
    .join("");

  document.querySelector(".mi-party__avatar").textContent = obtenerIniciales(sesion.nombre);
  document.querySelector(".mi-party__yo-nombre").textContent = sesion.nombre.split(" ")[0];
  document.querySelector(".mi-party__stat-valor--nivel").textContent = obtenerNivelJugador(sesion.correo);
  document.querySelector(".mi-party__stat-valor--racha").textContent = `🔥 ${perfil.racha}`;

  const proxima = calcularProximaSesion(party.horarios);
  if (proxima) {
    document.querySelector(".mi-party__mes").textContent = mesesCortosParty[proxima.fecha.getMonth()];
    document.querySelector(".mi-party__numero").textContent = proxima.fecha.getDate();
    document.querySelector(".mi-party__horario").textContent = `${proxima.horario.dia} · ${proxima.horario.desde} – ${proxima.horario.hasta}`;
  } else {
    document.querySelector(".mi-party__mes").textContent = "—";
    document.querySelector(".mi-party__numero").textContent = "—";
    document.querySelector(".mi-party__horario").textContent = "Sin sesiones programadas";
  }
  document.querySelector(".mi-party__tema").textContent = `Tema: ${party.descripcion || "Práctica del grupo"}`;
  document.querySelector(".mi-party__dias").innerHTML = letrasDiasParty
    .map((letra, i) => `<li class="mi-party__dia${party.horarios.some((h) => diasSemanaParty.indexOf(h.dia) === i) ? " mi-party__dia--activo" : ""}">${letra}</li>`)
    .join("");
  document.querySelector(".mi-party__sesiones").textContent = party.horarios.length
    ? `Sesiones: ${party.horarios.map((h) => `${h.dia.toLowerCase()} ${h.desde}`).join(" y ")}`
    : "Sesiones: aún no hay horarios";
};

const dejarParty = (sesion, party) => {
  if (!confirm(`¿Dejar la party ${party.nombre}?`)) return;
  salirDeParty(party.id, sesion.correo);
  crearNotificacion(party.correoLider, `${sesion.nombre} dejó tu party.`, {
    tipo: "aviso",
    titulo: "Un integrante dejó la party",
    datos: [{ nombre: "Estudiante", valor: sesion.nombre }, { nombre: "Party", valor: party.nombre }],
    enlace: "lider/solicitudes.html",
    textoEnlace: "Ver solicitudes",
  });
  location.href = "unete-party.html";
};

// ----- Party completa (estudiante) -----
const mostrarPartyCompleta = (sesion, party) => {
  const llena = partyEstaLlena(party);
  const faltan = party.cupo - party.integrantes.length;
  document.title = `${party.nombre} · BranchMatch`;
  document.querySelector(".party-completa__encabezado .chip").textContent = `${llena ? "¡Party completa!" : "Party en formación"} · ${party.integrantes.length}/${party.cupo}`;
  document.querySelector("#party-titulo").textContent = llena ? `¡${party.nombre} está lista!` : `${party.nombre} va tomando forma`;
  document.querySelector(".party-completa__bajada").textContent = llena
    ? `El match terminó: ya son ${party.cupo}. Ahora empieza la aventura de verdad: entrenar juntos.`
    : `Faltan ${faltan} ${faltan === 1 ? "integrante" : "integrantes"} para completar la party. Mientras tanto, ya pueden empezar a entrenar.`;

  const lista = document.querySelector(".party-completa__integrantes");
  lista.setAttribute("aria-label", `Integrantes de ${party.nombre}`);
  lista.innerHTML = party.integrantes
    .map((correo, i) => {
      const nombre = obtenerPrimerNombre(correo);
      const etiquetas = [`<li class="chip chip--amarillo">LV ${obtenerNivelJugador(correo)}</li>`];
      if (correo === party.correoLider) etiquetas.push('<li class="chip chip--rosa">Líder</li>');
      if (correo === sesion.correo) etiquetas.push('<li class="chip chip--celeste">Tú</li>');
      return `<li class="tarjeta integrante-party">
        <span class="integrante-party__avatar integrante-party__avatar--${coloresAvatarParty[i % coloresAvatarParty.length]}" aria-hidden="true">${escaparHtml(obtenerIniciales(obtenerNombrePerfil(correo)))}</span>
        <h2 class="titulo-3"><a href="player-card.html?correo=${encodeURIComponent(correo)}">${escaparHtml(nombre)}</a></h2>
        <ul class="integrante-party__chips">${etiquetas.join("")}</ul>
      </li>`;
    })
    .join("");
};


// ===== Validaciones =====
const mostrarErrorParty = (campo, mensaje) => {
  const contenedor = campo.closest(".campo");
  let textoError = contenedor.querySelector(".campo__error");
  if (!textoError) {
    textoError = document.createElement("p");
    textoError.className = "campo__error";
    contenedor.appendChild(textoError);
  }
  if (mensaje) textoError.textContent = mensaje;
  contenedor.classList.add("campo--error");
  campo.setAttribute("aria-invalid", "true");
};

const limpiarErroresParty = (formulario) => {
  formulario.querySelectorAll(".campo--error").forEach((c) => c.classList.remove("campo--error"));
  formulario.querySelectorAll("[aria-invalid]").forEach((c) => c.removeAttribute("aria-invalid"));
};

// Revisa el nombre (y la descripción); devuelve el primer campo con error
const validarNombreParty = (formulario) => {
  const nombre = formulario.querySelector("#nombre");
  if (nombre.value.trim().length < 3) {
    mostrarErrorParty(nombre, "Escribe un nombre para el grupo (mínimo 3 caracteres).");
    return nombre;
  }
  return null;
};

const validarHorariosParty = () => {
  if (horariosEnEdicion.length > 0) return true;
  document.querySelector("#error-horarios").classList.add("campo--error");
  return false;
};

const validarFormularioCreaParty = (zonaHorarios) => {
  let primerError = validarNombreParty(formCreaParty);
  const integrantes = formCreaParty.querySelector("#integrantes");
  const nivel = formCreaParty.querySelector("#nivel");
  const cantidad = Number(integrantes.value);

  if (!Number.isInteger(cantidad) || cantidad < 2 || cantidad > 5) {
    mostrarErrorParty(integrantes, "Indica entre 2 y 5 integrantes.");
    primerError = primerError || integrantes;
  }
  if (!nivel.value) {
    mostrarErrorParty(nivel, "Elige un rango de nivel.");
    primerError = primerError || nivel;
  }
  if (!validarHorariosParty()) {
    zonaHorarios.hidden = false;
    primerError = primerError || formCreaParty.querySelector("#horario-dia");
  }
  if (primerError) primerError.focus();
  return !primerError;
};

const validarFormularioEditaParty = () => {
  let primerError = validarNombreParty(formEditaParty);
  if (!validarHorariosParty()) primerError = primerError || formEditaParty.querySelector("#horario-dia");
  if (primerError) primerError.focus();
  return !primerError;
};


// ===== Registro de eventos =====
// Se espera a DOMContentLoaded para que perfil.js y prueba.js (que se cargan antes o después) ya estén disponibles
document.addEventListener("DOMContentLoaded", () => {
  const sesion = obtenerSesion();
  if (!sesion) return;

  if (formCreaParty) iniciarFormularioCreaParty(sesion);
  if (formEditaParty) iniciarFormularioEditaParty(sesion);

  if (zonaUnete) {
    mostrarUnete(sesion);
    zonaUnete.addEventListener("click", (e) => accionarUnete(e, sesion));
    document.addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea, select")) return;
      if (e.key === "ArrowLeft") descartarParty(sesion);
      if (e.key === "ArrowRight") enviarSolicitudParty(sesion);
    });
  }

  if (zonaSolicitudes) {
    mostrarSolicitudes(sesion);
    zonaSolicitudes.addEventListener("click", (e) => accionarSolicitud(e, sesion));
    document.addEventListener("keydown", (e) => {
      const item = zonaSolicitudes.querySelector(".sol__item[data-id]");
      if (!item) return;
      if (e.key === "ArrowLeft") item.querySelector('.sol__accion[data-accion="rechazar"]').click();
      if (e.key === "ArrowRight") item.querySelector('.sol__accion[data-accion="aceptar"]').click();
    });
  }

  if (principalIntegrantes) mostrarIntegrantes(sesion);

  if (principalMiParty) {
    const party = obtenerPartyDe(sesion.correo);
    if (!party) {
      principalMiParty.innerHTML = crearHtmlSinParty();
    } else {
      mostrarMiParty(sesion, party);
      document.querySelector(".mi-party__dejar").addEventListener("click", (e) => {
        e.preventDefault();
        dejarParty(sesion, party);
      });
    }
  }

  if (principalPartyCompleta) {
    const party = obtenerPartyDe(sesion.correo);
    if (!party) {
      location.replace("unete-party.html");
    } else {
      mostrarPartyCompleta(sesion, party);
    }
  }
});
