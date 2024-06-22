import { Box, Typography } from "@mui/material";
import AppLayout from "../components/Layout/AppLayout";

const Home = () => {
  return (
    <Box bgcolor={"gray"} height={"100%"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
      Select a Friend To Chat
    </Typography>
    </Box>
  );
};

const EnhancedHome = AppLayout(Home);
export default EnhancedHome;
