import { create, findOne } from "../../../../DB/DBMethods.js";
import orderModel from "../../../../DB/model/order.model.js";
import reviewModel from "../../../../DB/model/review.model.js";
import { asyncHandler } from "../../../services/handleError.js";

export const addReview = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params
    const {message,rating} = req.body
    const {_id}= req.user

    const checkedReview = await findOne({
        model:reviewModel,
        filter:{
            userId:_id,
            productId
        }

    })
    if(checkedReview){
     return next(new Error('already reviewed by you',{cause:409}))
    }

    const order = await findOne({
        model:orderModel,
        filter:{
            userId:_id,
            status:"received",
            'products.productId':productId
        },
        populate:[
            {
                path:'products'
            }
        ]
    })

    if(!order){
        return next(new Error('sorry you have to finish your order first',{cause:400}))
    }

    const review = await create({
        model:reviewModel,
        data:{
            message,
            rating,
            productId,
            userId:_id
        }
    })

       return res.status(200).json({message:"done",review})

})