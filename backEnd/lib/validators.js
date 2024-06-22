import { body, validationResult,param} from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessage = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessage, 400));
};

const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("username", "Please Enter UserName").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
  body("bio", "Please Enter Bio").notEmpty(),
 
];

const loginValidator = () => [
  body("username", "Please Enter UserName").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members must be 2-100"),
];

const AddMemberValidator = () => [
  body("chatId", "Please Enter Chat Id").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be 1-97"),
];

const RemoveMemberValidator = () => [
  body("chatId", "Please Enter Chat Id").notEmpty(),
  body("userId", "please Enter User Id").notEmpty(),
];

const LeaveMemberValidator = () => [
  param("id", "Please Enter Chat Id").notEmpty(),
];

const sendAttachmentsMemberValidator = () => [
  body("chatId", "Please Enter Chat Id").notEmpty(),
  
];

const ChatIdValidator = () => [param("id", "Please Enter Chat Id").notEmpty()];

const RenameGroupValidator = () => [
  param("id", "Please Enter Chat Id").notEmpty(),
  body("name", "Please Enter New Name").notEmpty(),
];

const sendRequestValidator = () => [
  body("userId", "Please Enter UserId").notEmpty(),
];

const acceptRequestValidator = () => [
  body("requestId", "Please Enter RequestId").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept Must Be a Boolean"),
];


const adminLoginValidator = () => [
  body("secretKey", "Please Enter Secret Key").notEmpty(),
  
];

export {
  registerValidator,
  validate,
  loginValidator,
  newGroupValidator,
  AddMemberValidator,
  RemoveMemberValidator,
  LeaveMemberValidator,
  sendAttachmentsMemberValidator,
  ChatIdValidator,
  RenameGroupValidator,
  sendRequestValidator,
  acceptRequestValidator,
  adminLoginValidator
};
