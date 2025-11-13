export class InicioApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./public/vendor/bootstrap/css/bootstrap.min.css">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="card bg-light text-dark">
              <div class="card-body text-center">
                <h1 class="h3 mb-2">Aplicación Proyecto Parcil 1</h1>
                <p class="text-muted mb-4">
                  Calculo de promedio de notas y analisis de aprobado o reprobado la materia
                </p>
                <div class="d-grid gap-3">
                  <button id="btnLogin" class="btn btn-primary">Iniciar sesión</button>
                  <button id="btnRegistro" class="btn btn-success">Registrarse</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#btnLogin")
      .addEventListener("click", () => location.href = "login.html");

    this.shadowRoot.querySelector("#btnRegistro")
      .addEventListener("click", () => location.href = "registro.html");
  }
}

customElements.define("inicio-app", InicioApp);