import { PersonalModel } from "../models/personal.model.js"

const createPersonal = async (req, res) => {
  try {
    const { nombre, lastname, idrole, telephonenomber, ci, email, birthday, direccion, parroquia_id } = req.body

    if (!nombre || !lastname || !idrole || !ci) {
      return res.status(400).json({
        ok: false,
        msg: "Missing required fields: nombre, lastname, idrole, and ci are mandatory",
      })
    }

    // Validate CI format (Venezuelan format)
    const ciRegex = /^[VE]\d{7,8}$/
    if (!ciRegex.test(ci)) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid CI format. Use format: V12345678 or E12345678",
      })
    }

    // Check if personal with same CI already exists
    const existingPersonalByCi = await PersonalModel.findOneByCi(ci)
    if (existingPersonalByCi) {
      return res.status(400).json({
        ok: false,
        msg: "A personal member with this CI already exists",
      })
    }

    // Check if personal with same email already exists (if email is provided)
    if (email) {
      const existingPersonalByEmail = await PersonalModel.findOneByEmail(email)
      if (existingPersonalByEmail) {
        return res.status(400).json({
          ok: false,
          msg: "A personal member with this email already exists",
        })
      }
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          ok: false,
          msg: "Invalid email format",
        })
      }
    }

    // Validate phone format if provided
    if (telephonenomber) {
      const phoneRegex = /^04\d{9}$/
      if (!phoneRegex.test(telephonenomber)) {
        return res.status(400).json({
          ok: false,
          msg: "Invalid phone format. Use format: 04123456789",
        })
      }
    }

    const newPersonal = await PersonalModel.create({
      nombre,
      lastname,
      idrole,
      telephonenomber,
      ci,
      email,
      birthday,
      direccion,
      parroquia_id,
    })

    return res.status(201).json({
      ok: true,
      msg: "Personal created successfully",
      personal: newPersonal,
    })
  } catch (error) {
    console.error("Error in createPersonal:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getPersonalById = async (req, res) => {
  try {
    const { id } = req.params
    const personal = await PersonalModel.findOneById(id)

    if (!personal) {
      return res.status(404).json({
        ok: false,
        msg: "Personal member not found",
      })
    }

    return res.json({
      ok: true,
      personal,
    })
  } catch (error) {
    console.error("Error in getPersonalById:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getAllPersonal = async (req, res) => {
  try {
    const personal = await PersonalModel.findAll()
    return res.json({
      ok: true,
      personal,
      total: personal.length,
    })
  } catch (error) {
    console.error("Error in getAllPersonal:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getPersonalByRole = async (req, res) => {
  try {
    const { idrole } = req.params
    const personal = await PersonalModel.findByRole(idrole)
    return res.json({
      ok: true,
      personal,
      total: personal.length,
    })
  } catch (error) {
    console.error("Error in getPersonalByRole:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getTeachers = async (req, res) => {
  try {
    const teachers = await PersonalModel.findTeachers()
    return res.json({
      ok: true,
      teachers,
      total: teachers.length,
    })
  } catch (error) {
    console.error("Error in getTeachers:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getAdministrators = async (req, res) => {
  try {
    const administrators = await PersonalModel.findAdministrators()
    return res.json({
      ok: true,
      administrators,
      total: administrators.length,
    })
  } catch (error) {
    console.error("Error in getAdministrators:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getMaintenanceStaff = async (req, res) => {
  try {
    const maintenance = await PersonalModel.findMaintenance()
    return res.json({
      ok: true,
      maintenance,
      total: maintenance.length,
    })
  } catch (error) {
    console.error("Error in getMaintenanceStaff:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getPersonalWithoutSystemAccess = async (req, res) => {
  try {
    const personal = await PersonalModel.findWithoutSystemAccess()
    return res.json({
      ok: true,
      personal,
      total: personal.length,
      msg: "Personal without system access",
    })
  } catch (error) {
    console.error("Error in getPersonalWithoutSystemAccess:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getPersonalWithSystemAccess = async (req, res) => {
  try {
    const personal = await PersonalModel.findWithSystemAccess()
    return res.json({
      ok: true,
      personal,
      total: personal.length,
      msg: "Personal with system access",
    })
  } catch (error) {
    console.error("Error in getPersonalWithSystemAccess:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const updatePersonal = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, lastname, idrole, telephonenomber, email, birthday, direccion, parroquia_id } = req.body

    // Check if personal exists
    const existingPersonal = await PersonalModel.findOneById(id)
    if (!existingPersonal) {
      return res.status(404).json({
        ok: false,
        msg: "Personal member not found",
      })
    }

    // Check if email is being updated and if it already exists
    if (email && email !== existingPersonal.email) {
      const existingPersonalByEmail = await PersonalModel.findOneByEmail(email)
      if (existingPersonalByEmail && existingPersonalByEmail.id !== Number.parseInt(id)) {
        return res.status(400).json({
          ok: false,
          msg: "A personal member with this email already exists",
        })
      }
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          ok: false,
          msg: "Invalid email format",
        })
      }
    }

    // Validate phone format if provided
    if (telephonenomber) {
      const phoneRegex = /^04\d{9}$/
      if (!phoneRegex.test(telephonenomber)) {
        return res.status(400).json({
          ok: false,
          msg: "Invalid phone format. Use format: 04123456789",
        })
      }
    }

    const updatedPersonal = await PersonalModel.update(id, {
      nombre,
      lastname,
      idrole,
      telephonenomber,
      email,
      birthday,
      direccion,
      parroquia_id,
    })

    return res.json({
      ok: true,
      msg: "Personal updated successfully",
      personal: updatedPersonal,
    })
  } catch (error) {
    console.error("Error in updatePersonal:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const deletePersonal = async (req, res) => {
  try {
    const { id } = req.params

    // Check if personal exists
    const existingPersonal = await PersonalModel.findOneById(id)
    if (!existingPersonal) {
      return res.status(404).json({
        ok: false,
        msg: "Personal member not found",
      })
    }

    const result = await PersonalModel.remove(id)
    return res.json({
      ok: true,
      msg: "Personal member deleted successfully",
      id: result.id,
    })
  } catch (error) {
    console.error("Error in deletePersonal:", error)

    // Handle specific error for personal with user account
    if (error.message.includes("Cannot delete personal who has a user account")) {
      return res.status(400).json({
        ok: false,
        msg: error.message,
      })
    }

    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const searchPersonalByName = async (req, res) => {
  try {
    const { name } = req.query
    if (!name) {
      return res.status(400).json({
        ok: false,
        msg: "Name parameter is required",
      })
    }

    const personal = await PersonalModel.searchByName(name)
    return res.json({
      ok: true,
      personal,
      total: personal.length,
    })
  } catch (error) {
    console.error("Error in searchPersonalByName:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const searchPersonalByCi = async (req, res) => {
  try {
    const { ci } = req.query
    if (!ci) {
      return res.status(400).json({
        ok: false,
        msg: "CI parameter is required",
      })
    }

    const personal = await PersonalModel.searchByCi(ci)
    return res.json({
      ok: true,
      personal,
      total: personal.length,
    })
  } catch (error) {
    console.error("Error in searchPersonalByCi:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getRoles = async (req, res) => {
  try {
    const roles = await PersonalModel.getRoles()
    return res.json({
      ok: true,
      roles,
      total: roles.length,
    })
  } catch (error) {
    console.error("Error in getRoles:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

const getParroquias = async (req, res) => {
  try {
    const parroquias = await PersonalModel.getParroquias()
    return res.json({
      ok: true,
      parroquias,
      total: parroquias.length,
    })
  } catch (error) {
    console.error("Error in getParroquias:", error)
    return res.status(500).json({
      ok: false,
      msg: "Server error",
      error: error.message,
    })
  }
}

export const PersonalController = {
  createPersonal,
  getPersonalById,
  getAllPersonal,
  getPersonalByRole,
  getTeachers,
  getAdministrators,
  getMaintenanceStaff,
  getPersonalWithoutSystemAccess,
  getPersonalWithSystemAccess,
  updatePersonal,
  deletePersonal,
  searchPersonalByName,
  searchPersonalByCi,
  getRoles,
  getParroquias,
}
