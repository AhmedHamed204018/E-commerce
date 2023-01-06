import { roles } from "../../middleware/auth.js";

export const endPoint ={
    getCategories:[roles.Admin,roles.user],
    updateCategory:[roles.Admin,roles.user],
    createCategory:[roles.Admin,roles.user]
}