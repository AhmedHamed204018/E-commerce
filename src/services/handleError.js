export function asyncHandler (fn){
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>{
            // res.status(500).json({
            //     message:"catched error",
            //     err:err.message,stack:err.stack
            // })
            next(new Error(err.message , {cause:500}))
        })
    }

}

export const globalHandleError = (err,req,res,next)=>{
    if(err){
        if(process.env.MODE==='DEV'){
            res.status(err['cause']).json({
                message:err.message,
                status:err['cause'],
                stack:err.stack
            })             
        }else{
        res.status(err['cause']).json({
            message:err.message,
            status:err['cause']})
        }
    }
}