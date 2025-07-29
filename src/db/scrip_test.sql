-- #############################################################################
-- ## INSERCIÓN DE DATOS DE PRUEBA MASIVOS PARA SISTEMA ESCOLAR
-- #############################################################################

-- Usamos IDs explícitos para facilitar las referencias entre tablas.
-- NOTA: Estos inserts asumen que las tablas están vacías y que los IDs generados por defecto comienzan en 1.
--       Los datos de usabilidad (países, estados, etc.) ya deben estar cargados.

-- -----------------------------------------------------------------------------
-- 1. Rellenar Tabla 'personal' y 'usuario'
--    Crearemos personal con roles de Administrador, Docente y Secretaría.
-- -----------------------------------------------------------------------------

-- Personal (Directores, Secretarios, Docentes)
INSERT INTO "personal" ("id", "ci", "name", "lastName", "idRole", "telephoneNumber", "email", "birthday", "direction", "parish", "created_at", "updated_at") VALUES
(1, 'V12345678', 'Carlos', 'Martínez', 1, '0414-1234567', 'carlos.martinez@email.com', '1980-05-10', 'Barrio Obrero', 1, NOW(), NOW()),
(2, 'V87654321', 'Ana', 'Gómez', 3, '0416-8765432', 'ana.gomez@email.com', '1985-11-20', 'Centro', 2, NOW(), NOW()),
(3, 'V11223344', 'Lucía', 'Pérez', 2, '0424-1122334', 'lucia.perez@email.com', '1990-02-15', 'Av. España', 3, NOW(), NOW()),
(4, 'V22334455', 'Jorge', 'Hernández', 2, '0412-2233445', 'jorge.hernandez@email.com', '1992-08-30', 'La Concordia', 3, NOW(), NOW()),
(5, 'V33445566', 'María', 'Fernández', 2, '0414-3344556', 'maria.fernandez@email.com', '1988-07-25', 'Táriba', 7, NOW(), NOW()),
(6, 'V44556677', 'Pedro', 'Ramírez', 2, '0416-4455667', 'pedro.ramirez@email.com', '1991-01-12', 'Palmira', 9, NOW(), NOW()),
(7, 'V55667788', 'Sofía', 'Torres', 2, '0426-5566778', 'sofia.torres@email.com', '1993-04-18', 'San Josecito', 8, NOW(), NOW()),
(8, 'V66778899', 'Luis', 'Díaz', 2, '0414-6677889', 'luis.diaz@email.com', '1989-12-05', 'Pueblo Nuevo', 1, NOW(), NOW()),
(9, 'V77889900', 'Elena', 'Rojas', 2, '0412-7788990', 'elena.rojas@email.com', '1994-09-22', 'Las Acacias', 2, NOW(), NOW()),
(10, 'V88990011', 'Daniel', 'Morales', 2, '0424-8899001', 'daniel.morales@email.com', '1995-03-03', 'Pirineos', 4, NOW(), NOW());

-- Usuarios del Sistema (asociados al personal)
INSERT INTO "usuario" ("id", "username", "email", "password", "permiso_id", "personal_id", "is_active", "email_verified", "created_at", "updated_at") VALUES
(11, 'admin2', 'admin2@gmail.com', 'hash_password_seguro', 7, 1, TRUE, TRUE, NOW(), NOW()), -- Administrador -> Configurar Sistema
(2, 'secretaria', 'ana.gomez@email.com', 'hash_password_seguro', 2, 2, TRUE, TRUE, NOW(), NOW()), -- Secretaría -> Gestionar Estudiantes
(3, 'lperez', 'lucia.perez@email.com', 'hash_password_seguro', 3, 3, TRUE, TRUE, NOW(), NOW()),      -- Docente -> Gestionar Notas
(4, 'jhernandez', 'jorge.hernandez@email.com', 'hash_password_seguro', 3, 4, TRUE, TRUE, NOW(), NOW()),-- Docente -> Gestionar Notas
(5, 'mfernandez', 'maria.fernandez@email.com', 'hash_password_seguro', 3, 5, TRUE, TRUE, NOW(), NOW()),-- Docente -> Gestionar Notas
(6, 'pramirez', 'pedro.ramirez@email.com', 'hash_password_seguro', 3, 6, TRUE, TRUE, NOW(), NOW()),  -- Docente -> Gestionar Notas
(7, 'storres', 'sofia.torres@email.com', 'hash_password_seguro', 3, 7, TRUE, TRUE, NOW(), NOW()),   -- Docente -> Gestionar Notas
(8, 'ldiaz', 'luis.diaz@email.com', 'hash_password_seguro', 3, 8, TRUE, TRUE, NOW(), NOW()),      -- Docente -> Gestionar Notas
(9, 'erojas', 'elena.rojas@email.com', 'hash_password_seguro', 3, 9, TRUE, TRUE, NOW(), NOW()),    -- Docente -> Gestionar Notas
(10, 'dmorales', 'daniel.morales@email.com', 'hash_password_seguro', 3, 10, TRUE, TRUE, NOW(), NOW());-- Docente -> Gestionar Notas


