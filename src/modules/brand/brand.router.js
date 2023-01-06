import { Router } from "express";
import {auth, roles} from '../../middleware/auth.js'
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./brand.endPoint.js";
import * as brandController from './controller/brand.js'
const router = Router()




router.post('/',auth(endPoint.create),myMulter(fileValidation.image).single('image'),brandController.createBrand)
router.put('/:id',auth(endPoint.updateBrand),myMulter(fileValidation.image).single('image'),brandController.updateBrand)
router.get('/',auth(endPoint.get),brandController.brands)
// router.get('/:id',categoryController.getCategory)

// router.get('/categories',categoryController.allCategories)










export default router