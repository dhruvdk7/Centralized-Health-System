const STATUS_NAME = {
    APPROVED: 'APPROVED',
    PENDING: 'PENDING',
    REJECTED: 'REJECTED'
};

const UserRole = {
    ADMIN: 'ADMIN',
    DOCTOR: 'DOCTOR',
    PHARMACY: 'PHARMACY',
    PATIENT: 'PATIENT',
};

const UserRoleRankMap = {};
UserRoleRankMap[UserRole.PATIENT] = 0;
UserRoleRankMap[UserRole.PHARMACY] = 1;
UserRoleRankMap[UserRole.DOCTOR] = 2;
UserRoleRankMap[UserRole.ADMIN] = 3;

module.exports = {
    STATUS_NAME,
    UserRole,
    UserRoleRankMap,
};