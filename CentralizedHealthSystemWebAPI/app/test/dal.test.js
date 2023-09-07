const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const DoctorDAL = require('../components/doctor/doctor.dal');
const PatientDAL = require('../components/patient/patient.dal');
const PharmacyDAL = require('../components/pharmacy/pharmacy.dal');
const PrescriptionDAL = require('../components/prescription/prescription.dal');
const UserDAL = require('../components/user/user.dal');


describe('DoctorDAL', () => {
    let doctorDAL;
    let dbClient;

    beforeEach(() => {
        doctorDAL = new DoctorDAL();
        dbClient = {
            execute: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getPatientDetailsById', () => {
        it('Should return patient details for given patient ID and role', async() => {
            const patientId = 1;
            const role = 'PATIENT';
            const expectedResult = {};
            dbClient.execute.resolves([
                [expectedResult]
            ]);
            const result = await doctorDAL.getPatientDetailsById(dbClient, patientId, role);
            expect(result).to.equal(expectedResult);
        });
    });

    describe('getPatientPrescriptionDetails', () => {
        it('Should return prescription details for given patient ID and limit', async() => {
            const patientId = 1;
            const limit = 5;
            const expectedResult = [];
            dbClient.execute.resolves([expectedResult]);
            const result = await doctorDAL.getPatientPrescriptionDetails(dbClient, patientId, limit);
            expect(result).to.equal(expectedResult);
        });
    });

    describe('filterPatient', () => {
        it('Should return filtered patients based on filter request, role, and user ID', async() => {
            const filterRequest = {
                myPatient: true,
                searchId: 2
            };
            const role = 'Patient';
            const userId = 1;
            const expectedResult = [];
            dbClient.execute.resolves([expectedResult]);
            const result = await doctorDAL.filterPatient(dbClient, filterRequest, role, userId);
            expect(result).to.equal(expectedResult);
        });
    });
});

describe('PatientDAL', () => {
    let patientDAL;
    let dbClient;

    beforeEach(() => {
        patientDAL = new PatientDAL();
        dbClient = {
            execute: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getPatientDetailsById', () => {
        it('Should return patient details for given patient ID', async() => {
            const patientId = 1;
            const expectedResult = {};
            dbClient.execute.resolves([
                [expectedResult]
            ]);
            const result = await patientDAL.getPatientDetailsById(dbClient, patientId);
            expect(result).to.equal(expectedResult);
        });
    });

    describe('getPatientPrescriptionDetails', () => {
        it('Should return prescription details for given patient ID', async() => {
            const patientId = 1;
            const expectedResult = [];
            dbClient.execute.resolves([expectedResult]);
            const result = await patientDAL.getPatientPrescriptionDetails(dbClient, patientId);
            expect(result).to.equal(expectedResult);
        });
    });

    describe('updatePatientDetails', () => {
        it('Should update patient details for given patient ID and request body', async() => {
            const patientId = 1;
            const requestBody = {
                name: 'Updated Name',
                number: '1234567890',
                bloodGroup: 'B+',
                address: 'Updated Address'
            };
            dbClient.execute.resolves();
            await patientDAL.updatePatientDetails(dbClient, patientId, requestBody);
        });
    });
});

describe('PharmacyDAL', () => {
    let pharmacyDAL;
    let dbClient;

    beforeEach(() => {
        pharmacyDAL = new PharmacyDAL();
        dbClient = {
            execute: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getUserDetails', () => {
        it('Should return user details for given user ID', async() => {
            const userId = 1;
            const expectedResult = {};
            dbClient.execute.resolves([
                [expectedResult]
            ]);
            const result = await pharmacyDAL.getUserDetails(dbClient, userId);
            expect(result).to.equal(expectedResult);
        });
    });

    describe('getUserDetailsWithoutPrescription', () => {
        it('Should return user details without prescription for given user ID', async() => {
            const userId = 1;
            const expectedResult = {};
            dbClient.execute.resolves([
                [expectedResult]
            ]);
            const result = await pharmacyDAL.getUserDetailsWithoutPrescription(dbClient, userId);
            expect(result).to.equal(expectedResult);
        });
    });

    describe('getPrescriptionDetails', () => {
        it('Should return prescription details for given patient ID', async() => {
            const patientId = 1;
            const expectedResult = [];
            dbClient.execute.resolves([expectedResult]);
            const result = await pharmacyDAL.getPrescriptionDetails(dbClient, patientId);
            expect(result).to.equal(expectedResult);
        });
    });
});

describe('PrescriptionDAL', () => {
    let prescriptionDAL;
    let dbClient;

    beforeEach(() => {
        prescriptionDAL = new PrescriptionDAL();
        dbClient = {
            execute: sinon.stub(),
            query: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('insertPrescription', () => {
        it('Should insert a new prescription and return the insert ID', async() => {
            const doctorId = 1;
            const newPrescriptionDetail = {
                patientId: 1,
                details: 'Test details'
            };
            const currentDateTime = new Date();
            const insertId = 1;
            dbClient.execute.resolves([{ insertId }]);
            const result = await prescriptionDAL.insertPrescription(dbClient, doctorId, newPrescriptionDetail, currentDateTime);
            expect(result).to.equal(insertId);
        });
    });

    describe('insertPrescriptionMedicines', () => {
        it('Should insert prescription medicines', async() => {
            const prescriptionId = 1;
            const medicines = [
                { medicineName: 'Medicine 1', medicineQuantity: 2, note: 'Note 1' },
                { medicineName: 'Medicine 2', medicineQuantity: 3, note: 'Note 2' },
            ];
            dbClient.query.resolves();
            await prescriptionDAL.insertPrescriptionMedicines(dbClient, prescriptionId, medicines);
        });
    });

    describe('deletePrescription', () => {
        it('Should delete a prescription', async() => {
            const prescriptionId = 1;
            dbClient.execute.resolves();
            await prescriptionDAL.deletePrescription(dbClient, prescriptionId);
        });
    });

    describe('deletePrescriptionMedicines', () => {
        it('Should delete prescription medicines', async() => {
            const prescriptionId = 1;
            dbClient.execute.resolves();
            await prescriptionDAL.deletePrescriptionMedicines(dbClient, prescriptionId);
        });
    });

    describe('updatePrescriptionDetails', () => {
        it('Should update prescription details', async() => {
            const prescriptionId = 1;
            const currentDateTime = new Date();
            const details = 'Updated details';
            dbClient.execute.resolves();
            await prescriptionDAL.updatePrescriptionDetails(dbClient, prescriptionId, currentDateTime, details);
        });
    });

    describe('getPrescriptionById', () => {
        it('Should get prescription by ID', async() => {
            const prescriptionId = 1;
            const mockPrescription = {
                id: prescriptionId,
                doctorId: 1,
                doctorName: 'Doctor 1',
                details: 'test details',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            dbClient.execute.resolves([
                [mockPrescription]
            ]);
            const result = await prescriptionDAL.getPrescriptionById(dbClient, prescriptionId);
            expect(result).to.equal(mockPrescription);
        });
    });

    describe('getPrescriptionMedicines', () => {
        it('Should get prescription medicines', async() => {
            const prescriptionId = 1;
            const mockPrescriptionMedicines = [
                { medicineId: 1, medicineName: 'Medicine 1', medicineQuantity: 2, note: 'Take twice a day' },
                { medicineId: 2, medicineName: 'Medicine 2', medicineQuantity: 3, note: 'Take thrice a day' },
            ];
            dbClient.execute.resolves([mockPrescriptionMedicines]);
            const result = await prescriptionDAL.getPrescriptionMedicines(dbClient, prescriptionId);
            expect(result).to.equal(mockPrescriptionMedicines);
        });
    });

    describe('UserDAL', () => {
        let userDAL;
        let dbClient;

        beforeEach(() => {
            userDAL = new UserDAL();
            dbClient = {
                execute: sinon.stub(),
                query: sinon.stub()
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        describe('getUserByEmail', () => {
            it('Should get user by email', async () => {
                const email = 'test@dal.com';
                const mockUser = {
                    userId: 1,
                    name: 'Test User',
                    password: 'test#123',
                    salt: 'salt',
                    isDeleted: 0
                };
                dbClient.execute.resolves([[mockUser]]);
                const result = await userDAL.getUserByEmail(dbClient, email);
                expect(result).to.equal(mockUser);
            });
        });

        describe('getUserById', () => {
            it('should get user by ID', async () => {
                const userId = 1;
                const mockUser = {
                    userId: 1,
                    name: 'Test user',
                    email: 'test@dal.com',
                    number: '1234567890',
                    remarks: 'Test remarks',
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    updatedBy: 2,
                    bloodGroup: 'A+',
                    dob: 'Test date',
                    address: 'Test address',
                    isVerified: true,
                    statusName: 'APPROVED',
                    roleName: 'ADMIN',
                    file: 'test document'
                };
                dbClient.execute.resolves([[mockUser]]);
                const result = await userDAL.getUserById(dbClient, userId);
                expect(result).to.equal(mockUser);
            });
        });

        describe('getUserByRecoverToken', () => {
            it('should get user by recover token', async () => {
                const token = '123456';
                const mockUser = {
                    userId: 1
                };
                dbClient.execute.resolves([[mockUser]]);
                const result = await userDAL.getUserByRecoverToken(dbClient, token);
                expect(result).to.deep.equal(mockUser);
            });
        });

        describe('insertUser', () => {
            it('Should insert a new user and return the inserted userId', async () => {
                const newUserDetail = {
                    name: 'Test name',
                    email: 'test@dal.com',
                    number: '1234567890',
                    bloodGroup: 'A+',
                    address: 'Test address',
                    password: 'test#123',
                    documentId: 1,
                    statusId: 1,
                    salt: 'SALT',
                    isVerified: false,
                    verificationCode: '123456',
                    dob: 'Test date',
                };
                const currentDateTime = '2023-04-09 12:00:00';
                const mockInsertId = 1;
                dbClient.execute.resolves([{ insertId: mockInsertId }]);
                const result = await userDAL.insertUser(dbClient, newUserDetail, currentDateTime);
                expect(result).to.equal(mockInsertId);
            });
        });

        describe('filterUsers', () => {
            it('Should filter users based on status, role, and name', async () => {
                const status = 'APPROVED';
                const role = 'ADMIN';
                const name = 'Test User';

                const mockFilteredUsers = [
                    {
                        userId: 1,
                        email: 'test1@dal.com',
                        name: 'Test User 1',
                    },
                    {
                        userId: 2,
                        email: 'Test2@dal.com',
                        name: 'Test User 2',
                    }
                ];
                dbClient.execute.resolves([mockFilteredUsers]);
                const result = await userDAL.filterUsers(dbClient, status, role, name);
                expect(result).to.equal(mockFilteredUsers);
            });
        });

        describe('insertUserRoleMapping', () => {
            it('Should insert a user role mapping', async () => {
                const userId = 1;
                const roleId = 2;
                dbClient.execute.resolves();
                await userDAL.insertUserRoleMapping(dbClient, userId, roleId);
            });
        });

        describe('getUserStatusIdByName', () => {
            it('Should return the status ID for a given status name', async () => {
                const statusName = 'APPROVED';
                const mockStatusId = {
                    id: 1,
                };
                dbClient.execute.resolves([[mockStatusId]]);
                const result = await userDAL.getUserStatusIdByName(dbClient, statusName);
                expect(result).to.equal(mockStatusId);
            });
        });

        describe('getRoleByName', () => {
            it('Should return the role ID for a given role name', async () => {
                const roleName = 'ADMIN';
                const mockRoleId = {
                    id: 2,
                };
                dbClient.execute.resolves([[mockRoleId]]);
                const result = await userDAL.getRoleByName(dbClient, roleName);
                expect(result).to.equal(mockRoleId);
            });
        });

        describe('addDocument', () => {
            it('Should add a document and return the inserted document ID', async () => {
                const documentData = 'test document';
                const mockInsertId = 1;
                dbClient.execute.resolves([{ insertId: mockInsertId }]);
                const result = await userDAL.addDocument(dbClient, documentData);
                expect(result).to.equal(mockInsertId);
            });
        });

        describe('getUserDetailsByID', () => {
            it('Should return user details by ID', async () => {
                const mockUserId = 1;
                const mockUserDetails = { userId: mockUserId, name: 'Test User' };
                dbClient.execute.resolves([[mockUserDetails]]);
                const result = await userDAL.getUserDetailsByID(dbClient, mockUserId);
                expect(result).to.equal(mockUserDetails);
            });
        });

        describe('updateUserStatus', () => {
            it('should update user status', async () => {
                const userId = 1;
                const statusId = 2;
                const remarks = 'Test Remarks';
                dbClient.execute.resolves();
                await userDAL.updateUserStatus(dbClient, userId, statusId, remarks);
            });
        });

        describe('getUserRoleByUserId', () => {
            it('Should return the user role by user ID', async () => {
                const userId = 1;
                const mockRole = { id: 2, roleName: 'ADMIN' };
                dbClient.execute.resolves([[mockRole]]);
                const result = await userDAL.getUserRoleByUserId(dbClient, userId);
                expect(result).to.equal(mockRole);
            });
        });

        describe('getUserByVerificationCode', () => {
            it('Should return user details by verification code', async () => {
                const mockVerificationCode = '123456';
                const mockUserDetails = { userId: 1, email: 'test@dal.ca' };
                dbClient.execute.resolves([[mockUserDetails]]);
                const result = await userDAL.getUserByVerificationCode(dbClient, mockVerificationCode);
                expect(result).to.equal(mockUserDetails);
            });
        });

        describe('softDeleteUserById', () => {
            it('Should soft delete user by ID', async () => {
                const userId = 1;
                dbClient.execute.resolves();
                await userDAL.softDeleteUserById(dbClient, userId);
            });
        });

        describe('updateRecoverTokenById', () => {
            it('Should update recover token by user ID', async () => {
                const userId = 1;
                const recoverToken = '123456';
                dbClient.execute.resolves();
                await userDAL.updateRecoverTokenById(dbClient, userId, recoverToken);
            });
        });

        describe('resetUserPassword', () => {
            it('Should reset user password', async () => {
                const userId = 1;
                const updateUserDetails = {
                    password: 'password',
                    salt: 'salt',
                    recoverToken: null,
                };
                dbClient.execute.resolves();
                await userDAL.resetUserPassword(dbClient, userId, updateUserDetails);
            });
        });
    });
});
