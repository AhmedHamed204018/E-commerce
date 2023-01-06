import { roles } from "../../middleware/auth.js";

export const endPoint ={
    create:[roles.Admin,roles.user],
    update:[roles.Admin,roles.user],
    delete:[roles.Admin,roles.user],
    get:[roles.Admin,roles.user]

}