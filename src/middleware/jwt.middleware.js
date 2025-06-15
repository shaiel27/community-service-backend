import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.js"

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" })
  }

  const [bearer, token] = authHeader.split(" ")

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ error: "Formato de Authorization inválido" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserModel.findUserByAccessToken(token)

    if (!user) {
      return res.status(401).json({ error: "Token inválido o expirado" })
    }

    req.user = {
      userId: user.id,
      username: user.username,
      permiso_id: user.permiso_id,
      permiso_nombre: user.permiso_nombre,
      personal_id: user.personal_id,
      personal_nombre: user.personal_nombre,
      personal_apellido: user.personal_apellido,
      rol_nombre: user.rol_nombre,
    }

    next()
  } catch (error) {
    console.error("Error in verifyToken:", error)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" })
    }
    res.status(500).json({ error: "Error en la verificación del token" })
  }
}

// MIDDLEWARE SIMPLIFICADO - Verificar si el usuario tiene permisos de administrador
export const verifyAdmin = (req, res, next) => {
  console.log("=== VERIFICANDO PERMISOS DE ADMIN ===")
  console.log("req.user completo:", req.user)
  console.log("permiso_id:", req.user.permiso_id)
  console.log("tipo de permiso_id:", typeof req.user.permiso_id)
  console.log("permiso_nombre:", req.user.permiso_nombre)

  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  // Convertir a número para asegurar la comparación correcta
  const permisoId = Number(req.user.permiso_id)
  console.log("permiso_id convertido a número:", permisoId)
  console.log("¿Es igual a 1?:", permisoId === 1)

  // Permiso ID 1 = Admin con acceso completo
  if (permisoId === 1) {
    console.log("✅ Usuario tiene permisos de admin, continuando...")
    return next()
  }

  console.log("❌ Usuario NO tiene permisos de admin")
  return res.status(403).json({
    error: "Acceso denegado. Se requieren permisos de administrador.",
    user_permiso_id: req.user.permiso_id,
    user_permiso_nombre: req.user.permiso_nombre,
    required_permiso_id: 1,
  })
}

// Verificar si el usuario tiene permisos de administrador O solo lectura
export const verifyAdminOrReadOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  const permisoId = Number(req.user.permiso_id)

  // Permitir tanto admin (1) como solo lectura (2)
  if (permisoId === 1 || permisoId === 2) {
    return next()
  }

  return res.status(403).json({
    error: "Acceso denegado. Se requieren permisos de administrador o lectura.",
    user_permiso_id: req.user.permiso_id,
    user_permiso_nombre: req.user.permiso_nombre,
    allowed_permiso_ids: [1, 2],
  })
}

// Verificar si el usuario es personal de la escuela
export const verifyPersonal = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  if (req.user.personal_id) {
    return next()
  }

  return res.status(403).json({
    error: "Acceso denegado. Solo para personal de la institución.",
  })
}

// Middleware personalizado para verificar permisos específicos por nombre
export const verifyPermission = (permisoNombre) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    try {
      if (req.user.permiso_nombre !== permisoNombre) {
        return res.status(403).json({
          error: `Acceso denegado. Se requiere el permiso: ${permisoNombre}`,
          user_permiso: req.user.permiso_nombre,
        })
      }
      next()
    } catch (error) {
      console.error("Error in verifyPermission:", error)
      return res.status(500).json({ error: "Error al verificar permisos" })
    }
  }
}
