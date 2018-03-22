-- MySQL Script generated by MySQL Workbench
-- Thu Mar 22 10:12:59 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema node_base
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `node_base` ;

-- -----------------------------------------------------
-- Schema node_base
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `node_base` DEFAULT CHARACTER SET utf8 ;
USE `node_base` ;

-- -----------------------------------------------------
-- Table `node_base`.`account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`account` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `domain_name` VARCHAR(45) NOT NULL,
  UNIQUE INDEX `domain_name_UNIQUE` (`domain_name` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`user` (
  `id` INT(7) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(150) NOT NULL,
  `password` VARCHAR(400) NOT NULL,
  `type` ENUM('ADMIN', 'CLIENT') NOT NULL DEFAULT 'CLIENT',
  `verified` TINYINT(1) NOT NULL DEFAULT 0,
  `create_date` DATETIME NULL,
  `last_login` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_ID_UNIQUE` (`id` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1000000;


-- -----------------------------------------------------
-- Table `node_base`.`account_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`account_user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role` ENUM('ADMIN_USER', 'READ_ONLY') NOT NULL DEFAULT 'READ_ONLY',
  `account_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `account_usert_2_account_idx` (`account_id` ASC),
  INDEX `account_user_2_user_idx` (`user_id` ASC),
  CONSTRAINT `account_usert_2_account`
    FOREIGN KEY (`account_id`)
    REFERENCES `node_base`.`account` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `account_user_2_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `node_base`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`user_activation_key`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`user_activation_key` (
  `user_id` INT UNSIGNED NOT NULL,
  `_key` VARCHAR(60) NOT NULL,
  `issued_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isUsed` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_ID`
    FOREIGN KEY (`user_id`)
    REFERENCES `node_base`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`oauth_client`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`oauth_client` (
  `client_id` VARCHAR(45) NOT NULL,
  `client_secret` VARCHAR(45) NOT NULL,
  `redirect_uri` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`client_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`oauth_access_token`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`oauth_access_token` (
  `access_token` VARCHAR(45) NOT NULL,
  `client_id` VARCHAR(45) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `expires` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `user_2_access_tokens_idx` (`user_id` ASC),
  INDEX `auth_client_2_access_tokens_idx` (`client_id` ASC),
  CONSTRAINT `user_2_access_tokens`
    FOREIGN KEY (`user_id`)
    REFERENCES `node_base`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `auth_client_2_access_tokens`
    FOREIGN KEY (`client_id`)
    REFERENCES `node_base`.`oauth_client` (`client_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`oauth_refresh_token`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`oauth_refresh_token` (
  `refresh_token` VARCHAR(45) NOT NULL,
  `client_id` VARCHAR(45) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `expires` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `user_2_refresh_tokens_idx` (`user_id` ASC),
  INDEX `auth_client_2_refresh_token_idx` (`client_id` ASC),
  CONSTRAINT `user_2_refresh_tokens`
    FOREIGN KEY (`user_id`)
    REFERENCES `node_base`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `auth_client_2_refresh_token`
    FOREIGN KEY (`client_id`)
    REFERENCES `node_base`.`oauth_client` (`client_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`admin` (
  `user_id` INT UNSIGNED NOT NULL,
  `admin_specific_data` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `admin_2_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `node_base`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`client`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`client` (
  `user_id` INT UNSIGNED NOT NULL,
  `client_specific_data` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `profile_2_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `node_base`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`account_specific_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`account_specific_data` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `data` TEXT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `date_from` DATE NOT NULL,
  `date_to` DATE NOT NULL,
  `account_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `specific_data` (`account_id` ASC),
  CONSTRAINT `specific_data_2_account`
    FOREIGN KEY (`account_id`)
    REFERENCES `node_base`.`account` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`password_reset_key`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`password_reset_key` (
  `user_id` INT UNSIGNED NOT NULL,
  `_key` VARCHAR(60) NOT NULL,
  `issued_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isUsed` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `password_reset_key_2_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `node_base`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`maintainers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`maintainers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `joined_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled',
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `node_base`.`profile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node_base`.`profile` (
  `user_id` INT UNSIGNED NOT NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `profile1_to_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `node_base`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
