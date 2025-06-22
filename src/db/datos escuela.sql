-- SQL SCRIPT PARA POBLAR LA BASE DE DATOS EscuelaDB

-- -----------------------------------------------------------
-- 1. Población de tablas de Ubicación Geográfica
-- -----------------------------------------------------------

-- Tabla pais
INSERT INTO pais (nombre, created_at, updated_at) VALUES
('Venezuela', NOW(), NOW()),
('Colombia', NOW(), NOW());

-- Tabla estado (asumiendo pais_id 1 para Venezuela)
INSERT INTO estado (nombre, pais_id, created_at, updated_at) VALUES
('Táchira', 1, NOW(), NOW()),
('Mérida', 1, NOW(), NOW()),
('Zulia', 1, NOW(), NOW()),
('Norte de Santander', 2, NOW(), NOW()); -- Para simular un estado de Colombia

-- Tabla municipio (asumiendo estado_id para Táchira y Mérida)
INSERT INTO municipio (nombre, estado_id, created_at, updated_at) VALUES
('San Cristóbal', 1, NOW(), NOW()),
('Cárdenas', 1, NOW(), NOW()),
('Libertador', 2, NOW(), NOW()), -- Mérida
('Maracaibo', 3, NOW(), NOW()), -- Zulia
('Cúcuta', 4, NOW(), NOW()); -- Norte de Santander, Colombia

-- Tabla parroquia (asumiendo municipio_id para San Cristóbal, Cárdenas, Libertador, Maracaibo, Cúcuta)
INSERT INTO parroquia (nombre, municipio_id, created_at, updated_at) VALUES
('San Juan Bautista', 1, NOW(), NOW()), -- San Cristóbal
('La Concordia', 1, NOW(), NOW()), -- San Cristóbal
('Táriba', 2, NOW(), NOW()), -- Cárdenas
('Chiguará', 3, NOW(), NOW()), -- Libertador, Mérida
('Olegario Villalobos', 4, NOW(), NOW()), -- Maracaibo
('El Zulia', 5, NOW(), NOW()); -- Cúcuta, Colombia

-- -----------------------------------------------------------
-- 2. Población de tablas de Seguridad y Acceso
-- -----------------------------------------------------------

-- Tabla rol
INSERT INTO rol (name, description, created_at, updated_at) VALUES
('Director', 'Máxima autoridad de la institución.', NOW(), NOW()),
('Administrativo', 'Personal encargado de la gestión administrativa y de oficina.', NOW(), NOW()),
('Docente', 'Personal encargado de la enseñanza y educación.', NOW(), NOW()),
('Obrero', 'Personal encargado del mantenimiento y servicios generales.', NOW(), NOW());

-- Tabla permisos
INSERT INTO permisos (nombre, descripcion, created_at, updated_at) VALUES
('Administrador', 'Acceso total al sistema (lectura y escritura).', NOW(), NOW()),
('Usuario', 'Acceso de solo lectura al sistema.', NOW(), NOW());

-- Tabla personal (Director, Docentes, Administrativo, Obrero)
INSERT INTO personal (nombre, lastName, idRole, telephoneNomber, CI, Email, birthday, created_at, updated_at, direccion, parroquia_id) VALUES
('Ana', 'García', (SELECT id FROM rol WHERE name = 'Director'), '04147778899', '12345678', 'ana.garcia@escuela.com', '1975-03-15', NOW(), NOW(), 'Av. Principal 123', (SELECT id FROM parroquia WHERE nombre = 'San Juan Bautista')),
('Carlos', 'López', (SELECT id FROM rol WHERE name = 'Docente'), '04161112233', '10987654', 'carlos.lopez@escuela.com', '1980-07-20', NOW(), NOW(), 'Calle 5 #4-50', (SELECT id FROM parroquia WHERE nombre = 'La Concordia')),
('María', 'Pérez', (SELECT id FROM rol WHERE name = 'Docente'), '04264445566', '11223344', 'maria.perez@escuela.com', '1982-11-01', NOW(), NOW(), 'Carrera 6 #10-20', (SELECT id FROM parroquia WHERE nombre = 'Táriba')),
('José', 'Martínez', (SELECT id FROM rol WHERE name = 'Administrativo'), '04123334455', '13579246', 'jose.martinez@escuela.com', '1978-09-25', NOW(), NOW(), 'Residencias Sol, Apto 5', (SELECT id FROM parroquia WHERE nombre = 'San Juan Bautista')),
('Luisa', 'Rodríguez', (SELECT id FROM rol WHERE name = 'Obrero'), '04246667788', '14701235', 'luisa.rodriguez@escuela.com', '1965-01-10', NOW(), NOW(), 'Sector El Carmen, Casa 3', (SELECT id FROM parroquia WHERE nombre = 'La Concordia')),
('Pedro', 'Gómez', (SELECT id FROM rol WHERE name = 'Docente'), '04149990011', '15975310', 'pedro.gomez@escuela.com', '1985-05-30', NOW(), NOW(), 'Urb. Los Pinos, C-1', (SELECT id FROM parroquia WHERE nombre = 'San Juan Bautista'));

