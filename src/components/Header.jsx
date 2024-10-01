import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, Dashboard } from "@mui/icons-material";
import { Badge, Box, Button, Divider, IconButton } from "@mui/material";
import useWindowWidth from "../hooks/useWindowWidth";
import SearchBar from "./SearchBar";
import JoinUsModal from "./JoinUs";
import useAuth from "../hooks/useAuth";
import BecomeASellerModal from "./Forms/BecomeASeller";
import useAxiosPrivate from "../api/axiosPrivate";
const Header = () => {
  const [IsNavOpen, setIsNavOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const { auth } = useAuth();
  const [IsBecomeSellerModalOpen, setIsBecomeSellerModalOpen] = useState(false);

  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [noOfItemsInCart, setnoOfItemsInCart] = useState(0);
  const [formType, setFormType] = useState("signup"); // Form type state
  const toggleFormType = () => {
    setFormType(formType === "signup" ? "signin" : "signup");
  };
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const getNumberOfCartItems = async () => {
      try {
        if (auth?.accessToken && auth?.user.role === "buyer") {
          const response = await axiosPrivate.get("/api/cart");
          console.log(response);
          if (response.status === 200) {
            setnoOfItemsInCart(response.data.items.length);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getNumberOfCartItems();
  }, []);
  console.log(noOfItemsInCart);

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

          <div className="search">
            <SearchBar />
          </div>
          <div className="d-flex justify-center align-center">
            {auth?.accessToken ? (
              <Box></Box>
            ) : (
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
                    <Badge badgeContent={noOfItemsInCart} color="secondary">
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
                <Link href="/">BAGS</Link>
              </li>
              <li>
                <Link href="/">BASKETS</Link>
              </li>
              <li>
                <Link href="/">HOME DECOR</Link>
              </li>
              <li>
                <Link href="/">KITCHEN AND DINING</Link>
              </li>
              <li>
                <Link href="/">BEST SELLER</Link>
              </li>
              <li>
                <Link href="/">ACCESSORIES</Link>
              </li>

              <li>
                <Link href="/">ABOUT US</Link>
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
