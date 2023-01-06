import { Router } from "express";
import {auth, roles} from '../../middleware/auth.js'
import { fileValidation, myMulter } from "../../services/multer.js";
import  subcategoryRouter from "../subcategory/subcategory.router.js";
import { endPoint } from "./category.endPoint.js";
import * as categoryController from './controller/category.js'
const router = Router()



router.use('/:categoryID/subCategory',subcategoryRouter)


router.post('/',auth(endPoint.createCategory),myMulter(fileValidation.image).single('image'),categoryController.createCategory)
router.put('/:id',auth(endPoint.updateCategory),myMulter(fileValidation.image).single('image'),categoryController.updateCategory)
router.get('/',categoryController.allCategories)
router.get('/:id',categoryController.getCategory)

// router.get('/categories',categoryController.allCategories)










export default router