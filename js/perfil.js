// Perfiles de estudiantes y líderes: datos, formularios de perfil, vista del perfil y Player Card.
// Páginas: estudiante/completa-perfil, personaliza-perfil, perfil; lider/configura-perfil, personaliza-perfil, perfil, player-card.
// Responsable: P2 (Perfiles y party).

// ===== Elementos =====
const formCompletaPerfil = document.querySelector(".completa__form");
const vistaPreviaPerfil = document.querySelector(".completa__preview");
const formPersonalizaPerfil = document.querySelector(".personaliza__form");
const formConfiguraPerfil = document.querySelector("form.cfg__tarjeta");
const tarjetaPerfil = document.querySelector(".perfil__tarjeta");
const cabeceraPlayerCard = document.querySelector(".pc__cabecera");

// Con ?correo=jack@... en la dirección, la Player Card muestra a ese jugador
const correoPlayerCard = new URLSearchParams(location.search).get("correo");


// ===== Datos =====
const CLAVE_PERFILES = "bm_perfiles";

const opcionesInteresesPerfil = ["Algoritmos", "Grafos", "Programación dinámica", "Strings", "Matemática", "Geometría"];
const opcionesMetasPerfil = ["Clasificar a la ICPC", "Dominar DP", "Mejorar mi velocidad", "Ganar un concurso", "Aprender en equipo", "Conseguir prácticas"];
const opcionesLenguajesPerfil = ["C++", "Python", "Java", "JavaScript", "Kotlin", "C#"];
const opcionesTemasPerfil = ["Grafos", "DP", "Geometría", "Strings", "Matemática"];
const estadisticasPerfil = [
  { clave: "algoritmos", nombre: "Algoritmos" },
  { clave: "estructuras", nombre: "Estructuras de datos" },
  { clave: "matematica", nombre: "Matemática" },
  { clave: "velocidad", nombre: "Velocidad" },
];
const coloresChipPerfil = ["chip--celeste", "chip--menta", ""];

