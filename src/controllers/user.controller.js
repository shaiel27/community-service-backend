import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.js"
import crypto from "crypto"

// Claves por defecto para desarrollo
const JWT_SECRET = process.env.JWT_SECRET || "escuela-jwt-secret-key-2024-development"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "escuela-refresh-secret-key-2024-development"

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    console.log("🔍 LOGIN - Intento de login para:", email)

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: "Email and password are required",
      })
    }

    console.log("🔍 LOGIN - Buscando usuario en BD...")
    const user = await UserModel.findOneByEmail(email)

    if (!user) {
      console.log("❌ LOGIN - Usuario no encontrado")
      return res.status(400).json({
        ok: false,
        msg: "Invalid email",
      })
    }

    console.log("✅ LOGIN - Usuario encontrado:", {
      id: user.id,
      username: user.username,
      email: user.email,
      is_active: user.is_active,
      permiso_id: user.permiso_id,
    })

    if (!user.is_active) {
      console.log("❌ LOGIN - Usuario inactivo")
      return res.status(403).json({
        ok: false,
        msg: "Account is inactive. Please contact an administrator",
      })
    }

    console.log("🔑 LOGIN - Verificando contraseña...")
    const validPassword = await bcryptjs.compare(password, user.password)

    if (!validPassword) {
      console.log("❌ LOGIN - Contraseña incorrecta")
      return res.status(400).json({
        ok: false,
        msg: "Invalid password",
      })
    }

    console.log("🎉 LOGIN - Credenciales válidas, generando tokens...")

    // Generate access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        permiso_id: user.permiso_id,
        personal_id: user.personal_id,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Generate refresh token
    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    )

    console.log("✅ LOGIN - Tokens generados exitosamente")
    console.log("🔑 LOGIN - Access token para userId:", user.id)

    // Update last login (opcional, no fallar si hay error)
    try {
      await UserModel.updateLastLogin(user.id)
    } catch (updateError) {
      console.log("⚠️ LOGIN - Error actualizando last_login (no crítico):", updateError.message)
    }

    res.json({
      ok: true,
      msg: "Login successful",
      accessToken,
      refreshToken,
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
    })
  } catch (error) {
    console.error("❌ LOGIN - Error general:", error)
    res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        ok: false,
        msg: "Refresh token is required",
      })
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
      const userId = decoded.userId

      console.log("🔄 REFRESH - Token válido para userId:", userId)

      // Get the user
      const user = await UserModel.findOneById(userId)
      if (!user) {
        return res.status(404).json({
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

      // Generate new access token
      const accessToken = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          permiso_id: user.permiso_id,
          personal_id: user.personal_id,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      )

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        {
          userId: user.id,
        },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
      )

      console.log("✅ REFRESH - Nuevos tokens generados")

      return res.json({
        ok: true,
        accessToken,
        refreshToken: newRefreshToken,
      })
    } catch (error) {
      console.error("❌ REFRESH - Error verificando token:", error.message)

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          ok: false,
          msg: "Refresh token expired",
        })
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          ok: false,
          msg: "Invalid refresh token",
        })
      }
      throw error
    }
  } catch (error) {
    console.error("Error in refreshToken:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
    })
  }
}

const logout = async (req, res) => {
  try {
    // En este sistema simplificado, el logout solo confirma que el token es válido
    // El cliente debe eliminar el token de su almacenamiento local
    return res.json({
      ok: true,
      msg: "Logged out successfully",
    })
  } catch (error) {
    console.error("Error in logout:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
    })
  }
}

