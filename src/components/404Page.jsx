import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: "#1b4f72",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "hsl(0, 0%, 100%)",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: "6rem",
          fontWeight: 800,
          marginBottom: "1rem",
          color: "hsl(0, 0%, 100%)",
        }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontSize: "1.5rem",
          marginBottom: "1.5rem",
          color: "hsl(36, 64%, 91%)",
        }}
      >
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button
        onClick={() => navigate("/")}
        variant="contained"
        sx={{
          backgroundColor: "#933c10",
          color: "#fff",
          fontWeight: 500,
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "hsl(66, 17%, 21%)",
          },
        }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
