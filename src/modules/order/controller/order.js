import { create, findOne, updateOne } from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/model/coupon.model.js";
import orderModel from "../../../../DB/model/order.model.js";
import productModel from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../services/handleError.js";

export const createOrder = asyncHandler(async(req,res,next)=>{
    const {Products,couponId}=req.body
    const finalProducts = []
    let sumTotalPrice = 0
    let finalPriceAfterDiscount = 0

     for (let i=0; i<Products.length; i++) {
        let product = Products[i]
        console.log(product);
        const checkedProducts = await findOne({
          model:productModel,
          filter:{_id:product.productId,stock:{$gte:product.quantity}}
        })
        console.log(checkedProducts);
        if(!checkedProducts){
            return next(new Error(`fail to place this item ${product.productId}`,{cause:400}))
        }
        product.totalPrice = (product.quantity * checkedProducts.finalPrice)
         sumTotalPrice = sumTotalPrice +  product.totalPrice
        finalProducts.push(product)
    }
     req.body.totalPrice = sumTotalPrice 

    if(couponId){
        const coupon = await findOne({
            model:couponModel,
            filter:{_id:couponId,usedBy:{$nin:req.user._id}}
        })
        if(!coupon){
            return next(new Error(`invalid coupon`,{cause:400}))
        }
        finalPriceAfterDiscount = sumTotalPrice - (sumTotalPrice * (coupon.amount/100))
    }else{
        finalPriceAfterDiscount = sumTotalPrice
    }

    req.body.finalPrice = finalPriceAfterDiscount
    req.body.userId = req.user._id
    req.body.products = finalProducts

    const order = await create({
        model:orderModel,
        data:req.body
    })
    if(order){
        if (couponId) {
            await updateOne({
                model:couponModel,
                filter:{_id:couponId},
                data:{$addToSet:{usedBy:req.user._id}}
            })
            
        }
        res.status(201).json({message:"done",order})
    }else{
        return next(new Error(`fail`,{cause:400}))

    }
})
