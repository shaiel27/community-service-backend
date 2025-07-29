import personalService from '../services/personal.service.js';

// Manejador centralizado de errores
const handleError = (res, error) => {
  console.error(error);
  
  const status = error.message.includes('no encontrad') ? 404 : 
                error.message.includes('Ya existe') ? 400 : 500;
                 
  const message = status === 500 ? error.message : 'Error interno del servidor';
  
  res.status(status).json({
    ok: false,
    msg: message
  });
};

const createPersonal = async (req, res) => {
  try {
    const newPersonal = await personalService.crearPersonal(req.body);
    res.status(201).json({
      ok: true,
      msg: "Personal creado exitosamente",
      personal: newPersonal
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getPersonalById = async (req, res) => {
  try {
    const personal = await personalService.obtenerPorId(req.params.id);
    res.json({
      ok: true,
      personal
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getAllPersonal = async (req, res) => {
  try {
    const personal = await personalService.obtenerTodoPersonal();
    res.json({
      ok: true,
      personal,
      total: personal.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getPersonalByRole = async (req, res) => {
  try {
    const personal = await personalService.obtenerPorRol(req.params.idrole);
    res.json({
      ok: true,
      personal,
      total: personal.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await personalService.obtenerDocentes();
    res.json({
      ok: true,
      teachers,
      total: teachers.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getAdministrators = async (req, res) => {
  try {
    const administrators = await personalService.obtenerAdministradores();
    res.json({
      ok: true,
      administrators,
      total: administrators.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getMaintenanceStaff = async (req, res) => {
  try {
    const maintenance = await personalService.obtenerMantenimiento();
    res.json({
      ok: true,
      maintenance,
      total: maintenance.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getPersonalWithoutSystemAccess = async (req, res) => {
  try {
    const personal = await personalService.obtenerSinAcceso();
    res.json({
      ok: true,
      personal,
      total: personal.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getPersonalWithSystemAccess = async (req, res) => {
  try {
    const personal = await personalService.obtenerConAcceso();
    res.json({
      ok: true,
      personal,
      total: personal.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const updatePersonal = async (req, res) => {
  try {
    const updatedPersonal = await personalService.actualizarPersonal(
      req.params.id,
      req.body
    );
    res.json({
      ok: true,
      msg: "Personal actualizado exitosamente",
      personal: updatedPersonal
    });
  } catch (error) {
    handleError(res, error);
  }
};

const deletePersonal = async (req, res) => {
  try {
    const result = await personalService.eliminarPersonal(req.params.id);
    res.json({
      ok: true,
      msg: "Personal eliminado exitosamente",
      id: result.id
    });
  } catch (error) {
    handleError(res, error);
  }
};

const searchPersonalByName = async (req, res) => {
  try {
    // Cambiar de req.query.name a req.validated.name
    const { name } = req.validated;
    const personal = await personalService.buscarPorNombre(name);
    res.json({
      ok: true,
      personal,
      total: personal.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const searchPersonalByCedula = async (req, res) => {
  try {
    // Cambiar de req.query.ci a req.validated.ci
    const { ci } = req.validated;
    const personal = await personalService.buscarPorCedula(ci);
    res.json({
      ok: true,
      personal,
      total: personal.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await personalService.obtenerRoles();
    res.json({
      ok: true,
      roles,
      total: roles.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getParroquias = async (req, res) => {
  try {
    const parroquias = await personalService.obtenerParroquias();
    res.json({
      ok: true,
      parroquias,
      total: parroquias.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

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
  getParroquias
};