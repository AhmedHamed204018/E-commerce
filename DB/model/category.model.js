import { Schema, model, Types } from "mongoose";


const categorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique:[true,'email must be unique value'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase:true

    },
    image: {
        type: String,
        required: [true, 'image is required'],
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User",required:[true,"can not add category without admin's permission"]
    },
    publicImageId:String

}, {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

categorySchema.virtual('subCategoryId',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'categoryId'
})
const categoryModel = model('Category', categorySchema)
export default categoryModel