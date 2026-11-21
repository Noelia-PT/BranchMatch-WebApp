// Retos: datos de los retos, lista de retos (estudiante y líder), crear retos de código y de opción múltiple y reto publicado.
// Páginas: estudiante/retos; lider/retos, crear-reto-codigo, crear-reto-opcion-multiple, reto-publicado (y lo usan resolver, entregas y rendimiento).
// Responsable: P4 (Retos y rendimiento).

// ===== Elementos =====
const listaRetosEstudiante = document.querySelector(".retos__lista");
const formFiltrosRetos = document.querySelector("form.retos__filtros");
const listaRetosLider = document.querySelector(".rl__lista");
const filtrosRetosLider = document.querySelector(".rl__filtros");
const buscadorRetosLider = document.querySelector("#rl-buscar");
const formRetoCodigo = document.querySelector("form.crc__form");
const formRetoOpcion = document.querySelector("form.crm__form");
const formRetoPublicado = document.querySelector("form.rp__form");

// Con ?id=3 en la dirección se ve el reto 3 (reto-publicado)
const idRetoDireccion = Number(new URLSearchParams(location.search).get("id"));


// ===== Datos =====
const CLAVE_RETOS = "bm_retos";
const nombresMesesReto = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const nombresDiasReto = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const plataformasReto = {
  codeforces: { nombre: "Codeforces", dominio: "codeforces.com" },
  hackerrank: { nombre: "HackerRank", dominio: "hackerrank.com" },
};
const dificultadesReto = ["Fácil", "Media", "Difícil"];
const temasReto = ["Grafos", "Listas Enlazadas", "Árboles Binarios", "Programación dinámica", "Strings"];

