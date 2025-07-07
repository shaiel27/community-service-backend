import { PersonalModel } from '../models/personal.model.js';

class PersonalService {
  // Crear personal
  async crearPersonal(personalData) {
    // Verificar cédula única
    const existingByCi = await PersonalModel.findOneByCi(personalData.ci);
    if (existingByCi) {
      throw new Error('Ya existe personal con esta cédula');
    }

    // Verificar email único (si se proporciona)
    if (personalData.email) {
      const existingByEmail = await PersonalModel.findOneByEmail(personalData.email);
      if (existingByEmail) {
        throw new Error('Ya existe personal con este email');
      }
    }

    return PersonalModel.create(personalData);
  }

  // Actualizar personal
  async actualizarPersonal(id, updateData) {
    const personal = await this.obtenerPorId(id);

    // Verificar cédula única si se cambia
    if (updateData.ci && updateData.ci !== personal.ci) {
      const existingByCi = await PersonalModel.findOneByCi(updateData.ci);
      if (existingByCi && existingByCi.id !== id) {
        throw new Error('Ya existe personal con esta cédula');
      }
    }

    // Verificar email único si se cambia
    if (updateData.email && updateData.email !== personal.email) {
      const existingByEmail = await PersonalModel.findOneByEmail(updateData.email);
      if (existingByEmail && existingByEmail.id !== id) {
        throw new Error('Ya existe personal con este email');
      }
    }

    return PersonalModel.update(id, updateData);
  }

  // Obtener todo el personal
  async obtenerTodoPersonal() {
    return PersonalModel.findAll();
  }

  // Obtener por ID
  async obtenerPorId(id) {
    const personal = await PersonalModel.findOneById(id);
    if (!personal) throw new Error('Personal no encontrado');
    return personal;
  }

  // Obtener por rol
  async obtenerPorRol(idRole) {
    return PersonalModel.findByRole(idRole);
  }

  // Obtener docentes
  async obtenerDocentes() {
    return PersonalModel.findTeachers();
  }

  // Obtener administradores
  async obtenerAdministradores() {
    return PersonalModel.findAdministrators();
  }

  // Obtener personal de mantenimiento
  async obtenerMantenimiento() {
    return PersonalModel.findMaintenance();
  }

  // Obtener personal sin acceso al sistema
  async obtenerSinAcceso() {
    return PersonalModel.findWithoutSystemAccess();
  }

  // Obtener personal con acceso al sistema
  async obtenerConAcceso() {
    return PersonalModel.findWithSystemAccess();
  }

  // Buscar por nombre
  async buscarPorNombre(name) {
    return PersonalModel.searchByName(name);
  }

  // Buscar por cédula
  async buscarPorCedula(ci) {
    return PersonalModel.searchByCi(ci);
  }

  // Eliminar personal
  async eliminarPersonal(id) {
    const personal = await this.obtenerPorId(id);
    return PersonalModel.remove(id);
  }

  // Obtener roles
  async obtenerRoles() {
    return PersonalModel.getRoles();
  }

  // Obtener parroquias
  async obtenerParroquias() {
    return PersonalModel.getParishes();
  }
}

export default new PersonalService();