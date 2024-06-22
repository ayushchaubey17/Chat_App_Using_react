import dotenv from "dotenv";
dotenv.config();
const corsOptions = {
 
    origin:["http://localhost:5173","http://localhost:4173",process.env.CLIENT_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
  }

  

const CHAT_APP = "ChatApp-Token"

  export {corsOptions,CHAT_APP};