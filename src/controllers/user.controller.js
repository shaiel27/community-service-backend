import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.js"
import crypto from "crypto"

const register = async (req, res) => {
  try {
    const { username, password, staff_id, guardian_id, role_id, permission_id, security_question } = req.body

    if (!username || !password || !role_id || !permission_id) {
      return res.status(400).json({
        ok: false,
        msg: "Missing required fields: username, password, role_id, and permission_id are mandatory",
      })
    }

    // Check if either staff_id or guardian_id is provided
    if (!staff_id && !guardian_id) {
      return res.status(400).json({
        ok: false,
        msg: "Either staff_id or guardian_id must be provided",
      })
    }

    // Check if both staff_id and guardian_id are provided (not allowed)
    if (staff_id && guardian_id) {
      return res.status(400).json({
        ok: false,
        msg: "A user cannot be both staff and guardian. Please provide only one of staff_id or guardian_id",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        msg: "Password must be at least 6 characters long",
      })
    }

    const existingUser = await UserModel.findOneByUsername(username)
    if (existingUser) {
      return res.status(400).json({ ok: false, message: "Username already exists" })
    }

    // Check if staff or guardian already has a user account
    if (staff_id) {
      const existingStaffUser = await UserModel.findByStaffId(staff_id)
      if (existingStaffUser) {
        return res.status(400).json({ ok: false, message: "This staff member already has a user account" })
      }
    }

    if (guardian_id) {
      const existingGuardianUser = await UserModel.findByGuardianId(guardian_id)
      if (existingGuardianUser) {
        return res.status(400).json({ ok: false, message: "This guardian already has a user account" })
      }
    }

    const newUser = await UserModel.create({
      username,
      password,
      staff_id,
      guardian_id,
      role_id,
      permission_id,
      security_question,
    })

    if (!newUser) {
      return res.status(500).json({
        ok: false,
        msg: "Error creating user",
      })
    }

    return res.status(201).json({
      ok: true,
      user: newUser,
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
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        msg: "Username and password are required",
      })
    }

    const user = await UserModel.findOneByUsername(username)
    if (!user) {
      return res.status(400).json({ ok: false, message: "Invalid username or password" })
    }

    if (!user.is_active) {
      return res.status(403).json({ ok: false, message: "Account is inactive. Please contact an administrator" })
    }

    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ ok: false, message: "Invalid username or password" })
    }

    // Generate access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role_id: user.role_id,
        permission_id: user.permission_id,
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
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role_id: user.role_id,
        permission_id: user.permission_id,
        role_name: user.role_name,
        permission_name: user.permission_name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ ok: false, message: "Server error" })
  }
}

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ ok: false, message: "Refresh token is required" })
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      const userId = decoded.userId

      // Get the user
      const user = await UserModel.findOneById(userId)
      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" })
      }

      if (!user.is_active) {
        return res.status(403).json({ ok: false, message: "Account is inactive" })
      }

      // Generate new access token
      const accessToken = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role_id: user.role_id,
          permission_id: user.permission_id,
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
        return res.status(401).json({ ok: false, message: "Refresh token expired" })
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ ok: false, message: "Invalid refresh token" })
      }
      throw error
    }
  } catch (error) {
    console.error("Error in refreshToken:", error)
    return res.status(500).json({ ok: false, message: "Server error" })
  }
}

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ ok: false, message: "No token provided" })
    }

    const [bearer, token] = authHeader.split(" ")
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ ok: false, message: "Invalid token format" })
    }

    const user = await UserModel.findUserByAccessToken(token)

    if (!user) {
      return res.status(403).json({ ok: false, message: "Invalid token" })
    }

    await UserModel.clearLoginTokens(user.id)

    return res.json({ ok: true, message: "Logged out successfully" })
  } catch (error) {
    console.error("Error in logout:", error)
    return res.status(500).json({ ok: false, message: "Server error" })
  }
}

const profile = async (req, res) => {
  try {
    const userId = req.user.userId
    console.log("Fetching profile for user ID:", userId)

    const user = await UserModel.findOneById(userId)
    console.log("User found:", user ? "Yes" : "No")

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" })
    }

    const { password: _, access_token: __, refresh_token: ___, ...userWithoutSensitiveInfo } = user
    return res.json({
      ok: true,
      user: userWithoutSensitiveInfo,
    })
  } catch (error) {
    console.error("Error in profile:", error)
    return res.status(500).json({ ok: false, msg: "Server error" })
  }
}

const listUsers = async (req, res) => {
  try {
    console.log("Fetching list of users")
    const users = await UserModel.findAll()
    console.log("Number of users found:", users.length)
    return res.json({ ok: true, users })
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
    const { security_question } = req.body

    const updatedUser = await UserModel.updateProfile(userId, {
      security_question,
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
    const { username } = req.body

    if (!username) {
      return res.status(400).json({
        ok: false,
        msg: "Username is required",
      })
    }

    const user = await UserModel.findOneByUsername(username)
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.json({
        ok: true,
        msg: "If your username exists in our system, you will receive a password reset token",
      })
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    await UserModel.setPasswordResetToken(username, resetToken, expires)

    // In a real application, you would send an email with the reset token
    // For this example, we'll just return it in the response
    return res.json({
      ok: true,
      msg: "If your username exists in our system, you will receive a password reset token",
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
}
