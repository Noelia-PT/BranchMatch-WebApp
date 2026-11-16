// Prueba diagnóstica: guarda las respuestas, lleva el temporizador, calcula puntaje y nivel y muestra el resultado.
// Páginas: prueba/inicio, pregunta-1, pregunta-2 y resultado (otras personas lo cargan para leer obtenerNivel).
// Responsable: P1 (Entrada).

// ===== Elementos =====
const botonComenzarPrueba = document.querySelector(".prueba-inicio__boton");
const datoPreguntasPrueba = document.querySelector("#prueba-dato-preguntas");
const datoTiempoPrueba = document.querySelector("#prueba-dato-tiempo");
const datoXpPrueba = document.querySelector("#prueba-dato-xp");
const formPregunta = document.querySelector(".prueba-tarjeta");
const tiempoPrueba = document.querySelector(".prueba-estado__tiempo");
const barraPrueba = document.querySelector(".prueba-estado__barra");
const contadorPrueba = document.querySelector(".prueba-contador");
const botonSiguientePrueba = document.querySelector(".prueba-navegacion .boton");
const botonSalirPrueba = document.querySelector(".prueba-header__salir");
const botonSalirDeTodosModos = document.querySelector("#salir .boton--peligro");
const seccionResultado = document.querySelector(".prueba-resultado");
const tituloResultado = document.querySelector("#resultado-titulo");
const bajadaResultado = document.querySelector("#resultado-bajada");
const correctasResultado = document.querySelector("#resultado-correctas");
const tiempoResultado = document.querySelector("#resultado-tiempo");
const xpResultado = document.querySelector("#resultado-xp");
const listaFortalezas = document.querySelector("#resultado-fortalezas");
const listaReforzar = document.querySelector("#resultado-reforzar");

const temaPregunta = document.querySelector(".prueba-tarjeta__legend .chip");
const tituloPregunta = document.querySelector(".prueba-tarjeta__titulo");
const listaOpciones = document.querySelector(".prueba-opciones");
const figuraCodigo = document.querySelector(".codigo");
const bloqueCodigo = document.querySelector(".codigo__bloque code");
const rellenoPrueba = document.querySelector(".prueba-estado__relleno");

// Número de la pregunta: ?n=5 en la dirección o, si no hay, el data-pregunta del formulario; 0 si no es una pregunta
const numeroPregunta = formPregunta
  ? Number(new URLSearchParams(location.search).get("n")) || Number(formPregunta.dataset.pregunta)
  : 0;


// ===== Datos =====
const CLAVE_RESULTADOS_PRUEBA = "bm_resultados_prueba";
const CLAVE_PRUEBA_EN_CURSO = "bm_prueba_en_curso";
const DURACION_PRUEBA_SEGUNDOS = 15 * 60;
const XP_PRUEBA = 120;

