INSERT INTO pais (nombre, created_at, updated_at)
VALUES ('Venezuela', NOW(), NOW());

INSERT INTO estado (nombre, pais_id, created_at, updated_at)
VALUES ('Táchira', 1, NOW(), NOW());

INSERT INTO municipio (nombre, estado_id, created_at, updated_at)
VALUES ('Michelena', 1, NOW(), NOW());

INSERT INTO parroquia (nombre, municipio_id, created_at, updated_at)
VALUES ('Michelena Centro', 1, NOW(), NOW());

INSERT INTO rol (name, description, created_at, updated_at)
VALUES 
  ('Docente', 'Encargado de impartir clases', NOW(), NOW()),
  ('Coordinador', 'Responsable de coordinación académica', NOW(), NOW());

INSERT INTO permisos (nombre, descripcion, created_at, updated_at)
VALUES 
  ('admin', 'Acceso total al sistema', NOW(), NOW()),
  ('docente', 'Acceso limitado a notas y estudiantes', NOW(), NOW());

  INSERT INTO personal (nombre, lastName, idRole, telephoneNomber, CI, Email, birthday, created_at, updated_at, direccion, parroquia_id)
VALUES 
  ('Andrea', 'González', 1, '04141234567', 'V12345678', 'andrea@escuela.edu.ve', '1985-03-22', NOW(), NOW(), 'Calle 3', 1),
  ('Luis', 'Marín', 2, '04168889999', 'V87654321', 'luis@escuela.edu.ve', '1980-07-15', NOW(), NOW(), 'Av. Bolívar', 1);

-- Usuarios asociados al personal
INSERT INTO usuario (username, email, password, permiso_id, is_active, created_at, updated_at, personal_id)
VALUES 
  ('andreaG', 'andrea@escuela.ve', 'hash_andrea123', 2, TRUE, NOW(), NOW(), 1),
  ('lmarin', 'luis@escuela.ve', 'hash_luis456', 1, TRUE, NOW(), NOW(), 2);

-- Usuario sin vínculo con personal (administrador externo)
INSERT INTO usuario (username, email, password, permiso_id, is_active, created_at, updated_at, personal_id)
VALUES ('adminExt', 'externo@admin.com', 'admin_secure', 1, TRUE, NOW(), NOW(), NULL);

INSERT INTO status_student (descripcion, created_at, updated_at)
VALUES ('Inscrito', NOW(), NOW());

INSERT INTO brigada (nombre, created_at, updated_at)
VALUES ('Brigada A', NOW(), NOW());

INSERT INTO brigada_docente_fecha (brigada_id, fecha, personal_id, created_at, updated_at)
VALUES (1, '2025-06-10', 1, NOW(), NOW());

INSERT INTO estudiante (nombre, apellido, status_id, brigada_docente_fecha_id, vive_madre, vive_padre, vive_ambos, vive_representante, created_at, updated_at, lugarNacimiento_id, sexo, cedula_escolar)
VALUES 
  ('Camila', 'Rodríguez', 1, 1, TRUE, FALSE, FALSE, TRUE, NOW(), NOW(), '1', 'F', 'V00122345');

INSERT INTO estudiante_bdf (descripcion, student_id, created_at, updated_at, brigada_id)
VALUES ('Inspección médica realizada', 1, NOW(), NOW(), 1);

INSERT INTO representante (name, lastName, roleName, telephoneNomber, Cedula, Email, birthday, created_at, updated_at, estudiante_id, telephoneHouse, direccionHabitacion, lugar_trabajo, telefono_trabajo)
VALUES ('Juana', 'Rodríguez', 'Madre', '04144445555', 'V22334455', 'juana@familia.com', '1982-11-15', NOW(), NOW(), 1, '02760000000', 'Los Andes #12', 'Hospital', '02767778888');

INSERT INTO grado (nombre, created_at, updated_at)
VALUES ('Primer Grado', NOW(), NOW());

INSERT INTO docente_grado (docente_id, grado_id, created_at, updated_at, seccion)
VALUES (1, 1, NOW(), NOW(), 'A');

INSERT INTO matricula (estudiante_id, docente_grado_id, fecha_inscripcion, periodo_escolar, created_at, updated_at, repitiente)
VALUES (1, 1, '2025-06-14', '2025-2026', NOW(), NOW(), FALSE);

INSERT INTO notas (matricula_id, nota, periodo, asignatura, fecha_registro, created_at, updated_at)
VALUES (1, 19.5, '1er Trimestre', 'Lengua y Literatura', '2025-10-01', NOW(), NOW());