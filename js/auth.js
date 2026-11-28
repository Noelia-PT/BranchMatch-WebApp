// Usuarios, sesión, inicio de sesión, registro, protección de páginas por rol, XP y cabecera del usuario.
// Páginas: index.html, auth/*, prueba/* y todas las de estudiante/ y lider/ (se carga justo después de localstorage.js).
// Responsable: P1 (Entrada).

// ===== Elementos =====
const formLogin = document.querySelector("#formulario-login");
const formRegistro = document.querySelector("#formulario-registro");
const botonIniciarSesion = document.querySelector("#boton-iniciar-sesion");
const botonRegistrarse = document.querySelector("#boton-registrarse");
const zonaErrorAuth = document.querySelector("#zona-error");
const textoErrorAuth = document.querySelector("#mensaje-error");
const campoUsuarioAuth = document.querySelector("#usuario");
const campoEmailAuth = document.querySelector("#email");
const campoContrasenaAuth = document.querySelector("#contrasena");
const campoConfirmarAuth = document.querySelector("#confirmar");
const campoTerminosAuth = document.querySelector("#terminos");
const avatarCabecera = document.querySelector(".header__usuario .avatar");
const chipCabecera = document.querySelector(".header__usuario .header__chip");
const cuerpoLanding = document.querySelector("body.landing");
const menuLanding = document.querySelector(".landing-header__nav .header__lista");

// Rol de la página (data-rol del <body>): "estudiante", "lider" o "publico"
const rolPagina = document.body.dataset.rol;
const reiniciarPedido = new URLSearchParams(location.search).get("reiniciar");


// ===== Datos =====
const CLAVE_USUARIOS = "bm_lista_usuarios";
const CLAVE_SESION = "bm_sesion_actual";
const CLAVE_XP = "bm_xp";

// Cuentas de ejemplo (contraseñas de 8 o más caracteres porque el formulario lo pide)
const usuariosIniciales = [
  { nombre: "Tomás Campos", correo: "estudiante1@branchmatch.test", contrasena: "estudiante123", rol: "estudiante" },
  { nombre: "Ana Gutiérrez", correo: "estudiante2@branchmatch.test", contrasena: "estudiante123", rol: "estudiante" },
  { nombre: "Edson Mendiolaza", correo: "lider1@branchmatch.test", contrasena: "lider1234", rol: "lider" },
  { nombre: "Jack Lima", correo: "lider2@branchmatch.test", contrasena: "lider1234", rol: "lider" },
  { nombre: "Valeria Ríos", correo: "lider3@branchmatch.test", contrasena: "lider1234", rol: "lider" },
  { nombre: "Camila Torres", correo: "lider4@branchmatch.test", contrasena: "lider1234", rol: "lider" },
  { nombre: "Marco Peña", correo: "lider5@branchmatch.test", contrasena: "lider1234", rol: "lider" },
];

// XP guardada por correo: [{ correo, puntos }]. Solo se cambia con sumarXp()
const xpIniciales = [{ correo: "estudiante1@branchmatch.test", puntos: 450 }];

// Cada rol tiene su página de inicio (ruta desde pages/<grupo>/)
const rutasInicioPorRol = {
  estudiante: "../estudiante/inicio.html",
  lider: "../lider/panel.html",
};
const rutaIniciarSesion = "../auth/iniciar-sesion.html";
const XP_POR_NIVEL = 100;

const normalizarCorreo = (correo) => String(correo || "").trim().toLowerCase();

const obtenerUsuarios = () => leerDatos(CLAVE_USUARIOS, usuariosIniciales);

const crearUsuario = (usuario) => {
  const usuarios = obtenerUsuarios();
  usuario.correo = normalizarCorreo(usuario.correo);
  usuarios.push(usuario);
  guardarDatos(CLAVE_USUARIOS, usuarios);
};

// Cambia datos de un usuario (por ejemplo { nombre: "Nuevo" }); no cambia el correo ni el rol
const editarUsuario = (correo, cambios) => {
  const usuarios = obtenerUsuarios();
  const posicion = usuarios.findIndex((u) => u.correo === normalizarCorreo(correo));
  if (posicion === -1) return;
  usuarios[posicion] = { ...usuarios[posicion], ...cambios, correo: usuarios[posicion].correo, rol: usuarios[posicion].rol };
  guardarDatos(CLAVE_USUARIOS, usuarios);
  const sesion = obtenerSesion();
  if (sesion && sesion.correo === usuarios[posicion].correo) {
    guardarSesion(usuarios[posicion]);
  }
};

const borrarUsuario = (correo) => {
  const usuarios = obtenerUsuarios().filter((u) => u.correo !== normalizarCorreo(correo));
  guardarDatos(CLAVE_USUARIOS, usuarios);
};

// La sesión guarda solo lo necesario: { nombre, correo, rol }
const obtenerSesion = () => leerDatos(CLAVE_SESION, null);

const guardarSesion = (usuario) => {
  guardarDatos(CLAVE_SESION, { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol });
};

