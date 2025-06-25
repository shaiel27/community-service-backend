import { PersonalModel } from "../models/personal.model.js"

const createPersonal = async (req, res) => {
  try {
    const { name, lastName, idrole, telephoneNumber, ci, email, birthday, direction, parishID } = req.body // Renombrado parishID

    if (!name || !lastName || !idrole || !ci) { // Usar name y lastName
      return res.status(400).json({
        ok: false,
        msg: "Missing required fields: name, lastName, idrole, and ci are mandatory", // Mensaje actualizado
      })
    }

    // Validaciones de longitud específicas (mantener estas validaciones a nivel de controlador es bueno para feedback inmediato)
    if (name.length > 100) { // Actualizado a 100 según el modelo
      return res.status(400).json({
        ok: false,
        msg: `El nombre es demasiado largo. Máximo 100 caracteres, actual: ${name.length}`,
      })
    }

    if (lastName.length > 100) { // Actualizado a 100 según el modelo
      return res.status(400).json({
        ok: false,
        msg: `El apellido es demasiado largo. Máximo 100 caracteres, actual: ${lastName.length}`,
      })
    }

    if (email && email.length > 100) { // Actualizado a 100 según el modelo
      return res.status(400).json({
        ok: false,
        msg: `El email es demasiado largo. Máximo 100 caracteres, actual: ${email.length}`,
      })
    }

    if (direction && direction.length > 30) { // Actualizado a 30 según el modelo
      return res.status(400).json({
        ok: false,
        msg: `La dirección es demasiado larga. Máximo 30 caracteres, actual: ${direction.length}`,
      })
    }

    if (telephoneNumber && telephoneNumber.length > 20) { // Actualizado a 20 según el modelo
      return res.status(400).json({
        ok: false,
        msg: `El teléfono es demasiado largo. Máximo 20 caracteres, actual: ${telephoneNumber.length}`,
      })
    }
    if (ci && ci.length > 20) { // Actualizado a 20 según el modelo
      return res.status(400).json({
        ok: false,
        msg: `La cédula es demasiado larga. Máximo 20 caracteres, actual: ${ci.length}`,
      })
    }

    // Validate cedula format (Venezuelan format)
    const cedulaRegex = /^[VE]\d{7,8}$/
    if (!cedulaRegex.test(ci)) { // Usar ci
      return res.status(400).json({
        ok: false,
        msg: "Invalid cedula format. Use format: V12345678 or E12345678",
      })
    }

    // Check if personal with same cedula already exists
    const existingPersonalByCedula = await PersonalModel.findOneByCi(ci) // Usar findOneByCi
    if (existingPersonalByCedula) {
      return res.status(400).json({
        ok: false,
        msg: "A personal member with this cedula already exists",
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
    if (telephoneNumber) { // Usar telephoneNumber
      const phoneRegex = /^04\d{9}$/
      if (!phoneRegex.test(telephoneNumber)) { // Usar telephoneNumber
        return res.status(400).json({
          ok: false,
          msg: "Invalid phone format. Use format: 04123456789",
        })
      }
    }

    const newPersonal = await PersonalModel.create({
      name, // Usar name
      lastName, // Usar lastName
      idrole,
      telephoneNumber, // Usar telephoneNumber
      ci, // Usar ci
      email,
      birthday,
      direction,
      parishID, // Usar parishID
    })

    return res.status(201).json({
      ok: true,
      msg: "Personal created successfully",
      personal: newPersonal,
    })
  } catch (error) {
    console.error("Error in createPersonal:", error)

    // Manejar errores específicos de longitud
    if (error.message.includes("demasiado largo")) {
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
    const { name, lastName, idrole, telephoneNumber, email, birthday, direction, parishID } = req.body // Renombrado parishID, name, lastName, telephoneNumber

    // Check if personal exists
    const existingPersonal = await PersonalModel.findOneById(id)
    if (!existingPersonal) {
      return res.status(404).json({
        ok: false,
        msg: "Personal member not found",
      })
    }

    // Validaciones de longitud específicas
    if (name && name.length > 100) { // Actualizado a 100
      return res.status(400).json({
        ok: false,
        msg: `El nombre es demasiado largo. Máximo 100 caracteres, actual: ${name.length}`,
      })
    }

    if (lastName && lastName.length > 100) { // Actualizado a 100
      return res.status(400).json({
        ok: false,
        msg: `El apellido es demasiado largo. Máximo 100 caracteres, actual: ${lastName.length}`,
      })
    }

    if (email && email.length > 100) { // Actualizado a 100
      return res.status(400).json({
        ok: false,
        msg: `El email es demasiado largo. Máximo 100 caracteres, actual: ${email.length}`,
      })
    }

    if (direction && direction.length > 30) { // Actualizado a 30
      return res.status(400).json({
        ok: false,
        msg: `La dirección es demasiado larga. Máximo 30 caracteres, actual: ${direction.length}`,
      })
    }

    if (telephoneNumber && telephoneNumber.length > 20) { // Actualizado a 20
      return res.status(400).json({
        ok: false,
        msg: `El teléfono es demasiado largo. Máximo 20 caracteres, actual: ${telephoneNumber.length}`,
      })
    }

    // Check if email is being updated and if it already exists
    if (email && email !== existingPersonal.email) {
      const existingPersonalByEmail = await PersonalModel.findOneByEmail(email)
      // La comparación debe ser con `existingPersonal.id` que viene del modelo, no con `Number.parseInt(id)`
      if (existingPersonalByEmail && existingPersonalByEmail.id !== existingPersonal.id) {
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
    if (telephoneNumber) { // Usar telephoneNumber
      const phoneRegex = /^04\d{9}$/
      if (!phoneRegex.test(telephoneNumber)) { // Usar telephoneNumber
        return res.status(400).json({
          ok: false,
          msg: "Invalid phone format. Use format: 04123456789",
        })
      }
    }

    const updatedPersonal = await PersonalModel.update(id, {
      name, // Usar name
      lastName, // Usar lastName
      idrole,
      telephoneNumber, // Usar telephoneNumber
      email,
      birthday,
      direction,
      parishID, // Usar parishID
    })

    return res.json({
      ok: true,
      msg: "Personal updated successfully",
      personal: updatedPersonal,
    })
  } catch (error) {
    console.error("Error in updatePersonal:", error)

    // Manejar errores específicos de longitud
    if (error.message.includes("demasiado largo")) {
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
    const { name } = req.query // Usar name
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

const searchPersonalByCedula = async (req, res) => {
  try {
    const { cedula } = req.query // Usar cedula
    if (!cedula) {
      return res.status(400).json({
        ok: false,
        msg: "Cedula parameter is required",
      })
    }

    const personal = await PersonalModel.searchByCi(cedula) // Usar searchByCi
    return res.json({
      ok: true,
      personal,
      total: personal.length,
    })
  } catch (error) {
    console.error("Error in searchPersonalByCedula:", error)
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
    const parroquias = await PersonalModel.getParishes() // Corregido el nombre de la función
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
  searchPersonalByCedula,
  getRoles,
  getParroquias,
}