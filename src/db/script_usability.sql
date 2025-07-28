-- DML - Primera Inyección de Datos (Datos de Usabilidad/Producción Inicial)
-- Compatible con PostgreSQL

-- -----------------------------------------------------------------------------
-- 1. Rellenar Tabla 'country'
-- -----------------------------------------------------------------------------
INSERT INTO "country" ("name", "created_at", "updated_at") VALUES
('Venezuela', NOW(), NOW());

-- -----------------------------------------------------------------------------
-- 2. Rellenar Tabla 'state' (Táchira y algunos estados vecinos)
-- -----------------------------------------------------------------------------
INSERT INTO "state" ("name", "countryID", "created_at", "updated_at") VALUES
('Táchira', (SELECT id FROM "country" WHERE name = 'Venezuela'), NOW(), NOW()),
('Mérida', (SELECT id FROM "country" WHERE name = 'Venezuela'), NOW(), NOW()),
('Trujillo', (SELECT id FROM "country" WHERE name = 'Venezuela'), NOW(), NOW()),
('Zulia', (SELECT id FROM "country" WHERE name = 'Venezuela'), NOW(), NOW()),
('Barinas', (SELECT id FROM "country" WHERE name = 'Venezuela'), NOW(), NOW());

-- -----------------------------------------------------------------------------
-- 3. Rellenar Tabla 'municipality' (Municipios de Táchira y algunos vecinos)
--    Nota: Se incluyen solo algunos municipios por estado para ejemplificar.
-- -----------------------------------------------------------------------------