const obtenerUsuarioActual = () => {
  const sesion = obtenerSesion();
  if (!sesion) return null;
  return obtenerUsuarios().find((u) => u.correo === sesion.correo) || null;
};

const obtenerListaXp = () => leerDatos(CLAVE_XP, xpIniciales);

const obtenerXp = (correo) => {
  const registro = obtenerListaXp().find((x) => x.correo === normalizarCorreo(correo));
  return registro ? registro.puntos : 0;
};

// Suma puntos de XP a un estudiante y devuelve su total nuevo
const sumarXp = (correo, puntos) => {
  const lista = obtenerListaXp();
  const correoLimpio = normalizarCorreo(correo);
  const registro = lista.find((x) => x.correo === correoLimpio);
  const total = (registro ? registro.puntos : 0) + Number(puntos);
  if (registro) {
    registro.puntos = total;
  } else {
    lista.push({ correo: correoLimpio, puntos: total });
  }
  guardarDatos(CLAVE_XP, lista);
  return total;
};


// ===== Funciones =====
const calcularNivelNumero = (xp) => Math.floor(xp / XP_POR_NIVEL) + 1;

// "Tomás Campos" -> "TC"; "papita_frita" -> "PA"
const obtenerIniciales = (nombre) => {
  const palabras = String(nombre || "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  if (palabras.length === 0) return "?";
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[1][0]).toUpperCase();
};

// Para comparar el correo o el nombre de usuario sin importar mayúsculas ni "@"
const normalizarIdentificador = (texto) => String(texto || "").trim().toLowerCase().replace(/^@/, "");

const coincideConIdentificador = (usuario, identificador) =>
  usuario.correo === identificador || normalizarIdentificador(usuario.nombre) === identificador;

// Si la página es de otro rol (o no hay sesión), vuelve al inicio de sesión
const protegerPagina = () => {
  if (!rolPagina || rolPagina === "publico") return true;
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol !== rolPagina) {
    location.replace(rutaIniciarSesion);
    return false;
  }
  return true;
};

const iniciarSesion = (e) => {
  e.preventDefault();
  limpiarErroresFormulario(formLogin);
  if (!validarFormularioLogin()) return;

  const identificador = normalizarIdentificador(campoUsuarioAuth.value);
  const contrasena = campoContrasenaAuth.value;
  const usuario = obtenerUsuarios().find((u) => coincideConIdentificador(u, identificador) && u.contrasena === contrasena);

  if (!usuario) {
    mostrarErrorGeneral("Correo o contraseña incorrectos.");
    return;
  }

  guardarSesion(usuario);
  location.href = rutasInicioPorRol[usuario.rol] || rutasInicioPorRol.estudiante;
};

const registrarUsuario = (e) => {
  e.preventDefault();
  limpiarErroresFormulario(formRegistro);
  if (!validarFormularioRegistro()) return;

  // Crear cuenta siempre crea un estudiante
  const usuario = {
    nombre: campoUsuarioAuth.value.trim().replace(/^@/, ""),
    correo: normalizarCorreo(campoEmailAuth.value),
    contrasena: campoContrasenaAuth.value,
    rol: "estudiante",
  };

  crearUsuario(usuario);
  guardarSesion(usuario);
  location.href = "../prueba/inicio.html";
};

const cerrarSesion = (e, enlace) => {
  e.preventDefault();
  localStorage.removeItem(CLAVE_SESION);
  // Si el enlace no tiene destino (#), recarga la página actual
  location.href = enlace.getAttribute("href") === "#" ? location.pathname : enlace.href;
};

const esEnlaceCerrarSesion = (enlace) =>
  enlace.dataset.accion === "cerrar-sesion" || enlace.textContent.trim() === "Cerrar sesión";

// Muestra las iniciales y el nivel del usuario en la cabecera
const mostrarCabecera = () => {
  const sesion = obtenerSesion();
  if (!sesion) return;
  if (avatarCabecera) {
    avatarCabecera.textContent = obtenerIniciales(sesion.nombre);
    avatarCabecera.setAttribute("aria-label", `Mi perfil (${sesion.nombre})`);
    avatarCabecera.title = sesion.nombre;
  }
  if (chipCabecera && sesion.rol === "estudiante") {
    chipCabecera.textContent = `LV ${calcularNivelNumero(obtenerXp(sesion.correo))}`;
  }
};

// En el landing, los enlaces de entrada llevan al panel del usuario que ya inició sesión
const actualizarLanding = () => {
  const sesion = obtenerSesion();
  if (!sesion) return;
  const rutaPanel = (rutasInicioPorRol[sesion.rol] || rutasInicioPorRol.estudiante).replace("../", "pages/");

  document.querySelectorAll('a[href$="iniciar-sesion.html"], a[href$="crear-cuenta.html"]').forEach((enlace) => {
    enlace.href = rutaPanel;
    enlace.textContent = "Ir a mi panel";
  });

  const textoRegistro = document.querySelector(".hero__registro");
  if (textoRegistro) textoRegistro.hidden = true;

  if (menuLanding) {
    const itemSalir = document.createElement("li");
    itemSalir.innerHTML = '<a class="landing-header__link" href="#" data-accion="cerrar-sesion">Cerrar sesión</a>';
    menuLanding.appendChild(itemSalir);
  }
};

