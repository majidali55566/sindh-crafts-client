import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f8f9fa",
        padding: "1rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderTop: "1px solid #dee2e6",
      }}
    >
      <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
        © 2024 Sindh's Finest Crafts
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
          Home
        </Link>
        <Link
          to="/add-to-cart"
          style={{ textDecoration: "none", color: "#007bff" }}
        >
          Add to Cart
        </Link>

        <Link
          to="/seller-dashboard"
          style={{ textDecoration: "none", color: "#007bff" }}
        >
          Seller Dashboard
        </Link>
        <Link
          to="/checkout"
          style={{ textDecoration: "none", color: "#007bff" }}
        >
          Checkout
        </Link>
        <Link to="/orders" style={{ textDecoration: "none", color: "#007bff" }}>
          Orders
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