// Un perfil por correo (estudiante o líder). "nombre" solo se usa si la persona no tiene cuenta
const perfilesIniciales = [
  { correo: "estudiante1@branchmatch.test", jugador: "@tomas_dev", github: "https://github.com/tomascampos", biografia: "Me gustan los grafos y los strings. Entreno todos los días para la ICPC.", lenguajes: ["C++", "Python", "Java", "JavaScript"], temas: ["Grafos", "Strings"], intereses: ["Grafos", "Programación dinámica"], metas: ["Clasificar a la ICPC", "Dominar DP"], stats: { algoritmos: 82, estructuras: 70, matematica: 64, velocidad: 75 }, logros: ["Top 3 regional", "50 problemas", "Racha 7 días", "Primer merge"], racha: 130, ubicacion: "Lima, Perú", carrera: "Ing. de Sistemas" },
  { correo: "estudiante2@branchmatch.test", jugador: "@ana_gtz", github: "https://github.com/anagutierrez", biografia: "Empecé hace poco con la programación competitiva y busco un equipo con quien practicar.", lenguajes: ["Python", "C++"], temas: ["Matemática"], intereses: ["Algoritmos"], metas: ["Aprender en equipo"], stats: { algoritmos: 40, estructuras: 35, matematica: 50, velocidad: 45 }, logros: ["Primer reto"], racha: 12, ubicacion: "Lima, Perú", carrera: "Ing. de Software" },
  { correo: "lider1@branchmatch.test", nivel: 7, jugador: "@edson_mendiolaza", github: "https://github.com/edsonmendiolaza", biografia: "Líder de Los Insanos. Rumbo a la ICPC regional.", lenguajes: ["C++", "Java"], temas: ["Grafos", "DP"], intereses: ["Algoritmos", "Grafos"], metas: ["Clasificar a la ICPC"], stats: { algoritmos: 90, estructuras: 85, matematica: 70, velocidad: 88 }, logros: ["ICPC regional", "Líder de party"], racha: 45, ubicacion: "Lima, Perú", carrera: "Ing. de Software", foto: "assets/img/edson-foto.png" },
  { correo: "lider2@branchmatch.test", nivel: 5, jugador: "@jack_lima", github: "", biografia: "Líder de Los Chacales.", lenguajes: ["C++"], temas: ["Grafos"], intereses: ["Algoritmos"], metas: ["Ganar un concurso"], stats: { algoritmos: 75, estructuras: 70, matematica: 60, velocidad: 70 }, logros: ["Líder de party"], racha: 20, ubicacion: "Lima, Perú", carrera: "Ing. de Sistemas" },
  { correo: "lider3@branchmatch.test", nivel: 5, jugador: "@valeria_rios", github: "", biografia: "Líder de Code Ninjas.", lenguajes: ["Python"], temas: ["Strings"], intereses: ["Strings"], metas: ["Aprender en equipo"], stats: { algoritmos: 65, estructuras: 60, matematica: 55, velocidad: 60 }, logros: ["Líder de party"], racha: 15, ubicacion: "Lima, Perú", carrera: "Ing. de Software" },
  { correo: "lider4@branchmatch.test", nivel: 4, jugador: "@camila_torres", github: "", biografia: "Líder de Merge Masters.", lenguajes: ["Java"], temas: ["Matemática"], intereses: ["Matemática"], metas: ["Mejorar mi velocidad"], stats: { algoritmos: 60, estructuras: 55, matematica: 65, velocidad: 55 }, logros: ["Líder de party"], racha: 10, ubicacion: "Lima, Perú", carrera: "Ing. de Sistemas" },
  { correo: "lider5@branchmatch.test", nivel: 6, jugador: "@marco_pena", github: "", biografia: "Líder de Los Algoritmos.", lenguajes: ["C++", "Python"], temas: ["DP", "Grafos"], intereses: ["Programación dinámica"], metas: ["Clasificar a la ICPC"], stats: { algoritmos: 88, estructuras: 80, matematica: 75, velocidad: 85 }, logros: ["Top 3 regional", "Líder de party"], racha: 60, ubicacion: "Lima, Perú", carrera: "Ing. de Software" },
  // Postulantes de ejemplo de las solicitudes (no tienen cuenta para iniciar sesión)
  { correo: "jack@branchmatch.test", nombre: "Jack", jugador: "@jack_cat", github: "https://github.com/jackcat", biografia: "Me gusta el código limpio y los gatos.", lenguajes: ["C++"], temas: ["Grafos", "DP"], intereses: ["ICPC", "Codeforces"], metas: ["Clasificar a la ICPC"], stats: { algoritmos: 78, estructuras: 72, matematica: 66, velocidad: 70 }, logros: ["50 problemas"], racha: 30, ubicacion: "Lima, Perú", carrera: "Ing. de Sistemas", foto: "assets/img/jack-foto.png", nivel: 5 },
  { correo: "lucia@branchmatch.test", nombre: "Lucía", jugador: "@lucia_py", github: "", biografia: "Strings y matemática son lo mío.", lenguajes: ["Python"], temas: ["Strings", "Matemática"], intereses: ["Strings"], metas: ["Ganar un concurso"], stats: { algoritmos: 60, estructuras: 55, matematica: 80, velocidad: 58 }, logros: ["Primer reto"], racha: 8, ubicacion: "Lima, Perú", carrera: "Ing. de Software", nivel: 4 },
  { correo: "mateo@branchmatch.test", nombre: "Mateo", jugador: "@mateo_geo", github: "", biografia: "Geometría computacional y Kotlin.", lenguajes: ["Java", "Kotlin"], temas: ["Geometría"], intereses: ["Geometría"], metas: ["Mejorar mi velocidad"], stats: { algoritmos: 80, estructuras: 75, matematica: 85, velocidad: 72 }, logros: ["Top 3 regional"], racha: 40, ubicacion: "Lima, Perú", carrera: "Ing. de Sistemas", nivel: 6 },
];

const obtenerPerfiles = () => leerDatos(CLAVE_PERFILES, perfilesIniciales);

const crearPerfilVacio = (correo) => ({
  correo,
  jugador: "",
  github: "",
  biografia: "",
  lenguajes: [],
  temas: [],
  intereses: [],
  metas: [],
  stats: { algoritmos: 0, estructuras: 0, matematica: 0, velocidad: 0 },
  logros: [],
  racha: 0,
  ubicacion: "",
  carrera: "",
});

// Devuelve el perfil guardado o uno vacío (sin guardarlo) si la persona aún no lo completó
const obtenerPerfil = (correo) => obtenerPerfiles().find((p) => p.correo === correo) || crearPerfilVacio(correo);

