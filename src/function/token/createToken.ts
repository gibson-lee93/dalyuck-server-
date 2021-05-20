const jwt = require("jsonwebtoken");
import { User } from "../../user/user.entity";

export const createToken = (
        payload : object, //여기에는 userId와 email만 들어간다.
        salt : string,
        expiresIn : object) : string => {
        const tokenValue = jwt.sign(payload, salt, expiresIn);
        console.log("tokenValue : ", tokenValue);
        return tokenValue;

}

export const checkToken = async (token : string, userId : number) : Promise<any> => {

    let decode : string;

    try{
        console.log("checkToken",token)
        console.log("userId : ", userId);
        // verify에서 에러 발생시 catch으로 이동

        // 유저아이디로 salt값 검색
        const user = await User.findOne({id:userId});
        // const  = user.findOne()
        if(token !== user.token) {
          return {error : 401, message : 'token invalid'};
        }
        const dbSalt = user.salt;

        decode = jwt.verify(user.token, dbSalt);
        console.log(decode);
        // const decode = jwt.verify(token, salt);
        // console.log("decode : ",decode)
        return decode;
    }
    catch(err){
        console.log("err message : ",err.message);
        const error:number = 401;
        return {error, message : err.message};
    }

}
