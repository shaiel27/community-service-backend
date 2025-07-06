import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.js"

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        msg: "No token provided",
      })
    }

    const [bearer, token] = authHeader.split(" ")

    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({
        ok: false,
        msg: "Invalid token format",
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Verificar que el usuario existe y está activo
      const user = await UserModel.findOneById(decoded.userId)

      if (!user) {
        return res.status(401).json({
          ok: false,
          msg: "User not found",
        })
      }

      if (!user.is_active) {
        return res.status(403).json({
          ok: false,
          msg: "Account is inactive",
        })
      }

      req.user = decoded
      next()
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          ok: false,
          msg: "Token expired",
        })
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          ok: false,
          msg: "Invalid token",
        })
      }
      throw error
    }
  } catch (error) {
    console.error("Error in verifyToken:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
    })
  }
}

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findOneById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    // Verificar si tiene permisos de administrador (permiso_id = 1 es "Acceso Total")
    if (user.permiso_id !== 1) {
      return res.status(403).json({
        ok: false,
        msg: "Admin access required",
      })
    }

    next()
  } catch (error) {
    console.error("Error in verifyAdmin:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
    })
  }
}

export const verifyAdminOrReadOnly = async (req, res, next) => {
  try {
    const user = await UserModel.findOneById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    // Permitir acceso a administradores (permiso_id = 1) y usuarios con permisos de consulta (permiso_id = 4)
    // También permitir gestión académica (permiso_id = 2) y gestión personal (permiso_id = 3)
    const allowedPermissions = [1, 2, 3, 4]

    if (!allowedPermissions.includes(user.permiso_id)) {
      return res.status(403).json({
        ok: false,
        msg: "Insufficient permissions",
      })
    }

    next()
  } catch (error) {
    console.error("Error in verifyAdminOrReadOnly:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
    })
  }
}
