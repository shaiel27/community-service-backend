    -- DML - Segunda Inyección de Datos (Datos de Prueba Transaccionales)
    -- Compatible con PostgreSQL

    -- -----------------------------------------------------------------------------
    -- 1. Rellenar Tabla 'personal'
    --    Asignando roles y parroquias existentes
    -- -----------------------------------------------------------------------------
    INSERT INTO "personal" ("ci", "name", "lastName", "idRole", "telephoneNumber", "email", "birthday", "direction", "parish", "created_at", "updated_at") VALUES
    ('12345678', 'Juan', 'Pérez', (SELECT id FROM "rol" WHERE name = 'Administrador'), '04141234567', 'juan.perez@escuela.com', '1980-05-10', 'Calle Principal 1', (SELECT id FROM "parish" WHERE name = 'San Juan Bautista' AND "minicipalityID" = (SELECT id FROM "municipality" WHERE name = 'San Cristóbal' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira'))), NOW(), NOW()),
    ('87654321', 'María', 'García', (SELECT id FROM "rol" WHERE name = 'Docente'), '04167654321', 'maria.garcia@escuela.com', '1985-03-20', 'Av. Las Flores 20', (SELECT id FROM "parish" WHERE name = 'Táriba' AND "minicipalityID" = (SELECT id FROM "municipality" WHERE name = 'Cárdenas' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira'))), NOW(), NOW()),
    ('11223344', 'Carlos', 'Rodríguez', (SELECT id FROM "rol" WHERE name = 'Docente'), '04261122334', 'carlos.rodriguez@escuela.com', '1978-11-12', 'Sector El Carmen 5', (SELECT id FROM "parish" WHERE name = 'San Josecito' AND "minicipalityID" = (SELECT id FROM "municipality" WHERE name = 'Torbes' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira'))), NOW(), NOW()),
    ('55667788', 'Ana', 'Martínez', (SELECT id FROM "rol" WHERE name = 'Secretaría'), '04125566778', 'ana.martinez@escuela.com', '1990-07-01', 'Urb. Miranda 3', (SELECT id FROM "parish" WHERE name = 'La Concordia' AND "minicipalityID" = (SELECT id FROM "municipality" WHERE name = 'San Cristóbal' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira'))), NOW(), NOW()),
    ('99001122', 'Pedro', 'Sánchez', (SELECT id FROM "rol" WHERE name = 'Mantenimiento'), '04249900112', 'pedro.sanchez@escuela.com', '1975-01-25', 'Callejón Los Andes 10', (SELECT id FROM "parish" WHERE name = 'Palmira' AND "minicipalityID" = (SELECT id FROM "municipality" WHERE name = 'Guásimos' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira'))), NOW(), NOW());

    -- -----------------------------------------------------------------------------
    -- 2. Rellenar Tabla 'usuario'
    --    Asignando personal y permisos (contraseñas en texto plano, usar hashes en producción)
    -- -----------------------------------------------------------------------------
    INSERT INTO "usuario" ("username", "email", "password", "permiso_id", "access_token", "refresh_token", "token_expiry", "email_verification_token", "email_verified", "password_reset_token", "password_reset_expires", "security_word", "respuesta_de_seguridad", "last_login", "is_active", "created_at", "updated_at", "personal_id") VALUES
    ('admin_juan', 'juan.perez@escuela.com', 'hashed_password_admin123', (SELECT id FROM "permisos" WHERE nombre = 'Gestionar Usuarios'), NULL, NULL, NULL, NULL, TRUE, NULL, NULL, 'mascota', 'fido', NOW(), TRUE, NOW(), NOW(), (SELECT id FROM "personal" WHERE ci = '12345678')),
    ('maria_docente', 'maria.garcia@escuela.com', 'hashed_password_maria123', (SELECT id FROM "permisos" WHERE nombre = 'Gestionar Notas'), NULL, NULL, NULL, NULL, TRUE, NULL, NULL, 'color', 'azul', NOW(), TRUE, NOW(), NOW(), (SELECT id FROM "personal" WHERE ci = '87654321')),
    ('carlos_docente', 'carlos.rodriguez@escuela.com', 'hashed_password_carlos123', (SELECT id FROM "permisos" WHERE nombre = 'Gestionar Notas'), NULL, NULL, NULL, NULL, TRUE, NULL, NULL, 'comida', 'pizza', NOW(), TRUE, NOW(), NOW(), (SELECT id FROM "personal" WHERE ci = '11223344')),
    ('ana_secretaria', 'ana.martinez@escuela.com', 'hashed_password_ana123', (SELECT id FROM "permisos" WHERE nombre = 'Gestionar Estudiantes'), NULL, NULL, NULL, NULL, TRUE, NULL, NULL, 'pelicula', 'matrix', NOW(), TRUE, NOW(), NOW(), (SELECT id FROM "personal" WHERE ci = '55667788')),
    ('pedro_mantenimiento', 'pedro.sanchez@escuela.com', 'hashed_password_pedro123', (SELECT id FROM "permisos" WHERE nombre = 'Gestionar Usuarios'), NULL, NULL, NULL, NULL, TRUE, NULL, NULL, 'cancion', 'rock', NOW(), TRUE, NOW(), NOW(), (SELECT id FROM "personal" WHERE ci = '99001122'));


    -- -----------------------------------------------------------------------------
    -- 3. Rellenar Tabla 'representative'
    -- -----------------------------------------------------------------------------
    INSERT INTO "representative" ("ci", "name", "lastName", "telephoneNumber", "email", "maritalStat", "profesion", "birthday", "telephoneHouse", "roomAdress", "workPlace", "jobNumber", "created_at", "updated_at") VALUES
    ('10111222', 'Laura', 'Gómez', '04145551122', 'laura.gomez@mail.com', 'Casado/a', 'Ingeniera', '1975-01-15', '02767778899', 'Av. Siempre Viva 123', 'Empresa XYZ', '555-666', NOW(), NOW()),
    ('20222333', 'Roberto', 'Hernández', '04269993344', 'roberto.h@mail.com', 'Soltero/a', 'Contador', '1980-09-01', '02761112233', 'Calle El Sol 45', 'Consultoría ABC', '777-888', NOW(), NOW()),
    ('30333444', 'Sofía', 'Ramírez', '04128885566', 'sofia.r@mail.com', 'Viudo/a', 'Médico', '1968-04-22', '02763334455', 'Carrera 6 #10-15', 'Clínica Central', '999-000', NOW(), NOW());

    -- -----------------------------------------------------------------------------
    -- 4. Rellenar Tabla 'student'
    --    Asignando representantes, parroquias y estatus
    -- -----------------------------------------------------------------------------
    INSERT INTO "student" ("ci", "name", "lastName", "sex", "birthday", "placeBirth", "parishID", "status_id", "quantityBrothers", "representativeID", "motherName", "motherCi", "motherTelephone", "fatherName", "fatherCi", "fatherTelephone", "livesMother", "livesFather", "livesBoth", "livesRepresentative", "rolRopresentative", "created_at", "updated_at") VALUES
    ('25000111', 'Diego', 'Gómez', 'Masculino', '2015-02-01', 'San Cristóbal', (SELECT id FROM "parish" WHERE name = 'San Juan Bautista' AND "minicipalityID" = (SELECT id FROM "municipality" WHERE name = 'San Cristóbal' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira'))), (SELECT id FROM "status_student" WHERE descripcion = 'Activo'), 1, '10111222', 'Laura Gómez', '10111222', '04145551122', 'Juan Gómez', '10000111', '04141112233', TRUE, TRUE, TRUE, FALSE, 'Padre', NOW(), NOW()),
    ('26000222', 'Valeria', 'Hernández', 'Femenino', '2016-08-10', 'Táriba', (SELECT id FROM "parish" WHERE name = 'Táriba' AND "minicipalityID" = (SELECT id FROM "municipality" WHERE name = 'Cárdenas' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira'))), (SELECT id FROM "status_student" WHERE descripcion = 'Activo'), 0, '20222333', 'Carolina Salas', '20000444', '04164445566', 'Roberto Hernández', '20222333', '04269993344', FALSE, TRUE, FALSE, TRUE, 'Padre', NOW(), NOW()),
    ('27000333', 'Gabriel', 'Ramírez', 'Masculino', '2017-03-05', 'San Josecito', (SELECT id FROM "parish" WHERE name = 'San Josecito' AND "minicipalityID" = (SELECT id FROM "municipality" WHERE name = 'Torbes' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira'))), (SELECT id FROM "status_student" WHERE descripcion = 'Activo'), 2, '30333444', 'Ana Blanco', '30000777', '04127778899', 'Luis Ramírez', '30000888', '04121112233', TRUE, FALSE, FALSE, TRUE, 'Madre', NOW(), NOW());

    -- -----------------------------------------------------------------------------
    -- 5. Rellenar Tabla 'academic_period' (Ya se hizo en la primera inyección, solo obtener IDs)
    -- -----------------------------------------------------------------------------
    SELECT id FROM "academic_period" WHERE name = '2024-2025'; -- Periodo actual
    SELECT id FROM "academic_period" WHERE name = '2023-2024'; -- Periodo anterior

    -- -----------------------------------------------------------------------------
    -- 6. Rellenar Tabla 'section'
    --    Creando secciones para el período 2024-2025
    -- -----------------------------------------------------------------------------
    INSERT INTO "section" ("teacherCI", "gradeID", "academicPeriodID", "seccion", "created_at", "updated_at") VALUES
    ((SELECT id FROM "personal" WHERE ci = '87654321'), (SELECT id FROM "grade" WHERE name = '1er Grado'), (SELECT id FROM "academic_period" WHERE name = '2024-2025'), 'A', NOW(), NOW()),
    ((SELECT id FROM "personal" WHERE ci = '11223344'), (SELECT id FROM "grade" WHERE name = '2do Grado'), (SELECT id FROM "academic_period" WHERE name = '2024-2025'), 'B', NOW(), NOW()),
    ((SELECT id FROM "personal" WHERE ci = '87654321'), (SELECT id FROM "grade" WHERE name = '3er Grado'), (SELECT id FROM "academic_period" WHERE name = '2024-2025'), 'A', NOW(), NOW());

    -- -----------------------------------------------------------------------------
    -- 7. Rellenar Tabla 'brigadeTeacherDate'
    --    Asignando profesores a brigadas para el período 2024-2025
    -- -----------------------------------------------------------------------------
    INSERT INTO "brigadeTeacherDate" ("brigadeID", "personalID", "academicPeriodID", "dateI", "created_at", "updated_at") VALUES
    ((SELECT id FROM "brigade" WHERE name = 'Brigada Ecológica'), (SELECT id FROM "personal" WHERE ci = '87654321'), (SELECT id FROM "academic_period" WHERE name = '2024-2025'), '2024-09-20', NOW(), NOW()),
    ((SELECT id FROM "brigade" WHERE name = 'Brigada de Primeros Auxilios'), (SELECT id FROM "personal" WHERE ci = '11223344'), (SELECT id FROM "academic_period" WHERE name = '2024-2025'), '2024-09-20', NOW(), NOW());

    -- -----------------------------------------------------------------------------
    -- 8. Rellenar Tabla 'enrollment'
    --    Inscribiendo estudiantes en secciones para el período actual (2024-2025)
    -- -----------------------------------------------------------------------------
    INSERT INTO "enrollment" ("studentID", "sectionID", "brigadeTeacherDateID", "registrationDate", "repeater", "chemiseSize", "pantsSize", "shoesSize", "weight", "stature", "diseases", "observation", "birthCertificateCheck", "vaccinationCardCheck", "studentPhotosCheck", "representativePhotosCheck", "representativeCopyIDCheck", "representativeRIFCheck", "autorizedCopyIDCheck", "created_at", "updated_at") VALUES
    ((SELECT id FROM "student" WHERE ci = '25000111'), (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '1er Grado') AND seccion = 'A' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025')), (SELECT id FROM "brigadeTeacherDate" WHERE "brigadeID" = (SELECT id FROM "brigade" WHERE name = 'Brigada Ecológica') AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025')), '2024-09-10', FALSE, 'S', 'S', '30', 25.5, 1.20, NULL, 'Ninguna', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, NOW(), NOW()),
    ((SELECT id FROM "student" WHERE ci = '26000222'), (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '2do Grado') AND seccion = 'B' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025')), (SELECT id FROM "brigadeTeacherDate" WHERE "brigadeID" = (SELECT id FROM "brigade" WHERE name = 'Brigada de Primeros Auxilios') AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025')), '2024-09-11', FALSE, 'M', 'M', '34', 30.0, 1.35, 'Asma leve', 'Requiere atención especial', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, NOW(), NOW()),
    ((SELECT id FROM "student" WHERE ci = '27000333'), (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '1er Grado') AND seccion = 'A' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025')), NULL, '2024-09-12', FALSE, 'S', 'S', '28', 22.0, 1.15, NULL, NULL, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, NOW(), NOW());

    -- -----------------------------------------------------------------------------
    -- 9. Rellenar Tabla 'student_academic_history'
    --    Ejemplos de historial externo y también de un año anterior en la misma escuela
    -- -----------------------------------------------------------------------------
    INSERT INTO "student_academic_history" ("studentID", "academicPeriodID", "gradeID", "institutionName", "gradeAchieved", "isApproved", "created_at", "updated_at") VALUES
    -- Historial externo para Diego Gómez (nuevo ingreso, cursó 1er Grado en otra escuela en 2023-2024)
    ((SELECT id FROM "student" WHERE ci = '25000111'), (SELECT id FROM "academic_period" WHERE name = '2023-2024'), (SELECT id FROM "grade" WHERE name = '1er Grado'), 'Escuela Primaria La Esperanza', 'A', TRUE, NOW(), NOW()),
    -- Historial externo para Valeria Hernández (cursó 1er Grado en otra escuela)
    ((SELECT id FROM "student" WHERE ci = '26000222'), (SELECT id FROM "academic_period" WHERE name = '2023-2024'), (SELECT id FROM "grade" WHERE name = '1er Grado'), 'Colegio Los Saberes', 'B', TRUE, NOW(), NOW()),
    -- Historial de un estudiante que reprobó un grado anterior (ejemplo para mostrar 'F')
    ((SELECT id FROM "student" WHERE ci = '27000333'), (SELECT id FROM "academic_period" WHERE name = '2023-2024'), (SELECT id FROM "grade" WHERE name = '1er Grado'), 'Otra Escuela', 'F', FALSE, NOW(), NOW());


    -- -----------------------------------------------------------------------------
    -- 10. Rellenar Tabla 'notes'
    --    Notas para los estudiantes inscritos en el período 2024-2025
    -- -----------------------------------------------------------------------------
    INSERT INTO "notes" ("enrollmentID", "notes", "period", "subject", "registrationDate", "created_at", "updated_at") VALUES
    ((SELECT id FROM "enrollment" WHERE "studentID" = (SELECT id FROM "student" WHERE ci = '25000111') AND "sectionID" = (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '1er Grado') AND seccion = 'A' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025'))), 'A', '1er Lapso', 'Lengua', '2024-12-01', NOW(), NOW()),
    ((SELECT id FROM "enrollment" WHERE "studentID" = (SELECT id FROM "student" WHERE ci = '25000111') AND "sectionID" = (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '1er Grado') AND seccion = 'A' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025'))), 'B', '1er Lapso', 'Matemáticas', '2024-12-01', NOW(), NOW()),
    ((SELECT id FROM "enrollment" WHERE "studentID" = (SELECT id FROM "student" WHERE ci = '26000222') AND "sectionID" = (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '2do Grado') AND seccion = 'B' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025'))), 'C', '1er Lapso', 'Ciencias Naturales', '2024-12-05', NOW(), NOW());

    -- -----------------------------------------------------------------------------
    -- 11. Rellenar Tabla 'studentBrigade'
    --    Asignando estudiantes a brigadas en el período 2024-2025
    -- -----------------------------------------------------------------------------
    INSERT INTO "studentBrigade" ("studentID", "brigadeID", "academicPeriodID", "assignmentDate", "created_at", "updated_at") VALUES
    ((SELECT id FROM "student" WHERE ci = '25000111'), (SELECT id FROM "brigade" WHERE name = 'Brigada Ecológica'), (SELECT id FROM "academic_period" WHERE name = '2024-2025'), '2024-10-01', NOW(), NOW()),
    ((SELECT id FROM "student" WHERE ci = '26000222'), (SELECT id FROM "brigade" WHERE name = 'Brigada de Primeros Auxilios'), (SELECT id FROM "academic_period" WHERE name = '2024-2025'), '2024-10-01', NOW(), NOW());

    -- -----------------------------------------------------------------------------
    -- 12. Rellenar Tabla 'attendance' y 'attendanceDetails'
    --    Registrando asistencia para algunas secciones y fechas
    -- -----------------------------------------------------------------------------

    -- Asistencia para 1er Grado A el 2025-01-20
    INSERT INTO "attendance" ("date_a", "sectionID", "observaciones", "created_at", "updated_at") VALUES
    ('2025-01-20', (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '1er Grado') AND seccion = 'A' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025')), 'Clase normal.', NOW(), NOW());

    -- Detalles de asistencia para la fecha anterior
    INSERT INTO "attendanceDetails" ("attendanceID", "studentID", "assistant") VALUES
    ((SELECT id FROM "attendance" WHERE date_a = '2025-01-20' AND "sectionID" = (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '1er Grado') AND seccion = 'A' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025'))), (SELECT id FROM "student" WHERE ci = '25000111'), TRUE),
    ((SELECT id FROM "attendance" WHERE date_a = '2025-01-20' AND "sectionID" = (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '1er Grado') AND seccion = 'A' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025'))), (SELECT id FROM "student" WHERE ci = '27000333'), FALSE); -- Gabriel ausente

    -- Asistencia para 2do Grado B el 2025-01-20
    INSERT INTO "attendance" ("date_a", "sectionID", "observaciones", "created_at", "updated_at") VALUES
    ('2025-01-20', (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '2do Grado') AND seccion = 'b' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025')), 'Clase normal.', NOW(), NOW());

    -- Detalles de asistencia para la fecha anterior
    INSERT INTO "attendanceDetails" ("attendanceID", "studentID", "assistant") VALUES
    ((SELECT id FROM "attendance" WHERE date_a = '2025-01-20' AND "sectionID" = (SELECT id FROM "section" WHERE "gradeID" = (SELECT id FROM "grade" WHERE name = '2do Grado') AND seccion = 'B' AND "academicPeriodID" = (SELECT id FROM "academic_period" WHERE name = '2024-2025'))), (SELECT id FROM "student" WHERE ci = '26000222'), TRUE);