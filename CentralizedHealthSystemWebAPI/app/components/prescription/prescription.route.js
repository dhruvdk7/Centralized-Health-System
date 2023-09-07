const express = require('express');
const { validate } = require('../../lib/expressValidation');
const { UserRole } = require('../../constants');
const { authenticateJwt } = require('../../helpers/jwt');
const { validateUserPermission } = require('../../helpers/validatePermissions');

const prescriptionController = require('./prescription.controller');
const prescriptionValidation = require('./prescription.validation');

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
 *  * @swagger
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
 *        insertPrescriptionReq:
 *          type: object
 *          properties:
 *              patientId:
 *                  type: string
 *              details:
 *                  type: string
 *
 * */

/**
 * @swagger
 *  definitions:
 *      insertPrescriptionRes:
 *          type: object
 *          properties:
 *              prescriptionId:
 *                  type: string
 * */

/**

 * @swagger
 *
 * /prescription:
 *   post:
 *     description: Insert Prescription
 *     tags:
 *       - Prescription
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/insertPrescriptionReq'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/insertPrescriptionRes'
 *       403:
 *         description: DOCTOR_PERMISSION_DENIED
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


router.route('/')
    .post(
        authenticateJwt,
        validateUserPermission(UserRole.DOCTOR),
        validate(prescriptionValidation.createPrescription),
        prescriptionController.createPrescription.bind(prescriptionController),
    );

/**
 * @swagger
 *  definitions:
 *      updatePrescriptionReq:
 *          type: object
 *          properties:
 *              details:
 *                  type: string
 *              medicines:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          medicineName:
 *                              type: string
 *                          medicineQuantity:
 *                              type: number
 *                          note:
 *                              type: string
 * */

/**
 * @swagger
 *
 * /prescription/{prescriptionId}:
 *   put:
 *     description: Update Prescription details
 *     tags:
 *       - Prescription
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       required: true
 *       type: string
 *     - name: prescriptionId
 *       description: PRESCRIPTION ID
 *       in: path
 *       required: true
 *       type: integer
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/updatePrescriptionReq'
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
 *       403:
 *         description: DOCTOR_PERMISSION_DENIED
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 */

/**
 * @swagger
 *  definitions:
 *      getPrescriptionRes:
 *          type: object
 *          properties:
 *              prescriptionId:
 *                  type: number
 *              patientId:
 *                  type: string
 *              name:
 *                  type: string
 *              details:
 *                  type: string
 *              DoctorName:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /prescription/{prescriptionId}:
 *   get:
 *     description: Get prescription details
 *     tags:
 *       - Prescription
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
 *                      $ref: '#definitions/getPrescriptionRes'
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

/**
 * @swagger
 *
 * /prescription/{prescriptionId}:
 *   delete:
 *     description: Delete prescription details
 *     tags:
 *       - Prescription
 *     parameters:
 *     - name: Authorization
 *       in: headers
 *       required: true
 *       type: string
 *     - name: prescriptionId
 *       description: Prescription ID
 *       in: path
 *       required: true
 *       type: integer
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
 *       403:
 *         description: DOCTOR_PERMISSION_DENIED
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 */

router.route('/:prescriptionId')
    .put(
        authenticateJwt,
        validateUserPermission(UserRole.DOCTOR),
        validate(prescriptionValidation.updatePrescription),
        prescriptionController.updatePrescriptionDetails.bind(prescriptionController),
    )
    .delete(
        authenticateJwt,
        validateUserPermission(UserRole.DOCTOR),
        validate(prescriptionValidation.deletePrescriptionById),
        prescriptionController.deletePrescription.bind(prescriptionController),
    )
    .get(
        authenticateJwt,
        validateUserPermission(UserRole.PATIENT),
        validate(prescriptionValidation.getPrescriptionById),
        prescriptionController.getPrescriptionById.bind(prescriptionController),
    )

module.exports = router;
