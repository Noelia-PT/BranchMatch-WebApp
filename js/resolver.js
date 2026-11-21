// Resolver retos: el estudiante entrega su archivo (reto de código) o responde (reto de opción múltiple) y ve su resultado.
// Páginas: estudiante/reto-codigo y estudiante/reto-opcion-multiple (necesita retos.js y entregas.js cargados antes).
// Responsable: P4 (Retos y rendimiento).

// ===== Elementos =====
const principalRetoCodigo = document.querySelector("main.rc");
const principalRetoOpcion = document.querySelector("main.rm");

// Con ?id=3 se abre el reto 3; con &reenviar=1 se vuelve a mostrar el formulario aunque ya haya entrega
const parametrosResolver = new URLSearchParams(location.search);
const idRetoResolver = Number(parametrosResolver.get("id"));
const quiereReenviar = parametrosResolver.get("reenviar") === "1";


// ===== Datos =====
const INTENTOS_MAXIMOS_CODIGO = 3;
const TAMANO_MAXIMO_ARCHIVO = 5 * 1024 * 1024;
const extensionesPermitidas = ["doc", "docx", "pdf", "png", "jpg", "jpeg"];


// ===== Funciones =====
// El estado "entregado" y "resultado" de estas páginas se muestra con #entregado y #resultado (CSS :target).
// Este archivo pone o quita ese # según lo que haya guardado el estudiante y recarga para pintar los textos.
const cambiarEstadoPagina = (hash) => {
  // Al terminar un envío ya no se pide volver a ver el formulario (&reenviar=1)
  const parametros = new URLSearchParams(location.search);
  parametros.delete("reenviar");
  const consulta = parametros.toString() ? `?${parametros}` : "";
  history.replaceState(null, "", `${location.pathname}${consulta}${hash}`);
  location.reload();
};

// Poner el # es un salto dentro de la misma página (activa :target sin recargar); quitarlo recarga la página sin él
const asegurarHashPagina = (hash, debeEstar) => {
  const base = `${location.pathname}${location.search}`;
  if (debeEstar && location.hash !== hash) location.replace(base + hash);
  if (!debeEstar && location.hash === hash) location.replace(base);
};

const obtenerLiderDelReto = (reto) => obtenerNombrePerfil(reto.correoLider);

// El reto de la dirección, solo si es un reto publicado de la party del estudiante y del tipo de la página
const obtenerRetoDeResolver = (sesion, tipo) => {
  const reto = obtenerReto(idRetoResolver);
  if (!reto || reto.tipo !== tipo) return null;
  return obtenerRetosDeEstudiante(sesion.correo).some((r) => r.id === reto.id) ? reto : null;
};

const escribirTextoPorClase = (contenedor, clase, textos) => {
  contenedor.querySelectorAll(clase).forEach((elemento, i) => {
    if (textos[i] !== undefined) elemento.textContent = textos[i];
  });
};

const notificarEntregaAlLider = (sesion, reto, entrega) => {
  crearNotificacion(reto.correoLider, `${sesion.nombre} entregó «${reto.titulo}».`, {
    tipo: "reto",
    titulo: "Nueva entrega para revisar",
    datos: [{ nombre: "Estudiante", valor: sesion.nombre }, { nombre: "Reto", valor: reto.titulo }],
    enlace: `lider/revisar-entrega.html?id=${entrega.id}`,
    textoEnlace: "Revisar entrega",
  });
};

// ----- Reto de código -----
const estadosCodigo = {
  "por-revisar": {
    chip: "Entregado · en revisión",
    entrega: "Enviado para calificar",
    calificacion: "Sin calificar · en revisión del líder",
  },
  aprobada: { chip: "Aprobado", entrega: "Entrega aprobada", calificacion: "Aprobado" },
  correccion: { chip: "Corrección pedida", entrega: "Enviado · se pidió una corrección", calificacion: "Corrección pedida por el líder" },
};

