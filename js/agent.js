// Asistente IA de BranchMatch (Popa): chat flotante con voz que consulta y modifica los datos de localStorage.
// Páginas: index y todas las páginas de estudiante y líder que tienen el bloque <section id="ventana-chat">.
// Responsable: plantilla del curso (motor común) + adaptación de BranchMatch (instrucciones y herramientas).

// ===== Elementos =====
const ventana = document.querySelector("#ventana-chat");
const mensajes = document.querySelector("#mensajes");
const campo = document.querySelector("#texto-chat");
const botonMicrofono = document.querySelector("#boton-microfono");


// ===== Datos =====
// La clave NO está aquí: la agrega la función de Netlify desde el archivo .env
const urlApi = "/.netlify/functions/chat";
const modelo = "gpt-4o-mini";
const idioma = "es-PE"; // idioma de la voz y del micrófono: "es-MX", "es-ES", "es-PE"...

// Fecha local (no UTC) para que «hoy» sea el mismo día que ve el usuario en Perú
const hoyChat = new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD
const diaSemanaChat = new Date().toLocaleDateString("es-PE", { weekday: "long" });

const instrucciones = `Eres Popa, la mascota y asistente de BranchMatch: una web donde estudiantes de la UPC entrenan programación competitiva en parties (equipos de 2 a 5 personas guiados por un líder). Responde en español, breve y amable, en texto plano sin Markdown ni asteriscos.
Usa SIEMPRE las herramientas para consultar datos; no inventes parties, clases, temas, solicitudes ni notificaciones. Si no sabes quién es el usuario o su rol, usa ver_mi_resumen.
Hay dos roles: estudiante y lider. Si una herramienta devuelve un error de rol o de sesión, explícaselo al usuario con amabilidad.
Estudiante: para buscar una party usa buscar_parties (por defecto muestra las de su nivel con cupo); para unirse usa enviar_solicitud_party.
Líder: para ver quién quiere unirse usa ver_solicitudes_pendientes; para aceptar o rechazar usa responder_solicitud; para agendar una clase usa programar_clase.
Ambos: ver_proximas_clases, ver_lecciones, ver_notificaciones, publicar_en_feed y preguntar_en_comunidad.
Acciones que guardan datos (enviar_solicitud_party, responder_solicitud, programar_clase, publicar_en_feed, preguntar_en_comunidad): primero pide los datos que falten, luego resume exactamente lo que vas a hacer y pregunta "¿Confirmas?". SOLO después de que el usuario diga que sí, usa la herramienta. Nunca la uses sin esa confirmación explícita.
Escribe las fechas como AAAA-MM-DD y las horas como HH:MM de 24 horas. Si el usuario dice "mañana" o "el jueves", calcula la fecha a partir de hoy.
Hoy es ${diaSemanaChat} ${hoyChat}.`;

const mensajeError = "No pude conectar con el asistente.";
const puntos = '<span class="puntos"><span></span><span></span><span></span></span>';