// "2026-11-18" de hoy más N días: los retos de ejemplo siempre tienen fechas cercanas a hoy
const fechaIsoDeReto = (fecha) => `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
const sumarDiasReto = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fechaIsoDeReto(fecha);
};

// tipo: "codigo" u "opcion-multiple"; estado: "borrador" o "publicado"; "correcta" es la letra ("A", "B"...)
const retosIniciales = [
  { id: 1, correoLider: "lider1@branchmatch.test", tipo: "codigo", titulo: "Recorrido en profundidad (DFS)", tema: "Grafos", dificultad: "Media", fecha: sumarDiasReto(-7), xp: 40, estado: "publicado", plataforma: "codeforces", link: "https://codeforces.com/problemset/problem/104/B", indicaciones: "• Lee un grafo no dirigido.\n• Recórrelo con DFS desde el nodo 1.\n• Imprime los nodos en el orden en que los visitas." },
  { id: 2, correoLider: "lider1@branchmatch.test", tipo: "codigo", titulo: "Componentes conexas", tema: "Grafos", dificultad: "Media", fecha: sumarDiasReto(-3), xp: 40, estado: "publicado", plataforma: "codeforces", link: "https://codeforces.com/problemset/problem/977/E", indicaciones: "• Lee un grafo no dirigido.\n• Cuenta sus componentes conexas.\n• Imprime la cantidad." },
  { id: 3, correoLider: "lider1@branchmatch.test", tipo: "codigo", titulo: "Dijkstra con colas de prioridad", tema: "Grafos", dificultad: "Media", fecha: sumarDiasReto(3), xp: 40, estado: "publicado", plataforma: "codeforces", link: "https://codeforces.com/problemset/problem/20/C", indicaciones: "• Lee un grafo dirigido con n nodos y m aristas con peso.\n• Encuentra el camino más corto del nodo 1 al nodo n.\n• Usa Dijkstra con cola de prioridad; si no hay camino, imprime -1." },
  { id: 4, correoLider: "lider1@branchmatch.test", tipo: "opcion-multiple", titulo: "Complejidad de Dijkstra", tema: "Grafos", dificultad: "Fácil", fecha: sumarDiasReto(5), xp: 20, estado: "publicado", pregunta: "¿Cuál es la complejidad de Dijkstra cuando usas una cola de prioridad (min-heap)?", alternativas: ["O(V²)", "O((V + E) log V)", "O(V · E)", "O(E)"], correcta: "B", explicacion: "Cada arista se procesa una vez y cada operación en el heap cuesta log V, por eso queda O((V + E) log V)." },
  { id: 5, correoLider: "lider1@branchmatch.test", tipo: "codigo", titulo: "Mochila 0/1", tema: "Programación dinámica", dificultad: "Difícil", fecha: sumarDiasReto(4), xp: 50, estado: "publicado", plataforma: "hackerrank", link: "https://www.hackerrank.com/challenges/unbounded-knapsack/problem", indicaciones: "• Lee n objetos con peso y valor.\n• Calcula el valor máximo con capacidad W.\n• Usa programación dinámica." },
  { id: 6, correoLider: "lider1@branchmatch.test", tipo: "codigo", titulo: "Palíndromos con hashing", tema: "Strings", dificultad: "Media", fecha: sumarDiasReto(7), xp: 40, estado: "publicado", plataforma: "codeforces", link: "https://codeforces.com/problemset/problem/835/D", indicaciones: "• Lee una cadena.\n• Cuenta sus subcadenas palíndromas.\n• Usa hashing para comparar rápido." },
];

const obtenerRetos = () => leerDatos(CLAVE_RETOS, retosIniciales);

const obtenerReto = (id) => obtenerRetos().find((r) => r.id === id) || null;

// Los retos de un líder (publicados y borradores), del más nuevo al más antiguo
const obtenerRetosDeLider = (correoLider) => obtenerRetos().filter((r) => r.correoLider === correoLider).sort((a, b) => b.id - a.id);

const crearReto = (reto) => {
  const retos = obtenerRetos();
  const ids = retos.map((r) => r.id);
  reto.id = Math.max(0, ...ids) + 1;
  retos.push(reto);
  guardarDatos(CLAVE_RETOS, retos);
  return reto;
};

const editarReto = (id, cambios) => {
  const retos = obtenerRetos();
  const posicion = retos.findIndex((r) => r.id === id);
  if (posicion === -1) return;
  retos[posicion] = { ...retos[posicion], ...cambios, id };
  guardarDatos(CLAVE_RETOS, retos);
};

const borrarReto = (id) => {
  guardarDatos(CLAVE_RETOS, obtenerRetos().filter((r) => r.id !== id));
};


// ===== Funciones =====
// ----- Ayudas compartidas con resolver.js, entregas.js y rendimiento.js -----
// Los retos publicados que ve un estudiante: los del líder de su party
const obtenerRetosDeEstudiante = (correoEstudiante) => {
  const party = obtenerPartyDe(correoEstudiante);
  return party ? obtenerRetosDeLider(party.correoLider).filter((r) => r.estado === "publicado") : [];
};

// Los estudiantes de la party de un líder (sin contar al líder)
const obtenerEstudiantesDeLider = (correoLider) => {
  const party = obtenerPartyDe(correoLider);
  return party ? party.integrantes.filter((c) => c !== correoLider) : [];
};

const obtenerLimiteReto = (reto) => new Date(`${reto.fecha}T23:59:00`);

const retoEstaVencido = (reto) => obtenerLimiteReto(reto) < new Date();

// "18 de octubre"
const formatearFechaReto = (fechaIso) => {
  const [anio, mes, dia] = fechaIso.split("-").map(Number);
  return `${dia} de ${nombresMesesReto[mes - 1]}`;
};

// "sábado, 18 de octubre de 2026, 23:59"
const formatearFechaLimiteReto = (reto) => {
  const fecha = obtenerLimiteReto(reto);
  return `${nombresDiasReto[fecha.getDay()]}, ${fecha.getDate()} de ${nombresMesesReto[fecha.getMonth()]} de ${fecha.getFullYear()}, 23:59`;
};

// "3 días 6 horas", "5 horas" o "Vencido"
const calcularTiempoRestanteReto = (reto) => {
  const faltan = obtenerLimiteReto(reto) - new Date();
  if (faltan <= 0) return "Vencido";
  const dias = Math.floor(faltan / 86400000);
  const horas = Math.floor((faltan % 86400000) / 3600000);
  const textoDias = dias ? `${dias} ${dias === 1 ? "día" : "días"} ` : "";
  return `${textoDias}${horas} ${horas === 1 ? "hora" : "horas"}`.trim();
};

// El número del ancho de una barra se redondea de 5 en 5 (clases p4-ancho--N)
const redondearAnchoReto = (valor) => Math.round(Math.min(100, Math.max(0, Number(valor) || 0)) / 5) * 5;

const obtenerNombreReto = (reto) => `Reto ${reto.id}: ${reto.titulo}`;

// ----- Lista de retos del estudiante -----
const estadosRetoEstudiante = {
  pendiente: { texto: "Pendiente", clase: "retos__estado--pendiente" },
  revision: { texto: "En revisión", clase: "retos__estado--revision" },
  aceptado: { texto: "Aceptado", clase: "retos__estado--aceptado" },
  correccion: { texto: "Corrección pedida", clase: "retos__estado--correccion" },
  incorrecta: { texto: "Incorrecta", clase: "retos__estado--correccion" },
};

// Estado de un reto para un estudiante según su entrega más reciente
const obtenerEstadoRetoEstudiante = (reto, correo) => {
  const entrega = obtenerEntregaDe(reto.id, correo);
  if (!entrega) return "pendiente";
  return { "por-revisar": "revision", aprobada: "aceptado", correccion: "correccion", incorrecta: "incorrecta" }[entrega.estado] || "pendiente";
};

const pasaFiltroFechaReto = (reto, filtro) => {
  if (filtro === "todos") return true;
  const limite = obtenerLimiteReto(reto);
  const ahora = new Date();
  if (filtro === "vencidos") return limite < ahora;
  if (filtro === "semana") return limite >= ahora && limite - ahora <= 7 * 86400000;
  if (filtro === "mes") return limite.getMonth() === ahora.getMonth() && limite.getFullYear() === ahora.getFullYear();
  return true;
};

const crearHtmlRetoEstudiante = (reto, estado) => {
  const info = estadosRetoEstudiante[estado];
  const esCodigo = reto.tipo === "codigo";
  const pagina = esCodigo ? "reto-codigo.html" : "reto-opcion-multiple.html";
  const resolver = estado === "pendiente" || estado === "correccion";
  return `
    <li class="retos__fila">
      <div class="retos__reto">
        <h2 class="retos__nombre">${escaparHtml(obtenerNombreReto(reto))}</h2>
        <p class="retos__tipo ${esCodigo ? "retos__tipo--codigo" : "retos__tipo--opcion"}">${esCodigo ? "&lt;/&gt; Código" : "◉ Opción múltiple"}</p>
      </div>
      <p class="retos__dato">Tema: ${escaparHtml(reto.tema)}</p>
      <p class="retos__dato">Entrega: ${formatearFechaReto(reto.fecha)}</p>
      <p class="retos__estado ${info.clase}">Estado: ${info.texto}</p>
      <a class="retos__accion ${resolver ? "retos__accion--resolver" : "retos__accion--ver"}" href="${pagina}?id=${reto.id}">${estado === "correccion" ? "Corregir →" : resolver ? "Resolver →" : "Ver →"}</a>
    </li>`;
};

// Las opciones de tema salen de los retos que existen
const llenarFiltrosRetosEstudiante = (retos) => {
  const selectTema = document.querySelector("#tema");
  const temas = [...new Set(retos.map((r) => r.tema))];
  selectTema.innerHTML = '<option value="todos">Tema: todos</option>' + temas.map((t) => `<option value="${escaparHtml(t)}">${escaparHtml(t)}</option>`).join("");
  document.querySelector("#estado").innerHTML = `
    <option value="todos">Estado: todos</option>
    <option value="pendiente">Pendiente</option>
    <option value="revision">En revisión</option>
    <option value="aceptado">Aceptado</option>
    <option value="correccion">Corrección pedida</option>
    <option value="incorrecta">Incorrecta</option>`;
};

const mostrarRetosEstudiante = (sesion) => {
  const party = obtenerPartyDe(sesion.correo);
  if (!party) {
    listaRetosEstudiante.innerHTML = '<li class="retos__fila"><p class="retos__dato">Únete a una party para ver sus retos.</p><a class="retos__accion retos__accion--resolver" href="unete-party.html">Buscar party →</a></li>';
    return;
  }
  const retos = obtenerRetosDeEstudiante(sesion.correo);
  const texto = document.querySelector("#buscar").value.trim().toLowerCase();
  const filtroTema = document.querySelector("#tema").value;
  const filtroEstado = document.querySelector("#estado").value;
  const filtroFecha = document.querySelector("#fecha").value;
  const orden = document.querySelector("#orden").value;

  const filas = retos
    .map((reto) => ({ reto, estado: obtenerEstadoRetoEstudiante(reto, sesion.correo) }))
    .filter(({ reto, estado }) =>
      obtenerNombreReto(reto).toLowerCase().includes(texto) &&
      (filtroTema === "todos" || reto.tema === filtroTema) &&
      (filtroEstado === "todos" || estado === filtroEstado) &&
      pasaFiltroFechaReto(reto, filtroFecha)
    )
    .sort((a, b) => (orden === "antiguos" ? a.reto.id - b.reto.id : orden === "entrega" ? a.reto.fecha.localeCompare(b.reto.fecha) : b.reto.id - a.reto.id));

  listaRetosEstudiante.innerHTML = filas.length
    ? filas.map(({ reto, estado }) => crearHtmlRetoEstudiante(reto, estado)).join("")
    : '<li class="retos__fila"><p class="retos__dato">No hay retos con esos filtros.</p></li>';
};

// ----- Lista de retos del líder -----
let filtroRetosLider = "activos";

const crearHtmlRetoLider = (reto, estudiantes) => {
  const entregas = obtenerEntregasDeReto(reto.id).filter((e) => e.estado !== "borrador");
  const quienes = new Set(entregas.map((e) => e.correoEstudiante));
  const total = estudiantes.length;
  const porcentaje = total ? Math.round((quienes.size / total) * 100) : 0;
  const porRevisar = entregas.filter((e) => e.estado === "por-revisar").length;
  const cerrado = retoEstaVencido(reto);
  const esBorrador = reto.estado === "borrador";

  const pie = esBorrador
    ? `<span class="rl__pildora rl__pildora--apagada">Borrador</span><a class="boton rl__boton" href="reto-publicado.html?id=${reto.id}">Continuar</a>`
    : `<span class="rl__pildora ${porRevisar ? "rl__pildora--rosa" : "rl__pildora--apagada"}">${porRevisar ? `${porRevisar} por revisar` : "Sin pendientes"}</span>
       <a class="boton${porRevisar ? "" : " boton--secundario"} rl__boton" href="entregas.html?idReto=${reto.id}">${porRevisar ? "Revisar" : "Ver detalle"}</a>`;
  return `
    <li class="rl__reto">
      <div class="rl__reto-info">
        <div class="rl__reto-cabecera">
          <h2 class="rl__reto-titulo">${escaparHtml(reto.titulo)}</h2>
          <span class="chip chip--celeste rl__tag">${escaparHtml(reto.tema)}</span>
        </div>
        <p class="rl__reto-fecha">${cerrado ? "Cerró" : "Cierra"} el ${formatearFechaReto(reto.fecha)}</p>
      </div>
      <div class="rl__progreso">
        <p class="rl__progreso-texto">Entregas ${quienes.size}/${total}</p>
        <span class="rl__barra"><span class="rl__relleno ${porcentaje >= 50 ? "rl__relleno--menta" : "rl__relleno--amarillo"} p4-ancho--${redondearAnchoReto(porcentaje)}"></span></span>
      </div>
      <div class="rl__reto-pie">${pie}</div>
    </li>`;
};

const mostrarRetosLider = (sesion) => {
  const retos = obtenerRetosDeLider(sesion.correo);
  const estudiantes = obtenerEstudiantesDeLider(sesion.correo);
  const activos = retos.filter((r) => r.estado === "borrador" || !retoEstaVencido(r));
  const cerrados = retos.filter((r) => r.estado === "publicado" && retoEstaVencido(r));
  const texto = buscadorRetosLider.value.trim().toLowerCase();

  filtrosRetosLider.innerHTML = `
    <li><a class="rl__pildora ${filtroRetosLider === "activos" ? "rl__pildora--amarillo" : "rl__pildora--borde"}" href="#" data-filtro="activos"${filtroRetosLider === "activos" ? ' aria-current="true"' : ""}>Activos · ${activos.length}</a></li>
    <li><a class="rl__pildora ${filtroRetosLider === "cerrados" ? "rl__pildora--amarillo" : "rl__pildora--borde"}" href="#" data-filtro="cerrados"${filtroRetosLider === "cerrados" ? ' aria-current="true"' : ""}>Cerrados · ${cerrados.length}</a></li>`;

  const mostrados = (filtroRetosLider === "activos" ? activos : cerrados).filter((r) => r.titulo.toLowerCase().includes(texto));
  listaRetosLider.innerHTML = mostrados.length
    ? mostrados.map((r) => crearHtmlRetoLider(r, estudiantes)).join("")
    : '<li class="rl__reto"><p class="rl__reto-fecha">No hay retos para mostrar. Crea uno con «+ Crear reto».</p></li>';
};

// ----- Crear reto: ayudas para los dos formularios -----
const mostrarErrorReto = (campo, mensaje) => {
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

const limpiarErroresReto = (formulario) => {
  formulario.querySelectorAll(".campo--error").forEach((c) => c.classList.remove("campo--error"));
  formulario.querySelectorAll("[aria-invalid]").forEach((c) => c.removeAttribute("aria-invalid"));
};

// "+40 XP" -> 40 (null si no tiene ese formato)
const leerRecompensaReto = (texto) => {
  const coincidencia = /^\+?(\d{1,4}) ?XP$/i.exec(texto.trim());
  return coincidencia ? Number(coincidencia[1]) : null;
};

// Las fechas de ejemplo del diseño no deben quedar en un reto nuevo
const prepararFormularioNuevoReto = (formulario, prefijo) => {
  formulario.noValidate = true;
  formulario.querySelector(`#${prefijo}-fecha`).value = sumarDiasReto(7);
  formulario.querySelector(`#${prefijo}-fecha`).min = sumarDiasReto(0);
  formulario.querySelector(`#${prefijo}-titulo`).value = "";
};