const mostrarRetoCodigo = (sesion, reto, entrega, entregaConBorrador) => {
  const principal = principalRetoCodigo;
  const lider = obtenerLiderDelReto(reto);
  const liderCorto = lider.split(" ")[0];
  const plataforma = plataformasReto[reto.plataforma];
  const intentos = contarIntentosEntrega(reto.id, sesion.correo);
  const vencido = retoEstaVencido(reto);
  const entregado = Boolean(entrega) && !quiereReenviar;

  document.title = `${obtenerNombreReto(reto)} · BranchMatch`;
  principal.querySelector(".rc__titulo").textContent = obtenerNombreReto(reto);
  principal.querySelector(".rc__chip--pendiente").textContent = quiereReenviar
    ? `Nuevo intento · vence el ${formatearFechaReto(reto.fecha)}`
    : vencido ? `Vencido · cerró el ${formatearFechaReto(reto.fecha)}` : `Pendiente · vence el ${formatearFechaReto(reto.fecha)}`;
  principal.querySelector(".rc__chip--xp").textContent = `+${reto.xp} XP`;

  // Indicaciones
  principal.querySelector(".rc__meta").innerHTML = `Publicado por: ${escaparHtml(lider)} · Líder<br>Tema: ${escaparHtml(reto.tema)} · Dificultad: ${escaparHtml(reto.dificultad)}`;
  const lineas = reto.indicaciones.split("\n").map((l) => l.replace(/^[•\-\s]+/, "").trim()).filter(Boolean);
  principal.querySelector(".rc__lista").innerHTML = lineas
    .map((linea, i) => `<li class="rc__item"><span class="rc__item-num">${i + 1}</span><span>${escaparHtml(linea)}</span></li>`)
    .join("");

  // Plataforma
  principal.querySelector("#rc-plataforma").textContent = `Resuélvelo en ${plataforma.nombre}`;
  principal.querySelector(".rc__texto").textContent = `El enunciado completo, los ejemplos y el juez están en la plataforma. Cuando te salga «Accepted», guarda tu código.`;
  principal.querySelector(".rc__enlace span").textContent = reto.link.replace(/^https?:\/\//, "");
  const botonPlataforma = principal.querySelector(".rc__plataforma .boton");
  botonPlataforma.href = reto.link;
  botonPlataforma.textContent = `Abrir en ${plataforma.nombre} →`;

  // Tabla de estado de la entrega
  const filas = principal.querySelectorAll(".rc__fila-tabla");
  const info = entrega ? estadosCodigo[entrega.estado] : null;
  if (info) {
    escribirTextoPorClase(filas[0], ".rc__solo-entregado", [info.entrega]);
    escribirTextoPorClase(filas[1], ".rc__solo-entregado", [info.calificacion]);
  }
  escribirTextoPorClase(filas[0], ".rc__solo-pendiente", ["No entregado"]);
  filas[2].querySelector(".rc__valor").textContent = formatearFechaLimiteReto(reto);
  filas[3].querySelector(".rc__valor").textContent = calcularTiempoRestanteReto(reto);
  escribirTextoPorClase(filas[4], ".rc__solo-pendiente", [`${intentos} de ${INTENTOS_MAXIMOS_CODIGO} usados`]);
  escribirTextoPorClase(filas[4], ".rc__solo-entregado", [`${intentos} de ${INTENTOS_MAXIMOS_CODIGO} usados`]);
  escribirTextoPorClase(filas[5], ".rc__solo-pendiente", ["—"]);
  if (entrega) {
    const fecha = new Date(entrega.fecha);
    escribirTextoPorClase(filas[5], ".rc__solo-entregado", [`${nombresDiasReto[fecha.getDay()]}, ${fecha.getDate()} de ${nombresMesesReto[fecha.getMonth()]} de ${fecha.getFullYear()}, ${String(fecha.getHours()).padStart(2, "0")}:${String(fecha.getMinutes()).padStart(2, "0")}`]);
  }
  const comentarios = filas[6].querySelector("details");
  comentarios.innerHTML = entrega && entrega.comentario
    ? `<summary>Comentarios (1)</summary><p class="rc__vacio">${escaparHtml(liderCorto)}: ${escaparHtml(entrega.comentario)}</p>`
    : '<summary>Comentarios (0)</summary><p class="rc__vacio">Aún no hay comentarios.</p>';

  // Aviso y bloque "archivo enviado"
  const aviso = principal.querySelector(".rc__aviso-texto");
  const deshacer = principal.querySelector(".rc__deshacer");
  if (entrega) {
    principal.querySelector(".rc__chip--entregado").textContent = info.chip;
    aviso.textContent = entrega.estado === "aprobada"
      ? `¡Aprobado! ${liderCorto} aceptó tu entrega.`
      : entrega.estado === "correccion"
        ? `${liderCorto} pidió una corrección. Lee su comentario y vuelve a enviar.`
        : `¡Listo! Tu archivo se envió. ${liderCorto} lo revisará y te avisaremos cuando tenga nota.`;
    if (entrega.estado !== "por-revisar") deshacer.remove();

    principal.querySelector(".rc__archivo-tipo").textContent = entrega.archivo.tipo;
    principal.querySelector(".rc__archivo-nombre").textContent = entrega.archivo.nombre;
    principal.querySelector(".rc__archivo-detalle").textContent = `${formatearTamanoEntrega(entrega.archivo.tamano)} · subido el ${formatearFechaCortaEntrega(entrega.fecha)} · ✓ Recibido`;
    const restantes = INTENTOS_MAXIMOS_CODIGO - intentos;
    principal.querySelector(".rc__ayuda-texto").textContent = entrega.estado === "aprobada"
      ? `Tu entrega fue aprobada y ya ganaste +${reto.xp} XP. ¡Buen trabajo!`
      : `Has utilizado ${intentos} de ${INTENTOS_MAXIMOS_CODIGO} intentos: todavía puedes realizar ${restantes} más antes de la fecha límite. Si ${liderCorto} solicita correcciones, revisa sus comentarios antes de volver a enviar tu solución.`;
    const botonReenviar = principal.querySelector(".rc__enviado .rc__acciones .boton:not(.boton--secundario)");
    if (entrega.estado === "aprobada" || restantes <= 0 || vencido) botonReenviar.remove();
  }

  // Si ya hay un borrador guardado, se recuerda su nombre en la zona de carga
  if (entregaConBorrador && entregaConBorrador.estado === "borrador") {
    principal.querySelector(".rc__zona-titulo").textContent = `Borrador guardado: ${entregaConBorrador.archivo.nombre}`;
  }

  asegurarHashPagina("#entregado", entregado);
};

const leerArchivoElegido = (sesion, reto) => {
  const input = principalRetoCodigo.querySelector("#archivo");
  if (input.files.length) {
    const archivo = input.files[0];
    const extension = archivo.name.split(".").pop().toLowerCase();
    return { nombre: archivo.name, tipo: extension.toUpperCase(), tamano: archivo.size, extension };
  }
  const borrador = obtenerEntregaDe(reto.id, sesion.correo, true);
  return borrador && borrador.estado === "borrador" ? { ...borrador.archivo, extension: borrador.archivo.tipo.toLowerCase() } : null;
};

const enviarEntregaCodigo = (e, sesion, reto) => {
  e.preventDefault();
  limpiarErrorArchivo();
  const archivo = leerArchivoElegido(sesion, reto);
  if (!validarArchivo(archivo, reto, sesion)) return;

  const borrador = obtenerEntregaDe(reto.id, sesion.correo, true);
  if (borrador && borrador.estado === "borrador") borrarEntrega(borrador.id);
  const entrega = crearEntrega({
    idReto: reto.id,
    correoEstudiante: sesion.correo,
    estado: "por-revisar",
    intento: contarIntentosEntrega(reto.id, sesion.correo) + 1,
    archivo: { nombre: archivo.nombre, tipo: archivo.tipo, tamano: archivo.tamano },
    respuesta: "",
    comentario: "",
    fecha: new Date().toISOString(),
    fechaRevision: "",
  });
  notificarEntregaAlLider(sesion, reto, entrega);
  cambiarEstadoPagina("#entregado");
};

// "Guardar cambios" guarda el archivo elegido sin enviarlo
const guardarBorradorCodigo = (e, sesion, reto) => {
  e.preventDefault();
  limpiarErrorArchivo();
  const archivo = leerArchivoElegido(sesion, reto);
  if (!validarArchivo(archivo, reto, sesion, true)) return;
  const anterior = obtenerEntregaDe(reto.id, sesion.correo, true);
  if (anterior && anterior.estado === "borrador") borrarEntrega(anterior.id);
  crearEntrega({
    idReto: reto.id,
    correoEstudiante: sesion.correo,
    estado: "borrador",
    intento: 0,
    archivo: { nombre: archivo.nombre, tipo: archivo.tipo, tamano: archivo.tamano },
    respuesta: "",
    comentario: "",
    fecha: new Date().toISOString(),
    fechaRevision: "",
  });
  location.href = "retos.html";
};

const deshacerEntregaCodigo = (e, sesion, reto) => {
  e.preventDefault();
  const entrega = obtenerEntregaDe(reto.id, sesion.correo);
  if (entrega && entrega.estado === "por-revisar") borrarEntrega(entrega.id);
  history.replaceState(null, "", `${location.pathname}${location.search}`);
  location.reload();
};

// ----- Reto de opción múltiple -----
const crearHtmlOpcionFormulario = (texto, indice, marcada) => {
  const letra = letrasAlternativas[indice];
  return `
    <label class="rm__opcion">
      <input class="visualmente-oculto" type="radio" name="respuesta" value="${letra}"${marcada ? " checked" : ""}>
      <span class="rm__radio" aria-hidden="true"></span>
      <span class="rm__letra">${letra}</span>
      <span class="rm__texto">${escaparHtml(texto)}</span>
    </label>`;
};

const crearHtmlOpcionResultado = (texto, indice, reto, respuesta) => {
  const letra = letrasAlternativas[indice];
  const esCorrecta = letra === reto.correcta;
  const esElegida = letra === respuesta;
  if (esCorrecta) {
    return `<li class="rm__opcion rm__opcion--correcta"><span class="rm__radio rm__radio--marcada" aria-hidden="true"></span><span class="rm__letra">${letra}</span><span class="rm__texto">${escaparHtml(texto)}</span><span class="rm__etiqueta">✓ Correcta${esElegida ? " · tu respuesta" : ""}</span></li>`;
  }
  if (esElegida) {
    return `<li class="rm__opcion rm__opcion--incorrecta"><span class="rm__radio" aria-hidden="true"></span><span class="rm__letra">${letra}</span><span class="rm__texto">${escaparHtml(texto)}</span><span class="rm__etiqueta">✕ Tu respuesta</span></li>`;
  }
  return `<li class="rm__opcion rm__opcion--apagada"><span class="rm__radio" aria-hidden="true"></span><span class="rm__letra">${letra}</span><span class="rm__texto">${escaparHtml(texto)}</span></li>`;
};

const mostrarRetoOpcion = (sesion, reto, entrega, borrador) => {
  const principal = principalRetoOpcion;
  const lider = obtenerLiderDelReto(reto);
  const vencido = retoEstaVencido(reto);
  const respondido = Boolean(entrega);

  document.title = `${obtenerNombreReto(reto)} · BranchMatch`;
  principal.querySelector(".rm__titulo").textContent = obtenerNombreReto(reto);
  principal.querySelector(".rm__chip--pendiente").textContent = vencido ? `Vencido · cerró el ${formatearFechaReto(reto.fecha)}` : `Pendiente · vence el ${formatearFechaReto(reto.fecha)}`;
  principal.querySelectorAll(".rm__chip--ok").forEach((chip) => {
    if (!chip.classList.contains("rm__solo-resultado")) chip.textContent = `+${reto.xp} XP`;
  });
  principal.querySelector("#rm-pregunta").textContent = reto.pregunta;
  principal.querySelector(".rm__form .rm__opciones").innerHTML =
    '<legend class="rm__leyenda">Elige una opción:</legend>' +
    reto.alternativas.map((texto, i) => crearHtmlOpcionFormulario(texto, i, borrador && borrador.respuesta === letrasAlternativas[i])).join("");

  // Datos del reto (columna lateral)
  const datos = principal.querySelectorAll(".rm__dato dd");
  datos[0].textContent = `${lider} · Líder`;
  datos[1].textContent = reto.tema;
  datos[2].textContent = `${formatearFechaReto(reto.fecha)}, 23:59`;
  datos[3].textContent = `+${reto.xp} XP`;
  datos[4].textContent = "1";

  if (respondido) {
    const acerto = entrega.estado === "aprobada";
    const indiceElegida = letrasAlternativas.indexOf(entrega.respuesta);
    const indiceCorrecta = letrasAlternativas.indexOf(reto.correcta);
    principal.querySelector(".rm__chip--ok.rm__solo-resultado").textContent = acerto ? `Completado · +${reto.xp} XP ganados` : "Respondido · sin XP esta vez";
    principal.querySelector(".rm__subtitulo.rm__solo-resultado").textContent = `Ya enviaste tu respuesta. Mira el resultado y la explicación de ${lider.split(" ")[0]}.`;
    principal.querySelector("#rm-resultado-titulo").textContent = acerto ? `¡Correcto! Ganaste +${reto.xp} XP` : "Casi: esta vez no fue la correcta";
    principal.querySelector(".rm__resultado-texto").textContent = acerto
      ? `Tu respuesta fue ${entrega.respuesta} · ${reto.alternativas[indiceElegida]}. ¡Sigue así!`
      : `Tu respuesta fue ${entrega.respuesta} · ${reto.alternativas[indiceElegida]}. La correcta era ${reto.correcta} · ${reto.alternativas[indiceCorrecta]}.`;
    principal.querySelector(".rm__revision .rm__opciones").innerHTML = reto.alternativas.map((texto, i) => crearHtmlOpcionResultado(texto, i, reto, entrega.respuesta)).join("");
    principal.querySelector(".rm__explicacion-texto").textContent = reto.explicacion || "El líder no agregó una explicación.";
    if (!reto.explicacion) principal.querySelector(".rm__explicacion").remove();
    principal.querySelector(".rm__revision .rm__nota").textContent = acerto ? "Tu XP ya se sumó a tu Player Card." : "No sumaste XP en este reto. Repasa la lección y sigue con el siguiente.";
  }

  asegurarHashPagina("#resultado", respondido);
};

const enviarRespuestaOpcion = (e, sesion, reto) => {
  e.preventDefault();
  const marcada = principalRetoOpcion.querySelector('input[name="respuesta"]:checked');
  limpiarErrorRespuesta();
  if (!validarRespuestaOpcion(marcada, reto)) return;

  const borrador = obtenerEntregaDe(reto.id, sesion.correo, true);
  if (borrador && borrador.estado === "borrador") borrarEntrega(borrador.id);
  const acerto = marcada.value === reto.correcta;
  const entrega = crearEntrega({
    idReto: reto.id,
    correoEstudiante: sesion.correo,
    estado: acerto ? "aprobada" : "incorrecta",
    intento: 1,
    archivo: { nombre: "", tipo: "", tamano: 0 },
    respuesta: marcada.value,
    comentario: "",
    fecha: new Date().toISOString(),
    fechaRevision: new Date().toISOString(),
  });
  if (acerto) sumarXp(sesion.correo, reto.xp);
  notificarEntregaAlLider(sesion, reto, entrega);
  cambiarEstadoPagina("#resultado");
};

const guardarBorradorOpcion = (e, sesion, reto) => {
  e.preventDefault();
  const marcada = principalRetoOpcion.querySelector('input[name="respuesta"]:checked');
  limpiarErrorRespuesta();
  if (!validarRespuestaOpcion(marcada, reto, true)) return;
  const anterior = obtenerEntregaDe(reto.id, sesion.correo, true);
  if (anterior && anterior.estado === "borrador") borrarEntrega(anterior.id);
  crearEntrega({ idReto: reto.id, correoEstudiante: sesion.correo, estado: "borrador", intento: 0, archivo: { nombre: "", tipo: "", tamano: 0 }, respuesta: marcada.value, comentario: "", fecha: new Date().toISOString(), fechaRevision: "" });
  location.href = "retos.html";
};


// ===== Validaciones =====
// El mensaje de error del archivo está dentro de .rc__zona; con .campo--error se muestra
const mostrarErrorArchivo = (mensaje) => {
  const zona = principalRetoCodigo.querySelector(".rc__zona");
  zona.querySelector(".campo__error").textContent = mensaje;
  zona.classList.add("campo--error");
};

const limpiarErrorArchivo = () => principalRetoCodigo.querySelector(".rc__zona").classList.remove("campo--error");

const validarArchivo = (archivo, reto, sesion, soloGuardar = false) => {
  if (!archivo) {
    mostrarErrorArchivo("Selecciona un documento Word, PDF o una imagen PNG/JPG de máximo 5 MB.");
    return false;
  }
  if (!extensionesPermitidas.includes(archivo.extension)) {
    mostrarErrorArchivo("Ese formato no está permitido. Usa Word (.doc, .docx), PDF, PNG o JPG.");
    return false;
  }
  if (archivo.tamano > TAMANO_MAXIMO_ARCHIVO) {
    mostrarErrorArchivo("El archivo pesa más de 5 MB. Elige uno más liviano.");
    return false;
  }
  if (!soloGuardar && retoEstaVencido(reto)) {
    mostrarErrorArchivo("El plazo de este reto ya venció, no se pueden enviar más archivos.");
    return false;
  }
  if (!soloGuardar && contarIntentosEntrega(reto.id, sesion.correo) >= INTENTOS_MAXIMOS_CODIGO) {
    mostrarErrorArchivo(`Ya usaste los ${INTENTOS_MAXIMOS_CODIGO} intentos de este reto.`);
    return false;
  }
  return true;
};

const limpiarErrorRespuesta = () => principalRetoOpcion.querySelector(".rm__form .campo__error").classList.remove("campo__error--visible");

// El aviso de error se muestra con la clase campo__error--visible
const validarRespuestaOpcion = (marcada, reto, soloGuardar = false) => {
  const aviso = principalRetoOpcion.querySelector(".rm__form .campo__error");
  if (!marcada) {
    aviso.textContent = "Elige una opción antes de enviar tu respuesta.";
    aviso.classList.add("campo__error--visible");
    return false;
  }
  if (!soloGuardar && retoEstaVencido(reto)) {
    aviso.textContent = "El plazo de este reto ya venció, no se pueden enviar respuestas.";
    aviso.classList.add("campo__error--visible");
    return false;
  }
  aviso.classList.remove("campo__error--visible");
  return true;
};


// ===== Registro de eventos =====
document.addEventListener("DOMContentLoaded", () => {
  const sesion = obtenerSesion();
  if (!sesion) return;

  if (principalRetoCodigo) {
    const reto = obtenerRetoDeResolver(sesion, "codigo");
    if (!reto) {
      location.replace("retos.html");
      return;
    }
    const entrega = obtenerEntregaDe(reto.id, sesion.correo);
    mostrarRetoCodigo(sesion, reto, entrega, obtenerEntregaDe(reto.id, sesion.correo, true));

    const formulario = principalRetoCodigo.querySelector(".rc__agregar");
    formulario.noValidate = true;
    formulario.addEventListener("submit", (e) => e.preventDefault());
    const botones = formulario.querySelectorAll(".rc__acciones .boton");
    botones[0].addEventListener("click", (e) => enviarEntregaCodigo(e, sesion, reto));
    botones[1].addEventListener("click", (e) => guardarBorradorCodigo(e, sesion, reto));
    principalRetoCodigo.querySelector("#archivo").addEventListener("change", limpiarErrorArchivo);

    const deshacer = principalRetoCodigo.querySelector(".rc__deshacer");
    if (deshacer) deshacer.addEventListener("click", (e) => deshacerEntregaCodigo(e, sesion, reto));
    const verArchivo = principalRetoCodigo.querySelector(".rc__archivo-ver");
    verArchivo.addEventListener("click", (e) => {
      e.preventDefault();
      alert("En esta demostración solo se guardan los datos del archivo, no su contenido.");
    });
    const volverAEnviar = principalRetoCodigo.querySelector(".rc__enviado .rc__acciones .boton:not(.boton--secundario)");
    if (volverAEnviar) {
      volverAEnviar.addEventListener("click", (e) => {
        e.preventDefault();
        location.href = `${location.pathname}?id=${reto.id}&reenviar=1`;
      });
    }
  }

  if (principalRetoOpcion) {
    const reto = obtenerRetoDeResolver(sesion, "opcion-multiple");
    if (!reto) {
      location.replace("retos.html");
      return;
    }
    mostrarRetoOpcion(sesion, reto, obtenerEntregaDe(reto.id, sesion.correo), obtenerEntregaDe(reto.id, sesion.correo, true));

    const formulario = principalRetoOpcion.querySelector(".rm__form");
    formulario.noValidate = true;
    formulario.addEventListener("submit", (e) => e.preventDefault());
    const botones = formulario.querySelectorAll(".rm__acciones .boton");
    botones[0].addEventListener("click", (e) => enviarRespuestaOpcion(e, sesion, reto));
    botones[1].addEventListener("click", (e) => guardarBorradorOpcion(e, sesion, reto));
    formulario.addEventListener("change", limpiarErrorRespuesta);

    // Atajo de teclado: A, B, C, D para elegir y Enter para enviar
    document.addEventListener("keydown", (e) => {
      const origen = e.target instanceof Element ? e.target : document.body;
      if (obtenerEntregaDe(reto.id, sesion.correo) || origen.closest("input[type='text'], textarea")) return;
      const indice = letrasAlternativas.indexOf(e.key.toUpperCase());
      if (e.key.length === 1 && indice >= 0 && indice < reto.alternativas.length) {
        formulario.querySelectorAll('input[name="respuesta"]')[indice].checked = true;
      }
      if (e.key === "Enter") enviarRespuestaOpcion(e, sesion, reto);
    });
  }
});
