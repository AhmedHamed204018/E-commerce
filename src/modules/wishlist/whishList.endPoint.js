import { roles } from "../../middleware/auth.js";

export const endPoint ={
    addWishList:[roles.Admin,roles.user],
    removeWishList:[roles.Admin,roles.user],

    
}

