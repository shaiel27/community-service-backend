-- BASE DE DATOS: EscuelaDB (PostgreSQL)

-- ---------- Ubicación geográfica ----------
CREATE TABLE pais (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE estado (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    pais_id BIGINT REFERENCES pais(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE municipio (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    estado_id BIGINT REFERENCES estado(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE parroquia (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    municipio_id BIGINT REFERENCES municipio(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- ---------- Seguridad y acceso ----------
CREATE TABLE rol (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE permisos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE personal (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    lastName VARCHAR(100),
    idRole BIGINT REFERENCES rol(id),
    telephoneNomber VARCHAR(20),
    CI VARCHAR(20) UNIQUE,
    Email VARCHAR(100),
    birthday TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    direccion VARCHAR(30),
    parroquia_id BIGINT REFERENCES parroquia(id)
);

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100),
    password VARCHAR(255),
    permiso_id BIGINT REFERENCES permisos(id),
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    token_expiry TIMESTAMP,
    email_verification_token VARCHAR(255),
    email_verified BOOLEAN,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    security_word TEXT,
	respuesta_de_seguridad text,
    last_login TIMESTAMP,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    personal_id BIGINT REFERENCES personal(id)
);

-- ---------- Información del estudiante ----------
CREATE TABLE status_student (
    id BIGSERIAL PRIMARY KEY,
    descripcion VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE brigada (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE brigada_docente_fecha (
    id BIGSERIAL PRIMARY KEY,
    brigada_id BIGINT REFERENCES brigada(id),
    fecha DATE,
    personal_id BIGINT REFERENCES personal(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE estudiante (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    status_id BIGINT REFERENCES status_student(id),
    brigada_docente_fecha_id BIGINT REFERENCES brigada_docente_fecha(id),
    vive_madre BOOLEAN,
    vive_padre BOOLEAN,
    vive_ambos BOOLEAN,
    vive_representante BOOLEAN,
    lugarNacimiento_id VARCHAR(20), -- (Referencia textual a parroquia)
    sexo VARCHAR(7),
    cedula_escolar VARCHAR(15),
    cant_hermanos INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE estudiante_bdf (
    id BIGSERIAL PRIMARY KEY,
    descripcion VARCHAR(255),
    student_id BIGINT REFERENCES estudiante(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    brigada_id BIGINT REFERENCES brigada(id)
);

CREATE TABLE representante (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    lastName VARCHAR(100),
    roleName VARCHAR(50),
    telephoneNomber VARCHAR(20),
    Cedula VARCHAR(20) UNIQUE,
    Email VARCHAR(100),
    birthday TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    estudiante_id BIGINT REFERENCES estudiante(id),
    telephoneHouse VARCHAR(20),
    direccionHabitacion VARCHAR(20),
    lugar_trabajo VARCHAR(50),
    telefono_trabajo VARCHAR(20)
);

-- ---------- Parte académica ----------
CREATE TABLE grado (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE docente_grado (
    id BIGSERIAL PRIMARY KEY,
    docente_id BIGINT REFERENCES personal(id),
    grado_id BIGINT REFERENCES grado(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    seccion VARCHAR(2)
);

CREATE TABLE matricula (
    id BIGSERIAL PRIMARY KEY,
    estudiante_id BIGINT REFERENCES estudiante(id),
    docente_grado_id BIGINT REFERENCES docente_grado(id),
    fecha_inscripcion DATE,
    periodo_escolar VARCHAR(20),
    repitiente BOOLEAN,
    talla_camisa VARCHAR(10),
    talla_pantalon VARCHAR(10),
    talla_zapatos VARCHAR(10),
    peso FLOAT,
    estatura FLOAT,
    enfermedades VARCHAR(100),
    observaciones VARCHAR(100),
    acta_nacimiento_check BOOLEAN,
    tarjeta_vacunas_check BOOLEAN,
    fotos_estudiante_check BOOLEAN,
    fotos_representante_check BOOLEAN,
    copia_cedula_representante_check BOOLEAN,
    rif_representante BOOLEAN,
    copia_cedula_autorizados_check BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
CREATE TABLE notas (
    id BIGSERIAL PRIMARY KEY,
    matricula_id BIGINT REFERENCES matricula(id),
    nota DECIMAL(5,2),
    periodo VARCHAR(20),
    asignatura VARCHAR(50),
    fecha_registro DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE asistencia_diaria (
    id BIGSERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    grado_id BIGINT REFERENCES docente_grado(id), -- o docente_grado_id si deseas mayor detalle
    cantidad_asistentes INTEGER NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
