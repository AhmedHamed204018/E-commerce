import { roles } from "../../middleware/auth.js";

export const endPoint ={
    createProduct:[roles.Admin,roles.user],
    updateProduct:[roles.Admin,roles.user]

   
 
}