// Las 20 preguntas: opciones en orden A, B, C, D y letra correcta. "codigo" es opcional
const preguntasPrueba = [
  { numero: 1, tema: "Complejidad algorítmica", enunciado: "¿Cuál es la complejidad temporal, en el peor caso, del siguiente fragmento?", codigo: "for (int i = 0; i < n; i++)\n    for (int j = i; j < n; j++)\n        suma += a[i] * a[j];", opciones: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correcta: "C" },
  { numero: 2, tema: "Complejidad algorítmica", enunciado: "¿Cuál es la complejidad del siguiente fragmento?", codigo: "for (int i = 1; i < n; i *= 2)\n    cuenta++;", opciones: ["O(n)", "O(n²)", "O(1)", "O(log n)"], correcta: "D" },
  { numero: 3, tema: "Complejidad algorítmica", enunciado: "¿Cuál es la solución de la recurrencia T(n) = 2T(n/2) + n?", opciones: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correcta: "B" },
  { numero: 4, tema: "Complejidad algorítmica", enunciado: "¿Cuál es el costo amortizado de agregar un elemento al final de un vector dinámico?", opciones: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correcta: "A" },
  { numero: 5, tema: "Recursión", enunciado: "¿Qué devuelve f(3)?", codigo: "int f(int n) {\n    if (n <= 1) return 1;\n    return n * f(n - 1);\n}", opciones: ["3", "6", "9", "24"], correcta: "B" },
  { numero: 6, tema: "Recursión", enunciado: "¿Cuál es la complejidad de calcular Fibonacci con recursión simple, sin memoria?", opciones: ["O(n)", "O(n²)", "O(2ⁿ)", "O(log n)"], correcta: "C" },
  { numero: 7, tema: "Recursión", enunciado: "¿Qué pasa si una función recursiva no tiene caso base?", opciones: ["Desbordamiento de pila", "Devuelve 0", "Termina en O(1)", "Se detiene sola"], correcta: "A" },
  { numero: 8, tema: "Estructuras de datos", enunciado: "¿Qué estructura atiende los elementos en orden de llegada (FIFO)?", opciones: ["Pila", "Cola", "Árbol", "Conjunto"], correcta: "B" },
  { numero: 9, tema: "Estructuras de datos", enunciado: "Necesitas insertar valores y sacar siempre el menor en O(log n). ¿Qué estructura usas?", opciones: ["Pila", "Cola simple", "Lista enlazada", "Cola de prioridad (heap)"], correcta: "D" },
  { numero: 10, tema: "Estructuras de datos", enunciado: "¿Cuál es el costo promedio de buscar una clave en una tabla hash?", opciones: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], correcta: "A" },
  { numero: 11, tema: "Estructuras de datos", enunciado: "El recorrido inorden de un árbol binario de búsqueda produce los valores...", opciones: ["en orden descendente", "en orden de inserción", "en orden ascendente", "en orden aleatorio"], correcta: "C" },
  { numero: 12, tema: "Búsqueda binaria", enunciado: "¿Qué necesita el arreglo para aplicar búsqueda binaria?", opciones: ["Tener elementos únicos", "Estar ordenado", "Tener tamaño par", "Estar en una lista enlazada"], correcta: "B" },
  { numero: 13, tema: "Búsqueda binaria", enunciado: "En un arreglo ordenado de 1 000 000 de elementos, ¿cuántas comparaciones hace la búsqueda binaria en el peor caso, aproximadamente?", opciones: ["20", "1 000", "500 000", "100"], correcta: "A" },
  { numero: 14, tema: "Grafos", enunciado: "¿Qué estructura usa el recorrido en anchura (BFS)?", opciones: ["Pila", "Árbol AVL", "Tabla hash", "Cola"], correcta: "D" },
  { numero: 15, tema: "Grafos", enunciado: "¿Con qué estructura se puede implementar el recorrido en profundidad (DFS) sin recursión?", opciones: ["Cola", "Heap", "Pila", "Conjunto"], correcta: "C" },
  { numero: 16, tema: "Grafos", enunciado: "¿Cuánta memoria usa una lista de adyacencia para un grafo con V vértices y E aristas?", opciones: ["O(V²)", "O(V + E)", "O(E²)", "O(V · E)"], correcta: "B" },
  { numero: 17, tema: "Grafos", enunciado: "¿En qué caso el algoritmo de Dijkstra no da resultados correctos?", opciones: ["Con aristas de peso negativo", "Con grafos dirigidos", "Con grafos densos", "Con vértices aislados"], correcta: "A" },
  { numero: 18, tema: "Programación dinámica", enunciado: "¿Qué propiedades debe tener un problema para resolverlo con programación dinámica?", opciones: ["Solo entradas ordenadas", "Un grafo como entrada", "Datos en una pila", "Subproblemas superpuestos y subestructura óptima"], correcta: "D" },
  { numero: 19, tema: "Programación dinámica", enunciado: "¿Cuál es la complejidad de Fibonacci con memoización?", opciones: ["O(2ⁿ)", "O(n)", "O(n²)", "O(log n)"], correcta: "B" },
  { numero: 20, tema: "Programación dinámica", enunciado: "¿Cuál es la complejidad de la mochila 0/1 con n objetos y capacidad W?", opciones: ["O(n + W)", "O(2ⁿ)", "O(n · W)", "O(W log n)"], correcta: "C" },
];

const textosNivelPrueba = {
  Principiante: "Vas empezando y eso está bien. Ya puedes unirte a parties para principiantes y desbloquear sus retos.",
  Intermedio: "Buen trabajo. Ya puedes unirte a parties de nivel Intermedio y desbloquear sus retos.",
  Avanzado: "¡Excelente! Ya puedes unirte a parties de nivel Avanzado y desbloquear sus retos.",
};

