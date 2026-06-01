// Utilidades de autenticación
import bcrypt from "bcryptjs";

// Hashear contraseña antes de guardar en BD
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verificar contraseña ingresada vs hash guardado
export async function verificarPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