// Comprueba los datos comunes (título, tema, fecha y recompensa); devuelve el primer campo con error
const validarDatosBaseReto = (formulario, prefijo) => {
  let primerError = null;
  const marcar = (campo, mensaje) => {
    mostrarErrorReto(campo, mensaje);
    primerError = primerError || campo;
  };
  const titulo = formulario.querySelector(`#${prefijo}-titulo`);
  const fecha = formulario.querySelector(`#${prefijo}-fecha`);
  const recompensa = formulario.querySelector(`#${prefijo}-recompensa`);

  if (titulo.value.trim().length < 3) marcar(titulo, "Escribe un título de al menos 3 caracteres.");
  if (!fecha.value) marcar(fecha, "Elige una fecha de entrega.");
  else if (fecha.value < sumarDiasReto(0)) marcar(fecha, "La fecha de entrega no puede ser anterior a hoy.");
  if (leerRecompensaReto(recompensa.value) === null) marcar(recompensa, "Escribe la recompensa, por ejemplo «+40 XP».");
  return primerError;
};

// Cuenta cuántos puntos del control "Antes de publicar" se cumplen y los marca con ✓ u ○
const pintarListaPrevia = (selectorItems, selectorChip, cumplidos) => {
  document.querySelectorAll(selectorItems).forEach((item, i) => {
    const marca = item.firstElementChild;
    marca.textContent = cumplidos[i] ? "✓" : "○";
  });
  const listos = cumplidos.filter(Boolean).length;
  document.querySelector(selectorChip).textContent = `${listos === cumplidos.length ? "✓ " : ""}${listos} de ${cumplidos.length} listos`;
};

