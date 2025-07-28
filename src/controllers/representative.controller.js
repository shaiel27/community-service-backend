import { RepresentativeModel } from "../models/representative.model.js"

// Crear representante
const createRepresentative = async (req, res) => {
  try {
    console.log("👤 Creando representante:", req.body)

    const representative = await RepresentativeModel.createRepresentative(req.body)

    res.status(201).json({
      ok: true,
      msg: "Representante creado exitosamente",
      data: representative,
    })
  } catch (error) {
    console.error("❌ Error en createRepresentative:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Obtener todos los representantes
const getAllRepresentatives = async (req, res) => {
  try {
    console.log("📋 Obteniendo todos los representantes")

    const representatives = await RepresentativeModel.getAllRepresentatives()

    res.json({
      ok: true,
      representatives,
      total: representatives.length,
    })
  } catch (error) {
    console.error("❌ Error en getAllRepresentatives:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Obtener representante por CI
const getRepresentativeByCi = async (req, res) => {
  try {
    const { ci } = req.params
    console.log("🔍 Buscando representante por CI:", ci)

    const representative = await RepresentativeModel.getRepresentativeByCi(ci)
    if (!representative) {
      return res.status(404).json({
        ok: false,
        msg: "Representante no encontrado",
      })
    }
    res.json({
      ok: true,
      representative,
    })
  } catch (error) {
    console.error("❌ Error en getRepresentativeByCi:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Actualizar representante
const updateRepresentative = async (req, res) => {
  try {
    const { ci } = req.params
    console.log("✏️ Actualizando representante:", ci, req.body)

    const representative = await RepresentativeModel.updateRepresentative(ci, req.body)

    if (!representative) {
      return res.status(404).json({
        ok: false,
        msg: "Representante no encontrado",
      })
    }

    res.json({
      ok: true,
      msg: "Representante actualizado exitosamente",
      representative,
    })
  } catch (error) {
    console.error("❌ Error en updateRepresentative:", error)
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
      error: error.message,
    })
  }
}

export const RepresentativeController = {
  createRepresentative,
  getAllRepresentatives,
  getRepresentativeByCi,
  updateRepresentative,
}
