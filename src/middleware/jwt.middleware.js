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
    // Usamos findUserByAccessToken en lugar de findUserByLoginToken
    const user = await UserModel.findUserByAccessToken(token)

    if (!user) {
      return res.status(401).json({ error: "Token inválido o expirado" })
    }

    // Actualizamos la estructura del objeto req.user para que coincida con la tabla user_account
    req.user = {
      userId: user.id,
      username: user.username,
      role_id: user.role_id,
      permission_id: user.permission_id,
      role_name: user.role_name,
      permission_name: user.permission_name,
      staff_id: user.staff_id,
      guardian_id: user.guardian_id,
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

export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  // Asumiendo que role_id = 2 es para administradores según los datos SQL
  if (req.user.role_id !== 2) {
    return res.status(403).json({ error: "Acceso denegado. Solo para administradores." })
  }
  next()
}

export const verifyTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  // Asumiendo que role_id = 1 es para docentes según los datos SQL
  if (req.user.role_id !== 1) {
    return res.status(403).json({ error: "Acceso denegado. Solo para docentes." })
  }
  next()
}

export const verifyMaintenance = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  // Asumiendo que role_id = 3 es para personal de mantenimiento según los datos SQL
  if (req.user.role_id !== 3) {
    return res.status(403).json({ error: "Acceso denegado. Solo para personal de mantenimiento." })
  }
  next()
}

export const verifyStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  // Verificar si el usuario es cualquier tipo de personal (tiene staff_id)
  if (!req.user.staff_id) {
    return res.status(403).json({ error: "Acceso denegado. Solo para personal de la institución." })
  }
  next()
}

export const verifyGuardian = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  // Verificar si el usuario es un representante (tiene guardian_id)
  if (!req.user.guardian_id) {
    return res.status(403).json({ error: "Acceso denegado. Solo para representantes." })
  }
  next()
}

export const verifyPermission = (permissionName) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    try {
      // Verificar si el usuario tiene el permiso específico
      if (req.user.permission_name !== permissionName) {
        return res.status(403).json({
          error: `Acceso denegado. Se requiere el permiso: ${permissionName}`,
        })
      }
      next()
    } catch (error) {
      console.error("Error in verifyPermission:", error)
      return res.status(500).json({ error: "Error al verificar permisos" })
    }
  }
}