// ----- Crear reto de código -----
const obtenerPlataformaReto = (url) => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return Object.keys(plataformasReto).find((clave) => host === plataformasReto[clave].dominio) || null;
  } catch (error) {
    return null;
  }
};

const leerFormularioCodigo = () => {
  const f = formRetoCodigo;
  return {
    titulo: f.querySelector("#crc-titulo").value.trim(),
    tema: f.querySelector("#crc-tema").selectedOptions[0].textContent,
    dificultad: dificultadesReto[["facil", "media", "dificil"].indexOf(f.querySelector('input[name="dificultad"]:checked').value)],
    fecha: f.querySelector("#crc-fecha").value,
    xp: leerRecompensaReto(f.querySelector("#crc-recompensa").value),
    plataforma: f.querySelector('input[name="plataforma"]:checked').value,
    link: f.querySelector("#crc-link").value.trim(),
    indicaciones: f.querySelector("#crc-indicaciones").value.trim(),
  };
};

// Vista previa lateral y lista "Antes de publicar" del reto de código
const actualizarPreviaCodigo = () => {
  const datos = leerFormularioCodigo();
  const plataformaLink = obtenerPlataformaReto(datos.link);
  const linkValido = plataformaLink === datos.plataforma;
  const campoLink = formRetoCodigo.querySelector("#crc-link");
  campoLink.classList.toggle("crc__input--ok", linkValido);
  const mensajeLink = formRetoCodigo.querySelector(".crc__valido");
  mensajeLink.textContent = linkValido ? `✓ Link válido · ${plataformasReto[datos.plataforma].nombre}` : "";

  const chips = document.querySelectorAll(".crc__mini-chips .crc__chip");
  chips[1].textContent = datos.tema;
  chips[2].textContent = datos.dificultad;
  document.querySelector(".crc__mini-titulo").textContent = datos.titulo || "Título del reto";
  document.querySelector(".crc__mini-fecha").textContent = `Entrega: ${datos.fecha ? formatearFechaReto(datos.fecha) : "sin fecha"} · ${datos.xp === null ? "—" : `+${datos.xp} XP`}`;
  document.querySelector(".crc__mini-boton").textContent = `Abrir en ${plataformasReto[datos.plataforma].nombre} →`;

  pintarListaPrevia(".crc__lista .crc__item", ".crc__caja .crc__chip", [
    datos.titulo.length >= 3,
    linkValido,
    datos.indicaciones.length >= 10,
    Boolean(datos.fecha) && datos.fecha >= sumarDiasReto(0),
  ]);
};

