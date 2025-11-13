// Importa utilidades para manejo de usuarios y almacenamiento
import * as utils from "./utilidades.js";

// Componente que muestra y gestiona el panel del usuario (perfil, materias y sesión)
export class PanelUsuario extends HTMLElement {
  constructor() {
    super();
    // Construye el shadow DOM e inserta el HTML del panel
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./public/vendor/bootstrap/css/bootstrap.min.css">

      <div class="row g-4">
        <div class="col-12 col-lg-4">
          <div class="card bg-light text-dark h-100">
            <img id="foto" class="card-img-top" alt="Foto de perfil">
            <div class="card-body">
              <h5 id="nombre"></h5>
              <p id="correo" class="text-muted mb-1"></p>
              <p class="mb-1"><strong>Carrera:</strong> <span id="carrera"></span></p>
              <p class="mb-1"><strong>Fecha de nacimiento:</strong> <span id="nacimiento"></span></p>
              <p class="mb-1"><strong>Edad:</strong> <span id="edad"></span> años</p>
            </div>

            <div class="card-footer d-flex gap-2">
              <button id="btnSalir" class="btn btn-outline-danger btn-sm ms-auto">Cerrar sesión</button>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-8">
          <div class="card bg-light text-dark h-100">
            <div class="card-body">
              <h3 class="h5 mb-3">Registrar materia y notas (0-20)</h3>

              <form id="formMateria" class="row g-3 mb-3">
                <div class="col-12">
                  <label class="form-label">Nombre de la materia</label>
                  <input type="text" id="nombreMateria" class="form-control" required>
                </div>

                <div class="col-12 col-md-4">
                  <label class="form-label">Nota 1</label>
                  <input type="number" id="n1" class="form-control" required>
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label">Nota 2</label>
                  <input type="number" id="n2" class="form-control" required>
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label">Nota 3</label>
                  <input type="number" id="n3" class="form-control" required>
                </div>

                <div class="col-12">
                  <button class="btn btn-primary">Guardar materia</button>
                  <span class="small text-muted ms-2">
                    Se aprueba con promedio ≥ 14.
                  </span>
                </div>
              </form>

              <h4 class="h6 mt-4 mb-2">Mis materias</h4>
              <div class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Materia</th>
                      <th>Notas</th>
                      <th>Promedio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody id="cuerpoMaterias"></tbody>
                </table>
              </div>

              <p class="small text-muted mt-2" id="mensajeMaterias">
                Aún no has registrado materias.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Inicializa el componente: obtiene usuario, redirige si no hay sesión y configura la vista
  connectedCallback() {
    this.usuario = utils.obtenerUsuarioActual();
    if (!this.usuario) {
      location.href = "login.html";
      return;
    }

    this.mostrarDatos();
    this.configEventos();
    this.mostrarMaterias();
  }

  // Rellena los datos del perfil del usuario en los elementos del shadow DOM
  mostrarDatos() {
    const u = this.usuario;

    this.shadowRoot.querySelector("#nombre").textContent = u.nombre;
    this.shadowRoot.querySelector("#correo").textContent = u.correo;
    this.shadowRoot.querySelector("#carrera").textContent = u.carrera;
    this.shadowRoot.querySelector("#nacimiento").textContent = u.nacimiento;
    this.shadowRoot.querySelector("#foto").src =
      u.foto || "https://via.placeholder.com/600x400?text=Sin+foto";

    this.shadowRoot.querySelector("#edad").textContent = this.calcularEdad(u.nacimiento);
  }

  // Asocia eventos del UI: formulario de materia y botón de cerrar sesión
  configEventos() {
    this.shadowRoot.querySelector("#formMateria").addEventListener("submit", e => {
      e.preventDefault();
      this.agregarMateria();
    });

    this.shadowRoot.querySelector("#btnSalir").addEventListener("click", () => {
      utils.cerrarSesion();
      location.href = "login.html";
    });
  }

  // Calcula la edad (años) a partir de la fecha de nacimiento proporcionada
  calcularEdad(fecha) {
    const hoy = new Date();
    const nac = new Date(fecha);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }

  // Valida y agrega/actualiza una materia en el perfil del usuario y guarda los cambios
  agregarMateria() {
    const nombreMateria = this.shadowRoot.querySelector("#nombreMateria").value.trim();
    const n1 = Number(this.shadowRoot.querySelector("#n1").value);
    const n2 = Number(this.shadowRoot.querySelector("#n2").value);
    const n3 = Number(this.shadowRoot.querySelector("#n3").value);

    if (!nombreMateria) {
      alert("Ingrese el nombre de la materia.");
      return;
    }

    const notas = [n1, n2, n3];
    const validas = notas.every(n => !isNaN(n) && n >= 0 && n <= 20);

    if (!validas) {
      alert("Todas las notas deben ser números entre 0 y 20.");
      return;
    }

    const promedio = ((n1 + n2 + n3) / 3).toFixed(2);
    const estado = promedio >= 14 ? "Aprobado" : "Reprobado";

    if (!Array.isArray(this.usuario.materias)) {
      this.usuario.materias = [];
    }

    const materia = {
      nombre: nombreMateria,
      notas,
      promedio,
      estado
    };

    const idx = this.usuario.materias.findIndex(
      m => m.nombre.toLowerCase() === materia.nombre.toLowerCase()
    );

    if (idx >= 0) {
      this.usuario.materias[idx] = materia;
    } else {
      this.usuario.materias.push(materia);
    }

    utils.guardarUsuario(this.usuario);
    this.mostrarMaterias();
    this.shadowRoot.querySelector("#formMateria").reset();
  }

  // Renderiza la lista de materias del usuario en la tabla del panel
  mostrarMaterias() {
    const cont = this.shadowRoot.querySelector("#cuerpoMaterias");
    const msg = this.shadowRoot.querySelector("#mensajeMaterias");
    cont.innerHTML = "";

    const lista = this.usuario.materias || [];

    if (lista.length === 0) {
      msg.style.display = "block";
      return;
    }

    msg.style.display = "none";

    lista.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.nombre}</td>
        <td>${m.notas.join(" - ")}</td>
        <td>${m.promedio}</td>
        <td>
          <span class="badge ${m.estado === "Aprobado" ? "bg-success" : "bg-danger"}">
            ${m.estado}
          </span>
        </td>
      `;
      cont.appendChild(tr);
    });
  }
}

customElements.define("panel-usuario", PanelUsuario);