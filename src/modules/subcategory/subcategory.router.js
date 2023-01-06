import { Router } from "express";
import {auth, roles} from '../../middleware/auth.js'
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./subcategory.endPoint.js";
import * as subCategoryController from './controller/subcategory.js'
const router = Router({mergeParams:true})


// router.get('/',(req,res,next)=>{
//     res.json({message:"subcategory"})
// })

router.post('/',auth(endPoint.createSubCategory),myMulter(fileValidation.image).single('image'),subCategoryController.createSubCategory)
router.put('/:subCategoryID',auth(endPoint.updateSubCategory),myMulter(fileValidation.image).single('image'),subCategoryController.updateSubCategory)

router.get('/',auth(endPoint.getCategoriesWithSubCategories),subCategoryController.getCategoriesWithSubCategories)
router.get('/list',auth(endPoint.getSubCategories),subCategoryController.getSubCategories) 
router.get('/:subCategoryID',subCategoryController.getSubCategoryById)










export default router