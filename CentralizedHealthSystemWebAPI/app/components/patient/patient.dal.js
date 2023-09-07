class PatientDAL {
    async getPatientDetailsById(dbClient, patientId) {
        const sqlStmt = `
            SELECT
                Users.userId AS patientId,
                Users.name AS patientName,
                Users.email AS patientEmail,
                Users.number AS phoneNumber,
                Users.bloodGroup as bloodGroup,
                Users.address as address,
                Users.DOB as DOB,
                Documents.file as document
            FROM
                Users
            JOIN
                Documents on Documents.id = Users.documentId
            WHERE
                Users.userId=?
            AND
                Users.isDeleted=0`;
        const parameters = [patientId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async getPatientPrescriptionDetails(dbClient, patientId) {
        const sqlStmt = `
            SELECT
                Prescription.id AS prescriptionId,
                Users.userId AS doctorId,
                Users.name AS doctorName,
                Prescription.details,
                Prescription.createdAt,
                Prescription.updatedAt
            FROM
                Prescription
            JOIN
                Users ON Users.userId = Prescription.doctorId
            WHERE
                Prescription.patientId = ?
            ORDER BY Prescription.createdAt DESC;`;
        const parameters = [patientId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0];
    }

    async updatePatientDetails(dbClient, patientId, requestBody) {
        const { name, number, bloodGroup, address } = requestBody;
        let parameters = [];

        let updateName = '';
        if (name) {
            updateName = `name = ?,`
            parameters.push(name);
        }
        let updateNumber = '';
        if (number) {
            updateNumber = `number = ?,`;
            parameters.push(number);
        }
        let updateBloodGroup = '';
        if (bloodGroup) {
            updateBloodGroup = `bloodGroup = ?,`;
            parameters.push(bloodGroup);
        }
        let updateAddress = '';
        if (address) {
            updateAddress = 'address = ?,';
            parameters.push(address);
        }

        parameters.push(patientId);

        const sqlStmt = `
            UPDATE
                Users
            SET
                ${updateName}
                ${updateNumber}
                ${updateBloodGroup}
                ${updateAddress}
                isDeleted = 0
            WHERE
                userId = ?;`;
        await dbClient.execute(sqlStmt, parameters);
    }
}

module.exports = PatientDAL;
