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
      role_id: user.role_id,
      permission_id: user.permission_id,
      role_name: user.role_name,
      permission_name: user.permission_name,
      staff_id: user.staff_id,
      guardian_id: user.guardian_id,
    }

    // Debug: Log para verificar los datos del usuario
    console.log("Usuario autenticado:", {
      userId: req.user.userId,
      username: req.user.username,
      permission_id: req.user.permission_id,
      permission_name: req.user.permission_name,
      role_id: req.user.role_id,
    })

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

// Verificar si el usuario tiene permisos de administrador (permission_id = 1)
export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  // Debug: Log para verificar la comparación
  console.log("Verificando permisos de admin:", {
    user_permission_id: req.user.permission_id,
    user_permission_id_type: typeof req.user.permission_id,
    is_admin: req.user.permission_id === 1,
    comparison_result: req.user.permission_id !== 1,
  })

  // Asegurar que permission_id sea un número para la comparación
  const userPermissionId = Number.parseInt(req.user.permission_id)

  // Permission ID 1 = 'enroll_student' = Acceso completo (Admin)
  if (userPermissionId !== 1) {
    return res.status(403).json({
      error: "Acceso denegado. Se requieren permisos de administrador.",
      required_permission: "enroll_student (permission_id: 1)",
      user_permission: `${req.user.permission_name} (permission_id: ${req.user.permission_id})`,
      debug_info: {
        user_permission_id: req.user.permission_id,
        user_permission_id_type: typeof req.user.permission_id,
        parsed_permission_id: userPermissionId,
        comparison_result: userPermissionId !== 1,
      },
    })
  }
  next()
}

// Verificar si el usuario tiene permisos de solo lectura (permission_id = 2)
export const verifyReadOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  const userPermissionId = Number.parseInt(req.user.permission_id)

  if (userPermissionId !== 2) {
    return res.status(403).json({
      error: "Acceso denegado. Se requieren permisos de solo lectura.",
      required_permission: "view_records (permission_id: 2)",
      user_permission: `${req.user.permission_name} (permission_id: ${req.user.permission_id})`,
    })
  }
  next()
}

// Verificar si el usuario tiene permisos de administrador O solo lectura
export const verifyAdminOrReadOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  const userPermissionId = Number.parseInt(req.user.permission_id)

  // Permitir tanto admin (1) como solo lectura (2)
  if (userPermissionId !== 1 && userPermissionId !== 2) {
    return res.status(403).json({
      error: "Acceso denegado. Se requieren permisos de administrador o lectura.",
      required_permissions: "enroll_student (1) o view_records (2)",
      user_permission: `${req.user.permission_name} (permission_id: ${req.user.permission_id})`,
    })
  }
  next()
}

// Verificar por rol específico
export const verifyTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  const userRoleId = Number.parseInt(req.user.role_id)

  if (userRoleId !== 1) {
    return res.status(403).json({
      error: "Acceso denegado. Solo para docentes.",
      user_role_id: req.user.role_id,
      required_role_id: 1,
    })
  }
  next()
}

export const verifyMaintenance = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  const userRoleId = Number.parseInt(req.user.role_id)

  if (userRoleId !== 3) {
    return res.status(403).json({
      error: "Acceso denegado. Solo para personal de mantenimiento.",
      user_role_id: req.user.role_id,
      required_role_id: 3,
    })
  }
  next()
}

export const verifyStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  if (!req.user.staff_id) {
    return res.status(403).json({ error: "Acceso denegado. Solo para personal de la institución." })
  }
  next()
}

export const verifyGuardian = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  if (!req.user.guardian_id) {
    return res.status(403).json({ error: "Acceso denegado. Solo para representantes." })
  }
  next()
}

// Middleware personalizado para verificar permisos específicos
export const verifyPermission = (permissionName) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    try {
      if (req.user.permission_name !== permissionName) {
        return res.status(403).json({
          error: `Acceso denegado. Se requiere el permiso: ${permissionName}`,
          user_permission: req.user.permission_name,
        })
      }
      next()
    } catch (error) {
      console.error("Error in verifyPermission:", error)
      return res.status(500).json({ error: "Error al verificar permisos" })
    }
  }
}
