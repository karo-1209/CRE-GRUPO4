DROP DATABASE IF EXISTS base_sesion;
CREATE DATABASE base_sesion;
USE base_sesion;

-- ROLES
CREATE TABLE roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(150)
);

-- USUARIOS
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  id_rol INT NOT NULL,
  cuenta_bloqueada BOOLEAN DEFAULT FALSE,
  estado BOOLEAN DEFAULT TRUE,
  -- HU04
  intentos_fallidos INT DEFAULT 0,
  -- HU05
  ultima_actividad DATETIME,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- HU06 AUDITORÍA
CREATE TABLE auditoria_accesos (
  id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  evento VARCHAR(100),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- DATOS INICIALES
INSERT INTO roles(nombre,descripcion)
VALUES ('Admin','Acceso total');

INSERT INTO usuarios(nombre,correo,username,password_hash,id_rol)
VALUES 
('Joel','admin@empresa.com','admin','1234',1),
('Karen','aquinok177@gmail.com','karen','1234',1);


SELECT * FROM usuarios;
SELECT * FROM roles;

CREATE TABLE password_reset_token (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiracion DATETIME NOT NULL
);

SELECT * FROM password_reset_token;

ALTER TABLE password_reset_token ADD usado BOOLEAN DEFAULT FALSE;

