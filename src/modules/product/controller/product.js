import slugify from "slugify";
import { create, find, findById, updateOne, findOneAndUpdate, findByIdAndUpdate, findOne } from "../../../../DB/DBMethods.js";
import brandModel from "../../../../DB/model/brand.model.js";
import categoryModel from "../../../../DB/model/category.model.js";
import productModel from "../../../../DB/model/product.model.js";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";
import subCategories from "../../../../DB/model/subCategory.model.js"

import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handleError.js";
import { paginate } from '../../../services/pagination.js'

const populate = [
    {
        path:'createdBy',
        select:'userName email image'
    },
    {
        path:'updatedBy',
        select:'userName email image'
    },
    {
        path:'categoryId',
        populate:{
            path:'createdBy',
            select:'userName email image'
        },
    },
    {
        path:'subCategoryId',
        populate:{
            path:'createdBy',
            select:'userName email image'
        },
    },
    {
        path:'brandId',
        populate:{
            path:'createdBy',
            select:'userName email image'
        },
    },
    {
        path:"reviews"
    }
    
]

export const createProduct = asyncHandler(async (req, res, next) => {
if(!req.files?.length){
  return next(new Error('images are required ',{cause:404}))
}
const {name,amount,discount,price,categoryId,subCategoryId,brandId} = req.body
req.body.slug = slugify(name)
req.body.stock = amount
discount? req.body.finalPrice = price-(price*(discount/100)):req.body.finalPrice = price

const category = await findOne({model:subCategoryModel,
 filter:{_id:subCategoryId,categoryId:categoryId}
})
if(!category){
    return next(new Error('invalid category Id or subcategory id ',{cause:404}))
}

const brand = await findOne({model:brandModel,
    filter:{_id:brandId}
})
   if(!brand){
       return next(new Error('invalid category Id or subcategory id  ',{cause:404}))
   }
   
    const images =[]
    const publicImageIds = []
   for (const file of req.files) {
      const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:`E-commerceOnline/${name}`})
      images.push(secure_url)
      publicImageIds.push(public_id)
   }
   req.body.images = images
   req.body.publicImageIds = publicImageIds
   req.body.createdBy= req.user._id

   const product = await create({
    model:productModel,
    data:req.body
   })
   if(product){
    return res.status(201).json({message:"done",product})
   }else{
    for (const imageId of publicImageIds) {
        await cloudinary.uploader.destroy(imageId)
    }
      return res.status(400).json({message:"fail to create"})
   }

})

export const updateProduct = asyncHandler(async (req, res, next) => {
    const {id}=req.params
    
    const product = await findById({
         model: productModel,
          filter: { _id: id } 
        })
    if (!product) {
       return  next(new Error('invalid product id', { cause: 404 }))
    }
     const  {name,amount,discount,price,subCategoryId,categoryId,brandId} = req.body
    if(name){
        req.body.slug=slugify(name)
    }
    

    if(amount){
        const calcStock = amount - product.soldCount
        calcStock >=0 ?  req.body.stock = calcStock : req.body.stock = 0 
    }

    if(price && discount){
        req.body.finalPrice = price - (price *(discount/100))
    }else if (price){
        req.body.finalPrice = price - (price *(product.discount/100))
    }else if(discount){
        req.body.finalPrice = product.price - (product.price * (discount/100))
    }

    if(categoryId&&subCategoryId){
        const category = await findOne({
            model:subCategoryModel,
            filter:{_id:subCategoryId,categoryId}
        }) 
        if(!category){
             next(new Error('invalid category or subcategory id', { cause: 404 }))
        }
    }

    if(brandId){
        const brand = await findOne({
            model:brandModel,
            filter:{_id:brandId}
        })
        if(!brand){
             next(new Error('invalid brand id ', { cause: 404 }))
        }
    }
    
    req.body.updatedBy = req.user._id

    if(req.files.length){
        const images =[]
        const publicImageIds = []
        for (const file of req.files) {
          const {secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:`E-commerceOnline/${name}`})
          images.push(secure_url)
          publicImageIds.push(public_id)
       }
       req.body.publicImageIds = publicImageIds
       req.body.images = images
    }     
    
    const updatedProduct = await findOneAndUpdate({
       model:productModel,
       data:req.body,
       filter:{_id:product._id},
       options:{new:false}
    })
    if(updatedProduct){
        for (const imageID of product.publicImageIds) {
            await cloudinary.uploader.destroy(imageID)
        }
        res.status(200).json({message:"done",updatedProduct})
    }else{
        for (const imageID of req.body.publicImageIds) {
            await cloudinary.uploader.destroy(imageID)
        }

        next(new Error(`fail to update with product id ${product._id} `, { cause: 404 }))
    }
})

export const productList = asyncHandler(async (req, res, next) => {
   const {skip,limit}=paginate(req.query.page,req.query.size)
   const products = await find({
    model:productModel,
    filter:{},
    skip,
    limit,
    populate:populate
   })
     
   const productList = []
   for (let i = 0; i < products.length; i++) {
    const convObj = products[i].toObject();
    let calcRating = 0
    for (let j = 0; j < convObj.reviews.length; j++) {
        calcRating += convObj.reviews[j].rating
    }
      convObj.avgRating = calcRating / convObj.reviews.length
      productList.push(convObj)
   }

     res.status(200).json({message:'done',productList})
})

// export const allCategories = asyncHandler(async (req, res, next) => {
//     const { skip, limit } = paginate(req.query.page, req.query.size)

//     const cursor = categoryModel.find({}).skip(skip).limit(limit).populate([
//         {
//             path: 'createdBy',
//             select: "userName email"
//         }
//     ]).cursor();
//     const result = []
//     for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
//         const newObj = doc.toObject()
//         newObj.subCategories = await subCategories.find({ categoryId: doc._id }).populate([{
//             path: 'createdBy',
//             select: "userName email"
//         }])

//         result.push(newObj)
//     }

//     res.status(200).json({ message: 'done', result })

// })
