import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as couponController from '../coupon/controller/coupon.js'
import { endPoint } from "./coupon.endPoint.js";
const router = Router()



router.get('/:name',couponController.coupons )
router.post('/',auth(endPoint.create),couponController.createCoupon )
router.patch('/:id',auth(endPoint.update),couponController.updateCoupon )
router.patch('/:id/delete',auth(endPoint.delete),couponController.deleteCoupon )






export default router