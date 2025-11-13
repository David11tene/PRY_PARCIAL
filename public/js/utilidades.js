// ===== Funciones auxiliares en español =====

export const CLAVE_USUARIOS = "usuarios";
export const CLAVE_ACTUAL = "usuario_actual";

// --- Manejo de LocalStorage ---
export function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

export function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

export function buscarUsuarioPorCorreo(correo) {
  return obtenerUsuarios().find(u => u.correo === correo);
}

export function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  const indice = usuarios.findIndex(u => u.correo === usuario.correo);
  if (indice >= 0) usuarios[indice] = usuario;
  else usuarios.push(usuario);
  guardarUsuarios(usuarios);
}

export function establecerUsuarioActual(correo) {
  localStorage.setItem(CLAVE_ACTUAL, correo);
}

export function obtenerUsuarioActual() {
  const correo = localStorage.getItem(CLAVE_ACTUAL);
  if (!correo) return null;
  return buscarUsuarioPorCorreo(correo);
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_ACTUAL);
}

// --- Cámara: tomar imagen ---
export function capturarImagen(video) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);
  return canvas.toDataURL("image/png");
}

// --- Descargar JSON ---
export function descargarJSON(nombre, datos) {
  const json = JSON.stringify(datos, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}
