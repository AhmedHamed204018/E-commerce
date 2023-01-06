import userModel from "../../../../DB/model/User.model.js"
import bcrypt from 'bcryptjs'
import { sendEmail } from "../../../services/email.js"
// import asyncHandler from 'express-async-handler'
import { asyncHandler } from "../../../services/handleError.js"

import jwt from 'jsonwebtoken'
import { findById, findOne, findOneAndUpdate, updateOne } from "../../../../DB/DBMethods.js"



export const signUp =asyncHandler( async (req,res,next)=>{
    const {userName,email,password} = req.body
    const user = await findOne({model:userModel,filter:{email},select:"email"})
    if(user){
        next(new Error("email exists",{cause:409}))

    }else{
        const hash = bcrypt.hashSync(password,parseInt(process.env.SALTROUND))
        const newUser = new userModel({userName,email,password:hash})
        console.log(newUser)
        const token = jwt.sign({id:newUser._id},process.env.EMAIL_TOKEN,{expiresIn:"10h"})
        const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`

        const RFtoken = jwt.sign({id:newUser._id},process.env.EMAIL_TOKEN,{expiresIn:"10h"})
        const RFlink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/RefreshConfirmEmail/${RFtoken}`

        const message = `<a href=${link}>confirm-email</a>
        <br>

        <a href=${RFlink}>Reconfirm-email</a>

        `
        const emailResult = await sendEmail(email,"confirmEmail",message)
        if(emailResult.accepted.length){
           await newUser.save()
           res.status(201).json({message:"done",userId:newUser._id})

        }else{
            next(new Error("please confirm email",{cause:409}))

        }
    }
} )

export const login = asyncHandler( async (req,res,next)=>{
    const {email,password} = req.body
    const user = await findOne({model:userModel,filter:{email}})
    if(!user){
        next(new Error("email doesn't exists",{cause:404}))
    }else{
        if(!user.confirmEmail){
            next(new Error("please confirm email",{cause:404}))
        }else{
            if(user.blocked){
                next(new Error("blocked user",{cause:400}))
            }else{
                const compare = bcrypt.compareSync(password,user.password)
                if(!compare){
                    next(new Error("password incorrect",{cause:400}))

                }else{
                    const token = jwt.sign({id:user._id , isLoggedIn:true},process.env.TOKEN_SIGNATURE,{expiresIn:60*60*24})
                    res.status(200).json({message:"done",token})
                }
            }
        }
        
       
        }
    })


export const confirmEmail = asyncHandler( async(req,res,next)=>{
    const {token} = req.params;
    const decoded = jwt.verify(token,process.env.EMAIL_TOKEN)
    if(!decoded?.id){
        next(new Error("invalid-payload",{cause:400}))
    }else{
        await updateOne(userModel,
            {_id:decoded.id,confirmEmail:false},
            {confirmEmail:true})
        res.json({message:"confirmed"})
    }

})

export const updatePassword = asyncHandler(async(req,res,next)=>{
    const {oldPassword,newPassword} = req.body
    const user = await findById({model:userModel,filter:req.user._id})
    const match = bcrypt.compareSync(oldPassword,user.password)
    if(!match){
        next(new Error("password incorrect",{cause:400}))
    }else{
        const hashPassword = await bcrypt.hash(newPassword,parseInt(process.env.SALTROUND))
        await userModel.findByIdAndUpdate({_id:user._id},{password:hashPassword})
        res.status(200).json({message:'done'})
    }
})

export const sendCode = asyncHandler(async(req,res,next)=>{
    const {email} = req.body
    const user = await findOne(userModel,{email},"userName email")
    if(!user){
        next(new Error("not registered account",{cause:400}))
    }else{
        const accessCode = Math.floor(Math.random()*(1999-1970+1))+1970
        await userModel.findByIdAndUpdate(user._id,{code:accessCode})
        sendEmail(user.email,"otp",`<h1>access code: ${accessCode}</h1>`)
        res.status(200).json({message:"done"})
        
    }
})

export const forgetPassword = asyncHandler(async(req,res,next)=>{
    const {email,code,password}=req.body
    const user = await userModel.findOne({email,code})
    if(!user){
        next(new Error("in-valid account or invalid otp",{cause:400}))
    }else{
        const hashPassword = bcrypt.hashSync(password,parseInt(process.env.SALTROUND))
        await userModel.updateOne({_id:user._id},{code:null,password:hashPassword})
        res.status(200).json({message:"done"})
    }
})

