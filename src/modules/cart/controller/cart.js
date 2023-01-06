import { create, findOne, findOneAndUpdate } from "../../../../DB/DBMethods.js";
import cartModel from "../../../../DB/model/cart.model.js";
import { asyncHandler } from "../../../services/handleError.js";

export const addToCart = asyncHandler(async(req,res,next)=>{
const {_id}=req.user
const {products} = req.body
const cart = await findOne({
    model:cartModel,
    filter:{userId:_id}
})
  
   if(!cart){
    const createCart = await create({
        model:cartModel,
        data:{
            userId:_id,
            products
        }
    })
    return res.status(200).json({message:'done',createCart})
   }

   for (const product of products) {
    let match = false
     for (let i = 0; i < products.length; i++) {
        if(product.productId==cart.products[i].productId.toString()){
            cart.products[i]=product
            match = true
            break;
        }
        
     }
     if(!match){
        cart.products.push(product)
     }
   }

   const result = await findOneAndUpdate({
    model:cartModel,
    filter:{_id:cart._id,userId:req.user._id},
    data:{products:cart.products},
    options:{new:true}
   })


   res.status(200).json({message:'done',result})


})