import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { sampleNotifications } from "../../constants/sampleData";
import { memo } from "react";
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";


const Notifications = () => {
  const {isNotification} = useSelector(state=>state.misc)
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationQuery();

  const [acceptRequest] = useAcceptFriendRequestMutation()

  const friendRequestHandler = async({ _id, accept }) => {

     dispatch(setIsNotification(false))
     try {
        const res = await acceptRequest({
          requestId:_id,
          accept
        })
        if(res.data?.success){
            console.log("User sockethere");
            toast.success(res.data?.message)
        }
        else{
          toast.error(res.data?.error || "Something went wrong");
        }
     } catch (error) {
        console.log(error);
        toast.error( "Something went wrong");

     }
  };
  useErrors([{ error, isError }]);

  const closeHandler = () => {
      dispatch(setIsNotification(false))
  }

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notification</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {" "}
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map(({ sender, _id }) => (
                <NotificationItem
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>0 Notification</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(function NotificationItem({
  sender,
  _id,
  handler,
}) {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

NotificationItem.displayName = "NotificationItem";


export default Notifications;