const profile = async (req, res) => {
  try {
    console.log("👤 PROFILE - Solicitado para userId:", req.user.userId)

    const userId = req.user.userId
    const user = await UserModel.findOneById(userId)

    if (!user) {
      console.log("❌ PROFILE - Usuario no encontrado")
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    console.log("✅ PROFILE - Usuario encontrado:", user.username)

    // Remover campos sensibles
    const {
      password: _,
      security_word: __,
      respuesta_de_seguridad: ___,
      password_reset_token: ____,
      password_reset_expires: _____,
      email_verification_token: ______,
      ...userWithoutSensitiveInfo
    } = user

    return res.json({
      ok: true,
      user: userWithoutSensitiveInfo,
    })
  } catch (error) {
    console.error("❌ PROFILE - Error:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const listUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll()
    return res.json({
      ok: true,
      users,
      total: users.length,
    })
  } catch (error) {
    console.error("Error in listUsers:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    const { email, security_word, respuesta_de_seguridad } = req.body

    // Check if email is being updated and if it already exists
    if (email) {
      const existingUserByEmail = await UserModel.findOneByEmail(email)
      if (existingUserByEmail && existingUserByEmail.id !== userId) {
        return res.status(400).json({
          ok: false,
          msg: "Email already exists",
        })
      }
    }

    const updatedUser = await UserModel.updateProfile(userId, {
      email,
      security_word,
      respuesta_de_seguridad,
    })

    if (!updatedUser) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    return res.json({
      ok: true,
      msg: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error in updateProfile:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

// Nueva función para actualizar perfil con validación de seguridad
const updateProfileWithSecurity = async (req, res) => {
  try {
    const userId = req.user.userId
    const { email, security_word, respuesta_de_seguridad, current_security_answer } = req.body

    if (!current_security_answer) {
      return res.status(400).json({
        ok: false,
        msg: "Current security answer is required",
      })
    }

    // Check if email is being updated and if it already exists
    if (email) {
      const existingUserByEmail = await UserModel.findOneByEmail(email)
      if (existingUserByEmail && existingUserByEmail.id !== userId) {
        return res.status(400).json({
          ok: false,
          msg: "Email already exists",
        })
      }
    }

    const updatedUser = await UserModel.updateProfileWithSecurity(userId, {
      email,
      security_word,
      respuesta_de_seguridad,
      current_security_answer,
    })

    return res.json({
      ok: true,
      msg: "Profile updated successfully with security validation",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error in updateProfileWithSecurity:", error)

    if (error.message === "Invalid security answer") {
      return res.status(400).json({
        ok: false,
        msg: "Invalid security answer",
      })
    }

    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Current password and new password are required",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: "New password must be at least 6 characters long",
      })
    }

    const user = await UserModel.findOneById(userId)
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    const validPassword = await bcryptjs.compare(currentPassword, user.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Current password is incorrect",
      })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(newPassword, salt)

    await UserModel.updatePassword(userId, hashedPassword)

    return res.json({
      ok: true,
      msg: "Password changed successfully",
    })
  } catch (error) {
    console.error("Error in changePassword:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

// Nueva función para cambiar contraseña con palabra de seguridad
const changePasswordWithSecurity = async (req, res) => {
  try {
    const { username, respuesta_de_seguridad, newPassword } = req.body

    if (!username || !respuesta_de_seguridad || !newPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Username, security answer, and new password are required",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: "New password must be at least 6 characters long",
      })
    }

    const updatedUser = await UserModel.changePasswordWithSecurity(username, respuesta_de_seguridad, newPassword)

    return res.json({
      ok: true,
      msg: "Password changed successfully using security question",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error("Error in changePasswordWithSecurity:", error)

    if (error.message === "Invalid username or security answer") {
      return res.status(400).json({
        ok: false,
        msg: "Invalid username or security answer",
      })
    }

    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { username } = req.body

    if (!username) {
      return res.status(400).json({
        ok: false,
        msg: "Username is required",
      })
    }

    const user = await UserModel.findOneByUsername(username)
    if (!user) {
      return res.json({
        ok: true,
        msg: "If your username exists in our system, you will receive a password reset token",
      })
    }

    const resetToken = crypto.randomBytes(20).toString("hex")
    await UserModel.setPasswordResetToken(user.id, resetToken)

    return res.json({
      ok: true,
      msg: "If your username exists in our system, you will receive a password reset token",
      resetToken,
    })
  } catch (error) {
    console.error("Error in forgotPassword:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Token and new password are required",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: "New password must be at least 6 characters long",
      })
    }

    const user = await UserModel.findByPasswordResetToken(token)
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid or expired password reset token",
      })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(newPassword, salt)

    await UserModel.updatePassword(user.id, hashedPassword)
    await UserModel.clearPasswordResetToken(user.id)

    return res.json({
      ok: true,
      msg: "Password has been reset successfully",
    })
  } catch (error) {
    console.error("Error in resetPassword:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const activateUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findOneById(id)
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    const updatedUser = await UserModel.setActive(id, true)

    return res.json({
      ok: true,
      msg: "User activated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error in activateUser:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findOneById(id)
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    const updatedUser = await UserModel.setActive(id, false)

    return res.json({
      ok: true,
      msg: "User deactivated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error in deactivateUser:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findOneById(id)
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    const result = await UserModel.remove(id)

    return res.json({
      ok: true,
      msg: "User deleted successfully",
      id: result.id,
    })
  } catch (error) {
    console.error("Error in deleteUser:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const searchUsers = async (req, res) => {
  try {
    const { username } = req.query
    if (!username) {
      return res.status(400).json({
        ok: false,
        msg: "Username parameter is required",
      })
    }

    const users = await UserModel.searchByUsername(username)
    return res.json({
      ok: true,
      users,
      total: users.length,
    })
  } catch (error) {
    console.error("Error in searchUsers:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    const user = await UserModel.verifyEmail(token)
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid or expired verification token",
      })
    }

    return res.json({
      ok: true,
      msg: "Email verified successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        email_verified: user.email_verified,
      },
    })
  } catch (error) {
    console.error("Error in verifyEmail:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const recoverPasswordWithSecurity = async (req, res) => {
  try {
    const { username, respuesta_de_seguridad, newPassword } = req.body

    if (!username || !respuesta_de_seguridad || !newPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Username, security answer, and new password are required",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: "New password must be at least 6 characters long",
      })
    }

    // Verify security answer
    const user = await UserModel.verifySecurityAnswer(username, respuesta_de_seguridad)
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid username or security answer",
      })
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(newPassword, salt)

    // Update password
    await UserModel.updatePassword(user.id, hashedPassword)

    return res.json({
      ok: true,
      msg: "Password has been reset successfully using security question",
    })
  } catch (error) {
    console.error("Error in recoverPasswordWithSecurity:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getSecurityQuestion = async (req, res) => {
  try {
    const { username } = req.params

    if (!username) {
      return res.status(400).json({
        ok: false,
        msg: "Username is required",
      })
    }

    const user = await UserModel.findOneByUsername(username)
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    return res.json({
      ok: true,
      security_question: user.security_word,
      username: user.username,
    })
  } catch (error) {
    console.error("Error in getSecurityQuestion:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
    })
  }
}

const register = async (req, res) => {
  try {
    const { username, email, password, permiso_id, security_word, respuesta_de_seguridad, personal_id } = req.body

    if (!username || !password || !permiso_id) {
      return res.status(400).json({
        ok: false,
        msg: "Missing required fields: username, password, and permiso_id are mandatory",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: "Password must be at least 6 characters long",
      })
    }

    // Check if username already exists
    const existingUser = await UserModel.findOneByUsername(username)
    if (existingUser) {
      return res.status(400).json({
        ok: false,
        msg: "Username already exists",
      })
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingUserByEmail = await UserModel.findOneByEmail(email)
      if (existingUserByEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Email already exists",
        })
      }
    }

    // Check if personal already has a user account (if personal_id is provided)
    if (personal_id) {
      const existingPersonalUser = await UserModel.findByPersonalId(personal_id)
      if (existingPersonalUser) {
        return res.status(400).json({
          ok: false,
          msg: "This personal member already has a user account",
        })
      }
    }

    const newUser = await UserModel.create({
      username,
      email,
      password,
      permiso_id,
      security_word,
      respuesta_de_seguridad,
      personal_id,
    })

    if (!newUser) {
      return res.status(500).json({
        ok: false,
        msg: "Error creating user",
      })
    }

    return res.status(201).json({
      ok: true,
      msg: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        permiso_id: newUser.permiso_id,
        personal_id: newUser.personal_id,
        is_active: newUser.is_active,
        email_verified: newUser.email_verified,
      },
    })
  } catch (error) {
    console.error("Error in register:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

export const UserController = {
  register,
  login,
  refreshToken,
  logout,
  profile,
  listUsers,
  updateProfile,
  updateProfileWithSecurity,
  changePassword,
  changePasswordWithSecurity,
  forgotPassword,
  resetPassword,
  activateUser,
  deactivateUser,
  deleteUser,
  searchUsers,
  verifyEmail,
  recoverPasswordWithSecurity,
  getSecurityQuestion,
}
