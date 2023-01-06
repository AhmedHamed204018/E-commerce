import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handleError.js";
import { create,find,findOneAndUpdate } from "../../../../DB/DBMethods.js";
import brandModel from "../../../../DB/model/brand.model.js";
import slugify from "slugify";
import { paginate } from "../../../services/pagination.js";

export const createBrand = asyncHandler(async(req,res,next)=>{
    if(!req.file){
        next(new Error('Image is required',{cause:400}))
    }else{
        const {name}=req.body
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:'E-commerce/saturday/brands'})
        const result = await create({
            model:brandModel,
            data:{
                name,
                image:secure_url,
                slug:slugify(name),
                createdBy:req.user._id,
                publicImageId:public_id
            }
        })
        if(!result){
            await cloudinary.uploader.destroy(public_id)
            next(new Error('fail to add your category',{cause:400}))
        }else{
            res.status(201).json({message:"done",result})
        }
    }

})

export const updateBrand = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    
    if(req.file){
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
            {folder:'E-commerce/saturday/brands'})
            req.body.image=secure_url
            req.body.publicImageId=public_id
    }

    if(req.body.name){
        req.body.slug=slugify(req.body.name)
    }
    const result = await findOneAndUpdate({
        model:brandModel,
        filter:{_id:id},
        data:req.body
    })
    if (!result) {
        await cloudinary.uploader.destroy(req.body.publicImageId)
        next(new Error('fail to update brand',{cause:400}))
    } else {
        await cloudinary.uploader.destroy(result.publicImageId)
        res.status(201).json({message:'done',result})
        
    }

})

export const brands = asyncHandler(async(req,res,next)=>{
    const  {skip,limit} = paginate(req.query.page,req.query.size) 
    const result = await find({model:brandModel,skip,limit})
    res.status(200).json({message:"done",result})
})