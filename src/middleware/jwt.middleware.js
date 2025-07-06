import jwt from "jsonwebtoken"
import { UsuarioModel } from "../models/user.model.js"

/**
 * Middleware para verificar token JWT
 * Extrae información del usuario y la adjunta a req.user
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      error: "Token no proporcionado",
    })
  }

  const [bearer, token] = authHeader.split(" ")

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({
      ok: false,
      error: "Formato de Authorization inválido. Use: Bearer <token>",
    })
  }

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Buscar el usuario en la base de datos para obtener información actualizada
    const usuario = await UsuarioModel.findById(decoded.userId)

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        error: "Token inválido o usuario no encontrado",
      })
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      return res.status(403).json({
        ok: false,
        error: "Usuario inactivo. Contacte al administrador.",
      })
    }

    // Adjuntar información del usuario a la request
    req.user = {
      userId: usuario.id,
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      permiso_id: usuario.permiso_id,
      permiso_nombre: usuario.permiso_nombre,
      personal_id: usuario.personal_id,
      personal_nombre: usuario.personal_nombre,
      personal_apellido: usuario.personal_apellido,
      rol_nombre: usuario.rol_nombre,
      // Información adicional útil
      isAdmin: Number(usuario.permiso_id) === 1,
      isReadOnly: Number(usuario.permiso_id) === 2,
      isPersonal: usuario.personal_id !== null,
    }

    next()
  } catch (error) {
    console.error("Error in verifyToken:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        ok: false,
        error: "Token inválido",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        ok: false,
        error: "Token expirado. Por favor, inicie sesión nuevamente.",
      })
    }

    res.status(500).json({
      ok: false,
      error: "Error en la verificación del token",
    })
  }
}

/**
 * Middleware para verificar permisos de administrador
 * Requiere permiso_id = 1 (Acceso Total)
 */
export const verifyAdmin = (req, res, next) => {
  console.log("=== VERIFICANDO PERMISOS DE ADMIN ===")
  console.log("Usuario:", req.user?.nombre_usuario)
  console.log("Permiso ID:", req.user?.permiso_id)
  console.log("Permiso Nombre:", req.user?.permiso_nombre)

  if (!req.user) {
    return res.status(401).json({
      ok: false,
      error: "Usuario no autenticado",
    })
  }

  // Convertir a número para asegurar la comparación correcta
  const permisoId = Number(req.user.permiso_id)

  // Permiso ID 1 = Admin con acceso completo
  if (permisoId === 1) {
    console.log("✅ Usuario tiene permisos de admin")
    return next()
  }

  console.log("❌ Usuario NO tiene permisos de admin")
  return res.status(403).json({
    ok: false,
    error: "Acceso denegado. Se requieren permisos de administrador.",
    details: {
      user_permiso_id: req.user.permiso_id,
      user_permiso_nombre: req.user.permiso_nombre,
      required_permiso_id: 1,
      required_permiso_nombre: "Acceso Total",
    },
  })
}

/**
 * Middleware para verificar permisos de administrador O solo lectura
 * Permite permiso_id = 1 (Acceso Total) o permiso_id = 2 (Solo Lectura)
 */
export const verifyAdminOrReadOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      ok: false,
      error: "Usuario no autenticado",
    })
  }

  const permisoId = Number(req.user.permiso_id)

  // Permitir tanto admin (1) como solo lectura (2)
  if (permisoId === 1 || permisoId === 2) {
    return next()
  }

  return res.status(403).json({
    ok: false,
    error: "Acceso denegado. Se requieren permisos de administrador o lectura.",
    details: {
      user_permiso_id: req.user.permiso_id,
      user_permiso_nombre: req.user.permiso_nombre,
      allowed_permiso_ids: [1, 2],
      allowed_permiso_nombres: ["Acceso Total", "Gestión Académica"],
    },
  })
}
