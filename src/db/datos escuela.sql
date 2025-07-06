-- Datos de Prueba para 'country'
INSERT INTO "country" (name, created_at, updated_at) VALUES
('Venezuela', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Colombia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brazil', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'state'
INSERT INTO "state" (name, "countryID", created_at, updated_at) VALUES
('Táchira', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mérida', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carabobo', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cundinamarca', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('São Paulo', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'municipality'
INSERT INTO "municipality" (name, "stateID", created_at, updated_at) VALUES
('San Cristóbal', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Libertador', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Valencia', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bogotá', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Campinas', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'parish'
INSERT INTO "parish" (name, "minicipalityID", created_at, updated_at) VALUES
('San Juan Bautista', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('La Concordia', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('El Llano', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('San Blas', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Usaquén', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'rol'
INSERT INTO "rol" (name, description, created_at, updated_at) VALUES
('Docente', 'Personal encargado de la enseñanza.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Administrador', 'Personal administrativo de la institución.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mantenimiento', 'Personal encargado del mantenimiento de las instalaciones.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Secretaría', 'Personal de secretaría y atención al público.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'permisos'
INSERT INTO "permisos" (nombre, descripcion, created_at, updated_at) VALUES
('Acceso Total', 'Permiso para acceder a todas las funciones del sistema.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gestión Académica', 'Permiso para gestionar estudiantes, matrículas y notas.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gestión Personal', 'Permiso para gestionar el personal de la institución.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Consulta Básica', 'Permiso solo para consultar información.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'personal'
INSERT INTO "personal" (ci, name, "lastName", "idRole", "telephoneNumber", email, birthday, direction, parish, created_at, updated_at) VALUES
('12345678', 'Ana', 'García', 1, '04121234567', 'ana.garcia@example.com', '1980-05-15', 'Calle Real 123', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('87654321', 'Luis', 'Martínez', 2, '04149876543', 'luis.martinez@example.com', '1975-11-20', 'Avenida Siempre Viva', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11223344', 'Carlos', 'Rodríguez', 3, '04261122334', 'carlos.r@example.com', '1990-03-10', 'Zona Industrial', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('99887766', 'María', 'Fernández', 1, '04165554433', 'maria.f@example.com', '1982-08-25', 'Callejón Angosto 5', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'status_student'
INSERT INTO "status_student" (descripcion, created_at, updated_at) VALUES
('Activo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Inactivo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Graduado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Retirado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'brigade'
INSERT INTO "brigade" (name, created_at, updated_at) VALUES
('Brigada Ecológica', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada Deportiva', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada Cívica', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'brigadeTeacherDate'
INSERT INTO "brigadeTeacherDate" ("brigadeID", "dateI", "personalID", created_at, updated_at) VALUES
(1, '2024-09-01', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '2024-09-01', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, '2024-09-01', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'representative'
INSERT INTO "representative" (ci, name, "lastName", "telephoneNumber", email, "maritalStat", profesion, birthday, "telephoneHouse", "roomAdress", "workPlace", "jobNumber", created_at, updated_at) VALUES
('10101010', 'Julia', 'González', '04247778899', 'julia.g@example.com', 'Casado', 'Abogado', '1978-02-10', '02761112233', 'Urb. Las Rosas', 'Bufete Legal', '02764445566', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('20202020', 'Roberto', 'Sánchez', '04161112233', 'roberto.s@example.com', 'Soltero', 'Ingeniero', '1970-07-22', '02769998877', 'Conjunto Residencial El Sol', 'Empresa de Software', '02767776655', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'student'
INSERT INTO "student" (ci, name, "lastName", sex, birthday, "placeBirth", "parishID", status_id, "brigadeTeacherDateID", "quantityBrothers", "representativeID", "motherName", "motherCi", "motherTelephone", "fatherName", "fatherCi", "fatherTelephone", "livesMother", "livesFather", "livesBoth", "livesRepresentative", "rolRopresentative", created_at, updated_at) VALUES
('30001001', 'Diego', 'Pérez', 'Masculino', '2015-01-20', 'San Cristóbal', 1, 1, 1, 1, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Pérez', '12345678', '04121234567', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30002002', 'Sofía', 'López', 'Femenino', '2016-03-12', 'Mérida', 3, 1, 2, 0, '20202020', 'Carla López', '98765432', '04161112233', 'Pedro López', '87654321', '04149876543', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30003003', 'Andrés', 'Ramírez', 'Masculino', '2014-09-05', 'Valencia', 4, 1, 1, 2, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Pérez', '12345678', '04121234567', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'grade'
INSERT INTO "grade" (name, created_at, updated_at) VALUES
('Primer Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Segundo Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tercer Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'section'
INSERT INTO "section" ("teacherCI", "gradeID", seccion, period, created_at, updated_at) VALUES
(1, 1, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 2, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'enrollment'
INSERT INTO "enrollment" ("studentID", "sectionID", "brigadeTeacherDateID", "registrationDate", repeater, "chemiseSize", "pantsSize", "shoesSize", weight, stature, diseases, observation, "birthCertificateCheck", "vaccinationCardCheck", "studentPhotosCheck", "representativePhotosCheck", "representativeCopyIDCheck", "representativeRIFCheck", "autorizedCopyIDCheck", created_at, updated_at) VALUES
(1, 1, 1, '2024-09-10', FALSE, 'M', 'M', '30', 30.5, 1.20, 'Ninguna', 'Buen estudiante', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 2, '2024-09-10', FALSE, 'S', 'S', '28', 28.0, 1.15, 'Asma', 'Requiere atención especial', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 1, '2024-09-10', TRUE, 'M', 'M', '31', 32.0, 1.25, 'Alergia al polen', 'Necesita inhalador', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'notes'
INSERT INTO "notes" ("enrollmentID", notes, period, subject, "registrationDate", created_at, updated_at) VALUES
(1, 18.50, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 19.00, 'Primer Lapso', 'Lengua', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 16.00, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 15.50, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'usuario'
INSERT INTO "usuario" (username, email, password, permiso_id, is_active, email_verified, security_word, respuesta_de_seguridad, personal_id, created_at, updated_at) VALUES
('admin.ana', 'admin.ana@example.com', '$2a$10$xyz...', 1, TRUE, TRUE, 'color favorito', 'azul', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Contraseña hasheada
('teacher.maria', 'teacher.maria@example.com', '$2a$10$abc...', 2, TRUE, FALSE, 'nombre mascota', 'fido', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Contraseña hasheada
('secretary.pedro', 'secretary.pedro@example.com', '$2a$10$def...', 3, TRUE, TRUE, 'comida favorita', 'pizza', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Contraseña hasheada

-- Datos de Prueba para 'attendance'
INSERT INTO "attendance" (date_a, "sectionID", observaciones, created_at, updated_at) VALUES
('2025-01-10', 1, 'Asistencia regular', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-10', 2, 'Faltaron 2 estudiantes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Datos de Prueba para 'attendanceDetails'
INSERT INTO "attendanceDetails" ("attendanceID", "studentID", assistant) VALUES
(1, 1, TRUE),
(2, 3, TRUE);