-- Municipios de Táchira
INSERT INTO "municipality" ("name", "stateID", "created_at", "updated_at") VALUES
('San Cristóbal', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Andrés Bello', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Ayacucho', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Cárdenas', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Córdoba', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Fernández Feo', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Guásimos', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Jáuregui', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Libertador', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Michelena', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Panamericano', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('San Judas Tadeo', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW()),
('Torbes', (SELECT id FROM "state" WHERE name = 'Táchira'), NOW(), NOW());

-- Municipios de Mérida (ejemplos)
INSERT INTO "municipality" ("name", "stateID", "created_at", "updated_at") VALUES
('Libertador (Mérida)', (SELECT id FROM "state" WHERE name = 'Mérida'), NOW(), NOW()),
('Alberto Adriani', (SELECT id FROM "state" WHERE name = 'Mérida'), NOW(), NOW());

-- Municipios de Barinas (ejemplos)
INSERT INTO "municipality" ("name", "stateID", "created_at", "updated_at") VALUES
('Barinas', (SELECT id FROM "state" WHERE name = 'Barinas'), NOW(), NOW()),
('Bolívar (Barinas)', (SELECT id FROM "state" WHERE name = 'Barinas'), NOW(), NOW());

-- -----------------------------------------------------------------------------
-- 4. Rellenar Tabla 'parish' (Parroquias de los municipios de Táchira)
--    Nota: Se incluyen algunas parroquias para los municipios más relevantes.
-- -----------------------------------------------------------------------------

-- Parroquias de San Cristóbal (Táchira)
INSERT INTO "parish" ("name", "minicipalityID", "created_at", "updated_at") VALUES
('San Juan Bautista', (SELECT id FROM "municipality" WHERE name = 'San Cristóbal' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW()),
('San Sebastián', (SELECT id FROM "municipality" WHERE name = 'San Cristóbal' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW()),
('La Concordia', (SELECT id FROM "municipality" WHERE name = 'San Cristóbal' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW()),
('Pedro María Morantes', (SELECT id FROM "municipality" WHERE name = 'San Cristóbal' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW()),
('Dr. Francisco Romero Lobo', (SELECT id FROM "municipality" WHERE name = 'San Cristóbal' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW());

-- Parroquias de Cárdenas (Táchira)
INSERT INTO "parish" ("name", "minicipalityID", "created_at", "updated_at") VALUES
('La Blanca', (SELECT id FROM "municipality" WHERE name = 'Cárdenas' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW()),
('Táriba', (SELECT id FROM "municipality" WHERE name = 'Cárdenas' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW());

-- Parroquias de Torbes (Táchira)
INSERT INTO "parish" ("name", "minicipalityID", "created_at", "updated_at") VALUES
('San Josecito', (SELECT id FROM "municipality" WHERE name = 'Torbes' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW());

-- Parroquias de Guásimos (Táchira)
INSERT INTO "parish" ("name", "minicipalityID", "created_at", "updated_at") VALUES
('Palmira', (SELECT id FROM "municipality" WHERE name = 'Guásimos' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW());

-- Parroquias de Ayacucho (Táchira)
INSERT INTO "parish" ("name", "minicipalityID", "created_at", "updated_at") VALUES
('San Juan de Colón', (SELECT id FROM "municipality" WHERE name = 'Ayacucho' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Táchira')), NOW(), NOW());

-- Parroquias de Libertador (Mérida)
INSERT INTO "parish" ("name", "minicipalityID", "created_at", "updated_at") VALUES
('Antonio Spinetti Dini', (SELECT id FROM "municipality" WHERE name = 'Libertador (Mérida)' AND "stateID" = (SELECT id FROM "state" WHERE name = 'Mérida')), NOW(), NOW());

-- -----------------------------------------------------------------------------
-- 5. Rellenar Tabla 'rol'
-- -----------------------------------------------------------------------------
INSERT INTO "rol" ("name", "description", "created_at", "updated_at") VALUES
('Administrador', 'Control total del sistema.', NOW(), NOW()),
('Docente', 'Acceso a la gestión de sus secciones y alumnos.', NOW(), NOW()),
('Secretaría', 'Gestión de matrículas, datos de estudiantes y reportes.', NOW(), NOW()),
('Mantenimiento', 'Gestión de recursos y mantenimiento de instalaciones.', NOW(), NOW());

-- -----------------------------------------------------------------------------
-- 6. Rellenar Tabla 'permisos'
-- -----------------------------------------------------------------------------
INSERT INTO "permisos" ("nombre", "descripcion", "created_at", "updated_at") VALUES
('Gestionar Usuarios', 'Permite crear, editar y eliminar usuarios del sistema.', NOW(), NOW()),
('Gestionar Estudiantes', 'Permite registrar, actualizar y consultar información de estudiantes.', NOW(), NOW()),
('Gestionar Notas', 'Permite ingresar y modificar calificaciones de estudiantes.', NOW(), NOW()),
('Gestionar Secciones', 'Permite crear y asignar secciones y docentes.', NOW(), NOW()),
('Gestionar Asistencia', 'Permite registrar y consultar la asistencia de los estudiantes.', NOW(), NOW()),
('Ver Reportes', 'Acceso a la generación de diversos reportes del sistema.', NOW(), NOW()),
('Configurar Sistema', 'Permite modificar la configuración general del sistema (roles, periodos, etc.).', NOW(), NOW());


-- -----------------------------------------------------------------------------
-- 7. Rellenar Tabla 'status_student'
-- -----------------------------------------------------------------------------
INSERT INTO "status_student" ("descripcion", "created_at", "updated_at") VALUES
('Activo', NOW(), NOW()),
('Inscrito', NOW(), NOW()),
('Graduado', NOW(), NOW()),
('Egresado', NOW(), NOW()),
('Inactivo', NOW(), NOW()),
('Retirado', NOW(), NOW()),
('Expulsado', NOW(), NOW());

-- -----------------------------------------------------------------------------
-- 8. Rellenar Tabla 'grade'
-- -----------------------------------------------------------------------------
INSERT INTO "grade" ("name", "created_at", "updated_at") VALUES
('1er Nivel', NOW(), NOW()),
('2do Nivel', NOW(), NOW()),
('3er Nivel', NOW(), NOW()),
('1er Grado', NOW(), NOW()),
('2do Grado', NOW(), NOW()),
('3er Grado', NOW(), NOW()),
('4to Grado', NOW(), NOW()),
('5to Grado', NOW(), NOW()),
('6to Grado', NOW(), NOW());

-- -----------------------------------------------------------------------------
-- 9. Rellenar Tabla 'brigade' (Basado en los nombres de tu script anterior)
-- -----------------------------------------------------------------------------
INSERT INTO "brigade" ("name", "created_at", "updated_at") VALUES
('Brigada Ecológica', NOW(), NOW()),
('Brigada de Patrulleros Escolares', NOW(), NOW()),
('Brigada Comunicacional', NOW(), NOW()),
('Brigada de Primeros Auxilios', NOW(), NOW()),
('Brigada de Deporte y Recreación', NOW(), NOW()),
('Brigada de Convivencia y Paz', NOW(), NOW()),
('Brigada de Muralistas', NOW(), NOW());

-- -----------------------------------------------------------------------------
-- 10. Rellenar Tabla 'academic_period'
-- -----------------------------------------------------------------------------
INSERT INTO "academic_period" ("name", "start_date", "end_date", "is_current", "created_at", "updated_at") VALUES
('2023-2024', '2023-09-15', '2024-07-31', FALSE, NOW(), NOW()),
('2024-2025', '2024-09-16', '2025-07-31', TRUE, NOW(), NOW()), -- Este es el período actual
('2025-2026', '2025-09-15', '2026-07-31', FALSE, NOW(), NOW());

-- Asegurar que solo un período sea 'current'
-- Esta es una sentencia UPDATE, no INSERT. Se ejecuta después de las inserciones iniciales.
UPDATE "academic_period" SET "is_current" = FALSE WHERE "name" != '2024-2025';
UPDATE "academic_period" SET "is_current" = TRUE WHERE "name" = '2024-2025';