-- -----------------------------------------------------------------------------
-- 2. Rellenar Tabla 'representative'
--    Crearemos una base amplia de representantes.
-- -----------------------------------------------------------------------------
INSERT INTO "representative" ("ci", "name", "lastName", "telephoneNumber", "email", "maritalStat", "profesion", "birthday", "workPlace") VALUES
('V10101010', 'Roberto', 'Sánchez', '0414-1112233', 'roberto.s@email.com', 'Casado(a)', 'Ingeniero', '1980-01-15', 'Empresa X'),
('V11112222', 'Laura', 'González', '0416-2223344', 'laura.g@email.com', 'Soltero(a)', 'Abogado(a)', '1982-03-20', 'Bufete Y'),
('V12121212', 'Miguel', 'Castro', '0424-3334455', 'miguel.c@email.com', 'Divorciado(a)', 'Comerciante', '1978-07-10', 'Negocio Propio'),
('V13131313', 'Carmen', 'Mendoza', '0412-4445566', 'carmen.m@email.com', 'Viudo(a)', 'Enfermera', '1985-05-25', 'Hospital Central'),
('V14141414', 'Ricardo', 'Silva', '0414-5556677', 'ricardo.s@email.com', 'Casado(a)', 'Contador', '1983-09-05', 'Oficina Contable'),
('V15151515', 'Isabel', 'García', '0416-6667788', 'isabel.g@email.com', 'Soltero(a)', 'Diseñadora Gráfica', '1990-11-12', 'Agencia de Publicidad'),
('V16161616', 'Javier', 'Ortega', '0426-7778899', 'javier.o@email.com', 'Casado(a)', 'Mecánico', '1981-02-28', 'Taller Automotriz'),
('V17171717', 'Patricia', 'Vargas', '0414-8889900', 'patricia.v@email.com', 'Divorciado(a)', 'Secretaria', '1987-08-18', 'Oficina Z'),
('V18181818', 'Andrés', 'Jiménez', '0412-9990011', 'andres.j@email.com', 'Soltero(a)', 'Estudiante', '1995-04-30', 'Universidad'),
('V19191919', 'Verónica', 'Chacón', '0416-0001122', 'veronica.c@email.com', 'Casado(a)', 'Ama de Casa', '1984-06-22', 'Hogar');


