import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as registerController from './controller/registration.js'
import { auth } from "../../middleware/auth.js"
import * as validators from './auth.validation.js'
const router = Router()

router.post('/signup',validation(validators.signup),registerController.signUp)
router.get('/confirmEmail/:token',registerController.confirmEmail)
router.post('/login',registerController.login)
router.patch('/password',auth(),registerController.updatePassword)
router.patch('/sendCode',registerController.sendCode)
router.patch('/forgetPassword',registerController.forgetPassword)








export default router