-- migrate:up

CREATE TABLE IF NOT EXISTS `CSCI5308_18_DEVINT`.`PrescriptionMedicineMapping` (
    `id` INT NOT NULL auto_increment,
    `prescriptionId` INT NOT NULL,
    `medicineName` VARCHAR(50) NOT NULL,
    `medicineQuantity` INT NOT NULL,
    `note` VARCHAR(100) NULL,
    PRIMARY KEY (`id`),
    INDEX `prescriptionId_idx` (`prescriptionId` ASC) ,
    CONSTRAINT `fk_prescription_has_medicines`
    FOREIGN KEY (`prescriptionId`)
    REFERENCES `CSCI5308_18_DEVINT`.`Prescription` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- migrate:down

DROP TABLE IF EXISTS `CSCI5308_18_DEVINT`.`PrescriptionMedicineMapping`;