// Un resultado por estudiante: { id, correo, correctas, total, puntaje, nivel, segundos, xpGanado, temasFuertes, temasDebiles, fecha }
const resultadosPruebaIniciales = [
  { id: 1, correo: "estudiante1@branchmatch.test", correctas: 16, total: 20, puntaje: 80, nivel: "Intermedio", segundos: 684, xpGanado: 120, temasFuertes: ["Recursión", "Estructuras de datos", "Búsqueda binaria"], temasDebiles: ["Grafos", "Programación dinámica"], fecha: "2026-11-01T10:00:00.000Z" },
  { id: 2, correo: "estudiante2@branchmatch.test", correctas: 7, total: 20, puntaje: 35, nivel: "Principiante", segundos: 840, xpGanado: 120, temasFuertes: ["Recursión"], temasDebiles: ["Estructuras de datos", "Grafos"], fecha: "2026-11-02T10:00:00.000Z" },
];

const obtenerResultadosPrueba = () => leerDatos(CLAVE_RESULTADOS_PRUEBA, resultadosPruebaIniciales);

const obtenerResultadoPrueba = (correo) => obtenerResultadosPrueba().find((r) => r.correo === correo) || null;

// Devuelve "Principiante", "Intermedio" o "Avanzado"; null si el estudiante aún no hizo la prueba
const obtenerNivel = (correo) => {
  const resultado = obtenerResultadoPrueba(correo);
  return resultado ? resultado.nivel : null;
};

// Guarda el resultado; si el estudiante ya tenía uno, lo reemplaza
const crearResultadoPrueba = (resultado) => {
  const resultados = obtenerResultadosPrueba().filter((r) => r.correo !== resultado.correo);
  const ids = resultados.map((r) => r.id);
  resultado.id = Math.max(0, ...ids) + 1;
  resultados.push(resultado);
  guardarDatos(CLAVE_RESULTADOS_PRUEBA, resultados);
};

const borrarResultadoPrueba = (correo) => {
  const resultados = obtenerResultadosPrueba().filter((r) => r.correo !== correo);
  guardarDatos(CLAVE_RESULTADOS_PRUEBA, resultados);
};

// Prueba que se está respondiendo: { correo, inicio (milisegundos), respuestas: { 1: "C" } }
const obtenerPruebaEnCurso = (correo) => {
  const prueba = leerDatos(CLAVE_PRUEBA_EN_CURSO, null);
  return prueba && prueba.correo === correo ? prueba : null;
};

const iniciarPrueba = (correo) => {
  guardarDatos(CLAVE_PRUEBA_EN_CURSO, { correo, inicio: Date.now(), respuestas: {} });
};

const guardarRespuestaPrueba = (correo, numero, letra) => {
  const prueba = obtenerPruebaEnCurso(correo);
  if (!prueba) return;
  prueba.respuestas[numero] = letra;
  guardarDatos(CLAVE_PRUEBA_EN_CURSO, prueba);
};

const borrarPruebaEnCurso = () => {
  localStorage.removeItem(CLAVE_PRUEBA_EN_CURSO);
};


// ===== Funciones =====
const calcularNivelPrueba = (puntaje) => {
  if (puntaje < 50) return "Principiante";
  if (puntaje < 90) return "Intermedio";
  return "Avanzado";
};

// 684 -> "11:24"
const formatearTiempoPrueba = (segundos) => {
  const minutos = String(Math.floor(segundos / 60)).padStart(2, "0");
  const resto = String(segundos % 60).padStart(2, "0");
  return `${minutos}:${resto}`;
};

// Un tema es fuerte si acertó al menos la mitad de sus preguntas; si no, hay que reforzarlo
const obtenerTemas = (detalle, fuertes) => {
  const temas = [...new Set(detalle.map((d) => d.tema))];
  return temas.filter((tema) => {
    const delTema = detalle.filter((d) => d.tema === tema);
    const aciertos = delTema.filter((d) => d.elegida === d.correcta).length;
    return (aciertos / delTema.length >= 0.5) === fuertes;
  });
};