-- -----------------------------------------------------------------------------
-- 3. Rellenar Tabla 'student'
--    Estudiantes con diferentes edades, vinculados a representantes y parroquias.
-- -----------------------------------------------------------------------------
INSERT INTO "student" ("id", "ci", "name", "lastName", "sex", "birthday", "placeBirth", "parishID", "status_id", "quantityBrothers", "representativeID", "motherName", "motherCi", "livesMother", "fatherName", "fatherCi", "livesFather", "livesBoth", "livesRepresentative", "rolRopresentative") VALUES
-- Estudiantes para 1er Nivel (3 años)
(1, '31111222', 'Ana Sofía', 'Sánchez González', 'Femenino', '2021-05-15', 'Táchira', 7, 1, 0, 'V10101010', 'Laura González', 'V11112222', TRUE, 'Roberto Sánchez', 'V10101010', TRUE, TRUE, FALSE, 'Padre'),
-- Estudiantes para 2do Nivel (4 años)
(2, '30555444', 'Diego', 'Castro Mendoza', 'Masculino', '2020-08-20', 'Táchira', 8, 1, 1, 'V13131313', 'Carmen Mendoza', 'V13131313', TRUE, 'Miguel Castro', 'V12121212', FALSE, FALSE, TRUE, 'Madre'),
-- Estudiantes para 3er Nivel (5 años)
(3, '29888777', 'Valentina', 'Silva García', 'Femenino', '2019-11-10', 'Mérida', 9, 1, 0, 'V14141414', 'Isabel García', 'V15151515', TRUE, 'Ricardo Silva', 'V14141414', TRUE, TRUE, FALSE, 'Padre'),
-- Estudiantes para 1er Grado (6 años)
(4, '28111222', 'Mateo', 'Ortega Vargas', 'Masculino', '2018-02-25', 'Táchira', 1, 1, 2, 'V16161616', 'Patricia Vargas', 'V17171717', FALSE, 'Javier Ortega', 'V16161616', TRUE, FALSE, TRUE, 'Padre'),
-- Estudiantes para 2do Grado (7 años)
(5, '27555444', 'Camila', 'Jiménez Chacón', 'Femenino', '2017-07-30', 'Zulia', 2, 1, 1, 'V19191919', 'Verónica Chacón', 'V19191919', TRUE, 'Andrés Jiménez', 'V18181818', TRUE, TRUE, FALSE, 'Madre'),
-- Estudiantes para 3er Grado (8 años)
(6, '26888777', 'Santiago', 'Sánchez González', 'Masculino', '2016-09-05', 'Táchira', 7, 1, 1, 'V10101010', 'Laura González', 'V11112222', TRUE, 'Roberto Sánchez', 'V10101010', TRUE, TRUE, FALSE, 'Padre'),
-- Estudiantes para 4to Grado (9 años)
(7, '25111222', 'Isabella', 'Castro Mendoza', 'Femenino', '2015-04-12', 'Táchira', 8, 1, 1, 'V12121212', 'Carmen Mendoza', 'V13131313', TRUE, 'Miguel Castro', 'V12121212', FALSE, FALSE, TRUE, 'Abuela'),
-- Estudiantes para 5to Grado (10 años)
(8, '24555444', 'Sebastián', 'Silva García', 'Masculino', '2014-10-18', 'Mérida', 9, 1, 0, 'V14141414', 'Isabel García', 'V15151515', TRUE, 'Ricardo Silva', 'V14141414', TRUE, TRUE, FALSE, 'Padre'),
-- Estudiante Retirado
(9, '23888777', 'Lucas', 'Ortega Vargas', 'Masculino', '2013-01-20', 'Táchira', 1, 6, 2, 'V16161616', 'Patricia Vargas', 'V17171717', FALSE, 'Javier Ortega', 'V16161616', TRUE, FALSE, TRUE, 'Padre'),
-- Estudiante Nuevo Ingreso para el año actual
(10, '29999888', 'Valeria', 'Núñez', 'Femenino', '2018-03-03', 'Barinas', 3, 2, 0, 'V18181818', 'Ana Núñez', 'V20202020', TRUE, 'Pedro Núñez', 'V21212121', TRUE, TRUE, FALSE, 'Tío');


-- -----------------------------------------------------------------------------
-- 4. Rellenar Tabla 'section' para DOS periodos académicos
--    Asignaremos docentes a grados para los periodos 2023-2024 y 2024-2025.
-- -----------------------------------------------------------------------------
-- Periodo Académico 2023-2024 (ID: 1)
INSERT INTO "section" ("id", "teacherCI", "gradeID", "academicPeriodID", "seccion", "created_at", "updated_at") VALUES
(1, 3, 1, 1, 'A', NOW(), NOW()), -- 1er Nivel A, Prof. Lucía Pérez
(2, 4, 2, 1, 'A', NOW(), NOW()), -- 2do Nivel A, Prof. Jorge Hernández
(3, 5, 3, 1, 'A', NOW(), NOW()), -- 3er Nivel A, Prof. María Fernández
(4, 6, 4, 1, 'A', NOW(), NOW()), -- 1er Grado A, Prof. Pedro Ramírez
(5, 7, 5, 1, 'A', NOW(), NOW()), -- 2do Grado A, Prof. Sofía Torres
(6, 8, 6, 1, 'A', NOW(), NOW()), -- 3er Grado A, Prof. Luis Díaz
(7, 9, 7, 1, 'A', NOW(), NOW()), -- 4to Grado A, Prof. Elena Rojas
(8, 10, 8, 1, 'A', NOW(), NOW()); -- 5to Grado A, Prof. Daniel Morales

