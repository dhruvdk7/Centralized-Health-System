const generateMedicinesParameters = (medicines, prescriptionId) => {
    const medicineParameters = [];
    const parameterValues = [];
    medicines.forEach((medicine) => {
        const parameterisedString = `(?, ?, ?, ?)`;
        medicineParameters.push(parameterisedString);

        parameterValues.push(prescriptionId);
        parameterValues.push(medicine.medicineName);
        parameterValues.push(medicine.medicineQuantity);
        parameterValues.push(medicine.note);
    });
    const strParameterNames = medicineParameters.join();
    return { strParameterNames, parameterValues };
};

class PrescriptionDAL {
    async insertPrescription(dbClient, doctorId, newPrescriptionDetail, currentDateTime) {
        const {
            patientId,
            details
        } = newPrescriptionDetail;
        const sqlStmt = "INSERT INTO Prescription (createdAt, updatedAt, patientId, doctorId, details) VALUES (?, ?, ?, ?, ?);";
        const parameters = [
            currentDateTime,
            currentDateTime,
            patientId,
            doctorId,
            details
        ];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0].insertId;
    }

    async insertPrescriptionMedicines(dbClient, prescriptionId, medicines) {
        const {
            strParameterNames,
            parameterValues,
        } = generateMedicinesParameters(medicines, prescriptionId);

        const sqlStmt = `
            INSERT INTO PrescriptionMedicineMapping
                (prescriptionId, medicineName, medicineQuantity, note)
            VALUES
                ${strParameterNames};`;
        await dbClient.query(sqlStmt, parameterValues);
    }

    async deletePrescription(dbClient, prescriptionId) {
        const sqlStmt = `DELETE FROM Prescription WHERE id=?;`;
        const parameters = [prescriptionId];
        await dbClient.execute(sqlStmt, parameters);
    }

    async deletePrescriptionMedicines(dbClient, prescriptionId) {
        const sqlStmt = `DELETE FROM PrescriptionMedicineMapping WHERE prescriptionId=?;`;
        const parameters = [prescriptionId];
        await dbClient.execute(sqlStmt, parameters);
    }

    async updatePrescriptionDetails(dbClient, prescriptionId, currentDateTime, details = null) {
        const sqlStmt = `
            UPDATE
                Prescription
            SET
                updatedAt=?,
                details=?
            WHERE
                id=?;`;
        const parameters = [currentDateTime, details, prescriptionId];
        await dbClient.execute(sqlStmt, parameters);
    }

    async getPrescriptionById(dbClient, prescriptionId) {
        const sqlStmt = `
            SELECT
                Prescription.id,
                Prescription.doctorId,
                Users.name AS doctorName,
                Prescription.details,
                Prescription.createdAt,
                Prescription.updatedAt
            FROM
                Prescription
            JOIN
                Users ON Prescription.doctorId = Users.userId
            WHERE
                Prescription.id=?`;
        const parameters = [prescriptionId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async getPrescriptionMedicines(dbClient, prescriptionId) {
        const sqlStmt = `
            SELECT
                id AS medicineId,
                medicineName,
                medicineQuantity,
                note
            FROM
                PrescriptionMedicineMapping
            WHERE
                prescriptionId=?`;
        const parameters = [prescriptionId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0];
    }
}
module.exports = PrescriptionDAL;