const crearPerfil = (perfil) => {
  const perfiles = obtenerPerfiles().filter((p) => p.correo !== perfil.correo);
  perfiles.push({ ...crearPerfilVacio(perfil.correo), ...perfil });
  guardarDatos(CLAVE_PERFILES, perfiles);
};

// Cambia solo los campos indicados; si la persona no tenía perfil, lo crea
const editarPerfil = (correo, cambios) => {
  crearPerfil({ ...obtenerPerfil(correo), ...cambios, correo });
};

const borrarPerfil = (correo) => {
  guardarDatos(CLAVE_PERFILES, obtenerPerfiles().filter((p) => p.correo !== correo));
};


// ===== Funciones =====
// Nombre completo: el de la cuenta; si no tiene cuenta, el que trae su perfil
const obtenerNombrePerfil = (correo) => {
  const usuario = obtenerUsuarios().find((u) => u.correo === correo);
  return usuario ? usuario.nombre : obtenerPerfil(correo).nombre || correo;
};

// Nivel que se muestra como "LV n": sale de la XP; si no tiene XP, el nivel de ejemplo del perfil
const obtenerNivelJugador = (correo) => {
  const xp = obtenerXp(correo);
  return xp > 0 ? calcularNivelNumero(xp) : obtenerPerfil(correo).nivel || 1;
};

// Porcentaje de la barra de XP dentro del nivel actual (100 XP por nivel)
const obtenerProgresoNivel = (correo) => obtenerXp(correo) % XP_POR_NIVEL;

// Los anchos de las barras son clases p2-ancho--0, --5 ... --100
const redondearAncho = (valor) => Math.round(Math.min(100, Math.max(0, Number(valor) || 0)) / 5) * 5;

// Porcentaje del perfil completado (5 datos, 20 % cada uno)
const calcularCompletitudPerfil = (perfil) => {
  const datos = [perfil.jugador, perfil.github, perfil.biografia, perfil.lenguajes.length, perfil.intereses.length + perfil.temas.length];
  return datos.filter(Boolean).length * 20;
};

const crearHtmlChips = (lista, claseExtra = "") =>
  lista.map((texto, i) => `<li><span class="chip ${coloresChipPerfil[i % 3]} ${claseExtra}">${escaparHtml(texto)}</span></li>`).join("");

// Pinta las casillas de una lista (intereses, metas, lenguajes...) con las opciones marcadas
const crearHtmlCasillas = (nombre, opciones, marcadas, clases) =>
  opciones
    .map(
      (opcion) => `
      <li><label class="${clases.opcion}"><input class="${clases.casilla}" type="checkbox" name="${nombre}" value="${escaparHtml(opcion)}"${marcadas.includes(opcion) ? " checked" : ""}>${clases.texto ? `<span class="${clases.texto}">${escaparHtml(opcion)}</span>` : `<span>${escaparHtml(opcion)}</span>`}</label></li>`
    )
    .join("");

const obtenerMarcadas = (formulario, nombre) => [...formulario.querySelectorAll(`input[name="${nombre}"]:checked`)].map((c) => c.value);

// Llena un grupo de casillas del formulario según el nombre de sus inputs
const llenarGrupoCasillas = (formulario, nombre, opciones, marcadas, clases) => {
  const primera = formulario.querySelector(`input[name="${nombre}"]`);
  if (!primera) return;
  const lista = primera.closest("ul");
  const extras = marcadas.filter((m) => !opciones.includes(m));
  lista.innerHTML = crearHtmlCasillas(nombre, [...opciones, ...extras], marcadas, clases);
};

// ----- Formularios de perfil (completa, personaliza y configura) -----
const clasesCasillasCompleta = { opcion: "completa__opcion", casilla: "completa__check visualmente-oculto", texto: "completa__opcion-texto" };
const clasesCasillasTemas = { opcion: "completa__opcion completa__opcion--tema", casilla: "completa__check visualmente-oculto", texto: "completa__opcion-texto" };
const clasesCasillasPersonaliza = { opcion: "personaliza__opcion", casilla: "personaliza__check", texto: "" };
const clasesCasillasConfigura = { opcion: "cfg__opcion", casilla: "cfg__check", texto: "cfg__opcion-texto" };

