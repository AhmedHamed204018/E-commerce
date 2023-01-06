import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import  {endPoint} from "./whishList.endPoint.js";
import * as whishListController from './controller/whishList.js'
const router = Router({mergeParams:true})


router.patch('/add',auth(endPoint.addWishList),whishListController.addWishList)
router.patch('/remove',auth(endPoint.removeWishList),whishListController.removeWishList)











export default router