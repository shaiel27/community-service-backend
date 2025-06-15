import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.js"
import crypto from "crypto"

const register = async (req, res) => {
  try {
    const { username, email, password, permiso_id, security_word, personal_id } = req.body

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

const login = async (req, res) => {
  try {
    const { email, password } = req.body // Cambiar username por email

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: "Email and password are required", // Cambiar mensaje
      })
    }

    const user = await UserModel.findOneByEmail(email) // Usar findOneByEmail
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid email or password", // Cambiar mensaje
      })
    }

    if (!user.is_active) {
      return res.status(403).json({
        ok: false,
        msg: "Account is inactive. Please contact an administrator",
      })
    }

    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid email or password",
      })
    }

    // Generate access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        permiso_id: user.permiso_id,
        personal_id: user.personal_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    )

    // Generate refresh token
    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    )

    const expiration = new Date(Date.now() + 3600000) // 1 hour from now
    await UserModel.saveLoginToken(user.id, accessToken, refreshToken, expiration)

    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Credentials", "true")

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
    console.error("Login error:", error)
    res.status(500).json({
      ok: false,
      msg: "Server error",
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
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      const userId = decoded.userId

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
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      )

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        {
          userId: user.id,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
      )

      const expiration = new Date(Date.now() + 3600000) // 1 hour from now
      await UserModel.saveLoginToken(user.id, accessToken, newRefreshToken, expiration)

      return res.json({
        ok: true,
        accessToken,
        refreshToken: newRefreshToken,
      })
    } catch (error) {
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

    const user = await UserModel.findUserByAccessToken(token)

    if (!user) {
      return res.status(403).json({
        ok: false,
        msg: "Invalid token",
      })
    }

    await UserModel.clearLoginTokens(user.id)

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
    const userId = req.user.userId

    const user = await UserModel.findOneById(userId)

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      })
    }

    const { password: _, access_token: __, refresh_token: ___, ...userWithoutSensitiveInfo } = user
    return res.json({
      ok: true,
      user: userWithoutSensitiveInfo,
    })
  } catch (error) {
    console.error("Error in profile:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
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
    const { email, security_word } = req.body

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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body // Cambiar username por email

    if (!email) {
      return res.status(400).json({
        ok: false,
        msg: "Email is required", // Cambiar mensaje
      })
    }

    const user = await UserModel.findOneByEmail(email) // Usar findOneByEmail
    if (!user) {
      return res.json({
        ok: true,
        msg: "If your email exists in our system, you will receive a password reset token", // Cambiar mensaje
      })
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    await UserModel.setPasswordResetToken(email, resetToken, expires)

    // In a real application, you would send an email with the reset token
    // For this example, we'll just return it in the response
    return res.json({
      ok: true,
      msg: "If your email exists in our system, you will receive a password reset token",
      // Only for development purposes:
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

export const UserController = {
  register,
  login,
  refreshToken,
  logout,
  profile,
  listUsers,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  activateUser,
  deactivateUser,
  deleteUser,
  searchUsers,
  verifyEmail,
}
