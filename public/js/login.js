import { buscarUsuarioPorCorreo, establecerUsuarioActual } from "./utilidades.js";

export class FormularioLogin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./public/vendor/bootstrap/css/bootstrap.min.css">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="card bg-light text-dark">
            <div class="card-body">
              <h2 class="h4 text-center mb-3">Iniciar sesión</h2>
              <form id="formulario">
                <div class="mb-3">
                  <label class="form-label">Correo</label>
                  <input type="email" id="correo" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input type="password" id="clave" class="form-control" required>
                </div>
                <button class="btn btn-primary w-100">Entrar</button>
              </form>
              <div class="text-center mt-3">
                <a href="registro.html">¿No tienes cuenta? Regístrate</a><br>
                <a href="index.html" class="small">Volver al inicio</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector("#formulario");
    const correo = this.shadowRoot.querySelector("#correo");
    const clave = this.shadowRoot.querySelector("#clave");

    form.addEventListener("submit", e => {
      e.preventDefault();
      const usuario = buscarUsuarioPorCorreo(correo.value.trim());
      if (!usuario || usuario.clave !== clave.value) {
        alert("Correo o contraseña incorrectos");
        return;
      }
      establecerUsuarioActual(usuario.correo);
      location.href = "panel.html";
    });
  }
}

customElements.define("formulario-login", FormularioLogin);
