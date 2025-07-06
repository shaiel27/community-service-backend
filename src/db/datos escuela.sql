-- Datos iniciales para el sistema escolar - Todo en español

-- Datos para 'pais'
INSERT INTO "pais" (nombre, fecha_creacion, fecha_actualizacion) VALUES
('Venezuela', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Colombia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brasil', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'estado'
INSERT INTO "estado" (nombre, pais_id, fecha_creacion, fecha_actualizacion) VALUES
('Táchira', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mérida', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carabobo', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cundinamarca', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('São Paulo', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'municipio'
INSERT INTO "municipio" (nombre, estado_id, fecha_creacion, fecha_actualizacion) VALUES
('San Cristóbal', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Libertador', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Valencia', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bogotá', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Campinas', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'parroquia'
INSERT INTO "parroquia" (nombre, municipio_id, fecha_creacion, fecha_actualizacion) VALUES
('San Juan Bautista', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('La Concordia', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('El Llano', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('San Blas', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Usaquén', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'rol'
INSERT INTO "rol" (nombre, descripcion, fecha_creacion, fecha_actualizacion) VALUES
('Director', 'Encargado de la escuela.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Docente', 'Personal encargado de la enseñanza.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Administrador', 'Personal administrativo de la institución.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mantenimiento', 'Personal encargado del mantenimiento de las instalaciones.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Secretaría', 'Personal de secretaría y atención al público.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'permisos'
INSERT INTO "permisos" (nombre, descripcion, fecha_creacion, fecha_actualizacion) VALUES
('Acceso Total', 'Permiso para acceder a todas las funciones del sistema.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gestión Académica', 'Permiso para gestionar estudiantes, matrículas y notas.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gestión Personal', 'Permiso para gestionar el personal de la institución.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Consulta Básica', 'Permiso solo para consultar información.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'personal'
INSERT INTO "personal" (cedula, nombre, apellido, rol_id, telefono, email, fecha_nacimiento, direccion, parroquia_id, fecha_creacion, fecha_actualizacion) VALUES
('V12345678', 'Ana', 'García', 1, '04121234567', 'ana.garcia@example.com', '1980-05-15', 'Calle Real 123', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('V87654321', 'Luis', 'Martínez', 2, '04149876543', 'luis.martinez@example.com', '1975-11-20', 'Avenida Siempre Viva', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('V11223344', 'Carlos', 'Rodríguez', 3, '04261122334', 'carlos.r@example.com', '1990-03-10', 'Zona Industrial', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('V99887766', 'María', 'Fernández', 1, '04165554433', 'maria.f@example.com', '1982-08-25', 'Callejón Angosto 5', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('V22334455', 'Pedro', 'Pérez', 4, '04123332211', 'pedro.p@example.com', '1988-01-30', 'Centro Comercial', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'estado_estudiante'
INSERT INTO "estado_estudiante" (descripcion, fecha_creacion, fecha_actualizacion) VALUES
('Activo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Inactivo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Graduado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Retirado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'brigada'
INSERT INTO "brigada" (nombre, fecha_creacion, fecha_actualizacion) VALUES
('Brigada Ecológica', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada Deportiva', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada Cívica', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'brigada_docente_fecha'
INSERT INTO "brigada_docente_fecha" (brigada_id, fecha_inicio, personal_id, fecha_creacion, fecha_actualizacion) VALUES
(1, '2024-09-01', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '2024-09-01', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, '2024-09-01', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'representante'
INSERT INTO "representante" (cedula, nombre, apellido, telefono, email, estado_civil, profesion, fecha_nacimiento, telefono_casa, direccion_habitacion, lugar_trabajo, telefono_trabajo, fecha_creacion, fecha_actualizacion) VALUES
('V10101010', 'Julia', 'González', '04247778899', 'julia.g@example.com', 'Casado', 'Abogado', '1978-02-10', '02761112233', 'Urb. Las Rosas', 'Bufete Legal', '02764445566', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('V20202020', 'Roberto', 'Sánchez', '04161112233', 'roberto.s@example.com', 'Soltero', 'Ingeniero', '1970-07-22', '02769998877', 'Conjunto Residencial El Sol', 'Empresa de Software', '02767776655', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'estudiante'
INSERT INTO "estudiante" (cedula, nombre, apellido, sexo, fecha_nacimiento, lugar_nacimiento, parroquia_id, estado_id, brigada_docente_fecha_id, cantidad_hermanos, representante_id, nombre_madre, cedula_madre, telefono_madre, nombre_padre, cedula_padre, telefono_padre, vive_con_madre, vive_con_padre, vive_con_ambos, vive_con_representante, rol_representante, fecha_creacion, fecha_actualizacion) VALUES
('V30001001', 'Diego', 'Pérez', 'Masculino', '2015-01-20', 'San Cristóbal', 1, 1, 1, 1, 'V10101010', 'Julia González', 'V10101010', '04247778899', 'Juan Pérez', 'V12345678', '04121234567', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('V30002002', 'Sofía', 'López', 'Femenino', '2016-03-12', 'Mérida', 3, 1, 2, 0, 'V20202020', 'Carla López', 'V98765432', '04161112233', 'Pedro López', 'V87654321', '04149876543', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('V30003003', 'Andrés', 'Ramírez', 'Masculino', '2014-09-05', 'Valencia', 4, 1, 1, 2, 'V10101010', 'Julia González', 'V10101010', '04247778899', 'Juan Pérez', 'V12345678', '04121234567', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'grado'
INSERT INTO "grado" (nombre, fecha_creacion, fecha_actualizacion) VALUES
('Primer Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Segundo Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tercer Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'seccion'
INSERT INTO "seccion" (docente_id, grado_id, seccion, periodo, fecha_creacion, fecha_actualizacion) VALUES
(1, 1, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 2, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'matricula'
INSERT INTO "matricula" (estudiante_id, seccion_id, brigada_docente_fecha_id, fecha_inscripcion, repitiente, talla_camisa, talla_pantalon, talla_zapatos, peso, estatura, enfermedades, observaciones, acta_nacimiento_check, tarjeta_vacunas_check, fotos_estudiante_check, fotos_representante_check, copia_cedula_representante_check, rif_representante_check, copia_cedula_autorizados_check, fecha_creacion, fecha_actualizacion) VALUES
(1, 1, 1, '2024-09-10', FALSE, 'M', 'M', '30', 30.5, 1.20, 'Ninguna', 'Buen estudiante', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 2, '2024-09-10', FALSE, 'S', 'S', '28', 28.0, 1.15, 'Asma', 'Requiere atención especial', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 1, '2024-09-10', TRUE, 'M', 'M', '31', 32.0, 1.25, 'Alergia al polen', 'Necesita inhalador', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'notas'
INSERT INTO "notas" (matricula_id, nota, periodo, materia, fecha_registro, fecha_creacion, fecha_actualizacion) VALUES
(1, 18.50, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 19.00, 'Primer Lapso', 'Lengua', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 16.00, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 15.50, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'usuario'
INSERT INTO "usuario" (nombre_usuario, email, contrasena, permiso_id, activo, email_verificado, pregunta_seguridad, respuesta_seguridad, personal_id, fecha_creacion, fecha_actualizacion) VALUES
('admin.ana', 'admin.ana@example.com', '$2a$10$xyz...', 1, TRUE, TRUE, '¿Cuál es tu color favorito?', 'azul', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('docente.maria', 'docente.maria@example.com', '$2a$10$abc...', 2, TRUE, FALSE, '¿Cuál es el nombre de tu mascota?', 'fido', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('secretaria.pedro', 'secretaria.pedro@example.com', '$2a$10$def...', 3, TRUE, TRUE, '¿Cuál es tu comida favorita?', 'pizza', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'asistencia'
INSERT INTO "asistencia" (fecha, seccion_id, observaciones, fecha_creacion, fecha_actualizacion) VALUES
('2025-01-10', 1, 'Asistencia regular', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-10', 2, 'Faltaron 2 estudiantes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos para 'detalle_asistencia'
INSERT INTO "detalle_asistencia" (asistencia_id, estudiante_id, presente) VALUES
(1, 1, TRUE),
(1, 3, TRUE),
(2, 2, TRUE);