-- Tabla usuario (enlazando con personal)
INSERT INTO usuario (username, email, password, permiso_id, access_token, refresh_token, token_expiry, email_verification_token, email_verified, password_reset_token, password_reset_expires, security_word, respuesta_de_seguridad, last_login, is_active, created_at, updated_at, personal_id) VALUES
('anagarcia_admin', 'ana.garcia@escuela.com', 'hashedpassword123', (SELECT id FROM permisos WHERE nombre = 'Administrador'), 'token123', 'rtoken123', NOW() + INTERVAL '1 hour', 'emailveriftoken1', TRUE, NULL, NULL, 'animal favorito', 'perro', NOW(), TRUE, NOW(), NOW(), (SELECT id FROM personal WHERE CI = '12345678')),
('carloslopez_doc', 'carlos.lopez@escuela.com', 'hashedpassword456', (SELECT id FROM permisos WHERE nombre = 'Usuario'), 'token456', 'rtoken456', NOW() + INTERVAL '1 hour', 'emailveriftoken2', TRUE, NULL, NULL, 'color favorito', 'azul', NOW(), TRUE, NOW(), NOW(), (SELECT id FROM personal WHERE CI = '10987654')),
('josemartinez_adm', 'jose.martinez@escuela.com', 'hashedpassword789', (SELECT id FROM permisos WHERE nombre = 'Administrador'), 'token789', 'rtoken789', NOW() + INTERVAL '1 hour', 'emailveriftoken3', TRUE, NULL, NULL, 'nombre de madre', 'carmen', NOW(), TRUE, NOW(), NOW(), (SELECT id FROM personal WHERE CI = '13579246'));

-- -----------------------------------------------------------
-- 3. Información del estudiante
-- -----------------------------------------------------------

-- Tabla status_student
INSERT INTO status_student (descripcion, created_at, updated_at) VALUES
('Activo', NOW(), NOW()),
('Inactivo', NOW(), NOW()),
('Egresado', NOW(), NOW()),
('Retirado', NOW(), NOW());

-- Tabla brigada
INSERT INTO brigada (nombre, created_at, updated_at) VALUES
('Brigada Ecológica', NOW(), NOW()),
('Brigada de Primeros Auxilios', NOW(), NOW()),
('Brigada de Recreación', NOW(), NOW());

-- Tabla brigada_docente_fecha (Docentes a cargo de brigadas)
INSERT INTO brigada_docente_fecha (brigada_id, fecha, personal_id, created_at, updated_at) VALUES
((SELECT id FROM brigada WHERE nombre = 'Brigada Ecológica'), '2025-09-01', (SELECT id FROM personal WHERE CI = '10987654'), NOW(), NOW()), -- Carlos López
((SELECT id FROM brigada WHERE nombre = 'Brigada de Primeros Auxilios'), '2025-09-01', (SELECT id FROM personal WHERE CI = '11223344'), NOW(), NOW()), -- María Pérez
((SELECT id FROM brigada WHERE nombre = 'Brigada de Recreación'), '2025-09-01', (SELECT id FROM personal WHERE CI = '15975310'), NOW(), NOW()); -- Pedro Gómez

