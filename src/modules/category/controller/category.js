import { create, find, findById, findOne, updateOne,findOneAndUpdate } from "../../../../DB/DBMethods.js";
import categoryModel from "../../../../DB/model/category.model.js";
import subCategories from "../../../../DB/model/subCategory.model.js"

import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handleError.js";
import {paginate} from '../../../services/pagination.js'

export const createCategory = asyncHandler(async(req,res,next)=>{
    if(!req.file){
        next(new Error('image is required',{cause:400}))
    }else{
        const {name}=req.body
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`E-commerce/saturday/categories`})
        const result = await create({model:categoryModel,data:{name,image:secure_url,publicImageId:public_id,createdBy:req.user._id}})
        if (!result) {
            await cloudinary.uploader.destroy(public_id)
            next(new Error('fail to add category',{cause:400}))
        } else {
            res.status(201).json({message:"done",result})    
        }
        
    }

})

export const updateCategory = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const category = await findOne({model:categoryModel,filter:{_id:id}})
    if(!category){
        next(new Error('image is required',{cause:400}))
    }
    if(req.file){
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
            {folder:'E-commerce/saturday/categories'})
            req.body.image=secure_url
            req.body.publicImageId=public_id
    }
    const result = await findOneAndUpdate({
        model:categoryModel,
        filter:{_id:id},
        data:req.body
    })
    if (!result) {
        await cloudinary.uploader.destroy(req.body.publicImageId)
        next(new Error('fail to update category',{cause:400}))
    } else {
        await cloudinary.uploader.destroy(result.publicImageId)
        res.status(201).json({message:'done',result})
        
    }

})

 
export const getCategory = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const category = await findById({model:categoryModel,filter:{_id:id},populate:[{
        path:'createdBy',
        select:"userName email"
    }]})
   
    res.status(200).json({message:'done',category})

})

export const allCategories = asyncHandler(async(req,res,next)=>{
    const {skip,limit} = paginate(req.query.page,req.query.size)
    
    const result = await find({
        model:categoryModel,
        skip,
        limit,
        populate:[
            {
                path:'createdBy',
                select:'userName email'
            },
            {
                path:'subCategoryId'
            }
        ]
    })


    // const cursor = categoryModel.find({}).skip(skip).limit(limit).populate([
    //     {path:'createdBy',
    //     select:"userName email"}
    // ]).cursor();
    //     const result = []
    //     for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    //     const newObj = doc.toObject()
    //     newObj.subCategories = await subCategories.find({categoryId:doc._id}).populate([{
    //         path:'createdBy',
    //     select:"userName email"
    //     }])

    //           result.push(newObj)
    //     }

    res.status(200).json({message:'done',result})

})