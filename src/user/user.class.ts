/*

회원가입시 유저가 입력해야하는 정보

    email : 이메일 (string)
    password : 비밀번호 (string)
    userName : 이름 (string)

*/

export class User{

    id : string; // DB저장시 PR키
    email : string;
    userName : string;
    password : string;
    

    constructor(
        id : string, // DB저장시 PR키
        email : string,
        userName : string,
        password : string
        
        ) {

        this.id = id;
        this.userName = userName;
        this.password = password;
        this.email = email;
    }

}
