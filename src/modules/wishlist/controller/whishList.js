import { findById, updateOne } from "../../../../DB/DBMethods.js";
import productModel from "../../../../DB/model/product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../services/handleError.js";

 export const addWishList = asyncHandler(async (req,res,next)=>{
     const {productId} = req.params

     const product = await findById({
        model:productModel,
        filter:productId,
     })

     if(!product){
      return next(new Error('invalid product is ',{cause:404}))
     }

     await updateOne({
        model:userModel,
        filter:{_id:req.user._id},
        data:{$addToSet:{wishList:product._id}}
     })
     res.status(200).json({message:"done"})
 })

 export const removeWishList = asyncHandler(async (req,res,next)=>{
   const {productId} = req.params

   const product = await findById({
      model:productModel,
      filter:productId,
   })

   if(!product){
    return next(new Error('invalid product is ',{cause:404}))
   }

   await updateOne({
      model:userModel,
      filter:{_id:req.user._id},
      data:{$pull:{wishList:product._id}}
   })
   res.status(200).json({message:"done"})
})