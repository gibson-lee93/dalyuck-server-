import {OAuth2Client} from 'google-auth-library';
require('dotenv').config()

export async function verify(token:string) {
    const client = new OAuth2Client(process.env.CLIENT_ID); // 클라리언트 아이디 구글에서 발급받은것 노출되면 안댐
    const ticket = await client.verifyIdToken({
      idToken: token,           // id토큰은 클라이언트에서 요청으로 받음.
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return userid
}

// module.exports = verify;