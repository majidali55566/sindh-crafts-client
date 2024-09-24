import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PermIdentity from "@mui/icons-material/PermIdentity";
import { FavoriteOutlined, ShoppingCart, Menu } from "@mui/icons-material";
import { Badge, Button, Divider, IconButton } from "@mui/material";
import useWindowWidth from "../hooks/useWindowWidth";
import SearchBar from "./SearchBar";
import JoinUsModal from "./JoinUs";
const Header = () => {
  const [IsNavOpen, setIsNavOpen] = useState(false);
  const windowWidth = useWindowWidth();
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

  useEffect(() => {
    if (windowWidth > 768) setIsNavOpen(true);
  }, [windowWidth]);
  return (
    <>
      <header className="header-container">
        <div className="content">
          <img
            id="logo"
            src="/images/Logo.png"
            alt="logo"
            width={200}
            height={60}
          />
          <div className="search">
            <SearchBar />
          </div>
          <div className="d-flex justify-center align-center">
            {/* <IconButton>
            <PermIdentity sx={{ color: "white" }} />
          </IconButton> */}
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
            <IconButton>
              <Badge badgeContent={4} color="secondary">
                <ShoppingCart sx={{ color: "white" }} />
              </Badge>
            </IconButton>
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
                <Link href="/">HOME</Link>
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
    </>
  );
};

export default Header;