// Corrige la prueba, guarda el resultado, suma el XP la primera vez y abre la página de resultado
const finalizarPrueba = (sesion) => {
  const prueba = obtenerPruebaEnCurso(sesion.correo);
  if (!prueba) {
    location.href = "inicio.html";
    return;
  }

  const segundos = Math.min(DURACION_PRUEBA_SEGUNDOS, Math.round((Date.now() - prueba.inicio) / 1000));
  const detalle = preguntasPrueba.map((p) => ({ tema: p.tema, correcta: p.correcta, elegida: prueba.respuestas[p.numero] || null }));
  const correctas = detalle.filter((d) => d.elegida === d.correcta).length;
  const puntaje = Math.round((correctas / preguntasPrueba.length) * 100);
  const nivel = calcularNivelPrueba(puntaje);
  // El XP de la prueba se gana una sola vez
  const xpGanado = obtenerResultadoPrueba(sesion.correo) ? 0 : XP_PRUEBA;

  crearResultadoPrueba({
    correo: sesion.correo,
    correctas,
    total: preguntasPrueba.length,
    puntaje,
    nivel,
    segundos,
    xpGanado,
    temasFuertes: obtenerTemas(detalle, true),
    temasDebiles: obtenerTemas(detalle, false),
    fecha: new Date().toISOString(),
  });

  if (xpGanado) sumarXp(sesion.correo, xpGanado);
  crearNotificacion(sesion.correo, `Terminaste la prueba diagnóstica: tu nivel es ${nivel}.`, {
    tipo: "aviso",
    titulo: "Prueba diagnóstica completada",
    enlace: "prueba/resultado.html",
    textoEnlace: "Ver mi resultado",
  });
  borrarPruebaEnCurso();
  location.href = "resultado.html";
};

const mostrarDatosInicioPrueba = () => {
  datoPreguntasPrueba.textContent = preguntasPrueba.length;
  datoTiempoPrueba.textContent = `${DURACION_PRUEBA_SEGUNDOS / 60} min`;
  datoXpPrueba.textContent = `+${XP_PRUEBA} XP`;
};

const mostrarTiempoRestante = (sesion) => {
  const prueba = obtenerPruebaEnCurso(sesion.correo);
  if (!prueba) return;
  const transcurridos = Math.floor((Date.now() - prueba.inicio) / 1000);
  const restante = DURACION_PRUEBA_SEGUNDOS - transcurridos;
  if (restante <= 0) {
    finalizarPrueba(sesion);
    return;
  }
  tiempoPrueba.textContent = `⏱ ${formatearTiempoPrueba(restante)} restantes`;
};

// Muestra la pregunta: contador, respuesta guardada (si hay) y texto del botón
const mostrarPregunta = (sesion) => {
  const total = preguntasPrueba.length;
  const prueba = obtenerPruebaEnCurso(sesion.correo);
  const guardada = prueba ? prueba.respuestas[numeroPregunta] : null;

  const pregunta = preguntasPrueba[numeroPregunta - 1];
  if (!pregunta) {
    location.replace("pregunta-1.html");
    return;
  }

  document.title = `Pregunta ${numeroPregunta} · BranchMatch`;
  temaPregunta.textContent = pregunta.tema;
  tituloPregunta.textContent = pregunta.enunciado;
  listaOpciones.innerHTML = pregunta.opciones
    .map((texto, i) => {
      const letra = "ABCD"[i];
      return `<li>
        <input class="opcion__radio" type="radio" id="opcion-${letra}" name="respuesta" value="${letra}">
        <label class="opcion" for="opcion-${letra}"><span class="opcion__letra">${letra}</span> ${escaparHtml(texto)}</label>
      </li>`;
    })
    .join("");
  figuraCodigo.hidden = !pregunta.codigo;
  if (pregunta.codigo) bloqueCodigo.textContent = pregunta.codigo;
  rellenoPrueba.className = `barra-xp__relleno prueba-estado__relleno prueba-estado__relleno--${numeroPregunta}`;
  contadorPrueba.innerHTML = `Pregunta <strong>${numeroPregunta}</strong> de ${total}`;
  barraPrueba.setAttribute("aria-label", `Pregunta ${numeroPregunta} de ${total}`);
  // Ninguna opción llega marcada de antemano: solo la que el estudiante ya eligió
  formPregunta.querySelectorAll('input[name="respuesta"]').forEach((opcion) => {
    opcion.checked = opcion.value === guardada;
  });
  if (numeroPregunta >= total) botonSiguientePrueba.textContent = "Enviar";
};

