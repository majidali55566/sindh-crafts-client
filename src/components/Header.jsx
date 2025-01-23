import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, Dashboard } from "@mui/icons-material";
import { Badge, Box, Button, Divider, IconButton } from "@mui/material";
import useWindowWidth from "../hooks/useWindowWidth";
import SearchBar from "./SearchBar";
import JoinUsModal from "./JoinUs";
import useAuth from "../hooks/useAuth";
import BecomeASellerModal from "./Forms/BecomeASeller";
import { CartContext } from "../context/CartContext";
const Header = () => {
  const [IsNavOpen, setIsNavOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const { auth } = useAuth();
  const [IsBecomeSellerModalOpen, setIsBecomeSellerModalOpen] = useState(false);

  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("signup"); // Form type state
  const toggleFormType = () => {
    setFormType(formType === "signup" ? "signin" : "signup");
  };

  const openSignInModal = () => {
    setFormType("signin"); // Set to "signin" when Sign In is clicked
    setIsModalOpen(true);
  };

  const openSignUpModal = () => {
    setFormType("signup"); // Set to "signup" when Join Us Now is clicked
    setIsModalOpen(true);
  };

  const handleCloseJoinUsModal = () => {
    setIsModalOpen(false);
  };
  const { cartItems } = useContext(CartContext);

  useEffect(() => {
    if (windowWidth > 768) setIsNavOpen(true);
  }, [windowWidth]);
  return (
    <>
      <header className="header-container">
        <div className="content">
          <Link to="/">
            <img
              id="logo"
              src="/images/Logo.png"
              alt="logo"
              width={200}
              height={60}
            />
          </Link>

          <div className="pos-relative d-flex justify-center items-center">
            <SearchBar />
            {!auth?.accessToken && (
              <>
                <Button color="white" onClick={openSignInModal}>
                  Sign In
                </Button>
                <Button
                  color="black"
                  sx={{ background: "white" }}
                  onClick={openSignUpModal}
                  variant="contained"
                >
                  Join Us
                </Button>
              </>
            )}
            {auth?.user?.role === "buyer" && (
              <div>
                <Link to="/add-to-cart">
                  <IconButton>
                    <Badge badgeContent={cartItems?.length} color="secondary">
                      <ShoppingCart sx={{ color: "white" }} />
                    </Badge>
                  </IconButton>
                </Link>
              </div>
            )}
            {auth?.accessToken && auth?.user.role === "seller" && (
              <Link to="/seller-dashboard">
                <IconButton>
                  <Dashboard />
                </IconButton>
              </Link>
            )}

            <IconButton
              className="menu-icon"
              sx={{ color: "white" }}
              onClick={() => {
                setIsNavOpen(!IsNavOpen);
              }}
            >
              <Menu />
            </IconButton>
          </div>
        </div>
        {windowWidth > 768 && (
          <Divider orientation="horizontal" sx={{ color: "white" }} />
        )}
        <nav>
          {IsNavOpen && (
            <ul>
              <li>
                <Link to="/">HOME</Link>
              </li>
              <li>
                <Link to="/add-to-cart">Add to cart</Link>
              </li>
              <li>
                <Link to="/seller-dashboard">Seller Dashboard</Link>
              </li>
              <li>
                <Link to="/checkout">Checkout</Link>
              </li>
              <li>
                <Link to="/orders">orders</Link>
              </li>
            </ul>
          )}
        </nav>
      </header>
      <JoinUsModal
        formType={formType}
        toggleFormType={toggleFormType}
        open={IsModalOpen}
        onClose={handleCloseJoinUsModal}
      />
      <BecomeASellerModal
        open={IsBecomeSellerModalOpen}
        onClose={() => setIsBecomeSellerModalOpen(false)}
      />
    </>
  );
};

export default Header;