const llenarFormularioPerfil = (formulario, sesion, clases) => {
  const perfil = obtenerPerfil(sesion.correo);
  const campoJugador = formulario.querySelector("#jugador");
  if (campoJugador) campoJugador.value = perfil.jugador;
  formulario.querySelector("#github").value = perfil.github;
  formulario.querySelector("#biografia").value = perfil.biografia;

  llenarGrupoCasillas(formulario, "intereses", opcionesInteresesPerfil, perfil.intereses, clases);
  llenarGrupoCasillas(formulario, "metas", opcionesMetasPerfil, perfil.metas, clases);
  llenarGrupoCasillas(formulario, "lenguajes", opcionesLenguajesPerfil, perfil.lenguajes, clases);
  llenarGrupoCasillas(formulario, "temas", opcionesTemasPerfil, perfil.temas, clasesCasillasTemas);

  // En "Completa tu perfil" la lista de lenguajes termina con el enlace "+ Añadir"
  if (formulario === formCompletaPerfil) {
    const listaLenguajes = formulario.querySelector('input[name="lenguajes"]').closest("ul");
    listaLenguajes.insertAdjacentHTML("beforeend", '<li><a class="completa__opcion-texto" href="#" data-accion="anadir-lenguaje">+ Añadir</a></li>');
  }
};

const anadirLenguajePerfil = () => {
  const texto = prompt("¿Qué lenguaje quieres añadir?");
  const nombre = texto ? texto.trim().slice(0, 20) : "";
  if (!nombre) return;
  const lista = formCompletaPerfil.querySelector('input[name="lenguajes"]').closest("ul");
  const yaExiste = [...lista.querySelectorAll("input")].some((c) => c.value.toLowerCase() === nombre.toLowerCase());
  if (yaExiste) return;
  const marcadas = obtenerMarcadas(formCompletaPerfil, "lenguajes");
  const todas = [...lista.querySelectorAll("input")].map((c) => c.value);
  llenarGrupoCasillas(formCompletaPerfil, "lenguajes", todas, [...marcadas, nombre], clasesCasillasCompleta);
  lista.insertAdjacentHTML("beforeend", '<li><a class="completa__opcion-texto" href="#" data-accion="anadir-lenguaje">+ Añadir</a></li>');
  actualizarVistaPreviaPerfil();
};

// Guarda lo que haya en el formulario (solo los campos que existen en esa página)
const guardarPerfilDesdeFormulario = (formulario, sesion) => {
  const cambios = {
    github: normalizarGithub(formulario.querySelector("#github").value),
    biografia: formulario.querySelector("#biografia").value.trim(),
  };
  ["intereses", "metas", "lenguajes", "temas"].forEach((nombre) => {
    if (formulario.querySelector(`input[name="${nombre}"]`)) cambios[nombre] = obtenerMarcadas(formulario, nombre);
  });
  const campoJugador = formulario.querySelector("#jugador");
  if (campoJugador) cambios.jugador = "@" + campoJugador.value.trim().replace(/^@/, "");
  editarPerfil(sesion.correo, cambios);
};

const enviarFormularioPerfil = (e, formulario, boton) => {
  e.preventDefault();
  const sesion = obtenerSesion();
  limpiarErroresPerfil(formulario);
  if (!validarFormularioPerfil(formulario)) return;
  guardarPerfilDesdeFormulario(formulario, sesion);
  location.href = boton.href;
};

// ----- Vista previa de "Completa tu perfil" -----
const crearHtmlEstadistica = (prefijo, nombre, valor) => `
  <li class="${prefijo}__stat">
    <span class="${prefijo}__stat-nombre">${escaparHtml(nombre)}</span>
    <span class="${prefijo}__stat-barra"><span class="${prefijo}__stat-relleno p2-ancho--${redondearAncho(valor)}"></span></span>
    <span class="${prefijo === "pc" ? "pc__stat-valor" : "texto-stats"}">${Number(valor) || 0}</span>
  </li>`;

// Barra de XP del nivel (la usan la vista previa y la Player Card)
const pintarBarraXp = (contenedor, correo) => {
  contenedor.querySelector(".barra-xp__nivel").textContent = `LV ${obtenerNivelJugador(correo)}`;
  contenedor.querySelector(".barra-xp__encabezado span:last-child").textContent = `${obtenerProgresoNivel(correo)} / ${XP_POR_NIVEL} XP`;
  contenedor.querySelector(".barra-xp__relleno").className = `barra-xp__relleno p2-ancho--${redondearAncho(obtenerProgresoNivel(correo))}`;
};

