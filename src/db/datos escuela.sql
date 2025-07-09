-- Datos de Prueba para 'country'
INSERT INTO "country" (name, created_at, updated_at) VALUES
('Venezuela', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Colombia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brazil', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING; -- Evitar duplicados si ya existen

-- Datos de Prueba para 'state'
INSERT INTO "state" (name, "countryID", created_at, updated_at) VALUES
('Táchira', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mérida', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carabobo', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cundinamarca', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('São Paulo', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'municipality'
INSERT INTO "municipality" (name, "stateID", created_at, updated_at) VALUES
('San Cristóbal', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Libertador', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Valencia', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bogotá', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Campinas', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'parish'
INSERT INTO "parish" (name, "minicipalityID", created_at, updated_at) VALUES
('San Juan Bautista', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('La Concordia', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('El Llano', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('San Blas', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Usaquén', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pedro María Morantes', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Andrés Bello', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'rol'
INSERT INTO "rol" (name, description, created_at, updated_at) VALUES
('Docente', 'Personal encargado de la enseñanza.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Administrador', 'Personal administrativo de la institución.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mantenimiento', 'Personal encargado del mantenimiento de las instalaciones.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Secretaría', 'Personal de secretaría y atención al público.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'permisos'
INSERT INTO "permisos" (nombre, descripcion, created_at, updated_at) VALUES
('Acceso Total', 'Permiso para acceder a todas las funciones del sistema.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gestión Académica', 'Permiso para gestionar estudiantes, matrículas y notas.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gestión Personal', 'Permiso para gestionar el personal de la institución.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Consulta Básica', 'Permiso solo para consultar información.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'personal'
INSERT INTO "personal" (ci, name, "lastName", "idRole", "telephoneNumber", email, birthday, direction, parish, created_at, updated_at) VALUES
('12345678', 'Ana', 'García', 1, '04121234567', 'ana.garcia@example.com', '1980-05-15', 'Calle Real 123', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('87654321', 'Luis', 'Martínez', 2, '04149876543', 'luis.martinez@example.com', '1975-11-20', 'Avenida Siempre Viva', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11223344', 'Carlos', 'Rodríguez', 3, '04261122334', 'carlos.r@example.com', '1990-03-10', 'Zona Industrial', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('99887766', 'María', 'Fernández', 1, '04165554433', 'maria.f@example.com', '1982-08-25', 'Callejón Angosto 5', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22334455', 'Pedro', 'Gómez', 1, '04123334455', 'pedro.g@example.com', '1978-01-30', 'Urb. Los Pinos', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('33445566', 'Laura', 'Díaz', 1, '04145556677', 'laura.d@example.com', '1985-11-01', 'Sector El Centro', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('44556677', 'Ricardo', 'Soto', 1, '04267778899', 'ricardo.s@example.com', '1972-04-18', 'Av. Principal', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('55667788', 'Elena', 'Vargas', 1, '04169990011', 'elena.v@example.com', '1988-09-07', 'Calle La Paz', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('66778899', 'Javier', 'Rojas', 1, '04121112233', 'javier.r@example.com', '1970-06-22', 'Res. Las Acacias', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('77889900', 'Sofía', 'Castro', 1, '04143334455', 'sofia.c@example.com', '1983-03-03', 'Carrera 10', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('88990011', 'Gabriel', 'Moreno', 1, '04265556677', 'gabriel.m@example.com', '1976-12-14', 'Prolongación Av. 5', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('99001122', 'Valeria', 'Herrera', 1, '04167778899', 'valeria.h@example.com', '1981-07-28', 'Calle El Sol', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10112233', 'Daniel', 'Jiménez', 1, '04129990011', 'daniel.j@example.com', '1979-02-09', 'Sector San Josecito', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (ci) DO NOTHING;

-- Datos de Prueba para 'status_student'
INSERT INTO "status_student" (descripcion, created_at, updated_at) VALUES
('Activo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Inactivo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Graduado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Retirado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'brigade'
INSERT INTO "brigade" (name, created_at, updated_at) VALUES
('Brigada Ecológica', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada Deportiva', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada Cívica', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Lectura', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Arte', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'brigadeTeacherDate'
INSERT INTO "brigadeTeacherDate" ("brigadeID", "dateI", "personalID", created_at, updated_at) VALUES
(1, '2024-09-01', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ana García - Brigada Ecológica
(2, '2024-09-01', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- María Fernández - Brigada Deportiva
(3, '2024-09-01', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pedro Gómez - Brigada Cívica
(4, '2024-09-15', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Laura Díaz - Brigada de Lectura
(5, '2024-09-15', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)  -- Ricardo Soto - Brigada de Arte
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'representative'
INSERT INTO "representative" (ci, name, "lastName", "telephoneNumber", email, "maritalStat", profesion, birthday, "telephoneHouse", "roomAdress", "workPlace", "jobNumber", created_at, updated_at) VALUES
('10101010', 'Julia', 'González', '04247778899', 'julia.g@example.com', 'Casado', 'Abogado', '1978-02-10', '02761112233', 'Urb. Las Rosas', 'Bufete Legal', '02764445566', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('20202020', 'Roberto', 'Sánchez', '04161112233', 'roberto.s@example.com', 'Soltero', 'Ingeniero', '1970-07-22', '02769998877', 'Conjunto Residencial El Sol', 'Empresa de Software', '02767776655', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30303030', 'Carmen', 'Pérez', '04122223344', 'carmen.p@example.com', 'Casado', 'Contador', '1985-05-01', '02765551122', 'Res. Monte Claro', 'Oficina Contable', '02766667788', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('40404040', 'José', 'Ramírez', '04144445566', 'jose.r@example.com', 'Divorciado', 'Arquitecto', '1973-10-10', '02768889900', 'Edif. El Bosque', 'Estudio de Arquitectura', '02761110099', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('50505050', 'Lorena', 'Torres', '04266667788', 'lorena.t@example.com', 'Casado', 'Doctora', '1980-03-15', '02762223344', 'Clínica La Salud', 'Hospital Central', '02763334455', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (ci) DO NOTHING;

-- Datos de Prueba para 'student'
INSERT INTO "student" (ci, name, "lastName", sex, birthday, "placeBirth", "parishID", status_id, "quantityBrothers", "representativeID", "motherName", "motherCi", "motherTelephone", "fatherName", "fatherCi", "fatherTelephone", "livesMother", "livesFather", "livesBoth", "livesRepresentative", "rolRopresentative", created_at, updated_at) VALUES
-- Estudiantes existentes
('30001001', 'Diego', 'Pérez', 'Masculino', '2015-01-20', 'San Cristóbal', 1, 1, 1, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Pérez', '12345678', '04121234567', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30002002', 'Sofía', 'López', 'Femenino', '2016-03-12', 'Mérida', 3, 1, 0, '20202020', 'Carla López', '98765432', '04161112233', 'Pedro López', '87654321', '04149876543', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30003003', 'Andrés', 'Ramírez', 'Masculino', '2014-09-05', 'Valencia', 4, 1, 2, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Pérez', '12345678', '04121234567', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Nuevos estudiantes
-- Preescolar
('30004004', 'Mariana', 'Silva', 'Femenino', '2020-07-01', 'San Cristóbal', 6, 1, 1, '30303030', 'Carmen Pérez', '30303030', '04122223344', 'Alberto Silva', '65432109', '04160001122', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30005005', 'Pablo', 'Velasquez', 'Masculino', '2020-02-14', 'Mérida', 7, 1, 0, '40404040', 'Elena Velasquez', '78901234', '04140001122', 'José Ramírez', '40404040', '04144445566', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30006006', 'Lucía', 'Guerrero', 'Femenino', '2019-11-25', 'San Cristóbal', 1, 1, 2, '50505050', 'Lorena Torres', '50505050', '04266667788', 'Manuel Guerrero', '13579246', '04128889900', TRUE, TRUE, TRUE, FALSE, 'Representante', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Primer Grado
('30007007', 'Mateo', 'Arias', 'Masculino', '2018-05-10', 'San Cristóbal', 6, 1, 0, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Arias', '24681357', '04129990011', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30008008', 'Valeria', 'Blanco', 'Femenino', '2018-09-18', 'Mérida', 3, 1, 1, '20202020', 'Carla Blanco', '98765432', '04161112233', 'Roberto Sánchez', '20202020', '04161112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30009009', 'Santiago', 'Castañeda', 'Masculino', '2017-03-03', 'Valencia', 4, 1, 0, '30303030', 'Carmen Pérez', '30303030', '04122223344', 'Francisco Castañeda', '76543210', '04141112233', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Segundo Grado
('30010010', 'Isabella', 'Díaz', 'Femenino', '2017-01-22', 'San Cristóbal', 1, 1, 1, '40404040', 'Ana Díaz', '11223344', '04123334455', 'José Ramírez', '40404040', '04144445566', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30011011', 'Juan', 'Espinoza', 'Masculino', '2016-10-05', 'Mérida', 2, 1, 0, '50505050', 'Lorena Torres', '50505050', '04266667788', 'Carlos Espinoza', '23456789', '04127778899', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30012012', 'Emma', 'Flores', 'Femenino', '2016-04-30', 'Valencia', 3, 1, 2, '10101010', 'Julia González', '10101010', '04247778899', 'Pedro Flores', '87654321', '04149990000', TRUE, TRUE, TRUE, FALSE, 'Representante', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Tercer Grado
('30013013', 'Sebastián', 'García', 'Masculino', '2015-08-11', 'San Cristóbal', 6, 1, 0, '20202020', 'Carla García', '98765432', '04161112233', 'Roberto Sánchez', '20202020', '04161112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30014014', 'Laura', 'Hernández', 'Femenino', '2015-02-20', 'Mérida', 7, 1, 1, '30303030', 'Carmen Pérez', '30303030', '04122223344', 'Miguel Hernández', '45678901', '04121112233', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30015015', 'Leo', 'Ibarra', 'Masculino', '2014-12-01', 'San Cristóbal', 1, 1, 0, '40404040', 'Maria Ibarra', '11223344', '04123334455', 'José Ramírez', '40404040', '04144445566', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Cuarto Grado
('30016016', 'Ana', 'Jara', 'Femenino', '2014-06-15', 'San Cristóbal', 6, 1, 1, '50505050', 'Lorena Torres', '50505050', '04266667788', 'Daniel Jara', '56789012', '04127778899', TRUE, TRUE, TRUE, FALSE, 'Representante', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30017017', 'Tomás', 'King', 'Masculino', '2013-10-08', 'Mérida', 2, 1, 0, '10101010', 'Julia González', '10101010', '04247778899', 'Pedro King', '98765432', '04149990000', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30018018', 'Daniela', 'León', 'Femenino', '2013-03-20', 'Valencia', 3, 1, 2, '20202020', 'Carla León', '98765432', '04161112233', 'Roberto Sánchez', '20202020', '04161112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Quinto Grado
('30019019', 'Felipe', 'Mendoza', 'Masculino', '2012-09-01', 'San Cristóbal', 1, 1, 0, '30303030', 'Carmen Pérez', '30303030', '04122223344', 'Andrés Mendoza', '34567890', '04121112233', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30020020', 'Martina', 'Núñez', 'Femenino', '2012-01-29', 'Mérida', 6, 1, 1, '40404040', 'Maria Núñez', '11223344', '04123334455', 'José Ramírez', '40404040', '04144445566', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30021021', 'Nicolás', 'Ortiz', 'Masculino', '2011-11-11', 'Valencia', 7, 1, 0, '50505050', 'Lorena Torres', '50505050', '04266667788', 'Fernando Ortiz', '67890123', '04127778899', TRUE, TRUE, TRUE, FALSE, 'Representante', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Sexto Grado
('30022022', 'Camila', 'Paredes', 'Femenino', '2011-04-05', 'San Cristóbal', 1, 1, 1, '10101010', 'Julia González', '10101010', '04247778899', 'Oscar Paredes', '01234567', '04129990011', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30023023', 'Agustín', 'Quintero', 'Masculino', '2010-07-25', 'Mérida', 2, 1, 0, '20202020', 'Carla Quintero', '98765432', '04161112233', 'Roberto Sánchez', '20202020', '04161112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30024024', 'Victoria', 'Ríos', 'Femenino', '2010-02-10', 'Valencia', 3, 1, 2, '30303030', 'Carmen Pérez', '30303030', '04122223344', 'Gabriel Ríos', '11223344', '04123334455', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Datos de Prueba para 'studentBrigade' (Nueva tabla)
INSERT INTO "studentBrigade" ("studentID", "brigadeID", "assignmentDate", created_at, updated_at) VALUES
(1, 1, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Diego Pérez en Brigada Ecológica
(2, 2, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sofía López en Brigada Deportiva
(3, 1, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Andrés Ramírez en Brigada Ecológica
(4, 3, '2024-10-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Mariana Silva en Brigada Cívica
(5, 4, '2024-10-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pablo Velasquez en Brigada de Lectura
(6, 5, '2024-10-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Lucía Guerrero en Brigada de Arte
(7, 1, '2024-10-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Mateo Arias en Brigada Ecológica
(8, 2, '2024-10-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Valeria Blanco en Brigada Deportiva
(9, 3, '2024-10-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Santiago Castañeda en Brigada Cívica
(10, 4, '2024-11-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Isabella Díaz en Brigada de Lectura
(11, 5, '2024-11-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Juan Espinoza en Brigada de Arte
(12, 1, '2024-11-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)  -- Emma Flores en Brigada Ecológica
ON CONFLICT ("studentID", "brigadeID") DO NOTHING;

-- Datos de Prueba para 'grade'
INSERT INTO "grade" (name, created_at, updated_at) VALUES
('Nivel Preescolar I', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nivel Preescolar II', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nivel Preescolar III', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Primer Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Segundo Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tercer Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cuarto Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quinto Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sexto Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'section'
INSERT INTO "section" ("teacherCI", "gradeID", seccion, period, created_at, updated_at) VALUES
(1, 4, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ana García - Primer Grado A
(4, 4, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- María Fernández - Primer Grado B
(5, 5, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pedro Gómez - Segundo Grado A
(6, 5, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Laura Díaz - Segundo Grado B
(7, 6, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ricardo Soto - Tercer Grado A
(8, 6, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Elena Vargas - Tercer Grado B
(9, 7, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Javier Rojas - Cuarto Grado A
(10, 7, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sofía Castro - Cuarto Grado B
(11, 8, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Gabriel Moreno - Quinto Grado A
(12, 8, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Valeria Herrera - Quinto Grado B
(1, 9, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ana García - Sexto Grado A
(4, 9, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- María Fernández - Sexto Grado B
(5, 1, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pedro Gómez - Preescolar I A
(6, 2, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Laura Díaz - Preescolar II A
(7, 3, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)  -- Ricardo Soto - Preescolar III A
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'enrollment'
INSERT INTO "enrollment" ("studentID", "sectionID", "brigadeTeacherDateID", "registrationDate", repeater, "chemiseSize", "pantsSize", "shoesSize", weight, stature, diseases, observation, "birthCertificateCheck", "vaccinationCardCheck", "studentPhotosCheck", "representativePhotosCheck", "representativeCopyIDCheck", "representativeRIFCheck", "autorizedCopyIDCheck", created_at, updated_at) VALUES
-- Inscripciones existentes
(1, 1, 1, '2024-09-10', FALSE, 'M', 'M', '30', 30.5, 1.20, 'Ninguna', 'Buen estudiante', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 2, '2024-09-10', FALSE, 'S', 'S', '28', 28.0, 1.15, 'Asma', 'Requiere atención especial', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 1, '2024-09-10', TRUE, 'M', 'M', '31', 32.0, 1.25, 'Alergia al polen', 'Necesita inhalador', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Nuevas inscripciones
(4, 13, 3, '2024-09-10', FALSE, 'XS', 'XS', '25', 18.0, 0.90, 'Ninguna', 'Se adapta bien', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Mariana Silva - Preescolar I A
(5, 13, 3, '2024-09-10', FALSE, 'XS', 'XS', '26', 19.5, 0.95, 'Ninguna', 'Activo', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pablo Velasquez - Preescolar I A
(6, 14, 4, '2024-09-10', FALSE, 'XS', 'XS', '27', 20.0, 1.00, 'Ninguna', 'Sociable', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Lucía Guerrero - Preescolar II A
(7, 1, 1, '2024-09-10', FALSE, 'S', 'S', '29', 25.0, 1.10, 'Ninguna', 'Participativo', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Mateo Arias - Primer Grado A
(8, 2, 2, '2024-09-10', FALSE, 'S', 'S', '28', 24.5, 1.08, 'Ninguna', 'Aplicada', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Valeria Blanco - Primer Grado B
(9, 1, 1, '2024-09-10', FALSE, 'M', 'M', '30', 28.0, 1.18, 'Ninguna', 'Buen desempeño', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Santiago Castañeda - Primer Grado A
(10, 3, 1, '2024-09-10', FALSE, 'M', 'M', '30', 31.0, 1.22, 'Ninguna', 'Creativa', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Isabella Díaz - Segundo Grado A
(11, 4, 4, '2024-09-10', FALSE, 'M', 'M', '31', 33.0, 1.28, 'Ninguna', 'Organizado', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Juan Espinoza - Segundo Grado B
(12, 3, 1, '2024-09-10', FALSE, 'M', 'M', '30', 30.0, 1.20, 'Ninguna', 'Tranquila', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Emma Flores - Segundo Grado A
(13, 5, 5, '2024-09-10', FALSE, 'L', 'L', '32', 35.0, 1.30, 'Ninguna', 'Líder', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sebastián García - Tercer Grado A
(14, 6, 1, '2024-09-10', FALSE, 'L', 'L', '31', 34.0, 1.29, 'Ninguna', 'Amigable', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Laura Hernández - Tercer Grado B
(15, 5, 5, '2024-09-10', FALSE, 'L', 'L', '32', 36.0, 1.35, 'Ninguna', 'Curioso', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Leo Ibarra - Tercer Grado A
(16, 7, 1, '2024-09-10', FALSE, 'L', 'L', '33', 38.0, 1.40, 'Ninguna', 'Responsable', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ana Jara - Cuarto Grado A
(17, 8, 2, '2024-09-10', FALSE, 'L', 'L', '32', 37.5, 1.38, 'Ninguna', 'Dedicado', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Tomás King - Cuarto Grado B
(18, 7, 1, '2024-09-10', FALSE, 'L', 'L', '33', 39.0, 1.42, 'Ninguna', 'Atenta', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Daniela León - Cuarto Grado A
(19, 9, 3, '2024-09-10', FALSE, 'XL', 'XL', '34', 42.0, 1.45, 'Ninguna', 'Participativo', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Felipe Mendoza - Quinto Grado A
(20, 10, 4, '2024-09-10', FALSE, 'XL', 'XL', '33', 40.0, 1.43, 'Ninguna', 'Organizada', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Martina Núñez - Quinto Grado B
(21, 9, 3, '2024-09-10', FALSE, 'XL', 'XL', '34', 43.0, 1.48, 'Ninguna', 'Extrovertido', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Nicolás Ortiz - Quinto Grado A
(22, 11, 1, '2024-09-10', FALSE, 'XL', 'XL', '35', 45.0, 1.50, 'Ninguna', 'Excelente alumno', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Camila Paredes - Sexto Grado A
(23, 12, 2, '2024-09-10', FALSE, 'XL', 'XL', '34', 44.0, 1.49, 'Ninguna', 'Buen compañero', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Agustín Quintero - Sexto Grado B
(24, 11, 1, '2024-09-10', FALSE, 'XL', 'XL', '35', 46.0, 1.52, 'Ninguna', 'Dedicada', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) -- Victoria Ríos - Sexto Grado A
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'notes'
INSERT INTO "notes" ("enrollmentID", notes, period, subject, "registrationDate", created_at, updated_at) VALUES
(1, 18.50, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 19.00, 'Primer Lapso', 'Lengua', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 16.00, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 15.50, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 17.00, 'Primer Lapso', 'Desarrollo Sensorial', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 19.00, 'Primer Lapso', 'Matemáticas', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 17.50, 'Primer Lapso', 'Lengua', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 18.00, 'Primer Lapso', 'Ciencias Naturales', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 16.50, 'Primer Lapso', 'Educación Física', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 19.50, 'Primer Lapso', 'Historia', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 17.00, 'Primer Lapso', 'Geografía', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(22, 18.80, 'Primer Lapso', 'Inglés', '2024-12-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'usuario'
INSERT INTO "usuario" (username, email, password, permiso_id, is_active, email_verified, security_word, respuesta_de_seguridad, personal_id, created_at, updated_at) VALUES
('admin.ana', 'admin.ana@example.com', '$2a$10$xyz...', 1, TRUE, TRUE, 'color favorito', 'azul', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Contraseña hasheada
('teacher.maria', 'teacher.maria@example.com', '$2a$10$abc...', 2, TRUE, FALSE, 'nombre mascota', 'fido', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Contraseña hasheada
('secretary.pedro', 'secretary.pedro@example.com', '$2a$10$def...', 3, TRUE, TRUE, 'comida favorita', 'pizza', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Contraseña hasheada
('teacher.laura', 'teacher.laura@example.com', '$2a$10$ghi...', 2, TRUE, TRUE, 'lugar de nacimiento', 'barinas', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('teacher.ricardo', 'teacher.ricardo@example.com', '$2a$10$jkl...', 2, TRUE, TRUE, 'nombre de madre', 'rosa', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'attendance'
INSERT INTO "attendance" (date_a, "sectionID", observaciones, created_at, updated_at) VALUES
('2025-01-10', 1, 'Asistencia regular', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-10', 2, 'Faltaron 2 estudiantes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-10', 3, 'Todos presentes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-11', 1, 'Un estudiante con permiso', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-11', 13, 'Asistencia completa preescolar', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'attendanceDetails'
INSERT INTO "attendanceDetails" ("attendanceID", "studentID", assistant) VALUES
(1, 1, TRUE),
(1, 3, TRUE),
(2, 2, TRUE),
(3, 10, TRUE),
(3, 11, TRUE),
(3, 12, TRUE),
(4, 1, FALSE), -- Diego faltó el 2025-01-11
(5, 4, TRUE),
(5, 5, TRUE);