const validarFormularioCodigo = () => {
  let primerError = validarDatosBaseReto(formRetoCodigo, "crc");
  const link = formRetoCodigo.querySelector("#crc-link");
  const indicaciones = formRetoCodigo.querySelector("#crc-indicaciones");
  const datos = leerFormularioCodigo();

  if (!link.value.trim() || obtenerPlataformaReto(datos.link) === null) {
    mostrarErrorReto(link, "Pega un link válido del problema, por ejemplo https://codeforces.com/…");
    primerError = primerError || link;
  } else if (obtenerPlataformaReto(datos.link) !== datos.plataforma) {
    mostrarErrorReto(link, `El link no es de ${plataformasReto[datos.plataforma].nombre}. Cambia la plataforma o el link.`);
    primerError = primerError || link;
  }
  if (datos.indicaciones.length < 10) {
    mostrarErrorReto(indicaciones, "Escribe las indicaciones (mínimo 10 caracteres).");
    primerError = primerError || indicaciones;
  } else if (datos.indicaciones.split("\n").filter((l) => l.trim()).length > 5) {
    mostrarErrorReto(indicaciones, "Usa como máximo 5 líneas.");
    primerError = primerError || indicaciones;
  }
  if (primerError) primerError.focus();
  return !primerError;
};

const guardarRetoCodigo = (sesion, estado) => {
  const datos = leerFormularioCodigo();
  return crearReto({ correoLider: sesion.correo, tipo: "codigo", ...datos, estado });
};

// ----- Crear reto de opción múltiple -----
const letrasAlternativas = ["A", "B", "C", "D", "E", "F"];

const crearHtmlAlternativa = (letra) => {
  const id = letra.toLowerCase();
  return `
    <div class="crm__alt">
      <span class="crm__letra">${letra}</span>
      <label class="visualmente-oculto" for="crm-alt-${id}">Alternativa ${letra}</label>
      <input class="campo__input crm__alt-input" id="crm-alt-${id}" name="alternativa-${id}" type="text" value="" required>
      <input class="visualmente-oculto" type="radio" id="crm-ok-${id}" name="correcta" value="${id}">
      <label class="crm__marcar" for="crm-ok-${id}"><span class="crm__marcar-no">○ Marcar correcta</span><span class="crm__marcar-si">✓ Correcta</span></label>
      <a class="crm__borrar" href="#" aria-label="Eliminar alternativa ${letra}"><img src="../../assets/icons/crear-reto-opcion-papelera.svg" alt=""></a>
    </div>`;
};