const avanzarPregunta = (e) => {
  e.preventDefault();
  const sesion = obtenerSesion();
  const elegida = formPregunta.querySelector('input[name="respuesta"]:checked');
  if (!validarRespuesta(elegida)) return;

  guardarRespuestaPrueba(sesion.correo, numeroPregunta, elegida.value);
  if (numeroPregunta >= preguntasPrueba.length) {
    finalizarPrueba(sesion);
  } else {
    // La pregunta 1 tiene su página; de la 2 en adelante se usa pregunta-2.html (que trae el aviso de salir) con ?n=
    location.href = `pregunta-2.html?n=${numeroPregunta + 1}`;
  }
};

const pintarTemasResultado = (lista, temas, claseChip) => {
  lista.innerHTML = temas.length
    ? temas.map((tema) => `<li class="chip ${claseChip}">${escaparHtml(tema)}</li>`).join("")
    : '<li class="texto-secundario">Ninguno por ahora</li>';
};

const mostrarResultado = (sesion) => {
  const resultado = obtenerResultadoPrueba(sesion.correo);
  if (!resultado) {
    location.replace("inicio.html");
    return;
  }
  tituloResultado.textContent = `Eres nivel ${resultado.nivel}`;
  document.title = `Eres nivel ${resultado.nivel} · BranchMatch`;
  bajadaResultado.textContent = textosNivelPrueba[resultado.nivel];
  correctasResultado.textContent = `${resultado.correctas}/${resultado.total}`;
  tiempoResultado.textContent = formatearTiempoPrueba(resultado.segundos);
  xpResultado.textContent = `+${resultado.xpGanado} XP`;
  pintarTemasResultado(listaFortalezas, resultado.temasFuertes, "chip--menta");
  pintarTemasResultado(listaReforzar, resultado.temasDebiles, "chip--rosa");
};


// ===== Validaciones =====
// Muestra (o esconde) el mensaje "Elige una respuesta" justo debajo de las opciones
const mostrarErrorRespuesta = (mostrar) => {
  let zona = document.querySelector("#error-respuesta");
  if (!zona) {
    zona = document.createElement("div");
    zona.className = "campo";
    zona.id = "error-respuesta";
    zona.innerHTML = '<p class="campo__error" role="alert">Elige una respuesta para continuar.</p>';
    listaOpciones.after(zona);
  }
  // .campo__error solo se ve con .campo--error, así que no hace falta hidden
  zona.classList.toggle("campo--error", mostrar);
};

const validarRespuesta = (elegida) => {
  mostrarErrorRespuesta(!elegida);
  return Boolean(elegida);
};


// ===== Registro de eventos =====
if (botonComenzarPrueba) {
  mostrarDatosInicioPrueba();
  botonComenzarPrueba.addEventListener("click", () => {
    iniciarPrueba(obtenerSesion().correo);
  });
}

if (formPregunta && obtenerSesion()) {
  const sesionPrueba = obtenerSesion();
  // Si abre la pregunta sin haber pulsado "Comenzar", la prueba empieza ahora
  if (!obtenerPruebaEnCurso(sesionPrueba.correo)) iniciarPrueba(sesionPrueba.correo);

  mostrarPregunta(sesionPrueba);
  mostrarTiempoRestante(sesionPrueba);
  setInterval(() => mostrarTiempoRestante(sesionPrueba), 1000);

  formPregunta.addEventListener("submit", (e) => e.preventDefault());
  formPregunta.addEventListener("change", () => mostrarErrorRespuesta(false));
  botonSiguientePrueba.addEventListener("click", avanzarPregunta);

  // Salir de la prueba descarta las respuestas
  if (botonSalirPrueba && botonSalirPrueba.getAttribute("href") !== "#salir") {
    botonSalirPrueba.addEventListener("click", borrarPruebaEnCurso);
  }
  if (botonSalirDeTodosModos) {
    botonSalirDeTodosModos.addEventListener("click", borrarPruebaEnCurso);
  }
}

if (seccionResultado && obtenerSesion()) {
  mostrarResultado(obtenerSesion());
}
