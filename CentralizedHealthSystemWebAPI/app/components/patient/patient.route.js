const express = require('express');

const { validateUserPermission } = require('../../helpers/validatePermissions');
const { authenticateJwt } = require('../../helpers/jwt');

const { validate } = require('../../lib/expressValidation');
const { UserRole } = require('../../constants');
const patientController = require('./patient.controller');
const patientValidation = require('./patient.validation');

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


/**
 * @swagger
 *  definitions:
 *      updatePatientReq:
 *          type: object
 *          properties:
 *              name:
 *                  type: string 
 *              phoneNumber:
 *                  type: string
 *              address:
 *                  type: string
 *              bloodGroup:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /patient/{patientId}:
 *   put:
 *     description: Update Patient details
 *     tags:
 *       - Patient
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       required: true
 *       type: string
 *     - name: patientId
 *       description:  PATIENT ID
 *       in: path
 *       required: true
 *       type: integer
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/updatePatientReq'
 *     responses:
 *       204:
 *         description: Ok
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
 */

/**
 * @swagger
 *  definitions:
 *      getPatientRes:
 *          type: object
 *          properties:
 *              patientName:
 *                  type: string
 *              phoneNumber:
 *                  type: string
 *              bloodGroup:
 *                  type: string
 *              address:
 *                  type: string
 *              DOB:
 *                  type: string
 *              patientId:
 *                  type: string
 *              document:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /patient/{patientId}:
 *   get:
 *     description: Get Patient details
 *     tags:
 *       - Patient
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       required: true
 *       type: string
 *     - name: patientId
 *       description: Patient ID
 *       in: path
 *       required: true
 *       type: integer
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/getPatientRes'
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
 *       403:
 *         description: DOCTOR_PERMISSION_DENIED
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 */


router.route('/:patientId')
    .get(
        authenticateJwt,
        validateUserPermission(UserRole.PATIENT),
        validate(patientValidation.getPatientDetailsById),
        patientController.getPatientDetailsById.bind(patientController),
    )
    .put(
        authenticateJwt,
        validateUserPermission(UserRole.PATIENT),
        validate(patientValidation.updatePatienDetails),
        patientController.updatePatientDetails.bind(patientController),
    )

/**
 * @swagger
 *  definitions:
 *      getPatientPrescriptions:
 *          type: array
 *          items:
 *              type: object
 *              properties:
 *                  prescriptionId:
 *                      type: number
 *                  doctorId:
 *                      type: number
 *                  doctorName:
 *                      type: string
 *                  details:
 *                      type: string
 *                  createdAt:
 *                      type: string
 *                  updatedAt:
 *                      type: string
 * */

/**
 * @swagger
 *
 * /patient/{patientId}/prescriptions:
 *   get:
 *     description: Get Patient Prescriptions
 *     tags:
 *       - Patient
 *     parameters:
 *     - name: Authorization
 *       in: headers
 *       required: true
 *       type: string
 *     - name: patientId
 *       description: Patient ID
 *       in: path
 *       required: true
 *       type: integer
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/getPatientPrescriptions'
 *       401:
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 *       404:
 *          description: Patient not found
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 *       500:
 *         description: Internal server error
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 */

router.route('/:patientId/prescriptions')
    .get(
        authenticateJwt,
        validateUserPermission(UserRole.PATIENT),
        validate(patientValidation.getPatientPrescriptions),
        patientController.getPatientPrescriptions.bind(patientController),
    )

module.exports = router;