// Vuelve a poner A, B, C... en orden después de añadir o quitar alternativas
const renumerarAlternativas = () => {
  formRetoOpcion.querySelectorAll(".crm__alt").forEach((alt, i) => {
    const letra = letrasAlternativas[i];
    const id = letra.toLowerCase();
    alt.querySelector(".crm__letra").textContent = letra;
    alt.querySelector("label.visualmente-oculto").textContent = `Alternativa ${letra}`;
    alt.querySelector("label.visualmente-oculto").htmlFor = `crm-alt-${id}`;
    const texto = alt.querySelector(".crm__alt-input");
    texto.id = `crm-alt-${id}`;
    texto.name = `alternativa-${id}`;
    const radio = alt.querySelector('input[type="radio"]');
    radio.id = `crm-ok-${id}`;
    radio.value = id;
    alt.querySelector(".crm__marcar").htmlFor = `crm-ok-${id}`;
    alt.querySelector(".crm__borrar").setAttribute("aria-label", `Eliminar alternativa ${letra}`);
  });
  const botonAnadir = document.querySelector("#boton-anadir-alternativa");
  if (botonAnadir) botonAnadir.hidden = formRetoOpcion.querySelectorAll(".crm__alt").length >= letrasAlternativas.length;
};

const anadirAlternativa = () => {
  const cantidad = formRetoOpcion.querySelectorAll(".crm__alt").length;
  if (cantidad >= letrasAlternativas.length) return;
  formRetoOpcion.querySelector(".crm__alternativas").insertAdjacentHTML("beforeend", crearHtmlAlternativa(letrasAlternativas[cantidad]));
  renumerarAlternativas();
  actualizarPreviaOpcion();
};

const quitarAlternativa = (alternativa) => {
  if (formRetoOpcion.querySelectorAll(".crm__alt").length <= 2) {
    mostrarErrorAlternativas("Un reto necesita al menos 2 alternativas.");
    return;
  }
  alternativa.remove();
  renumerarAlternativas();
  actualizarPreviaOpcion();
};

// Mensaje de error de las alternativas (no están dentro de un .campo, así que se crea uno)
const mostrarErrorAlternativas = (mensaje) => {
  let zona = document.querySelector("#error-alternativas");
  if (!zona) {
    zona = document.createElement("div");
    zona.className = "campo";
    zona.id = "error-alternativas";
    zona.innerHTML = '<p class="campo__error" role="alert"></p>';
    formRetoOpcion.querySelector(".crm__alternativas").after(zona);
  }
  zona.querySelector(".campo__error").textContent = mensaje || "";
  zona.classList.toggle("campo--error", Boolean(mensaje));
};

const leerFormularioOpcion = () => {
  const f = formRetoOpcion;
  const alternativas = [...f.querySelectorAll(".crm__alt-input")].map((i) => i.value.trim());
  const marcada = f.querySelector('input[name="correcta"]:checked');
  return {
    titulo: f.querySelector("#crm-titulo").value.trim(),
    tema: f.querySelector("#crm-tema").selectedOptions[0].textContent,
    fecha: f.querySelector("#crm-fecha").value,
    xp: leerRecompensaReto(f.querySelector("#crm-recompensa").value),
    pregunta: f.querySelector("#crm-pregunta").value.trim(),
    alternativas,
    correcta: marcada ? marcada.value.toUpperCase() : "",
    explicacion: f.querySelector("#crm-explicacion").value.trim(),
  };
};

const actualizarPreviaOpcion = () => {
  const datos = leerFormularioOpcion();
  document.querySelector(".crm__mini-pregunta").textContent = datos.pregunta || "Escribe la pregunta";
  document.querySelector(".crm__mini-lista").innerHTML = datos.alternativas
    .map((texto, i) => `<li class="crm__mini-opcion"><span class="crm__mini-letra">${letrasAlternativas[i]}</span> ${escaparHtml(texto) || "…"}</li>`)
    .join("");
  const llenas = datos.alternativas.filter(Boolean).length;
  pintarListaPrevia(".crm__lista .crm__item", ".crm__caja .crm__chip", [
    datos.pregunta.length >= 10,
    llenas >= 2 && llenas === datos.alternativas.length,
    Boolean(datos.correcta),
    Boolean(datos.fecha) && datos.fecha >= sumarDiasReto(0),
  ]);
};

const validarFormularioOpcion = () => {
  let primerError = validarDatosBaseReto(formRetoOpcion, "crm");
  const pregunta = formRetoOpcion.querySelector("#crm-pregunta");
  const datos = leerFormularioOpcion();
  mostrarErrorAlternativas("");

  if (datos.pregunta.length < 10) {
    mostrarErrorReto(pregunta, "Escribe la pregunta (mínimo 10 caracteres).");
    primerError = primerError || pregunta;
  }
  const vacia = [...formRetoOpcion.querySelectorAll(".crm__alt-input")].find((i) => !i.value.trim());
  if (vacia) {
    mostrarErrorAlternativas("Completa el texto de todas las alternativas, o elimina las que no uses.");
    primerError = primerError || vacia;
  } else if (!datos.correcta) {
    mostrarErrorAlternativas("Marca cuál es la alternativa correcta.");
    primerError = primerError || formRetoOpcion.querySelector(".crm__marcar");
  }
  if (primerError) primerError.focus();
  return !primerError;
};