-- Periodo Académico 2024-2025 (ID: 2)
INSERT INTO "section" ("id", "teacherCI", "gradeID", "academicPeriodID", "seccion", "created_at", "updated_at") VALUES
(9, 3, 1, 2, 'A', NOW(), NOW()), -- 1er Nivel A, Prof. Lucía Pérez
(10, 4, 2, 2, 'A', NOW(), NOW()), -- 2do Nivel A, Prof. Jorge Hernández
(11, 5, 3, 2, 'A', NOW(), NOW()), -- 3er Nivel A, Prof. María Fernández
(12, 6, 4, 2, 'A', NOW(), NOW()), -- 1er Grado A, Prof. Pedro Ramírez
(13, 7, 5, 2, 'A', NOW(), NOW()), -- 2do Grado A, Prof. Sofía Torres
(14, 8, 6, 2, 'A', NOW(), NOW()), -- 3er Grado A, Prof. Luis Díaz
(15, 9, 7, 2, 'A', NOW(), NOW()), -- 4to Grado A, Prof. Elena Rojas
(16, 10, 8, 2, 'A', NOW(), NOW()); -- 5to Grado A, Prof. Daniel Morales


-- -----------------------------------------------------------------------------
-- 5. Rellenar Tabla 'enrollment' para el PERIODO ANTERIOR (2023-2024)
--    Simulamos un año escolar ya finalizado.
-- -----------------------------------------------------------------------------
INSERT INTO "enrollment" ("id", "studentID", "sectionID", "registrationDate", "repeater", "chemiseSize", "pantsSize", "shoesSize", "weight", "stature", "diseases", "observation", "birthCertificateCheck", "vaccinationCardCheck", "final_grade", "final_grade_observation") VALUES
-- Estudiantes promovidos
(1, 1, 1, '2023-09-20', FALSE, 'S', '4', '25', 14.5, 0.95, 'Ninguna', 'Participativo', TRUE, TRUE, 'A', 'Excelente rendimiento, promovido con honores.'),
(2, 2, 2, '2023-09-21', FALSE, 'S', '6', '27', 16.0, 1.05, 'Asma Leve', 'Requiere seguimiento', TRUE, TRUE, 'A', 'Promovido. Muestra gran interés.'),
(3, 3, 3, '2023-09-22', FALSE, 'M', '8', '29', 18.2, 1.15, 'Ninguna', 'Muy creativo', TRUE, TRUE, 'A', 'Promovida. Destaca en actividades artísticas.'),
(4, 4, 4, '2023-09-23', FALSE, 'M', '10', '31', 22.0, 1.20, 'Alergia al polvo', 'Se distrae con facilidad', TRUE, FALSE, 'B', 'Promovido. Necesita reforzar lectura.'),
(5, 5, 5, '2023-09-24', FALSE, 'L', '12', '33', 25.5, 1.28, 'Ninguna', 'Líder del grupo', FALSE, TRUE, 'A', 'Promovida. Excelente participación.'),
(6, 6, 6, '2023-09-25', FALSE, 'L', '14', '35', 30.1, 1.35, 'Ninguna', 'Colaborador', TRUE, TRUE, 'B', 'Promovido. Debe mejorar la caligrafía.'),
(7, 7, 7, '2023-09-26', FALSE, 'XL', '16', '36', 35.0, 1.42, 'Miopía', 'Usa lentes', TRUE, TRUE, 'C', 'Promovida. Aprobó con la calificación mínima.'),
-- Estudiante que repetirá
(8, 8, 8, '2023-09-27', FALSE, 'XL', '16', '37', 38.5, 1.45, 'Ninguna', 'Poca participación', TRUE, TRUE, 'D', 'No aprobado. Repetirá el grado.');


