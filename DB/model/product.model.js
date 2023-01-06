import { Schema, model, Types } from "mongoose";


const productSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique:[true,'name must be unique value'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase:true

    },
    slug:{
        type:String,
        required:[true,'name is required']
    },
    images: {
        type: [String],
        required: [true, 'image is required'],
    },
    description:{
        type:String,
        required:[true,'description is required']
    }
    ,
    createdBy:{
        type:Types.ObjectId,
        ref:"User",required:[true,"can not add product without admin's permission"]
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:"User",
    },

    publicImageIds:[String],
    
   
    price:{
        type:Number,
        required:[true,"price is required"]
    },
    discount:{
        type:Number,
    },
    finalPrice:{
        type:Number,
        required:[true,'Final price is required']
    },
    colors:[String],
    
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:[true,'categoryId is required']
    },

    subCategoryId:{
        type:Types.ObjectId,
        ref:'SubCategory',
        required:[true,'SubCategory is required']
    },
    brandId:{
        type:Types.ObjectId,
        ref:'Brand',
        required:[true,'Brand is required']
    },

    stock:{
        type:Number,
        default:0,
        required:[true,'start-stock is required']
    },
    amount:{
        type:Number,
        default:0,
    },
    soldCount:{
        type:Number,
        default:0,
    },
    size:{type:[String],enum:['sm','l','xl','m']}

}, {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
 
productSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'productId'
})

const productModel = model('Product', productSchema)
export default productModel