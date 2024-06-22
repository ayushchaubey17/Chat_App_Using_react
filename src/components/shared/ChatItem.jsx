import { Box, Stack, Typography } from "@mui/material";
import { Link } from "../syles/StyledComponents";
import { memo } from "react";
import PropTypes from 'prop-types';
import AvatarCard from "./AvatarCard";
import {motion} from "framer-motion";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link sx={{padding:"0"}}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
      initial={{opacity:0, y:"-100%"}}
      whileInView={{opacity:1,y:0}}
      transition={{delay:index * 0.1}}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          gap: "1rem",
          position: "relative",
        }}
      >
        <AvatarCard avatar={avatar}/>
        <Stack>
          <Typography>{name}</Typography>
          {newMessageAlert && (
            <Typography>{newMessageAlert.count}  New Message</Typography>
          )}
        </Stack>
        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

ChatItem.propTypes = {
  avatar: PropTypes.array,
  name: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  groupChat: PropTypes.bool,
  sameSender: PropTypes.any, 
  isOnline: PropTypes.bool,
  newMessageAlert: PropTypes.object,
  index: PropTypes.number,
  handleDeleteChat: PropTypes.func.isRequired,
};

export default memo(ChatItem);