const actualizarVistaPreviaPerfil = () => {
  const sesion = obtenerSesion();
  if (!sesion || !vistaPreviaPerfil) return;
  const perfil = obtenerPerfil(sesion.correo);
  const lenguajes = obtenerMarcadas(formCompletaPerfil, "lenguajes");
  const temas = obtenerMarcadas(formCompletaPerfil, "temas");
  const jugador = formCompletaPerfil.querySelector("#jugador").value.trim();

  vistaPreviaPerfil.querySelector(".avatar").textContent = obtenerIniciales(sesion.nombre);
  vistaPreviaPerfil.querySelector(".completa__nombre").textContent = sesion.nombre;
  vistaPreviaPerfil.querySelector(".completa__usuario").textContent = jugador ? "@" + jugador.replace(/^@/, "") : "@tu_usuario";
  vistaPreviaPerfil.querySelector(".completa__nivel").textContent = `LV ${obtenerNivelJugador(sesion.correo)}`;
  vistaPreviaPerfil.querySelector(".completa__especialidad").textContent = temas.length ? temas.join(" · ") : "Aún sin elegir";

  const bloques = vistaPreviaPerfil.querySelectorAll(".completa__tags");
  bloques[0].innerHTML = lenguajes.length ? crearHtmlChips(lenguajes, "completa__tag") : '<li class="texto-secundario">Aún sin elegir</li>';
  bloques[1].innerHTML = perfil.logros.length
    ? perfil.logros.map((logro) => `<li><span class="chip chip--logro">${escaparHtml(logro)}</span></li>`).join("")
    : '<li class="texto-secundario">Aún sin logros</li>';
  vistaPreviaPerfil.querySelector(".completa__stats-lista").innerHTML = estadisticasPerfil
    .map((e) => crearHtmlEstadistica("completa", e.nombre, perfil.stats[e.clave]))
    .join("");
  pintarBarraXp(vistaPreviaPerfil.querySelector(".completa__xp"), sesion.correo);
};

// ----- Perfil (estudiante y líder) -----
const textosFaltantePerfil = [
  { falta: (p) => !p.biografia, texto: "Agrega tu biografía para que te conozcan mejor." },
  { falta: (p) => !p.github, texto: "Agrega tu repositorio de GitHub." },
  { falta: (p) => !p.jugador, texto: "Elige tu nombre de jugador." },
  { falta: (p) => !p.lenguajes.length, texto: "Elige los lenguajes que dominas." },
  { falta: (p) => !p.intereses.length && !p.temas.length, texto: "Elige tus intereses." },
];

const mostrarAvisoPerfil = (perfil) => {
  const aviso = document.querySelector(".perfil__aviso");
  if (!aviso) return;
  const porcentaje = calcularCompletitudPerfil(perfil);
  const pendiente = textosFaltantePerfil.find((t) => t.falta(perfil));
  if (!pendiente) {
    aviso.remove();
    return;
  }
  aviso.querySelector(".perfil__aviso-titulo").textContent = `Tu perfil está al ${porcentaje} %`;
  aviso.querySelector(".perfil__aviso-texto").textContent = pendiente.texto;
};

// Datos de la party para el perfil: party.js los provee si la página lo carga
const mostrarGrupoPerfil = (sesion) => {
  const enlace = document.querySelector(".perfil__grupo-enlace");
  const nombre = document.querySelector(".perfil__grupo-nombre");
  const detalle = document.querySelector(".perfil__grupo-detalle");
  if (!enlace || typeof obtenerPartyDe !== "function") return;
  const party = obtenerPartyDe(sesion.correo);
  const esLider = sesion.rol === "lider";

  if (!party) {
    nombre.textContent = esLider ? "Aún no tienes party" : "Aún no tienes grupo";
    detalle.textContent = esLider ? "Crea la tuya" : "Explora parties";
    if (enlace.tagName === "A") enlace.href = esLider ? "crea-party.html" : "unete-party.html";
    return;
  }
  nombre.textContent = `${esLider ? "Party" : "Grupo"}: ${party.nombre}`;
  detalle.textContent = esLider
    ? `Nivel ${formatearRangoNivel(party.nivel)}`
    : `Nivel ${formatearRangoNivel(party.nivel)} · Líder: ${obtenerNombrePerfil(party.correoLider).split(" ")[0]}`;
};

