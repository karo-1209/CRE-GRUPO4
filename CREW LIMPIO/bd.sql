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

INSERT INTO usuarios(nombre,correo,username,password_hash,id_rol)
VALUES

('David','davidmjhuizat@gmail.com','David','1234',1),
('caleb','calebsanchez9012@gmail.com','Caleb','1234',1);

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
USE base_sesion;
USE base_sesion;

UPDATE usuarios 
SET password_hash = '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RPHu5stS3uG' 
WHERE correo = 'aquinok177@gmail.com';
-- contraseña: $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xdqD1RPHu5stS3uG

INSERT INTO auditoria_accesos (id_usuario, evento, fecha)
VALUES 
((SELECT id_usuario FROM usuarios WHERE correo = 'admin@empresa.com'), 'LOGIN_EXITOSO', NOW()),
((SELECT id_usuario FROM usuarios WHERE correo = 'aquinok177@gmail.com'), 'ACCESO_PAGINA_AUDITORIA', NOW()),
((SELECT id_usuario FROM usuarios WHERE correo = 'davidmjhuizat@gmail.com'), 'LOGIN_FALLIDO', NOW() - INTERVAL 1 HOUR),
((SELECT id_usuario FROM usuarios WHERE correo = 'calebsanchez9012@gmail.com'), 'RECUPERACION_PASSWORD', NOW() - INTERVAL 2 HOUR);

SELECT * FROM auditoria_accesos;
-- Cambia 'fecha' por el nombre real que viste en el comando anterior
SELECT * FROM auditoria_accesos ORDER BY fecha DESC;

-- 1. Insertar el rol de Usuario normal
INSERT INTO roles(nombre, descripcion) 
VALUES ('User', 'Acceso limitado');

-- 2. Cambiar a David y Caleb para que sean "User" (id_rol = 2)
UPDATE usuarios SET id_rol = 2 WHERE username IN ('David', 'Caleb');

-- 3. Verificar los cambios
SELECT u.nombre, u.username, r.nombre as nombre_rol 
FROM usuarios u 
JOIN roles r ON u.id_rol = r.id_rol;
