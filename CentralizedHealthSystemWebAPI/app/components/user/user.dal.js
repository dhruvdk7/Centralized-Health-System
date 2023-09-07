class UserDAL {
    async insertUser(dbClient, newUserDetail, currentDateTime) {
        const {
            name,
            email,
            number,
            bloodGroup,
            address,
            password,
            documentId,
            statusId,
            salt,
            isVerified,
            verificationCode,
            dob,
        } = newUserDetail;
        const sqlStmt = `
            INSERT INTO Users
                (
                    name,
                    email,
                    number,
                    bloodGroup,
                    address,
                    password,
                    documentId,
                    statusId,
                    salt,
                    updatedAt,
                    createdAt,
                    isVerified,
                    verificationCode,
                    dob
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const parameters = [
            name,
            email,
            number,
            bloodGroup,
            address,
            password,
            documentId,
            statusId,
            salt,
            currentDateTime,
            currentDateTime,
            isVerified,
            verificationCode,
            dob,
        ];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0].insertId;
    }

    async getUserByEmail(dbClient, email) {
        const sqlStmt = "SELECT userId, name, password, salt, isDeleted FROM Users WHERE email = ?;";
        const parameters = [email];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async getUserByRecoverToken(dbClient, token) {
        const sqlStmt = "SELECT userId FROM Users WHERE recoverToken = ?;";
        const parameters = [token];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async getUserById(dbClient, userId) {
        const sqlStmt = `
            SELECT 
                Users.userId,
                Users.name,
                Users.email,
                Users.number,
                Users.remarks,
                Users.updatedAt,
                Users.createdAt,
                Users.updatedBy,
                Users.bloodGroup,
                Users.dob,
                Users.address,
                Users.isVerified,
                Status.statusName,
                Roles.roleName,
                Documents.file
            FROM
                Users
            JOIN
                Status ON Users.statusId=Status.id
            JOIN
                UserRoleMapping ON UserRoleMapping.userId = Users.userId
            JOIN
                Roles ON Roles.id = UserRoleMapping.roleId
            JOIN
                Documents ON Documents.id=Users.documentId
            WHERE
                Users.userId = ?
            AND
                Users.isDeleted = 0;`;
        const parameters = [userId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async filterUsers(dbClient, status, role, name) {
        let parameters = [];

        let statusFilter = '';
        if (status) {
            statusFilter = `AND Status.statusName = ?`;
            parameters.push(status);
        }
        let roleFilter = '';
        if (role) {
            roleFilter = `AND Roles.roleName = ?`;
            parameters.push(role);
        }
        let nameFilter = '';
        if (name) {
            nameFilter = `AND Users.name LIKE '%${name}%'`;
        }

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
                Users.address,
                Status.statusName,
                Roles.roleName
            FROM
                Status
            JOIN
                Users ON Users.statusId=Status.id
            JOIN
                UserRoleMapping ON UserRoleMapping.userId = Users.userId
            JOIN
                Roles ON Roles.id = UserRoleMapping.roleId
            WHERE
                Users.isVerified = true
            AND
                Users.isDeleted = 0
            ${statusFilter}
            ${roleFilter}
            ${nameFilter};`;
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0];
    }

    async insertUserRoleMapping(dbClient, userId, roleId) {
        const sqlStmt = "INSERT into UserRoleMapping (userId, roleId) VALUES (?, ?);";
        const parameters = [userId, roleId];
        await dbClient.execute(sqlStmt, parameters);
    }

    async getUserStatusIdByName(dbClient, statusName) {
        const sqlStmt = "SELECT id FROM Status WHERE statusName = ?;";
        const parameters = [statusName];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        if (!queryResult[0][0]) throw new Error('INVALID_STATUS_NAME');
        return queryResult[0][0];
    }

    async getRoleByName(dbClient, roleName) {
        const sqlStmt = "SELECT id FROM Roles WHERE roleName = ?;";
        const parameters = [roleName];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async addDocument(dbClient, documentData) {
        const sqlStmt = "INSERT into Documents (file, fileType) VALUES (?, '.pdf');";
        const parameters = [documentData];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0].insertId;
    }

    async getUserDetailsByID(dbClient, userId) {
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
                Users.address,
                Users.isVerified,
                Status.statusName,
                Documents.id AS documentId,
                Documents.file
            FROM 
                Users
            JOIN
                Status ON Status.id = Users.statusId
            JOIN
                Documents ON Documents.id = Users.documentId
            WHERE
                Users.userId = ?
            AND
                Users.isDeleted = 0;`;
        const parameters = [userId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async updateUserStatus(dbClient, userId, statusId, remarks = null) {
        const sqlStmt = `
            UPDATE
                Users
            SET
                statusId = ?,
                remarks = ?
            WHERE
                userId = ?;`;
        const parameters = [statusId, remarks, userId];
        await dbClient.execute(sqlStmt, parameters);
    }

    async getUserRoleByUserId(dbClient, userId) {
        const sqlStmt = `
            SELECT
                Roles.id,
                Roles.roleName
            FROM
                UserRoleMapping
            JOIN
                Roles ON Roles.id = UserRoleMapping.roleId    
            WHERE
                UserRoleMapping.userId = ?;`;
        const parameters = [userId];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async getUserByVerificationCode(dbClient, verificationCode) {
        const sqlStmt = `
            SELECT
                userId,
                email
            FROM
                Users
            WHERE
                verificationCode = ?;`;
        const parameters = [verificationCode];
        const queryResult = await dbClient.execute(sqlStmt, parameters);
        return queryResult[0][0];
    }

    async updateUserVerificationStatus(dbClient, userId) {
        const sqlStmt = `
            UPDATE
                Users
            SET
                isVerified = true
            WHERE
                userId = ?;`;
        const parameters = [userId];
        await dbClient.execute(sqlStmt, parameters);
    }

    async softDeleteUserById(dbClient, userId) {
        const sqlStmt = `
            UPDATE
                Users
            SET
                isDeleted = true
            WHERE
                userId = ?;`;
        const parameters = [userId];
        await dbClient.execute(sqlStmt, parameters);
    }

    async updateRecoverTokenById(dbClient, userId, recoverToken) {
        const sqlStmt = `
            UPDATE
                Users
            SET
                recoverToken = ?
            WHERE
                userId = ?;`;
        const parameters = [recoverToken, userId];
        await dbClient.execute(sqlStmt, parameters);
    }

    async resetUserPassword(dbClient, userId, updateUserDetails) {
        const { password, salt, recoverToken } = updateUserDetails;
        const sqlStmt = `
            UPDATE
                Users
            SET
                password = ?,
                salt = ?,
                recoverToken = ?
            WHERE
                userId = ?;`;
        const parameters = [password, salt, recoverToken, userId];
        await dbClient.execute(sqlStmt, parameters);
    }
}

module.exports = UserDAL;