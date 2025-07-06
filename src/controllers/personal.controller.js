import { PersonalModel } from "../models/personal.model.js"

/**
 * Crear un nuevo miembro del personal
 */
const crearPersonal = async (req, res) => {
  try {
    const { nombre, apellido, rol_id, telefono, cedula, email, fecha_nacimiento, direccion, parroquia_id } = req.body

    // Validaciones básicas
    if (!nombre || !apellido || !rol_id || !cedula) {
      return res.status(400).json({
        ok: false,
        msg: "Nombre, apellido, rol y cédula son obligatorios",
      })
    }

    // Validar formato de cédula venezolana
    const cedulaRegex = /^[VE]\d{7,8}$/i
    if (!cedulaRegex.test(cedula)) {
      return res.status(400).json({
        ok: false,
        msg: "Formato de cédula inválido. Use formato: V12345678 o E12345678",
      })
    }

    // Validar email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          ok: false,
          msg: "Formato de email inválido",
        })
      }
    }

    const nuevoPersonal = await PersonalModel.create({
      nombre,
      apellido,
      rol_id,
      telefono,
      cedula,
      email,
      fecha_nacimiento,
      direccion,
      parroquia_id,
    })

    return res.status(201).json({
      ok: true,
      msg: "Personal creado exitosamente",
      personal: nuevoPersonal,
    })
  } catch (error) {
    console.error("Error in crearPersonal:", error)

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
 * Obtener todo el personal
 */
const obtenerTodoPersonal = async (req, res) => {
  try {
    const personal = await PersonalModel.findAll()

    return res.json({
      ok: true,
      personal,
      total: personal.length,
    })
  } catch (error) {
    console.error("Error in obtenerTodoPersonal:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener personal por ID
 */
const obtenerPersonalPorId = async (req, res) => {
  try {
    const { id } = req.params

    const personal = await PersonalModel.findById(id)

    if (!personal) {
      return res.status(404).json({
        ok: false,
        msg: "Personal no encontrado",
      })
    }

    return res.json({
      ok: true,
      personal,
    })
  } catch (error) {
    console.error("Error in obtenerPersonalPorId:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Buscar personal por nombre
 */
const buscarPersonalPorNombre = async (req, res) => {
  try {
    const { nombre } = req.query

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        ok: false,
        msg: "El parámetro 'nombre' es obligatorio",
      })
    }

    const personal = await PersonalModel.findByNombre(nombre.trim())

    return res.json({
      ok: true,
      personal,
      total: personal.length,
      terminoBusqueda: nombre.trim(),
    })
  } catch (error) {
    console.error("Error in buscarPersonalPorNombre:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Buscar personal por cédula
 */
const buscarPersonalPorCedula = async (req, res) => {
  try {
    const { cedula } = req.query

    if (!cedula || cedula.trim() === "") {
      return res.status(400).json({
        ok: false,
        msg: "El parámetro 'cedula' es obligatorio",
      })
    }

    const personal = await PersonalModel.findByCedula(cedula.trim())

    if (!personal) {
      return res.status(404).json({
        ok: false,
        msg: "Personal no encontrado con esa cédula",
      })
    }

    return res.json({
      ok: true,
      personal,
    })
  } catch (error) {
    console.error("Error in buscarPersonalPorCedula:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener solo docentes
 */
const obtenerTodosDocentes = async (req, res) => {
  try {
    const docentes = await PersonalModel.findDocentes()

    return res.json({
      ok: true,
      docentes,
      total: docentes.length,
    })
  } catch (error) {
    console.error("Error in obtenerTodosDocentes:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener solo administradores
 */
const obtenerTodosAdministradores = async (req, res) => {
  try {
    const administradores = await PersonalModel.findAdministradores()

    return res.json({
      ok: true,
      administradores,
      total: administradores.length,
    })
  } catch (error) {
    console.error("Error in obtenerTodosAdministradores:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Actualizar personal
 */
const actualizarPersonal = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, rol_id, telefono, email, direccion, parroquia_id } = req.body

    // Verificar que el personal existe
    const personalExistente = await PersonalModel.findById(id)
    if (!personalExistente) {
      return res.status(404).json({
        ok: false,
        msg: "Personal no encontrado",
      })
    }

    // Validar email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          ok: false,
          msg: "Formato de email inválido",
        })
      }
    }

    const datosActualizacion = {}
    if (nombre !== undefined) datosActualizacion.nombre = nombre
    if (apellido !== undefined) datosActualizacion.apellido = apellido
    if (rol_id !== undefined) datosActualizacion.rol_id = rol_id
    if (telefono !== undefined) datosActualizacion.telefono = telefono
    if (email !== undefined) datosActualizacion.email = email
    if (direccion !== undefined) datosActualizacion.direccion = direccion
    if (parroquia_id !== undefined) datosActualizacion.parroquia_id = parroquia_id

    const personalActualizado = await PersonalModel.update(id, datosActualizacion)

    return res.json({
      ok: true,
      msg: "Personal actualizado exitosamente",
      personal: personalActualizado,
    })
  } catch (error) {
    console.error("Error in actualizarPersonal:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Eliminar personal
 */
const eliminarPersonal = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que el personal existe
    const personalExistente = await PersonalModel.findById(id)
    if (!personalExistente) {
      return res.status(404).json({
        ok: false,
        msg: "Personal no encontrado",
      })
    }

    const personalEliminado = await PersonalModel.remove(id)

    return res.json({
      ok: true,
      msg: "Personal eliminado exitosamente",
      personal: personalEliminado,
    })
  } catch (error) {
    console.error("Error in eliminarPersonal:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener roles disponibles
 */
const obtenerRoles = async (req, res) => {
  try {
    const roles = await PersonalModel.getRoles()

    return res.json({
      ok: true,
      roles,
      total: roles.length,
    })
  } catch (error) {
    console.error("Error in obtenerRoles:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

/**
 * Obtener parroquias disponibles
 */
const obtenerParroquias = async (req, res) => {
  try {
    const parroquias = await PersonalModel.getParroquias()

    return res.json({
      ok: true,
      parroquias,
      total: parroquias.length,
    })
  } catch (error) {
    console.error("Error in obtenerParroquias:", error)
    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const PersonalController = {
  crearPersonal,
  obtenerTodoPersonal,
  obtenerPersonalPorId,
  buscarPersonalPorNombre,
  buscarPersonalPorCedula,
  obtenerTodosDocentes,
  obtenerTodosAdministradores,
  actualizarPersonal,
  eliminarPersonal,
  obtenerRoles,
  obtenerParroquias,
}
