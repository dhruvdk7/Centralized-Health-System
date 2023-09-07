const express = require("express");
const { validate } = require("../../lib/expressValidation");
const { UserRole } = require("../../constants");
const { authenticateJwt } = require("../../helpers/jwt");
const { validateUserPermission } = require("../../helpers/validatePermissions");

const doctorController = require("./doctor.controller");
const doctorValidation = require("./doctor.validation");

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
 *      patientFilterReq:
 *          type: object
 *          properties:
 *              searchId:
 *                  type: number
 *              myPatient:
 *                  type: boolean
 * */

/**
 * @swagger
 *  definitions:
 *      patientFilterRes:
 *          type: array
 *          items:
 *              type: object
 *              properties:
 *                  userId:
 *                      type: number
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  number:
 *                      type: string
 *                  qrcode:
 *                      type: string
 *                  remarks:
 *                      type: string
 *                  updatedAt:
 *                      type: string
 *                  createdAt:
 *                      type: string
 *                  updatedBy:
 *                      type: string
 *                  bloodGroup:
 *                      type: string
 *                  dob:
 *                      type: string
 * */

/**
 * @swagger
 *
 * /doctor/filter:
 *   post:
 *     description: Filter patients
 *     tags:
 *       - Doctor
 *     parameters:
 *     - name: Authorization
 *       in: headers
 *       required: true
 *       type: string
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/patientFilterReq'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/patientFilterRes'
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

router.route('/filter')
    .post(
        authenticateJwt,
        validateUserPermission(UserRole.PHARMACY),
        validate(doctorValidation.filterPatient),
        doctorController.filterPatient.bind(doctorController),
    );

/**
 * @swagger
 *  definitions:
 *      sendSignupUserMailReq:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              email:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /doctor/create-user:
 *   post:
 *     description: Send mail to user for sign up and complete the profile
 *     tags:
 *       - Doctor
 *     parameters:
 *     - name: Authorization
 *       in: headers
 *       required: true
 *       type: string
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/sendSignupUserMailReq'
 *     responses:
 *       204:
 *         description: Ok
 *       401:
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 *       409:
 *          description: Email is taken
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
router.route('/create-user')
    .post(
        authenticateJwt,
        validateUserPermission(UserRole.DOCTOR),
        validate(doctorValidation.sendSignupUserMail),
        doctorController.sendSignupUserMail.bind(doctorController),
    )

/**
 * @swagger
 *  definitions:
 *      getPatientDetailsRes:
 *          type: object
 *          properties:
 *              userId:
 *                  type: number
 *              email:
 *                  type: string
 *              name:
 *                  type: string
 *              number:
 *                  type: string
 *              qrcode:
 *                  type: string
 *              remarks:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *              createdAt:
 *                  type: string
 *              updatedBy:
 *                  type: number
 *              bloodGroup:
 *                  type: string
 *              dob:
 *                  type: string
 *              address:
 *                  type: string
 *              prescriptions:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          prescriptionId:
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
 * /doctor/{patientId}:
 *   get:
 *     description: Get Patient Details
 *     tags:
 *       - Doctor
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
 *                      $ref: '#definitions/getPatientDetailsRes'
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

router
    .route("/:patientId")
    .get(
        authenticateJwt,
        validateUserPermission(UserRole.PHARMACY),
        validate(doctorValidation.getPatientDetails),
        doctorController.getPatientDetails.bind(doctorController)
    );

module.exports = router;
