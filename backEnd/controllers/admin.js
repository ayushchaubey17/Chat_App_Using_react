import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/features.js";
import { adminSecretKey } from "../app.js";

const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;
  
  const isMatch = secretKey === adminSecretKey;
  if (!isMatch) return next(new ErrorHandler("Invalid Admin Key", 401));

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);

  return res
    .status(200)
    .cookie("Chat-App-Admin", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    }).json({
      success:true,
      message:"Authenticated SuccessFully Welcome Boss"
    })
});

const adminLogout = TryCatch(async(req,res,next) => {
  return res
    .status(200)
    .cookie("Chat-App-Admin","", {
      ...cookieOptions,
      maxAge: 0,
    }).json({
      success:true,
      message:"Admin Logged Out SuccessFully"
    })
})

const getAdminData = TryCatch(async(req,res,next)=>{
      return res.status(200).json({
        admin:true,
      })
})

const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find({});

  const transFormedUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);
      return {
        name,
        username,
        avatar: avatar.url,
        _id,
        groups,
        friends,
      };
    })
  );

  return res.status(200).json({
    success: true,
    users: transFormedUsers,
  });
});

const allChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transFormedChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });
      return {
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map((members) => members.avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        })),
        creator: {
          name: creator?.name,
          avatar: creator?.avatar.url,
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );

  return res.status(200).json({
    status: "success",
    chats: transFormedChats,
  });
});

const allMessages = TryCatch(async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transFormedMessages = messages.map(
    ({ content, attachments, _id, sender, createdAt, chat }) => ({
      _id,
      attachments,
      content,
      createdAt,
      chat: chat?._id,
      groupChat:  chat?.groupChat,
      sender: {
        _id: sender?._id,
        name: sender?.name,
        avatar: sender?.avatar.url,
      },
    })
  );

  return res.status(200).json({
    success: true,
    messages: transFormedMessages,
  });
});

const getDashBoardStats = TryCatch(async (req, res) => {
  const [groupsCount, usersCount, messagesCount, totalCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);

  const today = new Date();
  const lastSevenDay = new Date();
  lastSevenDay.setDate(lastSevenDay.getDate() - 7);

  const lastSevenDayMessage = await Message.find({
    createdAt: {
      $gte: lastSevenDay,
      $lte: today,
    },
  }).select("createdAt");

  const messages = new Array(7).fill(0);
  const dayInMiliSec = 1000 * 60 * 60 * 24;

  lastSevenDayMessage.forEach((message) => {
    const indexApproax =
      (today.getTime() - message.createdAt.getTime()) / dayInMiliSec;
    const index = Math.floor(indexApproax);

    messages[6 - index]++;
  });

  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalCount,
  };

  return res.status(200).json({
    success: true,
    stats,
    messagesChart: messages,
  });
});

export { getAllUsers, allChats, allMessages, getDashBoardStats, adminLogin ,adminLogout,getAdminData};