-- Tabla estudiante
INSERT INTO estudiante (nombre, apellido, status_id, brigada_docente_fecha_id, vive_madre, vive_padre, vive_ambos, vive_representante, lugarNacimiento_id, sexo, cedula_escolar, cant_hermanos, created_at, updated_at) VALUES
('Sofía', 'Delgado', (SELECT id FROM status_student WHERE descripcion = 'Activo'), (SELECT id FROM brigada_docente_fecha WHERE personal_id = (SELECT id FROM personal WHERE CI = '10987654') AND brigada_id = (SELECT id FROM brigada WHERE nombre = 'Brigada Ecológica')), TRUE, TRUE, TRUE, FALSE, 'San Juan Bautista', 'Femenino', 'E-001', 1, NOW(), NOW()),
('Diego', 'Ramírez', (SELECT id FROM status_student WHERE descripcion = 'Activo'), (SELECT id FROM brigada_docente_fecha WHERE personal_id = (SELECT id FROM personal WHERE CI = '11223344') AND brigada_id = (SELECT id FROM brigada WHERE nombre = 'Brigada de Primeros Auxilios')), TRUE, FALSE, FALSE, FALSE, 'La Concordia', 'Masculino', 'E-002', 2, NOW(), NOW()),
('Valentina', 'Rojas', (SELECT id FROM status_student WHERE descripcion = 'Activo'), (SELECT id FROM brigada_docente_fecha WHERE personal_id = (SELECT id FROM personal WHERE CI = '15975310') AND brigada_id = (SELECT id FROM brigada WHERE nombre = 'Brigada de Recreación')), FALSE, FALSE, FALSE, TRUE, 'Táriba', 'Femenino', 'E-003', 0, NOW(), NOW()),
('Sebastián', 'Silva', (SELECT id FROM status_student WHERE descripcion = 'Activo'), (SELECT id FROM brigada_docente_fecha WHERE personal_id = (SELECT id FROM personal WHERE CI = '10987654') AND brigada_id = (SELECT id FROM brigada WHERE nombre = 'Brigada Ecológica')), TRUE, TRUE, TRUE, FALSE, 'San Juan Bautista', 'Masculino', 'E-004', 3, NOW(), NOW());

-- Tabla estudiante_bdf (Brigadas a las que pertenece el estudiante)
INSERT INTO estudiante_bdf (descripcion, student_id, created_at, updated_at, brigada_id) VALUES
('Miembro de la brigada ecológica.', (SELECT id FROM estudiante WHERE cedula_escolar = 'E-001'), NOW(), NOW(), (SELECT id FROM brigada WHERE nombre = 'Brigada Ecológica')),
('Miembro de la brigada de primeros auxilios.', (SELECT id FROM estudiante WHERE cedula_escolar = 'E-002'), NOW(), NOW(), (SELECT id FROM brigada WHERE nombre = 'Brigada de Primeros Auxilios')),
('Miembro de la brigada de recreación.', (SELECT id FROM estudiante WHERE cedula_escolar = 'E-003'), NOW(), NOW(), (SELECT id FROM brigada WHERE nombre = 'Brigada de Recreación'));

-- Tabla representante (asociado a un estudiante)
INSERT INTO representante (name, lastName, roleName, telephoneNomber, Cedula, Email, birthday, created_at, updated_at, estudiante_id, telephoneHouse, direccionHabitacion, lugar_trabajo, telefono_trabajo) VALUES
('Laura', 'Delgado', 'Madre', '04141234567', '20123456', 'laura.delgado@example.com', '1988-02-28', NOW(), NOW(), (SELECT id FROM estudiante WHERE cedula_escolar = 'E-001'), '02761234567', 'Calle Principal #1', 'Comercio C.A.', '02767890123'),
('Roberto', 'Ramírez', 'Padre', '04169876543', '18765432', 'roberto.ramirez@example.com', '1985-09-10', NOW(), NOW(), (SELECT id FROM estudiante WHERE cedula_escolar = 'E-002'), '02762345678', 'Av. Bolívar #2', 'Oficina S.A.', '02768901234'),
('Carla', 'González', 'Representante Legal', '04245556677', '22345678', 'carla.gonzalez@example.com', '1970-04-05', NOW(), NOW(), (SELECT id FROM estudiante WHERE cedula_escolar = 'E-003'), '02763456789', 'Barrio Obrero, Casa 4', 'Consultoría X', '02769012345');

-- -----------------------------------------------------------
-- 4. Parte académica
-- -----------------------------------------------------------

-- Tabla grado
INSERT INTO grado (nombre, created_at, updated_at) VALUES
('1er Grado', NOW(), NOW()),
('2do Grado', NOW(), NOW()),
('3er Grado', NOW(), NOW()),
('4to Grado', NOW(), NOW()),
('5to Grado', NOW(), NOW()),
('6to Grado', NOW(), NOW());

