// ELEMENTOS DOM
const btnAgregar = document.getElementById("agregarLibro");
const inputLibro = document.getElementById("inputLibro");
const inputAutor = document.getElementById("inputAutor");
const listaLibros = document.getElementById("listaLibros");

const avatarPrincipal = document.getElementById("avatarPrincipal");
const uploadPrincipal = document.getElementById("uploadPrincipal");
const usernameDisplay = document.getElementById("username");

const abrirConfig = document.getElementById("abrirConfig");
const cerrarConfig = document.getElementById("cerrarConfig");
const configModal = document.getElementById("configModal");
const avatarModal = document.getElementById("avatarModal");
const uploadModal = document.getElementById("uploadModal");
const nombreUsuarioInput = document.getElementById("nombreUsuario");
const guardarPerfil = document.getElementById("guardarPerfil");

// CARGAR DATOS LOCALSTORAGE
window.addEventListener("load", () => {
  const savedAvatar = localStorage.getItem("userAvatar");
  const savedName = localStorage.getItem("username");
  const savedLibros = JSON.parse(localStorage.getItem("libros")) || [];

  if (savedAvatar) {
    avatarPrincipal.src = savedAvatar;
    avatarModal.src = savedAvatar;
  }
  if (savedName) usernameDisplay.textContent = savedName;

  savedLibros.forEach(libro => addLibroDOM(libro));
  actualizarTotal();
});

// FUNCIONES
function addLibroDOM(libro) {
  const libroDiv = document.createElement("div");
  libroDiv.classList.add("libro");
  libroDiv.innerHTML = `
    <h3>${libro.titulo}</h3>
    <p>${libro.autor}</p>
    <div class="acciones">
      <span class="calificacion">⭐${libro.calificacion || 0}</span>
      <button class="opinionBtn">💬 Opinión</button>
    </div>
    <ul class="opiniones"></ul>
  `;

  // Opiniones
  const btnOpinion = libroDiv.querySelector(".opinionBtn");
  const listaOpiniones = libroDiv.querySelector(".opiniones");
  if(libro.opiniones) libro.opiniones.forEach(o => {
    const li = document.createElement("li"); li.textContent = o; listaOpiniones.appendChild(li);
  });

  btnOpinion.addEventListener("click", () => {
    const texto = prompt("Escribe tu opinión sobre este libro:");
    if (texto) {
      const li = document.createElement("li");
      li.textContent = texto;
      listaOpiniones.appendChild(li);
      libro.opiniones = libro.opiniones || [];
      libro.opiniones.push(texto);
      guardarLibros();
    }
  });

  // Calificación
  const calSpan = libroDiv.querySelector(".calificacion");
  calSpan.addEventListener("click", () => {
    const valor = parseInt(prompt("Califica este libro del 1 al 5:"));
    if (valor >= 1 && valor <= 5) {
      calSpan.textContent = "⭐".repeat(valor);
      libro.calificacion = valor;
      guardarLibros();
    } else {
      alert("Número entre 1 y 5.");
    }
  });

  listaLibros.appendChild(libroDiv);
}

// Guardar libros en localStorage
function guardarLibros() {
  const libros = [];
  document.querySelectorAll(".libro").forEach(div => {
    const titulo = div.querySelector("h3").textContent;
    const autor = div.querySelector("p").textContent;
    const cal = div.querySelector(".calificacion").textContent.length - 1;
    const opiniones = Array.from(div.querySelectorAll(".opiniones li")).map(li => li.textContent);
    libros.push({titulo, autor, calificacion: cal, opiniones});
  });
  localStorage.setItem("libros", JSON.stringify(libros));
  actualizarTotal();
}

// Actualizar total
function actualizarTotal() {
  const total = document.querySelectorAll(".libro").length;
  document.getElementById("totalLibros").textContent = `📚 Total: ${total}`;
}

// AGREGAR LIBRO NUEVO
btnAgregar.addEventListener("click", () => {
  const titulo = inputLibro.value.trim();
  const autor = inputAutor.value.trim();
  if (!titulo || !autor) return alert("Ingresa título y autor");

  const libro = {titulo, autor, calificacion: 0, opiniones: []};
  addLibroDOM(libro);
  guardarLibros();
  inputLibro.value = ""; inputAutor.value = "";
});

// MODAL PERFIL
abrirConfig.addEventListener("click", () => configModal.style.display = "flex");
cerrarConfig.addEventListener("click", () => configModal.style.display = "none");
window.addEventListener("click", e => { if(e.target === configModal) configModal.style.display = "none"; });

// FOTO USUARIO
uploadPrincipal.addEventListener("change", function() {
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = e => {
      avatarPrincipal.src = e.target.result;
      avatarModal.src = e.target.result;
      localStorage.setItem("userAvatar", e.target.result);
    };
    reader.readAsDataURL(file);
  }
});
uploadModal.addEventListener("change", function() {
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = e => {
      avatarModal.src = e.target.result;
      avatarPrincipal.src = e.target.result;
      localStorage.setItem("userAvatar", e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// GUARDAR NOMBRE USUARIO
guardarPerfil.addEventListener("click", () => {
  const nuevo = nombreUsuarioInput.value.trim();
  if(nuevo) {
    usernameDisplay.textContent = nuevo;
    localStorage.setItem("username", nuevo);
  }
  configModal.style.display = "none";
});
