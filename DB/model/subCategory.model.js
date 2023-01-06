import { Schema, model, Types } from "mongoose";


const subCategorySchema = new Schema({

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
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:[true,
            "can not add subcategory without category"
        ]
    },
    publicImageId:String
}, {
    timestamps: true
})


const subCategoryModel = model('SubCategory', subCategorySchema)
export default subCategoryModel