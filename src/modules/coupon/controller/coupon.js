import { create, find, findByIdAndUpdate } from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/model/coupon.model.js";
import { asyncHandler } from "../../../services/handleError.js";

export const coupons = asyncHandler(async(req,res,next)=>{
    const coupon = find({
        model:couponModel,
        filter:{name:req.params.name,deleted:false}
    })

    return res.status(200).json({message:'done',coupon})
})

export const createCoupon = asyncHandler(async(req,res,next)=>{
    req.body.createdBy = req.user._id

    const coupon = create({
        model:couponModel,
        data:req.body
    })

    return coupon? res.status(200).json({message:'done',coupon}): next(new Error('fail to create',{cause:400}))
})

export const updateCoupon = asyncHandler(async(req,res,next)=>{
    req.body.updatedBy = req.user._id
    const coupon = findByIdAndUpdate({
        model:couponModel,
        filter:{_id:req.params.id},
        data:req.body
    })

    return coupon? res.status(200).json({message:'done',coupon}): next(new Error('fail to update',{cause:400}))
})

export const deleteCoupon = asyncHandler(async(req,res,next)=>{
    const coupon = findByIdAndUpdate({
        model:couponModel,
        filter:{_id:req.params.id},
        data:{deleted:true,deletedBy : req.user._id}
    })

    return coupon? res.status(200).json({message:'done',coupon}): next(new Error('fail to delete',{cause:400}))
})