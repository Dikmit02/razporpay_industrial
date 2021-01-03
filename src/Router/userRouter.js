const express = require('express');
const authController = require('../../controllers/auth.controllers')
const middleware = require('../../middleware/index')
const authValidator = require('../../validator/auth.validators')
const validator = require('express-joi-validation').createValidator({})
const Router = express.Router();



Router.route('/getUser')
    .post(authController.getUser)

Router.route('/signUp')
    .post(validator.body(authValidator.signUpValidation), authController.SignUpHandler, middleware.assignJWTMiddleware())

Router.route('/loginLocal')
    .post(validator.body(authValidator.loginLocalValidation), authController.loginLocal)



module.exports = Router
