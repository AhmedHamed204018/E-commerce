import { roles } from "../../middleware/auth.js";

export const endPoint = {
    createBand:[roles.Admin,roles.user],
    updateBrand:[roles.Admin,roles.user],
    get:[roles.Admin,roles.user]
}