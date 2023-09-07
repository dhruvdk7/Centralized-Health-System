-- migrate:up

CREATE TABLE IF NOT EXISTS `CSCI5308_18_DEVINT`.`Documents` (
    `id` INT NOT NULL auto_increment,
    `file` LONGTEXT NOT NULL,
    `fileType` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `CSCI5308_18_DEVINT`.`Status` (
    `id` INT NOT NULL auto_increment,
    `statusName` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `CSCI5308_18_DEVINT`.`Users` (
    `userId` INT NOT NULL auto_increment,
    `email` VARCHAR(100) NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `number` VARCHAR(10) NULL,
    `password` VARCHAR(128) NULL,
    `qrcode` TEXT NULL,
    `remarks` VARCHAR(200) NULL,
    `updatedAt` DATETIME NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedBy` INT NULL,
    `bloodGroup` VARCHAR(5) NULL,
    `address` VARCHAR(200) NULL,
    `documentId` INT NULL,
    `statusId` INT NOT NULL,
    `salt` VARCHAR(32) NULL,
    `isVerified` TINYINT(1) NOT NULL DEFAULT 0,
    `verificationCode` INT(6) NOT NULL,
    PRIMARY KEY (`userId`),
    INDEX `fk_Users_Documents_idx` (`documentId` ASC) ,
    INDEX `fk_Users_Status1_idx` (`statusId` ASC) ,
    CONSTRAINT `fk_Users_Documents`
    FOREIGN KEY (`documentId`)
    REFERENCES `CSCI5308_18_DEVINT`.`Documents` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_Users_Status1`
    FOREIGN KEY (`statusId`)
    REFERENCES `CSCI5308_18_DEVINT`.`Status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


CREATE TABLE IF NOT EXISTS `CSCI5308_18_DEVINT`.`Prescription` (
   `id` INT NOT NULL auto_increment,
   `createdAt` DATETIME NOT NULL,
   `updatedAt` DATETIME NOT NULL,
   `patientId` INT NOT NULL,
   `doctorId` INT NOT NULL,
   `details` VARCHAR(200) NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_Prescription_Users1_idx` (`patientId` ASC) ,
    INDEX `fk_Prescription_Users2_idx` (`doctorId` ASC) ,
    CONSTRAINT `fk_Prescription_Users1`
    FOREIGN KEY (`patientId`)
    REFERENCES `CSCI5308_18_DEVINT`.`Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_Prescription_Users2`
    FOREIGN KEY (`doctorId`)
    REFERENCES `CSCI5308_18_DEVINT`.`Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS `CSCI5308_18_DEVINT`.`Roles` (
    `id` INT NOT NULL auto_increment,
    `roleName` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `CSCI5308_18_DEVINT`.`UserRoleMapping` (
    `id` INT NOT NULL auto_increment,
    `userId` INT NOT NULL,
    `roleId` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_Users_has_Roles_Roles1_idx` (`roleId` ASC) ,
    INDEX `fk_Users_has_Roles_Users1_idx` (`userId` ASC) ,
    CONSTRAINT `fk_Users_has_Roles_Users1`
    FOREIGN KEY (`userId`)
    REFERENCES `CSCI5308_18_DEVINT`.`Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_Users_has_Roles_Roles1`
    FOREIGN KEY (`roleId`)
    REFERENCES `CSCI5308_18_DEVINT`.`Roles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Prerequisite Data

INSERT INTO Status (id, statusName)
VALUES
    (1, 'APPROVED'),
    (2, 'PENDING'),
    (3, 'REJECTED');

INSERT INTO Roles (id, roleName)
VALUES
    (1, 'ADMIN'),
    (2, 'DOCTOR'),
    (3, 'PHARMACY'),
    (4, 'PATIENT');


-- migrate:down

DROP TABLE IF EXISTS `CSCI5308_18_DEVINT`.`UserRoleMapping`;
DROP TABLE IF EXISTS `CSCI5308_18_DEVINT`.`Roles`;
DROP TABLE IF EXISTS `CSCI5308_18_DEVINT`.`Prescription`;
DROP TABLE IF EXISTS `CSCI5308_18_DEVINT`.`Users`;
DROP TABLE IF EXISTS `CSCI5308_18_DEVINT`.`Status`;
DROP TABLE IF EXISTS `CSCI5308_18_DEVINT`.`Documents`;