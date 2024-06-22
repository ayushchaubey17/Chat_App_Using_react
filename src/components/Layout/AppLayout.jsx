import { Drawer, Grid, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsDeleteMenu, setIsMobileMenuFriend, setSelectedDeleteChat } from "../../redux/reducers/misc";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { getSocket } from "../../socket";
import { useCallback, useEffect, useRef, useState } from "react";
import { NEW_REQUEST, NEW_MESSAGE_ALERT, REFETCH_CHATS, ONLINE_USERS } from "../../constants/events.js";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat.js";
import { getOrSaveFromStorage } from "../../lib/Features.js";
import DeleteChatMenu from "../dialog/DeleteChatMenu.jsx";

const AppLayout = (WrappedComponent) => {
  const AppLayoutWrapper = (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);
    const [onlineUsers,setOnlineUsers] = useState([])

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const socket = getSocket();

    const { isMobileMenuFriend } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(()=>{
      getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
    },[newMessagesAlert])

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true))
      dispatch(setSelectedDeleteChat({chatId,groupChat}))
      deleteMenuAnchor.current = e.currentTraget
     
      
    };

    const handleMobileClose = () => dispatch(setIsMobileMenuFriend(false));

    const newMessagesAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId,dispatch]
    );

    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
       refetch()
       navigate("/")
    }, [refetch,navigate]);

    const onlineUsersListener = useCallback((data)=>{
        setOnlineUsers(data);
        
    },[])

    const eventHandler = {
      [NEW_MESSAGE_ALERT]: newMessagesAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]:onlineUsersListener,
    };
    useSocketEvents(socket, eventHandler);

    return (
      <>
        <Title />
        <Header />
        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor.current}/>

        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobileMenuFriend} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
          
        )}

        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>

        {/* <div>Footer</div> */}
      </>
    );
  };

  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  AppLayoutWrapper.displayName = `AppLayout(${displayName})`;

  return AppLayoutWrapper;
};

export default AppLayout;
