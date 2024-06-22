import express from "express"
import { adminLogin, adminLogout, allChats, allMessages, getAdminData, getAllUsers, getDashBoardStats } from "../controllers/admin.js";
import { adminLoginValidator, validate } from "../lib/validators.js";
import { AdminOnly } from "../middlewares/auth.js";

const app = express.Router();




app.post("/verify",adminLoginValidator(),validate,adminLogin)

app.get("/logout",adminLogout)

//Only admin can access this route

app.use(AdminOnly);

app.get("/",getAdminData)

app.get("/users",getAllUsers)

app.get("/chats",allChats)

app.get("/messages",allMessages)

app.get("/stats",getDashBoardStats);

export default app;