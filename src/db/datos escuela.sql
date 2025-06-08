-- País, estado, municipio, parroquia
INSERT INTO country (name) VALUES ('Venezuela');
INSERT INTO state (name, country_id) VALUES ('Táchira', 1);
INSERT INTO municipality (name, state_id) VALUES ('San Cristóbal', 1);
INSERT INTO parish (name, municipality_id) VALUES ('Pedro María Morantes', 1);

-- Roles
INSERT INTO role (name, description) VALUES
('Teacher', 'Academic staff'),
('Admin', 'System administrator'),
('Maintenance', 'School maintenance staff');

-- Permisos
INSERT INTO permission (name, description) VALUES
('enroll_student', 'Enroll a student'),
('view_records', 'View academic records');

-- Status del estudiante
INSERT INTO student_status (description) VALUES ('Active');

-- Brigadas
INSERT INTO brigade (name, description) VALUES
('Brigada de Patrulla Escolar','Responsables de mantener el orden y la seguridad de los estudiantes'),
('Brigada de Primeros Auxilios','Ayuda a atender a quienes se sienten mal o se lastiman'),
('Brigada de Gestión de Riesgos','Se encarga de prevenir y responder ante emergencias'),
('Brigada de Convivencia y Paz','Promueve un ambiente de respeto, armonía y resolución pacífica de conflictos'),
('Brigada Ecológica','Dedicada a la conservación del medio ambiente escolar y la promoción de prácticas sostenibles'),
('Brigada de Bosque Bicentenario','Encargada del cuidado y mantenimiento de las áreas verdes y el bosque escolar'),
('Brigada de Bioseguridad','Garantiza el cumplimiento de las normas sanitarias y de higiene en la institución'),
('Brigada de Calentamiento Global','Concientiza sobre el cambio climático y promueve acciones para mitigar sus efectos'),
('Brigada de Prevención Integral','Aborda la prevención de riesgos, adicciones y situaciones que afecten el bienestar estudiantil'),
('Brigada de Guardián de la Semilla','Fomenta la agricultura sostenible y el cuidado de las plantas y huertos escolares'),
('Brigada de Agua y Saneamiento','Promueve el uso consciente del agua y el mantenimiento de la higiene en las instalaciones'),
('Brigada de Sociedad Bolivariana','Estudia y difunde el pensamiento y legado de Simón Bolívar y los valores patrios'),

-- Staff: 9 docentes, 3 admins, 3 mantenimiento
INSERT INTO staff (first_name, last_name, role_id, phone_number, national_id, email, birth_date) VALUES
-- Teachers (role_id = 1)
('Ana', 'Torres', 1, '04121234567', '10000001', 'ana.torres@school.edu', '1980-01-01'),
('Luis', 'Martinez', 1, '04121234568', '10000002', 'luis.martinez@school.edu', '1980-02-01'),
('Sara', 'Rivas', 1, '04121234569', '10000003', 'sara.rivas@school.edu', '1980-03-01'),
('Mario', 'Gomez', 1, '04121234570', '10000004', 'mario.gomez@school.edu', '1980-04-01'),
('Lucia', 'Vega', 1, '04121234571', '10000005', 'lucia.vega@school.edu', '1980-05-01'),
('Carlos', 'Perez', 1, '04121234572', '10000006', 'carlos.perez@school.edu', '1980-06-01'),
('Carmen', 'Lopez', 1, '04121234573', '10000007', 'carmen.lopez@school.edu', '1980-07-01'),
('Daniel', 'Ramirez', 1, '04121234574', '10000008', 'daniel.ramirez@school.edu', '1980-08-01'),
('Julia', 'Figueroa', 1, '04121234575', '10000009', 'julia.figueroa@school.edu', '1980-09-01'),
-- Admin (role_id = 2)
('Paola', 'Reyes', 2, '04121234576', '20000001', 'paola.reyes@school.edu', '1975-01-01'),
('Raul', 'Alvarez', 2, '04121234577', '20000002', 'raul.alvarez@school.edu', '1975-02-01'),
('Elsa', 'Diaz', 2, '04121234578', '20000003', 'elsa.diaz@school.edu', '1975-03-01'),
-- Maintenance (role_id = 3)
('Miguel', 'Suarez', 3, '04121234579', '30000001', 'miguel.suarez@school.edu', '1970-01-01'),
('Adriana', 'Navarro', 3, '04121234580', '30000002', 'adriana.navarro@school.edu', '1970-02-01'),
('Diego', 'Rondon', 3, '04121234581', '30000003', 'diego.rondon@school.edu', '1970-03-01');

-- Asignación de brigadas con fecha y encargado
INSERT INTO brigade_staff_date (brigade_id, date, staff_id) VALUES
(1, '2024-05-15', 10),  -- Paola
(2, '2024-05-16', 11),  -- Raul
(3, '2024-05-17', 12);  -- Elsa

