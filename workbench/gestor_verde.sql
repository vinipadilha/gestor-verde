-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema gestor_verde
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `gestor_verde` ;

-- -----------------------------------------------------
-- Schema gestor_verde
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gestor_verde` DEFAULT CHARACTER SET utf8 ;
SHOW WARNINGS;
USE `gestor_verde` ;

-- -----------------------------------------------------
-- Table `produto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `produto` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `produto` (
  `proId` INT NOT NULL AUTO_INCREMENT,
  `proNome` VARCHAR(200) NULL,
  `proQtd` INT NULL,
  PRIMARY KEY (`proId`))
ENGINE = InnoDB;

SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