-- -----------------------------------------------------------------------------
-- 6. Rellenar Tabla 'notes' para el PERIODO ANTERIOR (2023-2024)
--    Notas de varios lapsos para las matrículas del año pasado.
-- -----------------------------------------------------------------------------
-- Notas para Matrícula ID 1 (Ana Sofía)
INSERT INTO "notes" ("enrollmentID", "notes", "period", "subject", "registrationDate") VALUES
(1, 'A', '1er Lapso', 'Lenguaje', '2023-12-10'), (1, 'A', '2do Lapso', 'Lenguaje', '2024-03-15'), (1, 'A', '3er Lapso', 'Lenguaje', '2024-06-20'),
(1, 'A', '1er Lapso', 'Matemática', '2023-12-10'), (1, 'B', '2do Lapso', 'Matemática', '2024-03-15'), (1, 'A', '3er Lapso', 'Matemática', '2024-06-20');
-- Notas para Matrícula ID 4 (Mateo)
INSERT INTO "notes" ("enrollmentID", "notes", "period", "subject", "registrationDate") VALUES
(4, 'B', '1er Lapso', 'Lenguaje', '2023-12-10'), (4, 'C', '2do Lapso', 'Lenguaje', '2024-03-15'), (4, 'B', '3er Lapso', 'Lenguaje', '2024-06-20'),
(4, 'C', '1er Lapso', 'Ciencias', '2023-12-10'), (4, 'B', '2do Lapso', 'Ciencias', '2024-03-15'), (4, 'B', '3er Lapso', 'Ciencias', '2024-06-20');
-- Notas para Matrícula ID 8 (Sebastián, el repitente)
INSERT INTO "notes" ("enrollmentID", "notes", "period", "subject", "registrationDate") VALUES
(8, 'C', '1er Lapso', 'Matemática', '2023-12-10'), (8, 'D', '2do Lapso', 'Matemática', '2024-03-15'), (8, 'D', '3er Lapso', 'Matemática', '2024-06-20');


-- -----------------------------------------------------------------------------
-- 7. Rellenar Tabla 'attendance' y 'attendanceDetails' para el PERIODO ANTERIOR
-- -----------------------------------------------------------------------------
-- Asistencia para la sección 4 (1er Grado A) el día 2024-02-05
INSERT INTO "attendance" ("id", "date_a", "sectionID", "observaciones") VALUES (1, '2024-02-05', 4, 'Actividad especial de manualidades.');
INSERT INTO "attendanceDetails" ("attendanceID", "studentID", "assistant") VALUES
(1, 4, TRUE); -- Mateo asistió

-- Asistencia para la sección 8 (5to Grado A) el día 2024-05-10
INSERT INTO "attendance" ("id", "date_a", "sectionID", "observaciones") VALUES (2, '2024-05-10', 8, 'Examen de matemática.');
INSERT INTO "attendanceDetails" ("attendanceID", "studentID", "assistant") VALUES
(2, 8, FALSE); -- Sebastián no asistió


