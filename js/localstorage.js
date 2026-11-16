// Funciones comunes para guardar y leer datos en localStorage y para escapar texto del usuario.
// Páginas: todas las que usan JavaScript (se carga siempre primero).
// Responsable: P1 (Entrada).

// ===== Funciones =====
// Guarda una lista u objeto en localStorage como texto JSON
const guardarDatos = (clave, lista) => {
  localStorage.setItem(clave, JSON.stringify(lista));
};

// Lee una clave; si no existe (o está dañada) devuelve los datos iniciales
const leerDatos = (clave, datosIniciales = []) => {
  const texto = localStorage.getItem(clave);
  if (!texto) return datosIniciales;
  try {
    return JSON.parse(texto);
  } catch (error) {
    return datosIniciales;
  }
};

// Convierte <, >, &, " y ' en texto seguro. Úsala con todo texto escrito por el usuario antes de pintarlo con innerHTML
const escaparHtml = (texto) =>
  String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Borra los datos de BranchMatch (claves bm_) y deja la web como al inicio; conserva la clave de API de Popa
const reiniciarDatos = () => {
  Object.keys(localStorage)
    .filter((clave) => clave.startsWith("bm_") && clave !== "bm_clave_api")
    .forEach((clave) => localStorage.removeItem(clave));
};
