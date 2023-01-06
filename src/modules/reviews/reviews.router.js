import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as reviewController from './controller/reviews.js'
import { endPoint } from "./reviews.endPoint.js";
const router = Router({mergeParams:true})




router.post('/',auth(endPoint.add),reviewController.addReview)




export default router