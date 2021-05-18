const jwt = require("jsonwebtoken");

export const createToken = (
        payload : object, //여기에는 userId와 email만 들어간다.
        salt : string, 
        expiresIn : object) : string => {

        return jwt.sign(payload, salt, expiresIn);

}

export const checkToken = (token : string, salt : string) : any => {
    try{
        console.log("checkToken",token)
        console.log("salt : ", salt);
        // verify에서 에러 발생시 catch으로 이동

        // 유저아이디로 salt값 검색
        // jwt verify

        const decode = jwt.verify(token,salt);
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
