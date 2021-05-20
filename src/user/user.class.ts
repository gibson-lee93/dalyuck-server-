/*

회원가입시 유저가 입력해야하는 정보

    email : 이메일 (string)
    password : 비밀번호 (string)
    userName : 이름 (string)
    salt : 암호화할 salt값 (string)

*/

export class User{

    userId : number; // DB저장시 PR키
    email : string;
    userName : string;
    password : string;
    salt : string;
    token : string;


    constructor(
        userId : number, // DB저장시 PR키
        email : string,
        userName : string,
        password : string,
        salt : string,
        token : string

        ) {

        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.salt = salt;
        this.token = token;
    }

}
