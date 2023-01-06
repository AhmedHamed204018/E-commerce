const dataMethod = ['body', 'params', 'query', 'headers']


export const validation = (Schema) => {

    return (req, res, next) => {
        try {
            const validationArr = []
        dataMethod.forEach(key => {
            if (Schema[key]) {
                const validationResult = Schema[key].validate(req[key], { abortEarly: false })
                if (validationResult?.error) {
                    validationArr.push(validationResult.error.details)
                }
            }
        })
        if (validationArr.length) {
            res.status(400).json({ message: "Validation error", validationArr })
        } else {
            next()
        }
        } catch (error) {
            res.status(500).json({ message: "catch error", error })
        }
    }
}


// const dataMethod = ['body','param','query','headers']


// export const validation =(schema)=>{
//     return (req,res,next)=>{
//         const validationErr = []
//         dataMethod.forEach(key=>{
//             if(schema[key]){
//                 let {error} = schema[key].validate(req[key],{abortEarly:false})
//                 if(error){
//                     error.details.map((msg)=>{
//                         validationErr.push(msg.message)
//                     })
//                 }
//             }
//         })
//         if(validationErr.length){
//          res.status(400).json({message:"validation error",validationErr})
//         }else{
//             next()
//         }
//     }
// }