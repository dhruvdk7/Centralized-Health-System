class DoctorDAL {
    async getPatientDetailsById(dbClient, patientId, role) {
        const sqlStmt = `
            SELECT
                Users.userId,
                Users.email,
                Users.name,
                Users.number,
                Users.qrcode,
                Users.remarks,
                Users.updatedAt,
                Users.createdAt,
                Users.updatedBy,
                Users.bloodGroup,
                Users.dob,
                Users.address
            FROM 
                Users
            JOIN
                UserRoleMapping ON UserRoleMapping.userId = Users.userId
            JOIN
                Roles ON Roles.id = UserRoleMapping.roleId
            WHERE
                Users.userId = ?
            AND
                Roles.roleName = ?
            AND
                Users.isDeleted = 0;`;
        const parameters = [patientId, role];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async getPatientPrescriptionDetails(dbClient, patientId, limit = 5) {
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
            ORDER BY Prescription.createdAt DESC
                LIMIT ?;`;
        const parameters = [patientId, limit];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0];
    }

    async filterPatient(dbClient, filterRequest, role, userId) {
        const parameters = [role];

        const { myPatient, searchId } = filterRequest;

        let myPatientFilter = '';
        let prescriptionJoin = '';
        if (myPatient) {
            prescriptionJoin = 'JOIN Prescription ON Prescription.patientId = Users.userId';
            myPatientFilter = `AND Prescription.doctorId = ?`;
            parameters.push(userId);
        }

        let patientIdFilter = '';
        if (searchId) {
            patientIdFilter = `AND Users.userId = ?`;
            parameters.push(searchId);
        }

        const sqlStmt = `
            SELECT
                Users.userId,
                Users.name,
                Users.email,
                Users.number,
                Users.qrcode,
                Users.remarks,
                Users.updatedAt,
                Users.createdAt,
                Users.bloodGroup,
                Users.dob
            FROM
                Users
            JOIN
                UserRoleMapping ON UserRoleMapping.userId = Users.userId
            JOIN
                Roles ON Roles.id = UserRoleMapping.roleId
            ${prescriptionJoin}
            WHERE
                Roles.roleName = ?
                AND Users.isDeleted = 0
                ${myPatientFilter}
                ${patientIdFilter}
            GROUP BY
                Users.userId;`;
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0];
    }
}

module.exports = DoctorDAL;