const mostrarPerfil = (sesion) => {
  const perfil = obtenerPerfil(sesion.correo);
  const esLider = sesion.rol === "lider";
  const fotoPerfil = document.querySelector(".perfil__foto-img");

  fotoPerfil.alt = `Foto de perfil de ${sesion.nombre}`;
  document.querySelector(".perfil__nombre").textContent = sesion.nombre;
  document.querySelector(".perfil__usuario").textContent = [perfil.jugador || "@sin_usuario", perfil.carrera].filter(Boolean).join(" · ");

  const insignias = esLider
    ? '<li class="chip chip--amarillo perfil__insignia">Líder</li>'
    : `<li class="chip chip--amarillo perfil__insignia"><img class="perfil__insignia-icono" src="../../assets/icons/trofeo.svg" alt="">LV ${obtenerNivelJugador(sesion.correo)}</li>
       <li class="chip chip--rosa perfil__insignia"><img class="perfil__insignia-icono" src="../../assets/icons/fuego.svg" alt="">${perfil.racha} días</li>`;
  document.querySelector(".perfil__insignias").innerHTML = insignias;

  mostrarAvisoPerfil(perfil);
  mostrarGrupoPerfil(sesion);
};

// ----- Player Card (la ve el líder) -----
const mostrarPlayerCard = (correo) => {
  const perfil = obtenerPerfil(correo);
  const nombre = obtenerNombrePerfil(correo);
  const nivel = obtenerNivelJugador(correo);
  const secciones = document.querySelectorAll(".pc__mas .pc__seccion");

  document.title = `Player Card de ${nombre} · BranchMatch`;
  document.querySelector(".pc__avatar").textContent = obtenerIniciales(nombre);
  document.querySelector(".pc__nombre").textContent = nombre;
  document.querySelector(".pc__nivel").textContent = `LV ${nivel}`;
  document.querySelector(".pc__usuario").textContent = perfil.jugador || "@sin_usuario";
  document.querySelector(".pc__racha").innerHTML = `<img class="pc__racha-icono" src="../../assets/icons/pc-fuego.svg" alt="">${perfil.racha} días de racha`;
  document.querySelector(".pc__especialidad-texto").textContent = perfil.temas.length ? perfil.temas.join(" · ") : "Sin definir";
  pintarBarraXp(document.querySelector(".pc__xp"), correo);

  document.querySelector(".pc__lenguajes .pc__chips").innerHTML = perfil.lenguajes.length
    ? perfil.lenguajes.map((l, i) => `<li class="chip ${coloresChipPerfil[i % 3]} pc__chip">${escaparHtml(l)}</li>`).join("")
    : '<li class="texto-secundario">Sin lenguajes</li>';

  const enlaceGithub = document.querySelector(".pc__enlace");
  if (perfil.github) {
    enlaceGithub.href = perfil.github;
    enlaceGithub.innerHTML = `${escaparHtml(perfil.github.replace(/^https?:\/\//, ""))} <span class="pc__externo" aria-hidden="true">↗</span>`;
  } else {
    enlaceGithub.removeAttribute("href");
    enlaceGithub.textContent = "No agregó su repositorio";
  }

  document.querySelector(".pc__stats-lista").innerHTML = estadisticasPerfil
    .map((e) => crearHtmlEstadistica("pc", e.nombre, perfil.stats[e.clave]))
    .join("");
  document.querySelector(".pc__logros .pc__chips").innerHTML = perfil.logros.length
    ? perfil.logros.map((l) => `<li class="chip chip--logro pc__chip">${escaparHtml(l)}</li>`).join("")
    : '<li class="texto-secundario">Aún sin logros</li>';

  const lista = (textos, clase, vacio) =>
    textos.length ? textos.map((t) => `<li class="pc__item ${clase}">${escaparHtml(t)}</li>`).join("") : `<li class="texto-secundario">${vacio}</li>`;
  secciones[0].querySelector(".pc__lista").innerHTML = lista([perfil.ubicacion, perfil.carrera].filter(Boolean), "pc__item--celeste", "Sin información");
  secciones[1].querySelector(".pc__chips").innerHTML = perfil.intereses.length
    ? perfil.intereses.map((i) => `<li class="chip chip--menta pc__chip">${escaparHtml(i)}</li>`).join("")
    : '<li class="texto-secundario">Sin intereses</li>';
  secciones[2].querySelector(".pc__lista").innerHTML = lista(perfil.metas, "pc__item--amarillo", "Sin metas");
};


