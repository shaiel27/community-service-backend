import { UsuarioModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

/**
 * Registrar un nuevo usuario
 */
const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      permiso_id,
      security_word,
      respuesta_de_seguridad,
      personal_id = null,
    } = req.body

    // Validaciones básicas
    if (!username || !email || !password || !permiso_id || !security_word || !respuesta_de_seguridad) {
      return res.status(400).json({
        ok: false,
        msg: "Todos los campos obligatorios deben ser proporcionados",
        required: ["username", "email", "password", "permiso_id", "security_word", "respuesta_de_seguridad"],
      })
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña debe tener al menos 6 caracteres",
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        msg: "Formato de email inválido",
      })
    }

    // Crear el usuario
    const newUser = await UsuarioModel.create({
      username,
      email,
      password,
      permiso_id,
      security_word,
      respuesta_de_seguridad,
      personal_id,
    })

    return res.status(201).json({
      ok: true,
      msg: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        permiso_id: newUser.permiso_id,
        personal_id: newUser.personal_id,
        created_at: newUser.created_at,
      },
    })
  } catch (error) {
    console.error("Error in registerUser:", error)

    // Manejar errores específicos
    if (error.message.includes("ya existe") || error.message.includes("already exists")) {
      return res.status(400).json({
        ok: false,
        msg: error.message,
      })
    }

    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Login de usuario
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: "Email y contraseña son obligatorios",
      })
    }

    // Buscar usuario por email
    const user = await UsuarioModel.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Credenciales inválidas",
      })
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        ok: false,
        msg: "Credenciales inválidas",
      })
    }

    // Verificar que el usuario esté activo
    if (!user.is_active) {
      return res.status(403).json({
        ok: false,
        msg: "Usuario inactivo. Contacte al administrador.",
      })
    }

    // Generar JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        permiso_id: user.permiso_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    )

    return res.json({
      ok: true,
      msg: "Login exitoso",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        permiso_id: user.permiso_id,
        permiso_nombre: user.permiso_nombre,
        personal_id: user.personal_id,
        personal_nombre: user.personal_nombre,
        personal_apellido: user.personal_apellido,
        rol_nombre: user.rol_nombre,
      },
      accessToken: token,
      expiresIn: "24h",
    })
  } catch (error) {
    console.error("Error in loginUser:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener perfil del usuario
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await UsuarioModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      })
    }

    return res.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        permiso_id: user.permiso_id,
        permiso_nombre: user.permiso_nombre,
        personal_id: user.personal_id,
        personal_nombre: user.personal_nombre,
        personal_apellido: user.personal_apellido,
        rol_nombre: user.rol_nombre,
        is_active: user.is_active,
        created_at: user.created_at,
      },
    })
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Listar todos los usuarios (solo admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await UsuarioModel.findAll()

    return res.json({
      ok: true,
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        permiso_id: user.permiso_id,
        permiso_nombre: user.permiso_nombre,
        personal_id: user.personal_id,
        personal_nombre: user.personal_nombre,
        personal_apellido: user.personal_apellido,
        rol_nombre: user.rol_nombre,
        is_active: user.is_active,
        created_at: user.created_at,
      })),
      total: users.length,
    })
  } catch (error) {
    console.error("Error in getAllUsers:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Cambiar contraseña
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId
    const { currentPassword, newPassword } = req.body

    // Validaciones
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña actual y nueva contraseña son obligatorias",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: "La nueva contraseña debe tener al menos 6 caracteres",
      })
    }

    // Buscar usuario
    const user = await UsuarioModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      })
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        ok: false,
        msg: "Contraseña actual incorrecta",
      })
    }

    // Actualizar contraseña
    await UsuarioModel.updatePassword(userId, newPassword)

    return res.json({
      ok: true,
      msg: "Contraseña actualizada exitosamente",
    })
  } catch (error) {
    console.error("Error in changePassword:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener pregunta de seguridad
 */
const getSecurityQuestion = async (req, res) => {
  try {
    const { username } = req.params

    const user = await UsuarioModel.findByUsername(username)
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      })
    }

    return res.json({
      ok: true,
      security_word: user.security_word,
    })
  } catch (error) {
    console.error("Error in getSecurityQuestion:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Verificar respuesta de seguridad
 */
const verifySecurityAnswer = async (req, res) => {
  try {
    const { username, securityAnswer } = req.body

    if (!username || !securityAnswer) {
      return res.status(400).json({
        ok: false,
        msg: "Username y respuesta de seguridad son obligatorios",
      })
    }

    const isValid = await UsuarioModel.verifySecurityAnswer(username, securityAnswer)
    if (!isValid) {
      return res.status(401).json({
        ok: false,
        msg: "Respuesta de seguridad incorrecta",
      })
    }

    return res.json({
      ok: true,
      msg: "Respuesta de seguridad correcta",
    })
  } catch (error) {
    console.error("Error in verifySecurityAnswer:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Logout
 */
const logout = async (req, res) => {
  try {
    return res.json({
      ok: true,
      msg: "Logout exitoso",
    })
  } catch (error) {
    console.error("Error in logout:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const UserController = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  changePassword,
  getSecurityQuestion,
  verifySecurityAnswer,
  logout,
}