-- Guardianes para estudiantes
INSERT INTO guardian (first_name, last_name, role_description, phone_number, national_id, email, birth_date) VALUES
('Maria', 'Lopez', 'Mother', '04141234567', '40000001', 'maria.lopez@example.com', '1990-01-01'),
('Jose', 'Martinez', 'Father', '04141234568', '40000002', 'jose.martinez@example.com', '1989-01-01'),
('Carla', 'Mendez', 'Mother', '04141234569', '40000003', 'carla.mendez@example.com', '1991-01-01');

-- Grados (PreK1, PreK2, PreK3, 1st to 6th grade)
INSERT INTO grade (name) VALUES
('Preschool 1'), ('Preschool 2'), ('Preschool 3'),
('1st Grade'), ('2nd Grade'), ('3rd Grade'),
('4th Grade'), ('5th Grade'), ('6th Grade');

-- Relación docente-grado (1 por grado)
INSERT INTO teacher_grade (teacher_id, grade_id) VALUES
(1,1), (2,2), (3,3), (4,4), (5,5), (6,6), (7,7), (8,8), (9,9);

-- Estudiantes (3 por grado × 9 grados = 27)
-- BDF student está vacío (por simplicidad), se asocia a la brigada 1
INSERT INTO bdf_student (description, brigade_id) VALUES
('BDF beneficiary', 1);

-- Estudiantes
INSERT INTO student (first_name, last_name, status_id, parish_id, bdf_student_id, brigade_staff_date_id, guardian_id) VALUES
('Student1', 'Last1', 1, 1, 1, 1, 1),
('Student2', 'Last2', 1, 1, 1, 2, 2),
('Student3', 'Last3', 1, 1, 1, 3, 3),
('Student4', 'Last4', 1, 1, 1, 1, 1),
('Student5', 'Last5', 1, 1, 1, 2, 2),
('Student6', 'Last6', 1, 1, 1, 3, 3),
('Student7', 'Last7', 1, 1, 1, 1, 1),
('Student8', 'Last8', 1, 1, 1, 2, 2),
('Student9', 'Last9', 1, 1, 1, 3, 3),
('Student10', 'Last10', 1, 1, 1, 1, 1),
('Student11', 'Last11', 1, 1, 1, 2, 2),
('Student12', 'Last12', 1, 1, 1, 3, 3),
('Student13', 'Last13', 1, 1, 1, 1, 1),
('Student14', 'Last14', 1, 1, 1, 2, 2),
('Student15', 'Last15', 1, 1, 1, 3, 3),
('Student16', 'Last16', 1, 1, 1, 1, 1),
('Student17', 'Last17', 1, 1, 1, 2, 2),
('Student18', 'Last18', 1, 1, 1, 3, 3),
('Student19', 'Last19', 1, 1, 1, 1, 1),
('Student20', 'Last20', 1, 1, 1, 2, 2),
('Student21', 'Last21', 1, 1, 1, 3, 3),
('Student22', 'Last22', 1, 1, 1, 1, 1),
('Student23', 'Last23', 1, 1, 1, 2, 2),
('Student24', 'Last24', 1, 1, 1, 3, 3),
('Student25', 'Last25', 1, 1, 1, 1, 1),
('Student26', 'Last26', 1, 1, 1, 2, 2),
('Student27', 'Last27', 1, 1, 1, 3, 3);


-- Matrículas
INSERT INTO enrollment (student_id, teacher_grade_id, enrollment_date, academic_year) VALUES
(1,1,'2024-09-15','2024-2025'), (2,1,'2024-09-15','2024-2025'), (3,1,'2024-09-15','2024-2025'),
(4,2,'2024-09-15','2024-2025'), (5,2,'2024-09-15','2024-2025'), (6,2,'2024-09-15','2024-2025'),
(7,3,'2024-09-15','2024-2025'), (8,3,'2024-09-15','2024-2025'), (9,3,'2024-09-15','2024-2025'),
(10,4,'2024-09-15','2024-2025'), (11,4,'2024-09-15','2024-2025'), (12,4,'2024-09-15','2024-2025'),
(13,5,'2024-09-15','2024-2025'), (14,5,'2024-09-15','2024-2025'), (15,5,'2024-09-15','2024-2025'),
(16,6,'2024-09-15','2024-2025'), (17,6,'2024-09-15','2024-2025'), (18,6,'2024-09-15','2024-2025'),
(19,7,'2024-09-15','2024-2025'), (20,7,'2024-09-15','2024-2025'), (21,7,'2024-09-15','2024-2025'),
(22,8,'2024-09-15','2024-2025'), (23,8,'2024-09-15','2024-2025'), (24,8,'2024-09-15','2024-2025'),
(25,9,'2024-09-15','2024-2025'), (26,9,'2024-09-15','2024-2025'), (27,9,'2024-09-15','2024-2025');


