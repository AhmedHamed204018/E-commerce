import jwt from 'jsonwebtoken'
import  userModel  from '../../DB/model/User.model.js';
import { asyncHandler } from '../services/handleError.js';


export const roles = {
    Admin:'Admin',
    user:'User'
}

export const auth = (accessRoles=[roles.user]) => {
    return asyncHandler (async (req, res, next) => {
            // console.log({ bb: req.body });
            const { authorization } = req.headers
            if (!authorization?.startsWith(process.env.BearerKey)) {
                next(new Error("In-valid Bearer key",{cause:400}))
            } else {
                const token = authorization.split(process.env.BearerKey)[1]
                const decoded = jwt.verify(token,process.env.TOKEN_SIGNATURE)
                if (!decoded?.id || !decoded?.isLoggedIn) {
                    next(new Error("In-valid token payload",{cause:400}))
                } else {
                    const user = await userModel.findById(decoded.id).select('email userName role')
                    if (!user) {
                        next(new Error("Not register user",{cause:401}))

                    } else {
                        if (!accessRoles.includes(user.role)) {
                            next(new Error("Un-authorized user",{cause:403}))
                        } else {          
                        req.user = user
                        next()
                        }
                    }
                }
            }
    

    })
}