-- -----------------------------------------------------------------------------
-- 8. Rellenar Tabla 'enrollment' para el PERIODO ACTUAL (2024-2025)
--    Inscribimos a los promovidos, repitentes y nuevos ingresos.
-- -----------------------------------------------------------------------------
INSERT INTO "enrollment" ("id", "studentID", "sectionID", "registrationDate", "repeater", "chemiseSize", "pantsSize", "shoesSize", "weight", "stature", "diseases", "observation", "birthCertificateCheck", "vaccinationCardCheck") VALUES
-- Promovidos al siguiente grado
(9, 1, 10, '2024-09-20', FALSE, 'S', '6', '26', 16.5, 1.02, 'Ninguna', 'Continúa participativa', TRUE, TRUE), -- Ana Sofía -> 2do Nivel (Sección ID 10)
(10, 2, 11, '2024-09-21', FALSE, 'M', '8', '28', 18.0, 1.10, 'Asma Leve', 'Traer inhalador', TRUE, TRUE),     -- Diego -> 3er Nivel (Sección ID 11)
(11, 3, 12, '2024-09-22', FALSE, 'M', '10', '30', 20.2, 1.20, 'Ninguna', 'Adaptada al nuevo grado', TRUE, TRUE), -- Valentina -> 1er Grado (Sección ID 12)
(12, 4, 13, '2024-09-23', FALSE, 'L', '12', '32', 24.5, 1.26, 'Alergia al polvo', 'Reforzar atención', TRUE, TRUE),-- Mateo -> 2do Grado (Sección ID 13)
(13, 5, 14, '2024-09-24', FALSE, 'L', '14', '34', 28.0, 1.34, 'Ninguna', 'Sigue siendo líder', TRUE, TRUE),    -- Camila -> 3er Grado (Sección ID 14)
(14, 6, 15, '2024-09-25', FALSE, 'XL', '16', '36', 33.0, 1.41, 'Ninguna', 'Mejoró caligrafía', TRUE, TRUE),    -- Santiago -> 4to Grado (Sección ID 15)
(15, 7, 16, '2024-09-26', FALSE, 'XL', '16', '37', 38.0, 1.48, 'Miopía', 'Revisión oftalmológica pendiente', TRUE, FALSE), -- Isabella -> 5to Grado (Sección ID 16)
-- Repitente
(16, 8, 16, '2024-09-27', TRUE, 'XL', '18', '38', 41.0, 1.50, 'Ninguna', 'Comprometido a mejorar', TRUE, TRUE),-- Sebastián -> Repite 5to Grado (Sección ID 16)
-- Nuevo Ingreso
(17, 10, 12, '2024-09-28', FALSE, 'M', '10', '31', 22.5, 1.21, 'Ninguna', 'Proviene de otra ciudad', TRUE, TRUE); -- Valeria -> 1er Grado (Sección ID 12)


-- -----------------------------------------------------------------------------
-- 9. Rellenar Tabla 'student_academic_history' para el nuevo ingreso
-- -----------------------------------------------------------------------------
INSERT INTO "student_academic_history" ("studentID", "academicPeriodID", "gradeID", "institutionName", "gradeAchieved", "isApproved", "created_at", "updated_at") VALUES
(10, 1, 3, 'U.E. Colegio Los Próceres (Barinas)', 'A', TRUE, NOW(), NOW()); -- Historial de Valeria (Estudiante ID 10) del año anterior (Periodo ID 1, Grado ID 3 -> 3er Nivel)


-- -----------------------------------------------------------------------------
-- 10. Asignación de Brigadas (Docentes y Estudiantes)
-- -----------------------------------------------------------------------------
-- Asignar Docentes a Brigadas por Periodo
INSERT INTO "brigadeTeacherDate" ("id", "brigadeID", "personalID", "academicPeriodID", "dateI") VALUES
(1, 1, 5, 1, '2023-10-01'), -- Ecológica | Prof. María F. | Periodo 2023-24
(2, 2, 6, 1, '2023-10-01'), -- Patrulleros | Prof. Pedro R. | Periodo 2023-24
(3, 1, 5, 2, '2024-10-01'), -- Ecológica | Prof. María F. | Periodo 2024-25
(4, 3, 7, 2, '2024-10-01'); -- Comunicacional | Prof. Sofía T. | Periodo 2024-25

-- Asignar Estudiantes a Brigadas por Periodo
-- Periodo 2023-2024
INSERT INTO "studentBrigade" ("studentID", "brigadeID", "academicPeriodID", "assignmentDate") VALUES
(4, 2, 1, '2023-10-15'), -- Mateo en Patrulleros
(5, 2, 1, '2023-10-15'), -- Camila en Patrulleros
(6, 1, 1, '2023-10-16'), -- Santiago en Ecológica
(7, 1, 1, '2023-10-16'); -- Isabella en Ecológica

-- Periodo 2024-2025
INSERT INTO "studentBrigade" ("studentID", "brigadeID", "academicPeriodID", "assignmentDate") VALUES
(4, 2, 2, '2024-10-15'), -- Mateo sigue en Patrulleros
(5, 3, 2, '2024-10-15'), -- Camila cambió a Comunicacional
(10, 1, 2, '2024-10-16'); -- Valeria (nueva) se une a Ecológica

-- #############################################################################
-- ## FIN DEL SCRIPT DE DATOS DE PRUEBA
-- #############################################################################