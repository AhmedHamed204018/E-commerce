import { roles } from "../../middleware/auth.js";

export const endPoint ={
    createSubCategory:[roles.Admin,roles.user],
    updateSubCategory:[roles.Admin,roles.user],
    getSubCategories:[roles.Admin,roles.user],
    getCategoriesWithSubCategories:[roles.Admin,roles.user]

    
}