const guardarRetoOpcion = (sesion, estado) => {
  const { alternativas, ...resto } = leerFormularioOpcion();
  return crearReto({ correoLider: sesion.correo, tipo: "opcion-multiple", dificultad: "Media", ...resto, alternativas, estado });
};

// Los dos botones del formulario (publicar y guardar borrador) hacen lo mismo en ambos tipos
const conectarBotonesCreacion = (formulario, sesion, validar, guardar, validarBorrador) => {
  // Solo los botones del bloque de acciones (crc__acciones o crm__acciones), no el de «Añadir alternativa»
  const botones = formulario.querySelectorAll('[class$="__acciones"] .boton');
  const botonPublicar = botones[0];
  const botonBorrador = botones[1];

  botonPublicar.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarErroresReto(formulario);
    if (!validar()) return;
    const reto = guardar(sesion, "publicado");
    location.href = `reto-publicado.html?id=${reto.id}#reto-publicado`;
  });
  botonBorrador.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarErroresReto(formulario);
    if (!validarBorrador()) return;
    guardar(sesion, "borrador");
    location.href = botonBorrador.href;
  });
};

// ----- Reto publicado (resumen del reto y botón para publicar) -----
const mostrarRetoPublicado = (sesion, reto, party) => {
  const estudiantes = obtenerEstudiantesDeLider(sesion.correo);
  const esCodigo = reto.tipo === "codigo";
  const enunciado = esCodigo ? reto.indicaciones : reto.pregunta;

  document.title = `${reto.titulo} · BranchMatch`;
  document.querySelector(".rp__subtitulo").textContent = `${party ? party.nombre : "Tu party"} · El reto se publicará para toda tu party.`;
  document.querySelector("#rp-titulo").value = reto.titulo;
  document.querySelector("#rp-tema").value = reto.tema;
  document.querySelectorAll(".rp__chips .rp__chip").forEach((chip) => {
    const activo = chip.textContent.trim() === reto.dificultad;
    chip.classList.toggle("rp__chip--activo", activo);
    if (activo) chip.setAttribute("aria-current", "true");
    else chip.removeAttribute("aria-current");
  });
  document.querySelector("#rp-fecha").value = reto.fecha.split("-").reverse().join(" / ");
  document.querySelector("#rp-recompensa").value = `+${reto.xp} XP`;
  document.querySelector("#rp-enunciado").value = enunciado;

  // El bloque de ejemplo muestra el link (código) o las alternativas (opción múltiple)
  document.querySelector(".rp__ejemplo .campo__label").textContent = esCodigo ? "Link del problema" : "Alternativas";
  document.querySelector(".rp__codigo-archivo").lastChild.textContent = esCodigo ? plataformasReto[reto.plataforma].nombre : "alternativas";
  document.querySelector(".rp__pre").textContent = esCodigo
    ? reto.link
    : reto.alternativas.map((a, i) => `${letrasAlternativas[i] === reto.correcta ? "✓" : " "} ${letrasAlternativas[i]}) ${a}`).join("\n");
  document.querySelector(".rp__casos").remove();

  const textosLista = document.querySelectorAll(".rp__lista .rp__item");
  textosLista[2].lastChild.textContent = esCodigo ? " Link del problema" : " Alternativas y respuesta correcta";
  document.querySelector(".rp__asignar .rp__etiqueta").textContent = `Toda la party (${estudiantes.length} ${estudiantes.length === 1 ? "integrante" : "integrantes"})`;

  document.querySelector(".rp__mini .rp__etiqueta--celeste").textContent = reto.tema;
  document.querySelector(".rp__mini-titulo").textContent = reto.titulo;
  document.querySelector(".rp__mini-fecha").textContent = `Entrega: ${formatearFechaReto(reto.fecha)} · +${reto.xp} XP`;
  document.querySelector(".rp__mini .rp__etiqueta--borde").textContent = reto.dificultad;

  document.querySelector(".rp__modal-texto").textContent = `«${reto.titulo}» ya está disponible para ${estudiantes.length === 1 ? "el integrante" : `los ${estudiantes.length} integrantes`} de ${party ? party.nombre : "tu party"}. Te avisaremos cuando lleguen las entregas.`;
  document.querySelector(".rp__modal-fecha").lastChild.textContent = ` ${formatearFechaReto(reto.fecha)} · +${reto.xp} XP`;
  document.querySelector(".rp__modal-acciones .boton").textContent = "Ver retos";
};

// Un reto ya publicado no se vuelve a publicar: el botón principal pasa a "Volver a retos"
const prepararBotonesRetoPublicado = (reto) => {
  const botonPrincipal = formRetoPublicado.querySelector(".rp__acciones .boton");
  if (reto.estado === "publicado") {
    botonPrincipal.textContent = "Volver a retos";
    formRetoPublicado.querySelector(".rp__acciones .boton--secundario").remove();
    return;
  }
  botonPrincipal.addEventListener("click", (e) => {
    e.preventDefault();
    editarReto(reto.id, { estado: "publicado", avisado: true });
    notificarRetoPublicado(reto);
    location.hash = "reto-publicado";
  });
};

