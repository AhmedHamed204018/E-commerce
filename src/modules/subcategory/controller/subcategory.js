import { create, find, findById, findOne, findOneAndUpdate, updateOne } from "../../../../DB/DBMethods.js";
import categoryModel from "../../../../DB/model/category.model.js";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handleError.js";
import {paginate} from '../../../services/pagination.js'

export const createSubCategory = asyncHandler(async(req,res,next)=>{
    if(!req.file){
        next(new Error('image is required',{cause:400}))
    }else{
        const {name}=req.body
        const {categoryID} = req.params
        const category= await findById({model:categoryModel,filter:{_id:categoryID},select:"_id"})
        if (!category) {
            next(new Error('in-valid parent category',{cause:404}))

        } else {
            const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`E-commerce/saturday/categories/${categoryID}/subcategory`})
            const result = await create({model:subCategoryModel,
                data:{
                    name,image:secure_url,categoryId:category._id,
                    createdBy:req.user._id,publicImageId:public_id
                }})
            res.status(201).json({message:"done",result})
        }      
    }
})

export const updateSubCategory = asyncHandler(async(req,res,next)=>{
    const{subCategoryID,categoryID}=req.params
    if(req.file){
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
            {folder:`E-commerce/saturday/categories/${categoryID}/subcategory`})
            req.body.image=secure_url
            req.body.publicImageId=public_id
    }
    const result = await findOneAndUpdate({model:subCategoryModel,
        filter:{_id:subCategoryID},data:req.body})

    if(!result){
        await cloudinary.uploader.destroy(req.body.publicImageId)
        next(new Error("in-valid subCategory id",{cause:404}))
    }else{
        await cloudinary.uploader.destroy(result.publicImageId)
        res.status(200).json({message:'done',result})

    }

})


export const getSubCategoryById = asyncHandler(async(req,res,next)=>{
    const {subCategoryID} = req.params
    const subcategory = await findById({model:subCategoryModel,filter:{_id:subCategoryID},populate:[{
        path:'createdBy',
        select:"userName email"
    },
   {
    path:'categoryId'
   }
]})
   
    res.status(200).json({message:'done',subcategory})

})


export const getCategoriesWithSubCategories = asyncHandler(async(req,res,next)=>{
    const {categoryID}=req.params
    const {skip,limit} = paginate(req.query.page,req.query.size)
    const categoryList = await find({model:subCategoryModel,
        filter:{categoryId:categoryID},
        populate:[
        {
        path:'createdBy',
        select:"userName email"
       },{
        path:'categoryID'
       }
],skip,limit})
   
    res.status(200).json({message:'done',categoryList})

})

export const getSubCategories = asyncHandler(async(req,res,next)=>{
    const {skip,limit} = paginate(req.query.page,req.query.size)
    const subCategories = await find({model:subCategoryModel,filter:{},populate:[
        {
        path:'createdBy',
        select:"userName email"
       },{
        path:'categoryId'
       }
]})
   
    res.status(200).json({message:'done',subCategories})

})

