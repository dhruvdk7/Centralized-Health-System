const express = require('express');
const pharmacyController = require('./pharmacy.controller');
const pharmacyValidation = require('./pharmacy.validation');

const { authenticateJwt } = require('../../helpers/jwt');
const { UserRole } = require('../../constants');
const { validate } = require('../../lib/expressValidation');
const { validateUserPermission } = require('../../helpers/validatePermissions');



const router = express.Router();

/**
 * @swagger
 * securityDefinitions:
 *      bearerAuth:
 *          type: apikey
 *      name: Authorization
 *      in: header
 * */

/**
 * @swagger
 * bearerAuth: []
 * */

/**
 * @swagger
 *  definitions:
 *      errorRes:
 *          type: object
 *          properties:
 *              code:
 *                  type: string
 *              message:
 *                  type: string
 * */

router.route('/prescription/:userId')
    .get(
        authenticateJwt,
        validateUserPermission(UserRole.PHARMACY),
        validate(pharmacyValidation.getPrescriptionDetailsById),
        pharmacyController.getPrescriptionById.bind(pharmacyController),
    );

/**
 * @swagger
 *  definitions:
 *      getPrescriptionDetailsRes:
 *          type: object
 *          properties:
 *              PatientName:
 *                  type: string
 *              PatientEmail:
 *                  type: string
 *              PhoneNumber:
 *                  type: string
 *              BloodGroup:
 *                  type: string
 *              Address:
 *                  type: string
 *              PatientId:
 *                  type: number
 *              prescriptionDetails:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          PrescriptionId:
 *                              type: number
 *                          doctorId:
 *                              type: number
 *                          doctorName:
 *                              type: string
 *                          details:
 *                              type: string
 *                          createdAt:
 *                              type: string
 *                          updatedAt:
 *                              type: string
 * */


/**
 * @swagger
 *
 * /pharmacy/{prescriptionId}:
 *   get:
 *     description: Get user details for Pharmacy
 *     tags:
 *       - Pharmacy
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       required: true
 *       type: string
 *     - name: prescriptionId
 *       description: Prescription ID
 *       in: path
 *       required: true
 *       type: integer
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/getPrescriptionDetailsRes'
 *       401:
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 *       500:
 *         description: Internal server error
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 *       404:
 *         description: Prescription Not Found Error
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 */

module.exports = router;