// Avisa a los estudiantes de la party que hay un reto nuevo
const notificarRetoPublicado = (reto) => {
  obtenerEstudiantesDeLider(reto.correoLider).forEach((correo) => {
    crearNotificacion(correo, `Hay un reto nuevo: ${reto.titulo}. Entrega: ${formatearFechaReto(reto.fecha)}.`, {
      tipo: "reto",
      titulo: "Nuevo reto en tu party",
      datos: [{ nombre: "Tema", valor: reto.tema }, { nombre: "Recompensa", valor: `+${reto.xp} XP` }],
      enlace: `estudiante/${reto.tipo === "codigo" ? "reto-codigo" : "reto-opcion-multiple"}.html?id=${reto.id}`,
      textoEnlace: "Ver el reto",
    });
  });
};


// ===== Validaciones =====
// Para guardar un borrador solo hace falta el título
const validarTituloBorrador = (formulario, prefijo) => {
  const titulo = formulario.querySelector(`#${prefijo}-titulo`);
  if (titulo.value.trim().length < 3) {
    mostrarErrorReto(titulo, "Escribe un título de al menos 3 caracteres para guardar el borrador.");
    titulo.focus();
    return false;
  }
  return true;
};


// ===== Registro de eventos =====
// Se espera a DOMContentLoaded para que entregas.js, perfil.js y party.js ya estén cargados
document.addEventListener("DOMContentLoaded", () => {
  const sesion = obtenerSesion();
  if (!sesion) return;

  if (listaRetosEstudiante) {
    llenarFiltrosRetosEstudiante(obtenerRetosDeEstudiante(sesion.correo));
    mostrarRetosEstudiante(sesion);
    formFiltrosRetos.addEventListener("submit", (e) => e.preventDefault());
    formFiltrosRetos.addEventListener("input", () => mostrarRetosEstudiante(sesion));
    formFiltrosRetos.addEventListener("change", () => mostrarRetosEstudiante(sesion));
  }

  if (listaRetosLider) {
    mostrarRetosLider(sesion);
    buscadorRetosLider.closest("form").addEventListener("submit", (e) => e.preventDefault());
    buscadorRetosLider.addEventListener("input", () => mostrarRetosLider(sesion));
    filtrosRetosLider.addEventListener("click", (e) => {
      const pildora = e.target.closest("a[data-filtro]");
      if (!pildora) return;
      e.preventDefault();
      filtroRetosLider = pildora.dataset.filtro;
      mostrarRetosLider(sesion);
    });
  }

  if (formRetoCodigo) {
    prepararFormularioNuevoReto(formRetoCodigo, "crc");
    formRetoCodigo.querySelector("#crc-link").value = "";
    formRetoCodigo.querySelector("#crc-indicaciones").value = "";
    actualizarPreviaCodigo();
    formRetoCodigo.addEventListener("input", actualizarPreviaCodigo);
    formRetoCodigo.addEventListener("change", actualizarPreviaCodigo);
    conectarBotonesCreacion(formRetoCodigo, sesion, validarFormularioCodigo, guardarRetoCodigo, () => validarTituloBorrador(formRetoCodigo, "crc"));
  }

  if (formRetoOpcion) {
    prepararFormularioNuevoReto(formRetoOpcion, "crm");
    formRetoOpcion.querySelector("#crm-pregunta").value = "";
    formRetoOpcion.querySelector("#crm-explicacion").value = "";
    formRetoOpcion.querySelectorAll(".crm__alt-input").forEach((i) => (i.value = ""));
    formRetoOpcion.querySelectorAll('input[name="correcta"]').forEach((r) => (r.checked = false));
    formRetoOpcion.querySelector(".crm__alternativas").insertAdjacentHTML("afterend", '<a class="boton boton--secundario" id="boton-anadir-alternativa" href="#">+ Añadir alternativa</a>');
    actualizarPreviaOpcion();
    formRetoOpcion.addEventListener("input", actualizarPreviaOpcion);
    formRetoOpcion.addEventListener("change", actualizarPreviaOpcion);
    formRetoOpcion.addEventListener("click", (e) => {
      const borrar = e.target.closest(".crm__borrar");
      if (borrar) {
        e.preventDefault();
        quitarAlternativa(borrar.closest(".crm__alt"));
      }
      if (e.target.closest("#boton-anadir-alternativa")) {
        e.preventDefault();
        anadirAlternativa();
      }
    });
    conectarBotonesCreacion(formRetoOpcion, sesion, validarFormularioOpcion, guardarRetoOpcion, () => validarTituloBorrador(formRetoOpcion, "crm"));
  }

  if (formRetoPublicado) {
    const reto = obtenerReto(idRetoDireccion);
    if (!reto || reto.correoLider !== sesion.correo) {
      location.replace("retos.html");
      return;
    }
    mostrarRetoPublicado(sesion, reto, obtenerPartyDe(sesion.correo));
    prepararBotonesRetoPublicado(reto);
    // Si el reto se acaba de publicar desde el formulario, se avisa a la party una sola vez
    if (reto.estado === "publicado" && location.hash === "#reto-publicado" && !reto.avisado) {
      notificarRetoPublicado(reto);
      editarReto(reto.id, { avisado: true });
    }
  }
});
