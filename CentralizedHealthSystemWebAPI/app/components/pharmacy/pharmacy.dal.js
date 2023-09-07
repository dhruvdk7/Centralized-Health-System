class PharmacyDAL {
    async getUserDetails(dbClient, userId) {
        const sqlStmt = `
            SELECT
                Users.name AS name,
                Users.email AS email,
                Users.number AS number,
                Users.bloodGroup as bloodGroup,
                Users.address as address,
                Prescription.PatientId as patientId
            FROM
                Prescription
            JOIN
                Users ON Prescription.patientId = Users.userId
            WHERE
                Users.userId=?
            AND
                Users.isDeleted = 0;`;
        const parameters = [userId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }
    async getUserDetailsWithoutPrescription(dbClient, userId) {
        const sqlStmt = `
            SELECT
                Users.name AS name,
                Users.email AS email,
                Users.number AS number,
                Users.bloodGroup as bloodGroup,
                Users.address as address
            FROM
                Users
            WHERE
                userId=?
            AND
                Users.isDeleted = 0;`;
        const parameters = [userId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async getPrescriptionDetails(dbClient, patientId) {
        const sqlStmt = `
            SELECT
                Prescription.id AS prescriptionId,
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
                patientId=?
            ORDER BY
                Prescription.updatedAt DESC
            LIMIT 
                3`;
        const parameters = [patientId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0];
    }
}

module.exports = PharmacyDAL;
