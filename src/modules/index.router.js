import express from 'express'
import morgan from 'morgan'
import connectDB from '../../DB/connection.js'
import { globalHandleError } from '../services/handleError.js'
import authRouter from './auth/auth.router.js'
import branRouter from './brand/brand.router.js'
import cartRouter from './cart/cart.router.js'
import categoryRouter from './category/category.router.js'
import couponRouter from './coupon/coupon.router.js'
import orderRouter from './order/order.router.js'
import productRouter from './product/product.router.js'
import reviewsRouter from './reviews/reviews.router.js'
import subcategoryRouter from './subcategory/subcategory.router.js'
import userRouter from './user/user.router.js'





export const appRouter = (app)=>{
    //base url
    const baseUrl = process.env.BASEURL
    //convert Buffer Data
    app.use(express.json())
    if(process.env.MODE === 'DEV'){
        app.use(morgan("dev"))
    
    }else{
        app.use(morgan("common"))
    
    }
    //Setup API Routing 
    app.use(`${baseUrl}/auth`, authRouter)
    app.use(`${baseUrl}/user`, userRouter)
    app.use(`${baseUrl}/product`, productRouter)
    app.use(`${baseUrl}/category`, categoryRouter)
    app.use(`${baseUrl}/subCategory`, subcategoryRouter)
    app.use(`${baseUrl}/reviews`, reviewsRouter)
    app.use(`${baseUrl}/coupon`, couponRouter)
    app.use(`${baseUrl}/cart`, cartRouter)
    app.use(`${baseUrl}/order`, orderRouter)
    app.use(`${baseUrl}/brand`, branRouter)
    
    app.use('*', (req, res, next) => {
        next(new Error("In-valid Routing Plz check url  or  method",{cause:404}))
    })
    //global handle error
    app.use(globalHandleError)
    connectDB()
    
}