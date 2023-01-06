import { Router } from "express";
import multer from "multer";
import { auth } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import  {endPoint} from "./product.endPoint.js";
import * as productController from './controller/product.js'
import wishlist from '../wishlist/whishList.router.js'
import review from '../reviews/reviews.router.js'
const router = Router()



router.use('/:productId/wishlist',wishlist)
router.use('/:productId/reviews',review)

router.post('/',auth(endPoint.createProduct),myMulter(fileValidation.image).array('image',7),productController.createProduct)
router.put('/:id',auth(endPoint.updateProduct),myMulter(fileValidation.image).array('image',7),productController.updateProduct)
router.get('/',productController.productList)




export default router