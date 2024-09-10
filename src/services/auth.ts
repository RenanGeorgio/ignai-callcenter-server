import axios from "axios";
import https from "https";

const AuthApi = axios.create({
  baseURL: process.env.USER_CONTROLL ? process.env.USER_CONTROLL.replace(/[\\"]/g, '') : "",
  withCredentials: true,
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
}); 

export default AuthApi;