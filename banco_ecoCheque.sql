CREATE DATABASE `ecoCheque`;
USE `ecoCheque`;

CREATE TABLE `gerencia` (
`usuario` INT NOT NULL,
  `status`  ENUM('ativo', 'inativo') NOT NULL,
  `senha` VARCHAR(60) NULL,
  `nome` VARCHAR(60) NULL,
CONSTRAINT PK_usuario PRIMARY KEY(`usuario`)
);

CREATE TABLE `cheque` (
`numerocheque` INT NOT NULL,
  `valor` DECIMAL(10,2) NULL,
  `empresa` VARCHAR(100) NULL,
  `data` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `contato` VARCHAR(11) NULL,
  `gerencia_usuario` INT NOT NULL,
 CONSTRAINT PK_cheque PRIMARY KEY(`numerocheque`), 
CONSTRAINT FK_usuario foreign key(`gerencia_usuario`) references `gerencia`(`usuario`));

INSERT INTO `gerencia` (`usuario`, `status`, `senha`, `nome`) VALUES (879,'ativo', '4131', 'Gabriel Pacheco');
INSERT INTO `gerencia` (`usuario`, `status`, `senha`, `nome`) VALUES (559,'ativo', '1368ba1ab6ed38bb1f26f36673739d54', 'Daniel Scheffel');
UPDATE `ecocheque`.`gerencia` SET `senha` = '$2a$12$yHnA1argPumLlZSkpMVVZOxXdiECce4miJ6bqzmoTbzmGDWdpMw/m' WHERE (`usuario` = '559');
UPDATE `ecocheque`.`gerencia` SET `senha` = '$2a$12$gi7TZHsKOM/pveWlPYis7uBmJhWHEwieTt9zDDpmzWjvZtrIHCtR.' WHERE (`usuario` = '879');


INSERT INTO `cheque` (`numerocheque`, `valor`, `empresa`, `contato`, `gerencia_usuario`) VALUES (5631, 500.00, 'IND DE PALM BROCKER LTDA', '51999211631', 879);
INSERT INTO `cheque` (`numerocheque`, `valor`, `empresa`, `contato`, `gerencia_usuario`) VALUES (2365, 500.07, 'IND DE PALM BROCKER LTDA', '51999211631', 879);
SELECT * FROM cheque;

select * from gerencia;
SELECT usuario, status FROM gerencia WHERE usuario = 559;

ALTER TABLE gerencia
ADD COLUMN tipo_usuario ENUM('gerente', 'usuario') NOT NULL DEFAULT 'usuario';

ALTER TABLE cheque
ADD COLUMN status_cheque ENUM('recebido', 'guardado', 'depositado')
NOT NULL DEFAULT 'recebido';