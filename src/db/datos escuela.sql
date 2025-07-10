-- Mejora del script de llenado de datos para la base de datos de la escuela

-- Conservar datos existentes e insertar nuevos donde sea necesario usando ON CONFLICT (id) DO NOTHING o ON CONFLICT (ci) DO NOTHING

-- Datos de Prueba para 'country', 'state', 'municipality', 'parish', 'rol', 'permisos' (existentes y no se añadirán más a rol ni permisos según la instrucción)
INSERT INTO "country" (name, created_at, updated_at) VALUES
('Venezuela', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Colombia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brazil', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "state" (name, "countryID", created_at, updated_at) VALUES
('Táchira', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mérida', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Carabobo', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cundinamarca', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('São Paulo', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "municipality" (name, "stateID", created_at, updated_at) VALUES
('San Cristóbal', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Libertador', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Valencia', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bogotá', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Campinas', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "parish" (name, "minicipalityID", created_at, updated_at) VALUES
('San Juan Bautista', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('La Concordia', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('El Llano', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('San Blas', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Usaquén', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pedro María Morantes', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Andrés Bello', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Palo Gordo', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Capacho Nuevo', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cordero', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Lagunillas', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Candelaria', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tocuyito', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Suba', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Engativá', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sousas', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "rol" (name, description, created_at, updated_at) VALUES
('Docente', 'Personal encargado de la enseñanza.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Administrador', 'Personal administrativo de la institución.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mantenimiento', 'Personal encargado del mantenimiento de las instalaciones.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Secretaría', 'Personal de secretaría y atención al público.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "permisos" (nombre, descripcion, created_at, updated_at) VALUES
('Acceso Total', 'Permiso para acceder a todas las funciones del sistema.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gestión Académica', 'Permiso para gestionar estudiantes, matrículas y notas.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gestión Personal', 'Permiso para gestionar el personal de la institución.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Consulta Básica', 'Permiso solo para consultar información.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'status_student'
INSERT INTO "status_student" (descripcion, created_at, updated_at) VALUES
('Activo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Inactivo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Graduado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Retirado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Nuevos Datos de Prueba para 'brigade'
INSERT INTO "brigade" (name, created_at, updated_at) VALUES
('Brigada Ecológica', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada Deportiva', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada Cívica', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Lectura', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Arte', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Ciencias', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Robótica', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Música', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Voluntariado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Primeros Auxilios', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Debate', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Brigada de Fotografía', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Nuevos Datos de Prueba para 'personal' (Docentes)
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
('10112233', 'Daniel', 'Jiménez', 1, '04129990011', 'daniel.j@example.com', '1979-02-09', 'Sector San Josecito', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11223355', 'Carolina', 'Nuñez', 1, '04241231234', 'carolina.n@example.com', '1987-06-20', 'Av. Las Cumbres', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('13579246', 'Felipe', 'Ortiz', 1, '04162342345', 'felipe.o@example.com', '1974-01-05', 'Callejón Bolívar', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('24680135', 'Adriana', 'Paz', 1, '04123453456', 'adriana.p@example.com', '1989-10-11', 'Urb. El Samán', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('36912457', 'Héctor', 'Quintero', 1, '04144564567', 'hector.q@example.com', '1971-04-29', 'Centro Ciudad', 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('70707070', 'Isabel', 'Ríos', 1, '04265675678', 'isabel.r@example.com', '1984-12-03', 'Zona Rural', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('80808080', 'Jorge', 'Salas', 1, '04166786789', 'jorge.s@example.com', '1977-08-16', 'Av. Los Próceres', 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (ci) DO NOTHING;

-- Nuevos Datos de Prueba para 'brigadeTeacherDate'
INSERT INTO "brigadeTeacherDate" ("brigadeID", "dateI", "personalID", created_at, updated_at) VALUES
(1, '2024-09-01', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ana García - Brigada Ecológica
(2, '2024-09-01', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- María Fernández - Brigada Deportiva
(3, '2024-09-01', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pedro Gómez - Brigada Cívica
(4, '2024-09-15', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Laura Díaz - Brigada de Lectura
(5, '2024-09-15', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ricardo Soto - Brigada de Arte
(6, '2024-09-01', 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Daniel Jiménez - Brigada de Ciencias
(7, '2024-09-01', 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Carolina Nuñez - Brigada de Robótica
(8, '2024-09-15', 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Felipe Ortiz - Brigada de Música
(9, '2024-09-15', 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Adriana Paz - Brigada de Voluntariado
(10, '2024-09-01', 17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Héctor Quintero - Brigada de Primeros Auxilios
(11, '2024-09-01', 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Isabel Ríos - Brigada de Debate
(12, '2024-09-15', 19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) -- Jorge Salas - Brigada de Fotografía
ON CONFLICT (id) DO NOTHING;

-- Nuevos Datos de Prueba para 'representative'
INSERT INTO "representative" (ci, name, "lastName", "telephoneNumber", email, "maritalStat", profesion, birthday, "telephoneHouse", "roomAdress", "workPlace", "jobNumber", created_at, updated_at) VALUES
('10101010', 'Julia', 'González', '04247778899', 'julia.g@example.com', 'Casado', 'Abogado', '1978-02-10', '02761112233', 'Urb. Las Rosas', 'Bufete Legal', '02764445566', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('20202020', 'Roberto', 'Sánchez', '04161112233', 'roberto.s@example.com', 'Soltero', 'Ingeniero', '1970-07-22', '02769998877', 'Conjunto Residencial El Sol', 'Empresa de Software', '02767776655', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30303030', 'Carmen', 'Pérez', '04122223344', 'carmen.p@example.com', 'Casado', 'Contador', '1985-05-01', '02765551122', 'Res. Monte Claro', 'Oficina Contable', '02766667788', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('40404040', 'José', 'Ramírez', '04144445566', 'jose.r@example.com', 'Divorciado', 'Arquitecto', '1973-10-10', '02768889900', 'Edif. El Bosque', 'Estudio de Arquitectura', '02761110099', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('50505050', 'Lorena', 'Torres', '04266667788', 'lorena.t@example.com', 'Casado', 'Doctora', '1980-03-15', '02762223344', 'Clínica La Salud', 'Hospital Central', '02763334455', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('60606060', 'Miguel', 'Herrera', '04125556677', 'miguel.h@example.com', 'Casado', 'Comerciante', '1975-09-20', '02767778899', 'Calle Los Mangos', 'Tienda de Ropa', '02769991122', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('70707070', 'Andrea', 'Ruiz', '04148889900', 'andrea.r@example.com', 'Soltero', 'Diseñadora', '1988-01-08', '02763334455', 'Av. Principal', 'Agencia de Publicidad', '02765556677', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('80808080', 'Fernando', 'Castro', '04169990011', 'fernando.c@example.com', 'Casado', 'Músico', '1972-06-01', '02761110000', 'Quinta El Cedro', 'Academia de Música', '02762221100', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('90909090', 'Diana', 'Mendoza', '04241112233', 'diana.m@example.com', 'Divorciado', 'Periodista', '1979-11-25', '02764445566', 'Edif. Los Pinos', 'Periódico Local', '02767778899', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('10010010', 'Gustavo', 'Navas', '04123334455', 'gustavo.n@example.com', 'Casado', 'Farmacéutico', '1983-04-12', '02768889900', 'Farmacia Central', 'Farmacia La Salud', '02761112233', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('11011011', 'Patricia', 'Peña', '04145556677', 'patricia.p@example.com', 'Soltero', 'Profesora', '1970-07-07', '02762223344', 'Escuela Nacional', 'Colegio Simón Bolívar', '02764445566', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('12012012', 'Mario', 'Quintero', '04167778899', 'mario.q@example.com', 'Casado', 'Policía', '1986-09-19', '02766667788', 'Comisaría Principal', 'Policía Nacional', '02768889900', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('13013013', 'Silvia', 'Reyes', '04269990011', 'silvia.r@example.com', 'Divorciado', 'Chef', '1974-02-28', '02761112233', 'Restaurante El Sabor', 'Hotel Gran Ciudad', '02763334455', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('14014014', 'Oscar', 'Salazar', '04121112233', 'oscar.s@example.com', 'Casado', 'Electricista', '1981-05-03', '02764445566', 'Zona Industrial', 'Empresa Eléctrica', '02767778899', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('15015015', 'Victoria', 'Vargas', '04143334455', 'victoria.v@example.com', 'Soltero', 'Bailarina', '1990-12-10', '02768889900', 'Estudio de Danza', 'Teatro Municipal', '02761112233', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (ci) DO NOTHING;

-- Nuevos Datos de Prueba para 'grade'
INSERT INTO "grade" (name, created_at, updated_at) VALUES
('Preescolar', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1er Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2do Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('3er Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('4to Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('5to Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6to Grado', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Nuevos Datos de Prueba para 'section'
INSERT INTO "section" ("teacherCI", "gradeID", seccion, period, created_at, updated_at) VALUES
(1, 1, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 2, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 2, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 3, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 3, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 4, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 4, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 5, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 5, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 6, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 6, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 7, 'A', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 7, 'B', '2024-2025', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Nuevos Datos de Prueba para 'student'
INSERT INTO "student" (ci, name, "lastName", sex, birthday, "placeBirth", "parishID", status_id, "quantityBrothers", "representativeID", "motherName", "motherCi", "motherTelephone", "fatherName", "fatherCi", "fatherTelephone", "livesMother", "livesFather", "livesBoth", "livesRepresentative", "rolRopresentative", created_at, updated_at) VALUES
-- Estudiantes existentes (se mantienen)
('30001001', 'Diego', 'Pérez', 'Masculino', '2015-01-20', 'San Cristóbal', 1, 1, 1, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Pérez', '12345678', '04121234567', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30002002', 'Sofía', 'López', 'Femenino', '2016-03-12', 'Mérida', 3, 1, 0, '20202020', 'Carla López', '98765432', '04161112233', 'Pedro López', '87654321', '04149876543', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30003003', 'Andrés', 'Ramírez', 'Masculino', '2014-09-05', 'Valencia', 4, 1, 2, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Pérez', '12345678', '04121234567', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Nuevos estudiantes - Preescolar
('30004004', 'Mariana', 'Silva', 'Femenino', '2020-07-01', 'San Cristóbal', 6, 1, 1, '30303030', 'Carmen Pérez', '30303030', '04122223344', 'Alberto Silva', '65432109', '04160001122', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30005005', 'Pablo', 'Velasquez', 'Masculino', '2020-02-14', 'Mérida', 7, 1, 0, '40404040', 'Elena Velasquez', '78901234', '04140001122', 'José Ramírez', '40404040', '04144445566', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30006006', 'Lucía', 'Guerrero', 'Femenino', '2019-11-25', 'San Cristóbal', 1, 1, 2, '50505050', 'Lorena Torres', '50505050', '04266667788', 'Manuel Guerrero', '13579246', '04128889900', TRUE, TRUE, TRUE, FALSE, 'Representante', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30007007', 'Mateo', 'Arias', 'Masculino', '2018-05-10', 'San Cristóbal', 6, 1, 0, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Arias', '24681357', '04129990011', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30008008', 'Valeria', 'Blanco', 'Femenino', '2018-09-18', 'Mérida', 3, 1, 1, '20202020', 'Carla Blanco', '98765432', '04161112233', 'Roberto Sánchez', '20202020', '04161112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30009009', 'Santiago', 'Castañeda', 'Masculino', '2017-03-03', 'Valencia', 4, 1, 0, '30303030', 'Carmen Pérez', '30303030', '04122223344', 'Francisco Castañeda', '76543210', '04141112233', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30010010', 'Isabella', 'Díaz', 'Femenino', '2017-01-22', 'San Cristóbal', 1, 1, 1, '40404040', 'Ana Díaz', '11223344', '04123334455', 'José Ramírez', '40404040', '04144445566', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30011011', 'Juan', 'Espinoza', 'Masculino', '2016-10-05', 'Mérida', 2, 1, 0, '50505050', 'Lorena Torres', '50505050', '04266667788', 'Carlos Espinoza', '23456789', '04127778899', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30012012', 'Emma', 'Flores', 'Femenino', '2016-04-30', 'Valencia', 3, 1, 2, '10101010', 'Julia González', '10101010', '04247778899', 'Pedro Flores', '87654321', '04149990000', TRUE, TRUE, TRUE, FALSE, 'Representante', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30013013', 'Sebastián', 'García', 'Masculino', '2015-08-11', 'San Cristóbal', 6, 1, 0, '20202020', 'Carla García', '98765432', '04161112233', 'Roberto Sánchez', '20202020', '04161112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30014014', 'Laura', 'Hernández', 'Femenino', '2015-02-20', 'Mérida', 7, 1, 1, '30303030', 'Carmen Pérez', '30303030', '04122223344', 'Miguel Hernández', '45678901', '04121112233', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30015015', 'Leo', 'Ibarra', 'Masculino', '2014-12-01', 'San Cristóbal', 1, 1, 0, '40404040', 'Maria Ibarra', '11223344', '04123334455', 'José Ramírez', '40404040', '04144445566', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30016016', 'Ana', 'Jara', 'Femenino', '2014-06-15', 'San Cristóbal', 6, 1, 1, '50505050', 'Lorena Torres', '50505050', '04266667788', 'Daniel Jara', '56789012', '04127778899', TRUE, TRUE, TRUE, FALSE, 'Representante', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30017017', 'Tomás', 'King', 'Masculino', '2013-10-08', 'Mérida', 2, 1, 0, '10101010', 'Julia González', '10101010', '04247778899', 'Pedro King', '98765432', '04149990000', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30018018', 'Daniela', 'León', 'Femenino', '2013-03-20', 'Valencia', 3, 1, 2, '20202020', 'Carla León', '98765432', '04161112233', 'Roberto Sánchez', '20202020', '04161112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Más estudiantes - Preescolar (parishID 1, 6, 7)
('30019019', 'Sara', 'Mora', 'Femenino', '2020-01-10', 'San Cristóbal', 1, 1, 1, '60606060', 'Laura Mora', '60606060', '04125556677', 'Miguel Herrera', '60606060', '04125556677', TRUE, TRUE, TRUE, FALSE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30020020', 'Lucas', 'Nieves', 'Masculino', '2019-09-03', 'Mérida', 7, 1, 0, '70707070', 'Ana Nieves', '70707070', '04148889900', 'Andrea Ruiz', '70707070', '04148889900', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30021021', 'Emilia', 'Ortiz', 'Femenino', '2020-05-22', 'Valencia', 8, 1, 2, '80808080', 'Marta Ortiz', '80808080', '04169990011', 'Fernando Castro', '80808080', '04169990011', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30022022', 'Felipe', 'Paredes', 'Masculino', '2019-04-18', 'Bogotá', 9, 1, 1, '90909090', 'Paula Paredes', '90909090', '04241112233', 'Diana Mendoza', '90909090', '04241112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30023023', 'Victoria', 'Quintero', 'Femenino', '2020-03-07', 'San Cristóbal', 10, 1, 0, '10010010', 'Luisa Quintero', '10010010', '04123334455', 'Gustavo Navas', '10010010', '04123334455', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Más estudiantes - 1er Grado (parishID 1, 3, 4)
('30024024', 'Ricardo', 'Rojas', 'Masculino', '2018-02-05', 'Mérida', 11, 1, 1, '11011011', 'Rosa Rojas', '11011011', '04145556677', 'Patricia Peña', '11011011', '04145556677', TRUE, TRUE, TRUE, FALSE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30025025', 'Sofía', 'Salazar', 'Femenino', '2018-07-28', 'Valencia', 12, 1, 0, '12012012', 'Carolina Salazar', '12012012', '04167778899', 'Mario Quintero', '12012012', '04167778899', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30026026', 'Javier', 'Torres', 'Masculino', '2017-11-14', 'Bogotá', 13, 1, 2, '13013013', 'Beatriz Torres', '13013013', '04269990011', 'Silvia Reyes', '13013013', '04269990011', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30027027', 'Camila', 'Uribe', 'Femenino', '2018-04-01', 'San Cristóbal', 1, 1, 1, '14014014', 'Laura Uribe', '14014014', '04121112233', 'Oscar Salazar', '14014014', '04121112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30028028', 'Alejandro', 'Vargas', 'Masculino', '2017-09-09', 'Mérida', 3, 1, 0, '15015015', 'Elena Vargas', '15015015', '04143334455', 'Victoria Vargas', '15015015', '04143334455', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Más estudiantes - 2do Grado (parishID 1, 2, 3)
('30029029', 'Valeria', 'Zurita', 'Femenino', '2017-01-20', 'Valencia', 4, 1, 1, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Zurita', '12345678', '04121234567', TRUE, TRUE, TRUE, FALSE, 'Representante', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30030030', 'Miguel', 'Acosta', 'Masculino', '2016-10-15', 'San Cristóbal', 1, 1, 0, '20202020', 'Sandra Acosta', '20202020', '04161112233', 'Roberto Sánchez', '20202020', '04161112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30031031', 'Natalia', 'Benítez', 'Femenino', '2016-04-04', 'Mérida', 2, 1, 2, '30303030', 'Carmen Pérez', '30303030', '04122223344', 'Carlos Benítez', '30303030', '04122223344', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30032032', 'Diego', 'Cabrera', 'Masculino', '2017-08-01', 'Valencia', 3, 1, 1, '40404040', 'Ana Cabrera', '40404040', '04144445566', 'José Ramírez', '40404040', '04144445566', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30033033', 'Elena', 'Delgado', 'Femenino', '2016-02-19', 'Bogotá', 4, 1, 0, '50505050', 'Lorena Torres', '50505050', '04266667788', 'Pedro Delgado', '50505050', '04266667788', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Más estudiantes - 3er Grado (parishID 6, 7, 8)
('30034034', 'Luis', 'Estrada', 'Masculino', '2015-07-25', 'San Cristóbal', 6, 1, 1, '60606060', 'María Estrada', '60606060', '04125556677', 'Miguel Herrera', '60606060', '04125556677', TRUE, TRUE, TRUE, FALSE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30035035', 'Andrea', 'Figueroa', 'Femenino', '2015-01-08', 'Mérida', 7, 1, 0, '70707070', 'Sofía Figueroa', '70707070', '04148889900', 'Andrea Ruiz', '70707070', '04148889900', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30036036', 'Carlos', 'Guzmán', 'Masculino', '2014-11-02', 'Valencia', 8, 1, 2, '80808080', 'Laura Guzmán', '80808080', '04169990011', 'Fernando Castro', '80808080', '04169990011', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30037037', 'Daniela', 'Hernández', 'Femenino', '2015-03-16', 'Bogotá', 9, 1, 1, '90909090', 'Diana Mendoza', '90909090', '04241112233', 'Roberto Hernández', '90909090', '04241112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30038038', 'Pedro', 'Infante', 'Masculino', '2014-09-29', 'San Cristóbal', 10, 1, 0, '10010010', 'Carmen Infante', '10010010', '04123334455', 'Gustavo Navas', '10010010', '04123334455', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Más estudiantes - 4to Grado (parishID 1, 2, 3)
('30039039', 'Gabriela', 'Jaramillo', 'Femenino', '2014-06-10', 'Mérida', 11, 1, 1, '11011011', 'Julia Jaramillo', '11011011', '04145556677', 'Patricia Peña', '11011011', '04145556677', TRUE, TRUE, TRUE, FALSE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30040040', 'Jorge', 'Klein', 'Masculino', '2013-10-03', 'Valencia', 12, 1, 0, '12012012', 'Ana Klein', '12012012', '04167778899', 'Mario Quintero', '12012012', '04167778899', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30041041', 'Carolina', 'Lara', 'Femenino', '2013-03-15', 'Bogotá', 13, 1, 2, '13013013', 'Isabel Lara', '13013013', '04269990011', 'Silvia Reyes', '13013013', '04269990011', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30042042', 'Manuel', 'Méndez', 'Masculino', '2014-05-20', 'San Cristóbal', 1, 1, 1, '14014014', 'Sofía Méndez', '14014014', '04121112233', 'Oscar Salazar', '14014014', '04121112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30043043', 'Valeria', 'Navarro', 'Femenino', '2013-09-01', 'Mérida', 2, 1, 0, '15015015', 'Lorena Navarro', '15015015', '04143334455', 'Victoria Vargas', '15015015', '04143334455', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Más estudiantes - 5to Grado (parishID 6, 7, 8)
('30044044', 'Pablo', 'Olivares', 'Masculino', '2013-01-22', 'Valencia', 3, 1, 1, '10101010', 'Julia González', '10101010', '04247778899', 'Juan Olivares', '12345678', '04121234567', TRUE, TRUE, TRUE, FALSE, 'Representante', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30045045', 'Lucía', 'Pérez', 'Femenino', '2012-10-05', 'San Cristóbal', 6, 1, 0, '20202020', 'Carla Pérez', '20202020', '04161112233', 'Roberto Sánchez', '20202020', '04161112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30046046', 'Santiago', 'Quiroz', 'Masculino', '2012-04-30', 'Mérida', 7, 1, 2, '30303030', 'Carmen Quiroz', '30303030', '04122223344', 'Carlos Quiroz', '30303030', '04122223344', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30047047', 'Isabella', 'Reyes', 'Femenino', '2013-08-11', 'Valencia', 8, 1, 1, '40404040', 'Ana Reyes', '40404040', '04144445566', 'José Ramírez', '40404040', '04144445566', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30048048', 'Juan', 'Sosa', 'Masculino', '2012-02-20', 'Bogotá', 9, 1, 0, '50505050', 'Lorena Torres', '50505050', '04266667788', 'Pedro Sosa', '50505050', '04266667788', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Más estudiantes - 6to Grado (parishID 1, 2, 3)
('30049049', 'María', 'Tapia', 'Femenino', '2012-06-15', 'San Cristóbal', 1, 1, 1, '60606060', 'Luisa Tapia', '60606060', '04125556677', 'Miguel Herrera', '60606060', '04125556677', TRUE, TRUE, TRUE, FALSE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30050050', 'José', 'Urbina', 'Masculino', '2011-10-08', 'Mérida', 2, 1, 0, '70707070', 'Ana Urbina', '70707070', '04148889900', 'Andrea Ruiz', '70707070', '04148889900', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30051051', 'Ana', 'Vidal', 'Femenino', '2011-03-20', 'Valencia', 3, 1, 2, '80808080', 'Marta Vidal', '80808080', '04169990011', 'Fernando Castro', '80808080', '04169990011', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30052052', 'Pedro', 'Zambrano', 'Masculino', '2012-05-01', 'Bogotá', 4, 1, 1, '90909090', 'Paula Zambrano', '90909090', '04241112233', 'Diana Mendoza', '90909090', '04241112233', FALSE, TRUE, FALSE, TRUE, 'Padre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('30053053', 'Elena', 'Álvarez', 'Femenino', '2011-09-12', 'San Cristóbal', 6, 1, 0, '10010010', 'Luisa Álvarez', '10010010', '04123334455', 'Gustavo Navas', '10010010', '04123334455', TRUE, FALSE, FALSE, TRUE, 'Madre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;


-- Datos de Prueba para 'enrollment' (Se asume que los IDs de sectionID, studentID y brigadeTeacherDateID existen)
-- Se crearán matrículas para los estudiantes existentes y los nuevos, distribuyéndolos entre las secciones y brigadas disponibles.
-- Se asignarán de forma round-robin a las secciones existentes para simular una distribución.
-- Asignación de estudiantes a secciones y brigadas (ejemplos)

-- Para los estudiantes de Preescolar
INSERT INTO "enrollment" ("studentID", "sectionID", "brigadeTeacherDateID", "registrationDate", repeater, "chemiseSize", "pantsSize", "shoesSize", weight, stature, diseases, observation, "birthCertificateCheck", "vaccinationCardCheck", "studentPhotosCheck", "representativePhotosCheck", "representativeCopyIDCheck", "representativeRIFCheck", "autorizedCopyIDCheck", created_at, updated_at) VALUES
-- Para los estudiantes de Preescolar
(1, 1, 1, '2024-09-01', FALSE, 'XS', 'XS', '25', 15.5, 90.0, 'Ninguna', 'Buen desempeño', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Diego Pérez (Preescolar)
(4, 1, 1, '2024-09-01', FALSE, 'XS', 'XS', '24', 14.8, 88.5, 'Asma leve', 'Necesita atención en respiración', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Mariana Silva (Preescolar)
(5, 2, 2, '2024-09-01', FALSE, 'XS', 'XS', '26', 16.0, 91.0, 'Alergia al polen', 'Buen comportamiento', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pablo Velasquez (Preescolar)
(6, 2, 2, '2024-09-01', FALSE, 'XS', 'XS', '25', 15.2, 89.0, 'Ninguna', 'Muy participativa', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Lucía Guerrero (Preescolar)
(19, 1, 1, '2024-09-01', FALSE, 'XS', 'XS', '24', 14.9, 87.5, 'Ninguna', 'Se adapta bien', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sara Mora (Preescolar)
(20, 2, 2, '2024-09-01', FALSE, 'XS', 'XS', '25', 15.7, 90.2, 'Ninguna', 'Interés en actividades', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Lucas Nieves (Preescolar)
(21, 1, 1, '2024-09-01', FALSE, 'XS', 'XS', '26', 16.1, 91.5, 'Ninguna', 'Necesita más socialización', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Emilia Ortiz (Preescolar)
(22, 2, 2, '2024-09-01', FALSE, 'XS', 'XS', '25', 15.0, 88.0, 'Ninguna', 'Buen aprendiz', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Felipe Paredes (Preescolar)
(23, 1, 1, '2024-09-01', FALSE, 'XS', 'XS', '24', 14.7, 87.0, 'Ninguna', 'Buen progreso', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Victoria Quintero (Preescolar)

-- Para los estudiantes de 1er Grado
(2, 3, 3, '2024-09-01', FALSE, 'S', 'S', '28', 19.0, 105.0, 'Ninguna', 'Destaca en matemáticas', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sofía López (1er Grado)
(7, 3, 3, '2024-09-01', FALSE, 'S', 'S', '27', 18.5, 104.0, 'Ninguna', 'Participa activamente', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Mateo Arias (1er Grado)
(8, 4, 4, '2024-09-01', FALSE, 'S', 'S', '28', 19.2, 106.0, 'Alergia al polvo', 'Necesita refuerzo en lectura', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Valeria Blanco (1er Grado)
(9, 4, 4, '2024-09-01', FALSE, 'S', 'S', '27', 18.0, 103.5, 'Ninguna', 'Comportamiento excelente', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Santiago Castañeda (1er Grado)
(24, 3, 3, '2024-09-01', FALSE, 'S', 'S', '28', 19.1, 105.5, 'Ninguna', 'Entusiasta con las tareas', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ricardo Rojas (1er Grado)
(25, 4, 4, '2024-09-01', FALSE, 'S', 'S', '27', 18.7, 104.2, 'Ninguna', 'Le gusta trabajar en grupo', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sofía Salazar (1er Grado)
(26, 3, 3, '2024-09-01', FALSE, 'S', 'S', '28', 19.3, 106.3, 'Ninguna', 'Requiere apoyo en escritura', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Javier Torres (1er Grado)
(27, 4, 4, '2024-09-01', FALSE, 'S', 'S', '27', 18.4, 103.8, 'Ninguna', 'Participación activa', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Camila Uribe (1er Grado)
(28, 3, 3, '2024-09-01', FALSE, 'S', 'S', '28', 19.0, 105.0, 'Ninguna', 'Buen compañero', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Alejandro Vargas (1er Grado)

-- Para los estudiantes de 2do Grado
(10, 5, 5, '2024-09-01', FALSE, 'S', 'S', '30', 22.0, 115.0, 'Ninguna', 'Muy aplicada', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Isabella Díaz (2do Grado)
(11, 6, 6, '2024-09-01', FALSE, 'S', 'S', '29', 21.5, 114.0, 'Deficiencia visual', 'Usa lentes, sentar adelante', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Juan Espinoza (2do Grado)
(12, 5, 5, '2024-09-01', FALSE, 'M', 'M', '31', 23.0, 116.0, 'Ninguna', 'Le gusta leer', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Emma Flores (2do Grado)
(29, 6, 6, '2024-09-01', FALSE, 'S', 'S', '30', 22.1, 115.1, 'Ninguna', 'Participación entusiasta', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Valeria Zurita (2do Grado)
(30, 5, 5, '2024-09-01', FALSE, 'S', 'S', '29', 21.7, 114.5, 'Ninguna', 'Interés en ciencias', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Miguel Acosta (2do Grado)
(31, 6, 6, '2024-09-01', FALSE, 'M', 'M', '31', 23.2, 116.2, 'Ninguna', 'Buen desarrollo social', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Natalia Benítez (2do Grado)
(32, 5, 5, '2024-09-01', FALSE, 'S', 'S', '30', 22.3, 115.3, 'Ninguna', 'Necesita mejorar concentración', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Diego Cabrera (2do Grado)
(33, 6, 6, '2024-09-01', FALSE, 'S', 'S', '29', 21.8, 114.8, 'Ninguna', 'Excelente en dibujo', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Elena Delgado (2do Grado)

-- Para los estudiantes de 3er Grado
(3, 7, 7, '2024-09-01', FALSE, 'M', 'M', '32', 25.0, 125.0, 'Ninguna', 'Excelente rendimiento', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Andrés Ramírez (3er Grado)
(13, 7, 7, '2024-09-01', FALSE, 'M', 'M', '31', 24.5, 124.0, 'Alergia al gluten', 'Evitar alimentos con gluten', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sebastián García (3er Grado)
(14, 8, 8, '2024-09-01', FALSE, 'M', 'M', '32', 25.2, 126.0, 'Ninguna', 'Le cuesta trabajo en equipo', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Laura Hernández (3er Grado)
(15, 8, 8, '2024-09-01', FALSE, 'M', 'M', '31', 24.0, 123.5, 'Ninguna', 'Muy creativo', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Leo Ibarra (3er Grado)
(34, 7, 7, '2024-09-01', FALSE, 'M', 'M', '32', 25.1, 125.1, 'Ninguna', 'Líder positivo', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Luis Estrada (3er Grado)
(35, 8, 8, '2024-09-01', FALSE, 'M', 'M', '31', 24.7, 124.5, 'Ninguna', 'Curiosa y preguntona', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Andrea Figueroa (3er Grado)
(36, 7, 7, '2024-09-01', FALSE, 'M', 'M', '32', 25.3, 125.7, 'Ninguna', 'Necesita apoyo en lectura comprensiva', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Carlos Guzmán (3er Grado)
(37, 8, 8, '2024-09-01', FALSE, 'M', 'M', '31', 24.8, 124.9, 'Ninguna', 'Participación activa en clase', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Daniela Hernández (3er Grado)
(38, 7, 7, '2024-09-01', FALSE, 'M', 'M', '32', 25.0, 125.0, 'Ninguna', 'Buen rendimiento académico', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pedro Infante (3er Grado)

-- Para los estudiantes de 4to Grado
(16, 9, 9, '2024-09-01', FALSE, 'M', 'M', '34', 28.0, 135.0, 'Ninguna', 'Se esfuerza mucho', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ana Jara (4to Grado)
(17, 10, 10, '2024-09-01', FALSE, 'M', 'M', '33', 27.5, 134.0, 'Problemas de visión', 'Usa lentes, sentarse adelante', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Tomás King (4to Grado)
(18, 9, 9, '2024-09-01', FALSE, 'L', 'L', '35', 29.0, 136.0, 'Ninguna', 'Muy sociable', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Daniela León (4to Grado)
(39, 10, 10, '2024-09-01', FALSE, 'M', 'M', '34', 28.1, 135.2, 'Ninguna', 'Le gusta ayudar a sus compañeros', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Gabriela Jaramillo (4to Grado)
(40, 9, 9, '2024-09-01', FALSE, 'M', 'M', '33', 27.6, 134.3, 'Ninguna', 'Buen sentido del humor', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Jorge Klein (4to Grado)
(41, 10, 10, '2024-09-01', FALSE, 'L', 'L', '35', 29.2, 136.5, 'Ninguna', 'Participación activa en el aula', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Carolina Lara (4to Grado)
(42, 9, 9, '2024-09-01', FALSE, 'M', 'M', '34', 28.3, 135.5, 'Ninguna', 'Necesita mejorar organización', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Manuel Méndez (4to Grado)
(43, 10, 10, '2024-09-01', FALSE, 'M', 'M', '33', 27.8, 134.8, 'Ninguna', 'Excelente en artes', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Valeria Navarro (4to Grado)

-- Para los estudiantes de 5to Grado
(44, 11, 11, '2024-09-01', FALSE, 'L', 'L', '36', 32.0, 145.0, 'Ninguna', 'Curioso y analítico', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pablo Olivares (5to Grado)
(45, 12, 12, '2024-09-01', FALSE, 'L', 'L', '35', 31.5, 144.0, 'Diabetes tipo 1', 'Requiere control de azúcar', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Lucía Pérez (5to Grado)
(46, 11, 11, '2024-09-01', FALSE, 'XL', 'XL', '37', 33.0, 146.0, 'Ninguna', 'Líder en proyectos grupales', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Santiago Quiroz (5to Grado)
(47, 12, 12, '2024-09-01', FALSE, 'L', 'L', '36', 32.2, 145.2, 'Ninguna', 'Se distrae con facilidad', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Isabella Reyes (5to Grado)
(48, 11, 11, '2024-09-01', FALSE, 'L', 'L', '35', 31.8, 144.5, 'Ninguna', 'Buen rendimiento en educación física', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Juan Sosa (5to Grado)

-- Para los estudiantes de 6to Grado
(49, 13, 1, '2024-09-01', FALSE, 'XL', 'XL', '38', 36.0, 155.0, 'Ninguna', 'Responsable y organizado', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- María Tapia (6to Grado)
(50, 14, 4, '2024-09-01', FALSE, 'XL', 'XL', '37', 35.5, 154.0, 'Alergia a mariscos', 'Evitar contacto con mariscos', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- José Urbina (6to Grado)
(51, 13, 1, '2024-09-01', FALSE, 'XXL', 'XXL', '39', 37.0, 156.0, 'Ninguna', 'Preparado para la secundaria', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ana Vidal (6to Grado)
(52, 14, 4, '2024-09-01', FALSE, 'XL', 'XL', '38', 36.2, 155.2, 'Ninguna', 'Líder natural', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Pedro Zambrano (6to Grado)
(53, 13, 1, '2024-09-01', FALSE, 'XL', 'XL', '37', 35.8, 154.5, 'Ninguna', 'Muy participativa', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) -- Elena Álvarez (6to Grado)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'usuario' (usuarios de ejemplo, solo se añaden algunos nuevos)
INSERT INTO "usuario" (username, email, password, "permiso_id", "last_login", is_active, "email_verified", "security_word", "respuesta_de_seguridad", "personal_id", created_at, updated_at) VALUES
('admin.ana', 'admin.ana@example.com', '$2a$10$xyz...', 1, NULL, TRUE, TRUE, 'color favorito', 'azul', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('teacher.maria', 'teacher.maria@example.com', '$2a$10$abc...', 2, NULL, TRUE, FALSE, 'nombre mascota', 'fido', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('secretary.pedro', 'secretary.pedro@example.com', '$2a$10$def...', 3, NULL, TRUE, TRUE, 'comida favorita', 'pizza', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('teacher.laura', 'teacher.laura@example.com', '$2a$10$ghi...', 2, NULL, TRUE, TRUE, 'lugar de nacimiento', 'barinas', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('teacher.ricardo', 'teacher.ricardo@example.com', '$2a$10$jkl...', 2, NULL, TRUE, TRUE, 'nombre de madre', 'rosa', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'attendance'
INSERT INTO "attendance" (date_a, "sectionID", observaciones, created_at, updated_at) VALUES
('2025-01-10', 1, 'Asistencia regular', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-10', 2, 'Faltaron 2 estudiantes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-10', 3, 'Todos presentes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-11', 1, 'Un estudiante con permiso', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-11', 4, 'Asistencia completa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-12', 5, 'Sin novedad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('2025-01-12', 6, 'Un estudiante con retraso', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Datos de Prueba para 'attendanceDetails' (ejemplos)
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

-- Datos de Prueba para 'notes' (ejemplos)
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

-- Datos de Prueba para 'studentBrigade' (ejemplos, asegurando que los studentID y brigadeID existan)
INSERT INTO "studentBrigade" ("studentID", "brigadeID", "assignmentDate", created_at, updated_at) VALUES
(1, 1, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 2, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 2, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 1, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 2, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 1, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 2, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "studentBrigade" ("studentID", "brigadeID", "assignmentDate", created_at, updated_at) VALUES
(12, 3, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Emma Flores to Brigada Siembra A
(13, 4, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sebastián García to Brigada Siembra B
(14, 5, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Laura Hernández to Brigada Reciclaje A
(15, 6, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Leo Ibarra to Brigada Reciclaje B
(16, 1, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ana Jara to Brigada Limpieza A
(17, 2, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Tomás King to Brigada Limpieza B
(18, 3, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Daniela León to Brigada Siembra A
(19, 4, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sara Mora to Brigada Siembra B
(20, 5, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Lucas Nieves to Brigada Reciclaje A
(21, 6, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Emilia Ortiz to Brigada Reciclaje B
(22, 1, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Felipe Paredes to Brigada Limpieza A
(23, 2, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Victoria Quintero to Brigada Limpieza B
(24, 3, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ricardo Rojas to Brigada Siembra A
(25, 4, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sofía Salazar to Brigada Siembra B
(26, 5, '2024-09-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Javier Torres to Brigada Reciclaje A