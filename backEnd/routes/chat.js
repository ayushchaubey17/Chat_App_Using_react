import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  AddMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChat,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {
  AddMemberValidator,
  ChatIdValidator,
  LeaveMemberValidator,
  RemoveMemberValidator,
 
  RenameGroupValidator,
 
  newGroupValidator,
  sendAttachmentsMemberValidator,
  validate,
} from "../lib/validators.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new", newGroupValidator(), validate, newGroupChat);

app.get("/my", getMyChat);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", AddMemberValidator(), validate, AddMembers);

app.put("/removemember", RemoveMemberValidator(), validate, removeMembers);

app.delete("/leave/:id", LeaveMemberValidator(), validate, leaveGroup);

//send attachments
app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsMemberValidator(),
  validate,
  sendAttachments
);
//getMessages
app.get("/message/:id",ChatIdValidator(),validate, getMessages);

//Get Chat Details, Rename, Delete
app.get("/:id",ChatIdValidator(),validate, getChatDetails);
app.put("/:id",RenameGroupValidator(),validate, renameGroup);
app.delete("/:id",ChatIdValidator(),validate, deleteChat);

export default app;
