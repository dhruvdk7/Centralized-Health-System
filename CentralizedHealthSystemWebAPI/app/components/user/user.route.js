const express = require('express');

const { validateUserPermission } = require('../../helpers/validatePermissions');
const { authenticateJwt } = require('../../helpers/jwt');

const { validate } = require('../../lib/expressValidation');
const { UserRole } = require('../../constants');
const userController = require('./user.controller');
const userValidation = require('./user.validation');

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
 *      createUserReq:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              email:
 *                  type: string
 *              number:
 *                  type: string
 *              bloodGroup:
 *                  type: string
 *              address:
 *                  type: string
 *              password:
 *                  type: string
 *              status:
 *                  type: string
 *              role:
 *                  type: string
 *              dob:
 *                  type: string
 *              documentData:
 *                  type: string
 * */

/**
 * @swagger
 *  definitions:
 *      createUserRes:
 *          type: object
 *          properties:
 *              userId:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /users:
 *   post:
 *     description: Create User
 *     tags:
 *       - Users
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/createUserReq'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/createUserRes'
 *       401:
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 *       409:
 *         description: Email is taken
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
        validate(userValidation.createUser),
        userController.createUser.bind(userController),
    );

/**
 * @swagger
 *  definitions:
 *      loginReq:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *              rememberMe:
 *                  type: boolean
 * */

/**
 * @swagger
 *  definitions:
 *  loginRes:
 *      type: object
 *      properties:
 *          userDetails:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *          jwtToken:
 *              type: string
 * */

/**
 * @swagger
 *
 * /users/login:
 *   post:
 *     description: Login user into system
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  $ref: '#definitions/loginReq'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/loginRes'
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

router.route('/login')
    .post(
        validate(userValidation.loginUser),
        userController.loginUser.bind(userController),
    );

/**
 * @swagger
 *  definitions:
 *      filterReq:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *              role:
 *                  type: string
 *              name:
 *                  type: string
 * */

/**
 * @swagger
 *  definitions:
 *      filterRes:
 *          type: array
 *          items:
 *              type: object
 *              properties:
 *                  userId:
 *                      type: number
 *                  email:
 *                      type: string
 *                  name:
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
 *                  address:
 *                      type: string
 *                  statusName:
 *                      type: string
 *                  roleName:
 *                      type: string
 * */

/**
 * @swagger
 *
 * /users/filter:
 *   post:
 *     description: Filter users
 *     tags:
 *       - Users
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/filterReq'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/filterRes'
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
        validateUserPermission(UserRole.ADMIN),
        validate(userValidation.filterUsers),
        userController.filterUsers.bind(userController),
    );

/**
 * @swagger
 *  definitions:
 *      verifyReq:
 *          type: object
 *          properties:
 *              verificationCode:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /users/verify:
 *   put:
 *     description: Verify User
 *     tags:
 *       - Users
 *     parameters:
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/verifyReq'
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

router.route('/verify')
    .put(
        validate(userValidation.verifyUser),
        userController.verifyUser.bind(userController),
    );

/**
 * @swagger
 *  definitions:
 *      forgotPasswordReq:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /users/forgot-password:
 *   post:
 *     description: User forgot password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  $ref: '#definitions/forgotPasswordReq'
 *     responses:
 *       204:
 *         description: Ok
 *       401:
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 *       404:
 *          description: User not found
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

router.route('/forgot-password')
    .post(
        validate(userValidation.forgotPassword),
        userController.forgotPassword.bind(userController),
    );

/**
 * @swagger
 *  definitions:
 *      resetPasswordReq:
 *          type: object
 *          properties:
 *              password:
 *                  type: string
 *              token:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /users/reset-password:
 *   post:
 *     description: User reset password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  $ref: '#definitions/resetPasswordReq'
 *     responses:
 *       204:
 *         description: Ok
 *       401:
 *         description: Unauthorized
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/errorRes'
 *       404:
 *          description: User not found
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

router.route('/reset-password')
    .post(
        validate(userValidation.resetPassword),
        userController.resetPassword.bind(userController),
    );

/**
 * @swagger
 *  definitions:
 *      updateUserReq:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *              remarks:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /users/{userId}:
 *   put:
 *     description: Update user details
 *     tags:
 *       - Users
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       required: true
 *       type: string
 *     - name: userId
 *       description: User ID
 *       in: path
 *       required: true
 *       type: integer
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/updateUserReq'
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
 *      getUserRes:
 *          type: object
 *          properties:
 *              userId:
 *                  type: number
 *              name:
 *                  type: string
 *              email:
 *                  type: string
 *              number:
 *                  type: string
 *              remarks:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *              createdAt:
 *                  type: string
 *              updatedBy:
 *                  type:  number
 *              bloodGroup:
 *                  type: string
 *              dob:
 *                  type: string
 *              address:
 *                  type: string
 *              statusName:
 *                  type: string
 *              roleName:
 *                  type: string
 *              file:
 *                  type: string
 * */

/**
 * @swagger
 *
 * /users/{userId}:
 *   get:
 *     description: Get user details
 *     tags:
 *       - Users
 *     parameters:
 *     - name: Authorization
 *       in: header
 *       required: true
 *       type: string
 *     - name: userId
 *       description: User ID
 *       in: path
 *       required: true
 *       type: integer
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *              application/json:
 *                  schema:
 *                      $ref: '#definitions/getUserRes'
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
 *
 * /users/{userId}:
 *   delete:
 *     description: Delete user details
 *     tags:
 *       - Users
 *     parameters:
 *     - name: Authorization
 *       in: headers
 *       required: true
 *       type: string
 *     - name: userId
 *       description: User ID
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
 */

router.route('/:userId')
    .put(
        authenticateJwt,
        validateUserPermission(UserRole.ADMIN),
        validate(userValidation.updateUserStatus),
        userController.updateUserStatus.bind(userController),
    )
    .get(
        authenticateJwt,
        validate(userValidation.getUserDetailsById),
        userController.getUserDetailById.bind(userController),
    )
    .delete(
        authenticateJwt,
        validateUserPermission(UserRole.ADMIN),
        validate(userValidation.softDeleteUserById),
        userController.softDeleteUserById.bind(userController),
    );

module.exports = router;
