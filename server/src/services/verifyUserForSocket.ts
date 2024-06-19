import { UUID } from "crypto";
import USER from "../models/user";

export const verifyUserforSocket = async (userID:UUID) => {
    try {
        const user = await USER.findOne({where:{id:userID}})
    
        if(user){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
};