-- Tabla docente_grado (Asignación de docentes a grados y secciones)
INSERT INTO docente_grado (docente_id, grado_id, created_at, updated_at, seccion) VALUES
((SELECT id FROM personal WHERE CI = '10987654'), (SELECT id FROM grado WHERE nombre = '1er Grado'), NOW(), NOW(), 'A'), -- Carlos López
((SELECT id FROM personal WHERE CI = '11223344'), (SELECT id FROM grado WHERE nombre = '2do Grado'), NOW(), NOW(), 'B'), -- María Pérez
((SELECT id FROM personal WHERE CI = '15975310'), (SELECT id FROM grado WHERE nombre = '3er Grado'), NOW(), NOW(), 'A'); -- Pedro Gómez

-- Tabla matricula (Simulación de inscripción)
INSERT INTO matricula (estudiante_id, docente_grado_id, fecha_inscripcion, periodo_escolar, repitiente, talla_camisa, talla_pantalon, talla_zapatos, peso, estatura, enfermedades, observaciones, acta_nacimiento_check, tarjeta_vacunas_check, fotos_estudiante_check, fotos_representante_check, copia_cedula_representante_check, rif_representante, copia_cedula_autorizados_check, created_at, updated_at) VALUES
((SELECT id FROM estudiante WHERE cedula_escolar = 'E-001'), (SELECT id FROM docente_grado WHERE docente_id = (SELECT id FROM personal WHERE CI = '10987654') AND seccion = 'A'), '2025-09-05', '2025-2026', FALSE, 'S', 'S', '28', 25.5, 1.20, 'Ninguna', 'Excelente desempeño.', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, NOW(), NOW()),
((SELECT id FROM estudiante WHERE cedula_escolar = 'E-002'), (SELECT id FROM docente_grado WHERE docente_id = (SELECT id FROM personal WHERE CI = '11223344') AND seccion = 'B'), '2025-09-06', '2025-2026', FALSE, 'M', 'M', '30', 30.0, 1.30, 'Asma', 'Requiere atención especial en educación física.', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, NOW(), NOW()),
((SELECT id FROM estudiante WHERE cedula_escolar = 'E-003'), (SELECT id FROM docente_grado WHERE docente_id = (SELECT id FROM personal WHERE CI = '15975310') AND seccion = 'A'), '2025-09-07', '2025-2026', TRUE, 'S', 'S', '29', 27.0, 1.25, 'Alergia al polen', 'Buen rendimiento a pesar de haber repetido.', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, NOW(), NOW());

-- Tabla notas
INSERT INTO notas (matricula_id, nota, periodo, asignatura, fecha_registro, created_at, updated_at) VALUES
((SELECT id FROM matricula WHERE estudiante_id = (SELECT id FROM estudiante WHERE cedula_escolar = 'E-001')), 18.50, '1er Lapso', 'Matemáticas', '2025-11-15', NOW(), NOW()),
((SELECT id FROM matricula WHERE estudiante_id = (SELECT id FROM estudiante WHERE cedula_escolar = 'E-001')), 19.00, '1er Lapso', 'Lenguaje', '2025-11-15', NOW(), NOW()),
((SELECT id FROM matricula WHERE estudiante_id = (SELECT id FROM estudiante WHERE cedula_escolar = 'E-002')), 15.00, '1er Lapso', 'Matemáticas', '2025-11-16', NOW(), NOW()),
((SELECT id FROM matricula WHERE estudiante_id = (SELECT id FROM estudiante WHERE cedula_escolar = 'E-003')), 17.25, '1er Lapso', 'Ciencias Naturales', '2025-11-17', NOW(), NOW());

-- Tabla asistencia_diaria
INSERT INTO asistencia_diaria (fecha, grado_id, cantidad_asistentes, observaciones, created_at, updated_at) VALUES
('2025-09-09', (SELECT id FROM docente_grado WHERE docente_id = (SELECT id FROM personal WHERE CI = '10987654') AND seccion = 'A'), 25, 'Asistencia normal en 1er Grado A.', NOW(), NOW()),
('2025-09-09', (SELECT id FROM docente_grado WHERE docente_id = (SELECT id FROM personal WHERE CI = '11223344') AND seccion = 'B'), 20, 'Hubo 2 inasistencias en 2do Grado B.', NOW(), NOW()),
('2025-09-10', (SELECT id FROM docente_grado WHERE docente_id = (SELECT id FROM personal WHERE CI = '10987654') AND seccion = 'A'), 24, 'Un estudiante con permiso médico en 1er Grado A.', NOW(), NOW());
