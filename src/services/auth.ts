import axios from "axios";
import https from "https";
import config from "../config/env";

const AuthApi = axios.create({
  baseURL: config.userControl.url,
  withCredentials: true,
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
}); 

export default AuthApi;