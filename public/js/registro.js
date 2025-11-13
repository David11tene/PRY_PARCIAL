// Importa funciones auxiliares desde `utilidades.js`
import {
  buscarUsuarioPorCorreo,
  guardarUsuario,
  establecerUsuarioActual,
  capturarImagen
} from "./utilidades.js";

export class FormularioRegistro extends HTMLElement {
  flujo = null; // MediaStream de la cámara
  foto = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // Inserta el HTML directamente en el shadow DOM
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./public/vendor/bootstrap/css/bootstrap.min.css">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-7">
          <div class="card bg-light text-dark">
            <div class="card-body">
              <h2 class="h4 text-center mb-3">Registro</h2>

              <form id="formulario" autocomplete="off">
                <div class="mb-3">
                  <label class="form-label">Nombre completo</label>
                  <input type="text" id="nombre" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Correo</label>
                  <input type="email" id="correo" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input type="password" id="clave" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Fecha de nacimiento</label>
                  <input type="date" id="nacimiento" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Carrera</label>
                  <select id="carrera" class="form-select" required>
                    <option value="">Seleccione...</option>
                    <option>Ingeniería de Software</option>
                    <option>Ingeniería en Tecnologías de la Información</option>
                    <option>Contabilidad</option>
                    <option>Administración de Empresas</option>
                    <option>Diseño Gráfico</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Toma tu foto</label>
                  <video id="video" autoplay playsinline class="bg-dark w-100 rounded"></video>
                  <button id="btnFoto" type="button" class="btn btn-outline-secondary mt-2">
                    Tomar foto
                  </button>
                  <div class="small text-muted mt-1">La foto se usará en tu perfil.</div>
                </div>

                <button class="btn btn-success w-100 mt-3">Registrar</button>
              </form>

              <div class="text-center mt-3">
                <a href="login.html">¿Ya tienes cuenta? Inicia sesión</a><br>
                <a href="index.html" class="small">Volver al inicio</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async connectedCallback() {
    const video = this.shadowRoot.querySelector("#video");
    const btnFoto = this.shadowRoot.querySelector("#btnFoto");
    const form = this.shadowRoot.querySelector("#formulario");

    try {
      this.flujo = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.flujo;
    } catch (err) {
      alert("No se pudo activar la cámara: " + err.message);
    }

    btnFoto.addEventListener("click", () => {
      if (!video.videoWidth) {
        alert("Esperando la cámara...");
        return;
      }
      this.foto = capturarImagen(video);
      btnFoto.textContent = "Foto tomada";
      btnFoto.classList.replace("btn-outline-secondary", "btn-success");
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      const nombre = this.shadowRoot.querySelector("#nombre").value.trim();
      const correo = this.shadowRoot.querySelector("#correo").value.trim();
      const clave = this.shadowRoot.querySelector("#clave").value.trim();
      const nacimiento = this.shadowRoot.querySelector("#nacimiento").value;
      const carrera = this.shadowRoot.querySelector("#carrera").value;

      if (buscarUsuarioPorCorreo(correo)) {
        alert("Ya existe un usuario con ese correo");
        return;
      }

      const nuevo = {
        nombre,
        correo,
        clave,
        nacimiento,
        carrera,
        foto: this.foto,
        materias: []
      };

      guardarUsuario(nuevo);
      establecerUsuarioActual(correo);
      location.href = "panel.html";
    });
  }

  disconnectedCallback() {
    if (this.flujo) {
      this.flujo.getTracks().forEach(t => t.stop());
    }
  }
}

customElements.define("formulario-registro", FormularioRegistro);