// ===== Validaciones =====
// Acepta "github.com/usuario" con o sin https:// y lo guarda siempre con https://
const normalizarGithub = (texto) => {
  const limpio = texto.trim();
  if (!limpio) return "";
  return /^https?:\/\//i.test(limpio) ? limpio : "https://" + limpio;
};

const esGithubValido = (texto) => /^https?:\/\/(www\.)?github\.com\/[\w.-]+(\/[\w.-]+)?\/?$/i.test(normalizarGithub(texto));

const mostrarErrorPerfil = (campo, mensaje) => {
  const contenedor = campo.closest(".campo");
  const textoError = contenedor.querySelector(".campo__error");
  if (mensaje) textoError.textContent = mensaje;
  contenedor.classList.add("campo--error");
  campo.setAttribute("aria-invalid", "true");
};

const limpiarErroresPerfil = (formulario) => {
  formulario.querySelectorAll(".campo--error").forEach((c) => c.classList.remove("campo--error"));
  formulario.querySelectorAll("[aria-invalid]").forEach((c) => c.removeAttribute("aria-invalid"));
};

const validarFormularioPerfil = (formulario) => {
  let primerError = null;
  const campoJugador = formulario.querySelector("#jugador");
  const campoGithub = formulario.querySelector("#github");

  if (campoJugador && !/^@?[A-Za-z0-9_.]{3,20}$/.test(campoJugador.value.trim())) {
    mostrarErrorPerfil(campoJugador, "Escribe un nombre de jugador de 3 a 20 caracteres (letras, números, _ o .).");
    primerError = campoJugador;
  }
  if (campoGithub.value.trim() && !esGithubValido(campoGithub.value)) {
    mostrarErrorPerfil(campoGithub, "Ingresa un enlace válido de GitHub, por ejemplo github.com/usuario.");
    primerError = primerError || campoGithub;
  }

  if (primerError) primerError.focus();
  return !primerError;
};


// ===== Registro de eventos =====
// Se espera a DOMContentLoaded para que party.js (que se carga después) ya esté disponible
document.addEventListener("DOMContentLoaded", () => {
  const sesion = obtenerSesion();
  if (!sesion) return;

  if (formCompletaPerfil) {
    formCompletaPerfil.noValidate = true;
    llenarFormularioPerfil(formCompletaPerfil, sesion, clasesCasillasCompleta);
    actualizarVistaPreviaPerfil();
    formCompletaPerfil.addEventListener("input", actualizarVistaPreviaPerfil);
    formCompletaPerfil.addEventListener("change", actualizarVistaPreviaPerfil);
    formCompletaPerfil.addEventListener("click", (e) => {
      if (e.target.closest('a[data-accion="anadir-lenguaje"]')) {
        e.preventDefault();
        anadirLenguajePerfil();
      }
    });
    const botonGuardar = formCompletaPerfil.querySelector(".completa__acciones .boton");
    botonGuardar.addEventListener("click", (e) => enviarFormularioPerfil(e, formCompletaPerfil, botonGuardar));
  }

  [
    [formPersonalizaPerfil, clasesCasillasPersonaliza, ".personaliza__acciones .boton:not(.boton--secundario)"],
    [formConfiguraPerfil, clasesCasillasConfigura, ".cfg__acciones .boton:not(.boton--secundario)"],
  ].forEach(([formulario, clases, selectorBoton]) => {
    if (!formulario) return;
    formulario.noValidate = true;
    llenarFormularioPerfil(formulario, sesion, clases);
    const botonGuardar = formulario.querySelector(selectorBoton);
    botonGuardar.addEventListener("click", (e) => enviarFormularioPerfil(e, formulario, botonGuardar));
  });

  if (tarjetaPerfil) {
    mostrarPerfil(sesion);
    const cerrarAviso = document.querySelector(".perfil__aviso-cerrar");
    if (cerrarAviso) {
      cerrarAviso.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".perfil__aviso").remove();
      });
    }
  }

  if (cabeceraPlayerCard) {
    if (!correoPlayerCard) {
      location.replace("solicitudes.html");
    } else {
      mostrarPlayerCard(correoPlayerCard);
    }
  }

  const textoUsuarioConfigura = document.querySelector(".cfg__usuario");
  if (textoUsuarioConfigura) {
    textoUsuarioConfigura.textContent = obtenerPerfil(sesion.correo).jugador || "@" + sesion.nombre.toLowerCase().replace(/\s+/g, "_");
  }
});
