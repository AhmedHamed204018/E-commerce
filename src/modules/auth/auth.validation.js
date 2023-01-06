import joi from "joi";

export const signup = {
    body:joi.object().required().keys({
        userName: joi.string().pattern(new RegExp(/^[a-z][a-z]+\d*$|^[a-z]\d\d+$/i)).min(2).max(20).required().messages({
            'any.required':'plz enter a valid user name',
            'string.base':'only char is acceptable'
        }),
        email: joi.string().email().required().messages({
            
        }),
        
        password: joi.string().pattern(new RegExp(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/)).min(2).max(20).required().messages({
        }),

        cPassword: joi.string().valid(joi.ref('password')).required()
    })
        
}

export const login = {
    body:joi.object().required().keys({
       
        email: joi.string().email().required().messages({
            
        }),
        
        password: joi.string().pattern(new RegExp(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/)).min(2).max(20).required().messages({
        })

    })
        
}

export const token = {
    params:joi.object().required().keys({
        token:joi.string().required()
    })
}