// Herramientas que la IA puede pedir (descripción para la IA)
const herramientasIA = [
  {
    type: "function",
    function: {
      name: "ver_mi_resumen",
      description: "Devuelve quién es el usuario con sesión iniciada: nombre, rol, nivel de la prueba diagnóstica, XP, nivel LV, su party y cuántas notificaciones sin leer tiene.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "ver_notificaciones",
      description: "Lista las notificaciones del usuario con sesión iniciada, de la más reciente a la más antigua.",
      parameters: { type: "object", properties: { solo_no_leidas: { type: "boolean", description: "true para ver solo las que no ha leído" } } },
    },
  },
  {
    type: "function",
    function: {
      name: "buscar_parties",
      description: "Solo estudiantes. Busca parties con cupo libre. Por defecto filtra por el nivel del estudiante según su prueba diagnóstica.",
      parameters: {
        type: "object",
        properties: {
          nivel: { type: "string", enum: rangosNivelParty, description: "Rango de nivel de la party (1-3 Principiante, 3-5 Intermedio, 5-8 Avanzado). Opcional." },
          buscar: { type: "string", description: "Texto opcional a buscar en el nombre, la descripción o los horarios" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "enviar_solicitud_party",
      description: "Solo estudiantes sin party. Envía una solicitud para unirse a una party y avisa a su líder. Úsala solo tras confirmación explícita.",
      parameters: { type: "object", properties: { id_party: { type: "number", description: "ID de la party (de buscar_parties)" } }, required: ["id_party"] },
    },
  },
  {
    type: "function",
    function: {
      name: "ver_solicitudes_pendientes",
      description: "Solo líderes. Lista las solicitudes pendientes para unirse a su party, con el nivel de cada estudiante y el cupo que queda.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "responder_solicitud",
      description: "Solo líderes. Acepta o rechaza una solicitud pendiente de su party y avisa al estudiante. Úsala solo tras confirmación explícita.",
      parameters: {
        type: "object",
        properties: {
          id_solicitud: { type: "number", description: "ID de la solicitud (de ver_solicitudes_pendientes)" },
          decision: { type: "string", enum: ["aceptar", "rechazar"] },
        },
        required: ["id_solicitud", "decision"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "ver_proximas_clases",
      description: "Lista las próximas clases (desde hoy) de la party del usuario: las que programó el líder, con fecha, hora y link.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "programar_clase",
      description: "Solo líderes. Agenda una clase en vivo en el calendario de su party. Úsala solo tras confirmación explícita.",
      parameters: {
        type: "object",
        properties: {
          fecha: { type: "string", description: "AAAA-MM-DD, hoy o después" },
          hora: { type: "string", description: "Hora de inicio HH:MM en 24 horas" },
          hora_fin: { type: "string", description: "Hora de fin HH:MM en 24 horas (opcional; por defecto 1 hora después)" },
          link: { type: "string", description: "Link de la videollamada (https://...)" },
        },
        required: ["fecha", "hora", "link"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "ver_lecciones",
      description: "Lista los temas de lecciones con sus subtemas, si tienen grabación y, para estudiantes, cuántas lecciones vio. Se puede filtrar por texto.",
      parameters: { type: "object", properties: { buscar: { type: "string", description: "Texto opcional a buscar en temas y subtemas" } } },
    },
  },
  {
    type: "function",
    function: {
      name: "publicar_en_feed",
      description: "Publica un mensaje en el feed de inicio a nombre del usuario con sesión iniciada. Máximo 280 caracteres. Úsala solo tras confirmación explícita.",
      parameters: { type: "object", properties: { texto: { type: "string", description: "Texto de la publicación" } }, required: ["texto"] },
    },
  },
  {
    type: "function",
    function: {
      name: "preguntar_en_comunidad",
      description: "Publica una pregunta en la Comunidad a nombre del usuario con sesión iniciada. Máximo 280 caracteres. Úsala solo tras confirmación explícita.",
      parameters: {
        type: "object",
        properties: {
          texto: { type: "string", description: "Texto de la pregunta" },
          etiqueta: { type: "string", enum: etiquetasPreguntaComunidad },
        },
        required: ["texto"],
      },
    },
  },
];

// Historial de la conversación (para que el agente recuerde el contexto)
const historial = [{ role: "system", content: instrucciones }];


// ===== Herramientas (código real que se ejecuta) =====
// Solo vuelve a pintar una vista si su función está cargada y su elemento existe en esta página
const refrescarVista = (selector, mostrar) => {
  if (document.querySelector(selector)) mostrar();
};

const nombreDe = (correo) => (typeof obtenerNombrePerfil === "function" ? obtenerNombrePerfil(correo) : correo);

const resumenParty = (party) => ({
  id: party.id,
  nombre: party.nombre,
  descripcion: party.descripcion,
  nivel: party.nivel,
  lider: nombreDe(party.correoLider),
  integrantes: party.integrantes.length,
  cupo: party.cupo,
  lugares_libres: party.cupo - party.integrantes.length,
  horarios: party.horarios.map((h) => `${h.dia} ${h.desde}-${h.hasta}`).join(", "),
});

const verMiResumenHerramienta = () => {
  const sesion = obtenerSesion();
  if (!sesion) return { error: "El usuario no ha iniciado sesión." };
  const xp = obtenerXp(sesion.correo);
  const party = obtenerPartyDe(sesion.correo);
  return {
    nombre: sesion.nombre,
    rol: sesion.rol,
    nivel_prueba: sesion.rol === "estudiante" ? obtenerNivel(sesion.correo) || "Aún no hizo la prueba diagnóstica" : undefined,
    xp,
    nivel_lv: calcularNivelNumero(xp),
    party: party ? { nombre: party.nombre, lider: nombreDe(party.correoLider), integrantes: party.integrantes.map(nombreDe) } : "Sin party",
    notificaciones_sin_leer: contarNoLeidas(sesion.correo),
  };
};

const verNotificacionesHerramienta = ({ solo_no_leidas = false }) => {
  const sesion = obtenerSesion();
  if (!sesion) return { error: "El usuario debe iniciar sesión para ver sus notificaciones." };
  const lista = obtenerNotificacionesDe(sesion.correo)
    .filter((n) => !solo_no_leidas || !n.leida)
    .slice(0, 10)
    .map((n) => ({ titulo: n.titulo, texto: n.texto, leida: n.leida, fecha: n.fecha }));
  return lista.length ? lista : { mensaje: "No tienes notificaciones." };
};

const buscarPartiesHerramienta = ({ nivel = "", buscar = "" }) => {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== "estudiante") return { error: "Solo un estudiante con sesión iniciada puede buscar parties." };
  if (obtenerPartyDe(sesion.correo)) return { error: "Ya perteneces a una party." };
  const nivelPrueba = obtenerNivel(sesion.correo);
  const rango = nivel || (nivelPrueba ? rangoPorNivelPrueba[nivelPrueba] : "");
  const texto = buscar.toLowerCase();
  const encontradas = obtenerParties()
    .filter((p) => !rango || p.nivel === rango)
    .filter((p) => !partyEstaLlena(p))
    .filter((p) => `${p.nombre} ${p.descripcion} ${p.horarios.map((h) => h.dia).join(" ")}`.toLowerCase().includes(texto))
    .map((p) => ({ ...resumenParty(p), solicitud_enviada: Boolean(obtenerSolicitud(p.id, sesion.correo)) }));
  return encontradas.length ? { nivel_usado: rango || "todos", parties: encontradas } : { mensaje: "No hay parties con cupo para ese filtro." };
};

const enviarSolicitudPartyHerramienta = ({ id_party }) => {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== "estudiante") return { error: "Solo un estudiante con sesión iniciada puede enviar solicitudes." };
  if (obtenerPartyDe(sesion.correo)) return { error: "Ya perteneces a una party." };
  const party = obtenerParty(id_party);
  if (!party) return { error: "Esa party no existe." };
  if (partyEstaLlena(party)) return { error: "Esa party ya está completa." };
  if (obtenerSolicitud(party.id, sesion.correo)) return { error: "Ya enviaste una solicitud a esa party." };

  crearSolicitud({ idParty: party.id, correoEstudiante: sesion.correo, estado: "pendiente", fecha: new Date().toISOString() });
  crearNotificacion(party.correoLider, `${sesion.nombre} quiere unirse a ${party.nombre}.`, {
    tipo: "nueva",
    titulo: "Un estudiante quiere unirse",
    datos: [{ nombre: "Estudiante", valor: sesion.nombre }, { nombre: "Party", valor: party.nombre }],
    enlace: "lider/solicitudes.html",
    textoEnlace: "Ver solicitudes",
  });
  refrescarVista(".unete__grupos", () => mostrarUnete(sesion));
  return { ok: true, party: party.nombre, lider: nombreDe(party.correoLider), estado: "pendiente" };
};

const verSolicitudesPendientesHerramienta = () => {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== "lider") return { error: "Solo un líder con sesión iniciada puede ver solicitudes." };
  const party = obtenerPartyDe(sesion.correo);
  if (!party) return { error: "Todavía no has creado tu party." };
  const pendientes = obtenerSolicitudesDeParty(party.id, "pendiente").map((s) => ({
    id: s.id,
    estudiante: nombreDe(s.correoEstudiante),
    nivel_prueba: obtenerNivel(s.correoEstudiante) || "Sin prueba",
    fecha: s.fecha.slice(0, 10),
  }));
  return { party: party.nombre, lugares_libres: party.cupo - party.integrantes.length, pendientes: pendientes.length ? pendientes : "No hay solicitudes pendientes." };
};

const responderSolicitudHerramienta = ({ id_solicitud, decision }) => {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== "lider") return { error: "Solo un líder con sesión iniciada puede responder solicitudes." };
  const party = obtenerPartyDe(sesion.correo);
  const solicitud = obtenerSolicitudes().find((s) => s.id === id_solicitud);
  if (!party || !solicitud || solicitud.idParty !== party.id) return { error: "Esa solicitud no es de tu party." };
  if (solicitud.estado !== "pendiente") return { error: `Esa solicitud ya está ${solicitud.estado}.` };
  if (decision === "aceptar" && partyEstaLlena(party)) return { error: "Tu party ya está completa. Rechaza la solicitud o aumenta el cupo desde Editar party." };

  if (decision === "aceptar") aceptarSolicitud(solicitud, party);
  else rechazarSolicitud(solicitud, party);
  refrescarVista(".sol__der", () => mostrarSolicitudes(sesion));
  return { ok: true, estudiante: nombreDe(solicitud.correoEstudiante), decision, party: party.nombre };
};

const verProximasClasesHerramienta = () => {
  const sesion = obtenerSesion();
  if (!sesion) return { error: "El usuario debe iniciar sesión para ver sus clases." };
  const party = obtenerPartyDe(sesion.correo);
  const correoLider = sesion.rol === "lider" ? sesion.correo : party && party.correoLider;
  if (!correoLider) return { error: "Aún no estás en una party, así que no tienes clases." };
  const proximas = obtenerClasesDeLider(correoLider)
    .filter((c) => c.fecha >= hoyChat)
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))
    .slice(0, 5)
    .map((c) => ({ id: c.id, titulo: c.titulo, fecha: c.fecha, hora: c.hora, hora_fin: c.horaFin || "", link: c.link }));
  return proximas.length ? proximas : { mensaje: "No hay clases programadas desde hoy." };
};

const programarClaseHerramienta = ({ fecha, hora, hora_fin = "", link }) => {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== "lider") return { error: "Solo un líder con sesión iniciada puede programar clases." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) return { error: "Fecha (AAAA-MM-DD) u hora (HH:MM) inválida." };
  if (fecha < hoyChat) return { error: "La fecha debe ser hoy o después." };
  const [h, m] = hora.split(":").map(Number);
  const horaFin = /^\d{2}:\d{2}$/.test(hora_fin) ? hora_fin : `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  if (horaFin <= hora) return { error: "La hora de fin debe ser después de la hora de inicio." };
  if (!esLinkValido(link)) return { error: "El link debe empezar con http:// o https://." };
  if (obtenerClasesDeLider(sesion.correo).some((c) => c.fecha === fecha && c.hora === hora)) return { error: "Ya tienes una clase ese día a esa hora." };

  const party = obtenerNombrePartyCalendario(sesion.correo);
  const clase = crearClase({ correoLider: sesion.correo, titulo: party ? `Sesión de ${party}` : "Sesión de la party", fecha, hora, horaFin, link: link.trim() });
  refrescarVista(".lcal__dias", () => {
    mostrarCalendarioLider(sesion);
    mostrarClasesDelDia(sesion);
  });
  return { ok: true, titulo: clase.titulo, fecha, hora, hora_fin: horaFin, link: clase.link };
};

const verLeccionesHerramienta = ({ buscar = "" }) => {
  const sesion = obtenerSesion();
  if (!sesion) return { error: "El usuario debe iniciar sesión para ver las lecciones." };
  const texto = buscar.toLowerCase();
  const temas = obtenerTemasLecciones()
    .map((tema) => {
      const subtemas = obtenerSubtemasDeTema(tema.id);
      return {
        id: tema.id,
        tema: tema.titulo,
        descripcion: tema.descripcion,
        subtemas: subtemas.map((s) => `${s.titulo}${s.linkGrabacion ? " (con grabación)" : ""}`),
        lecciones_vistas: sesion.rol === "estudiante" ? `${contarVistasDeTema(sesion.correo, tema.id)} de ${subtemas.length}` : undefined,
      };
    })
    .filter((t) => `${t.tema} ${t.descripcion} ${t.subtemas.join(" ")}`.toLowerCase().includes(texto));
  return temas.length ? temas : { mensaje: "No hay temas que coincidan." };
};

const publicarEnFeedHerramienta = ({ texto }) => {
  const sesion = obtenerSesion();
  if (!sesion) return { error: "El usuario debe iniciar sesión para publicar." };
  const limpio = String(texto || "").trim();
  if (!limpio || limpio.length > LIMITE_PUBLICACION) return { error: `La publicación debe tener entre 1 y ${LIMITE_PUBLICACION} caracteres.` };

  crearPublicacion({ correoAutor: sesion.correo, texto: limpio, origen: "Inicio", fecha: new Date().toISOString() });
  if (typeof mostrarFeed === "function") refrescarVista(".ifd__feed", mostrarFeed);
  refrescarVista(".pub__lista", mostrarMisPublicaciones);
  return { ok: true, texto: limpio };
};

const preguntarEnComunidadHerramienta = ({ texto, etiqueta = "Pregunta" }) => {
  const sesion = obtenerSesion();
  if (!sesion) return { error: "El usuario debe iniciar sesión para preguntar en la comunidad." };
  const limpio = String(texto || "").trim();
  if (!limpio || limpio.length > LIMITE_PREGUNTA_COMUNIDAD) return { error: `La pregunta debe tener entre 1 y ${LIMITE_PREGUNTA_COMUNIDAD} caracteres.` };
  if (!etiquetasPreguntaComunidad.includes(etiqueta)) return { error: `Etiqueta inválida. Usa: ${etiquetasPreguntaComunidad.join(", ")}.` };

  crearPreguntaComunidad({
    correoAutor: sesion.correo,
    titulo: limpio.length > 60 ? `${limpio.slice(0, 57)}…` : limpio,
    texto: limpio,
    etiqueta,
    fecha: new Date().toISOString(),
  });
  refrescarVista(".cmu__feed", () => {
    mostrarPreguntasComunidad();
    mostrarTendenciasComunidad();
  });
  return { ok: true, etiqueta, texto: limpio };
};

const herramientas = {
  ver_mi_resumen: verMiResumenHerramienta,
  ver_notificaciones: verNotificacionesHerramienta,
  buscar_parties: buscarPartiesHerramienta,
  enviar_solicitud_party: enviarSolicitudPartyHerramienta,
  ver_solicitudes_pendientes: verSolicitudesPendientesHerramienta,
  responder_solicitud: responderSolicitudHerramienta,
  ver_proximas_clases: verProximasClasesHerramienta,
  programar_clase: programarClaseHerramienta,
  ver_lecciones: verLeccionesHerramienta,
  publicar_en_feed: publicarEnFeedHerramienta,
  preguntar_en_comunidad: preguntarEnComunidadHerramienta,
};


// ===== Funciones =====
const abrirOCerrarChat = () => {
  ventana.hidden = !ventana.hidden;
};

// El texto del usuario y de la IA pasa por escaparHtml (puede repetir texto escrito por otros usuarios)
const agregarMensaje = (texto, autor) => {
  const contenido = texto === puntos ? puntos : escaparHtml(texto);
  mensajes.innerHTML += `<div class="msg msg-${autor}">${contenido}</div>`;
  mensajes.scrollTop = mensajes.scrollHeight;
};

const llamarIA = async () => {
  const respuestaApi = await fetch(urlApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: modelo, messages: historial, tools: herramientasIA }),
  });
  const datos = await respuestaApi.json();
  return datos.choices[0].message;
};

// Bucle del agente: mientras la IA pida herramientas, las ejecutamos y le devolvemos el resultado
const pedirRespuesta = async (pregunta) => {
  historial.push({ role: "user", content: pregunta });

  let mensaje = await llamarIA();
  while (mensaje.tool_calls) {
    historial.push(mensaje);
    for (const llamada of mensaje.tool_calls) {
      const argumentos = JSON.parse(llamada.function.arguments);
      const resultado = herramientas[llamada.function.name](argumentos);
      historial.push({ role: "tool", tool_call_id: llamada.id, content: JSON.stringify(resultado) });
    }
    mensaje = await llamarIA();
  }

  historial.push(mensaje);
  return mensaje.content;
};

const hablar = (texto) => {
  const voces = speechSynthesis.getVoices();
  const vozEspanol = voces.find((v) => v.lang.replace("_", "-") === idioma) || voces.find((v) => v.lang.startsWith("es"));

  const voz = new SpeechSynthesisUtterance(texto);
  voz.voice = vozEspanol;
  voz.lang = vozEspanol ? vozEspanol.lang : idioma;
  speechSynthesis.cancel();
  speechSynthesis.speak(voz);
};

const enviarPregunta = async (pregunta, porVoz = false) => {
  agregarMensaje(pregunta, "user");
  agregarMensaje(puntos, "bot");

  const respuesta = await pedirRespuesta(pregunta).catch(() => mensajeError);

  mensajes.lastElementChild.remove();
  agregarMensaje(respuesta, "bot");
  if (porVoz) hablar(respuesta); // si preguntó con la voz, responde con voz
};

const enviarMensaje = (e) => {
  e.preventDefault();
  const pregunta = campo.value;
  campo.value = "";
  enviarPregunta(pregunta);
};

// ===== Voz =====
speechSynthesis.getVoices(); // el navegador carga las voces en segundo plano
const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;

let reconocedor = null;

// Un clic: empieza a escuchar y, al hacer una pausa, envía la pregunta
const escuchar = () => {
  if (reconocedor) return reconocedor.stop(); // segundo clic: termina y envía lo dicho
  speechSynthesis.cancel(); // el asistente deja de hablar para no escucharse a sí mismo

  reconocedor = new Reconocimiento();
  reconocedor.lang = idioma;
  botonMicrofono.classList.add("escuchando");
  reconocedor.onresult = (e) => enviarPregunta(e.results[0][0].transcript, true);
  reconocedor.onerror = (e) => {
    if (e.error === "not-allowed") agregarMensaje("Permite el micrófono: haz clic en el candado de la barra de direcciones, elige Micrófono → Permitir y vuelve a pulsar.", "bot");
  };
  reconocedor.onend = () => {
    botonMicrofono.classList.remove("escuchando");
    reconocedor = null;
  };
  reconocedor.start();
};


// ===== Eventos =====
document.querySelector("#boton-chat").addEventListener("click", abrirOCerrarChat);
document.querySelector("#boton-cerrar-chat").addEventListener("click", abrirOCerrarChat);
document.querySelector("#formulario-chat").addEventListener("submit", enviarMensaje);

if (Reconocimiento) {
  botonMicrofono.addEventListener("click", escuchar);
} else {
  botonMicrofono.hidden = true; // el navegador no soporta voz
}
