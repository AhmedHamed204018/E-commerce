import { Schema, model, Types } from "mongoose";


const orderSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:[true,'can not add without permission'],
        unique:true
    },

    products:{
        type:[{ 
            productId:{
                type:Types.ObjectId,
                ref:'Product',
                required:true,
                unique:true
            },
            quantity:{
                type:Number,
                default:1
            }
        }]
    }
    ,
    address:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    finalPrice:{
        type:Number,
        required:true
    },
    couponId:{
        type:Types.ObjectId,
        ref:'Coupon'
    },
    status:{
        type:String,
        enum:['placed','receive','rejected','preparing','on Way'],
        default:'placed'
    },
    payment:{
        type:String,
        enum:['cash','visa'],
        default:'cash'
    }
    
}, {
    timestamps: true
})


const orderModel = model('Order', orderSchema)
export default orderModel