// El enlace "Iniciar sesión" / "Registrarse" es un <a>: lo conectamos con el envío del formulario
const conectarEnvioConEnlace = (formulario, enlace) => {
  formulario.noValidate = true;
  enlace.addEventListener("click", (e) => {
    e.preventDefault();
    formulario.requestSubmit();
  });
  formulario.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "checkbox") {
      e.preventDefault();
      formulario.requestSubmit();
    }
  });
};

// Con iniciar-sesion.html?reiniciar=1 se borran los datos de ejemplo guardados
const reiniciarDesdeDireccion = () => {
  reiniciarDatos();
  history.replaceState(null, "", location.pathname);
  alert("Datos reiniciados. Ya puedes entrar con las cuentas de ejemplo.");
};


// ===== Validaciones =====
const mostrarErrorCampo = (campo, mensaje) => {
  const contenedor = campo.closest(".campo");
  const textoError = contenedor.querySelector(".campo__error");
  if (!textoError.dataset.mensajeOriginal) textoError.dataset.mensajeOriginal = textoError.textContent;
  if (mensaje) textoError.textContent = mensaje;
  contenedor.classList.add("campo--error");
  campo.setAttribute("aria-invalid", "true");
};

// Error general del formulario (zona #mensaje-error)
const mostrarErrorGeneral = (mensaje) => {
  if (!zonaErrorAuth) return;
  textoErrorAuth.textContent = mensaje;
  textoErrorAuth.setAttribute("role", "alert");
  zonaErrorAuth.classList.add("campo--error");
  zonaErrorAuth.hidden = false;
};

const limpiarErroresFormulario = (formulario) => {
  formulario.querySelectorAll(".campo--error").forEach((contenedor) => {
    contenedor.classList.remove("campo--error");
    const textoError = contenedor.querySelector(".campo__error");
    if (textoError && textoError.dataset.mensajeOriginal) textoError.textContent = textoError.dataset.mensajeOriginal;
  });
  formulario.querySelectorAll("[aria-invalid]").forEach((campo) => campo.removeAttribute("aria-invalid"));
  if (zonaErrorAuth) zonaErrorAuth.hidden = true;
};

// Usa las reglas del HTML (required, minlength, type="email", pattern) y deja el foco en el primer error
const validarCamposHtml = (formulario) => {
  let primerError = null;
  formulario.querySelectorAll("input").forEach((campo) => {
    if (!campo.checkValidity()) {
      mostrarErrorCampo(campo);
      if (!primerError) primerError = campo;
    }
  });
  return primerError;
};

const validarFormularioLogin = () => {
  const primerError = validarCamposHtml(formLogin);
  if (primerError) primerError.focus();
  return !primerError;
};

const validarFormularioRegistro = () => {
  let primerError = validarCamposHtml(formRegistro);

  if (!primerError && campoContrasenaAuth.value !== campoConfirmarAuth.value) {
    mostrarErrorCampo(campoConfirmarAuth, "Las contraseñas no coinciden.");
    primerError = campoConfirmarAuth;
  }

  const usuarios = obtenerUsuarios();
  if (!primerError && usuarios.some((u) => u.correo === normalizarCorreo(campoEmailAuth.value))) {
    mostrarErrorCampo(campoEmailAuth, "Ese correo ya está registrado.");
    primerError = campoEmailAuth;
  }
  if (!primerError && usuarios.some((u) => normalizarIdentificador(u.nombre) === normalizarIdentificador(campoUsuarioAuth.value))) {
    mostrarErrorCampo(campoUsuarioAuth, "Ese nombre de usuario ya existe.");
    primerError = campoUsuarioAuth;
  }

  if (primerError) primerError.focus();
  return !primerError;
};


// ===== Registro de eventos =====
if (formLogin && botonIniciarSesion) {
  conectarEnvioConEnlace(formLogin, botonIniciarSesion);
  formLogin.addEventListener("submit", iniciarSesion);
  if (reiniciarPedido) reiniciarDesdeDireccion();
}

if (formRegistro && botonRegistrarse) {
  conectarEnvioConEnlace(formRegistro, botonRegistrarse);
  formRegistro.addEventListener("submit", registrarUsuario);
}

// Un solo oyente para todos los "Cerrar sesión" (también el que crea el landing)
if (document.body) {
  document.addEventListener("click", (e) => {
    const enlace = e.target.closest("a");
    if (enlace && esEnlaceCerrarSesion(enlace)) cerrarSesion(e, enlace);
  });
}

if (protegerPagina()) {
  mostrarCabecera();
  if (cuerpoLanding) actualizarLanding();
}
