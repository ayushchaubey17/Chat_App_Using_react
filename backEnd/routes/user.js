import express from "express"
import { singleAvatar } from "../middlewares/multer.js";
import { AcceptFriendRequest, getMyFriends, getMyProfile, getNotification, logOut, loginUser, newUser, searchUser, sendFriendRequest } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validate } from "../lib/validators.js";

const app = express.Router();

app.post("/new",singleAvatar,registerValidator(),validate,newUser)
app.post("/login",loginValidator(),validate,loginUser)


//LoggedIn User
app.get("/me",isAuthenticated,getMyProfile);
app.get("/logout",isAuthenticated,logOut);
app.get("/search",isAuthenticated,searchUser);
app.put("/send-request",isAuthenticated,sendRequestValidator(),validate,sendFriendRequest)
app.put("/accept-request",isAuthenticated,acceptRequestValidator(),validate,AcceptFriendRequest)
app.get("/notifications",isAuthenticated,getNotification)

app.get("/friends",isAuthenticated,getMyFriends)

export default app;