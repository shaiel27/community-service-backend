import { BrigadaService } from "../services/brigada.service.js";

const handleError = (error, res) => {
  const status = 
    error.message.includes('no encontrad') ? 404 :
    error.message.includes('obligatorio') || 
    error.message.includes('demasiado largo') || 
    error.message.includes('inválido') ? 400 :
    error.message.includes('ya asignado') ? 409 : 500;
  
  res.status(status).json({
    ok: false,
    msg: error.message
  });
};

export const createBrigade = async (req, res) => {
  try {
    const newBrigade = await BrigadaService.crearBrigada(req.validated);
    res.status(201).json({
      ok: true,
      brigade: newBrigade
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllBrigades = async (req, res) => {
  try {
    const brigades = await BrigadaService.obtenerTodasBrigadas();
    res.json({
      ok: true,
      brigades,
      total: brigades.length
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getBrigadeById = async (req, res) => {
  try {
    const brigade = await BrigadaService.obtenerBrigadaPorId(req.params.id);
    res.json({
      ok: true,
      brigade
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateBrigade = async (req, res) => {
  try {
    const updatedBrigade = await BrigadaService.actualizarBrigada(
      req.params.id,
      req.validated
    );
    res.json({
      ok: true,
      msg: "Brigada actualizada exitosamente",
      brigade: updatedBrigade
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getStudentsByBrigade = async (req, res) => {
  try {
    const brigade = await BrigadaService.obtenerBrigadaPorId(req.params.id);
    const students = await BrigadaService.obtenerEstudiantesPorBrigada(req.params.id);
    res.json({
      ok: true,
      brigade: {
        id: brigade.id,
        name: brigade.name,
        teacher: brigade.encargado_name 
          ? `${brigade.encargado_name} ${brigade.encargado_lastName}` 
          : "Sin encargado"
      },
      students,
      total: students.length
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const assignTeacher = async (req, res) => {
  try {
    const assignment = await BrigadaService.asignarDocente(
      req.params.id,
      req.validated.personalId,
      req.validated.startDate
    );
    res.json({
      ok: true,
      msg: "Encargado asignado exitosamente",
      assignment
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const enrollStudents = async (req, res) => {
  try {
    const result = await BrigadaService.inscribirEstudiantes(
      req.params.id,
      req.validated.studentIds
    );
    res.json({
      ok: true,
      msg: `${result.studentsEnrolled} estudiantes inscritos exitosamente`,
      result
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const clearBrigade = async (req, res) => {
  try {
    const result = await BrigadaService.limpiarBrigada(req.params.id);
    res.json({
      ok: true,
      msg: "Brigada limpiada exitosamente",
      result
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const deleteBrigade = async (req, res) => {
  try {
    const result = await BrigadaService.eliminarBrigada(req.params.id);
    res.json({
      ok: true,
      msg: "Brigada eliminada exitosamente",
      brigade: result
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getAvailableStudents = async (req, res) => {
  try {
    const students = await BrigadaService.obtenerEstudiantesDisponibles();
    res.json({
      ok: true,
      students,
      total: students.length
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getAvailableTeachers = async (req, res) => {
  try {
    const teachers = await BrigadaService.obtenerDocentesDisponibles();
    res.json({
      ok: true,
      teachers,
      total: teachers.length
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const searchBrigades = async (req, res) => {
  try {
    const brigades = await BrigadaService.buscarBrigadasPorNombre(req.validated.name);
    res.json({
      ok: true,
      brigades,
      total: brigades.length
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const BrigadaController = {
  createBrigade,
  getAllBrigades,
  getBrigadeById,
  updateBrigade,
  getStudentsByBrigade,
  assignTeacher,
  enrollStudents,
  clearBrigade,
  deleteBrigade,
  getAvailableStudents,
  getAvailableTeachers,
  searchBrigades
};