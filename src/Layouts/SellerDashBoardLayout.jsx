import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import SellerProductPage from "../pages/sellerDashboard/SellerProductPage";
import { Inventory, AccountCircle } from "@mui/icons-material";
import useAxiosPrivate from "../api/axiosPrivate";
import SellerProfilePage from "../pages/sellerDashboard/SellerProfilePage";
import OrdersPage from "../pages/sellerDashboard/OrdersPage";

// Define the navigation for the dashboard
const NAVIGATION = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "products", // Segment for products page
    title: "Products",
    icon: <Inventory />,
  },
  {
    segment: "profile", // Segment for profile page
    title: "Profile",
    icon: <AccountCircle />, // Icon for profile
  },
];

// Define the theme
const demoTheme = createTheme({
  palette: {
    primary: {
      main: "#1b4f72",
    },
    secondary: {
      main: "#933c10",
    },
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Page content for the Dashboard
function DashboardPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography>Dashboard content</Typography>
    </Box>
  );
}

// Page content for Orders

// Update the routing logic based on the pathname
function DemoPageContent({ pathname }) {
  switch (pathname) {
    case "/dashboard":
      return <DashboardPage />;
    case "/orders":
      return <OrdersPage />;
    case "/products": // Case for the products page
      return <SellerProductPage />;
    case "/profile": // Case for the profile page
      return <SellerProfilePage />;
    default:
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography>404: Page Not Found</Typography>
        </Box>
      );
  }
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;
  const axiosPrivate = useAxiosPrivate();
  const [sellerInfo, setsellerInfo] = React.useState({});
  React.useEffect(() => {
    const getSellerInfo = async () => {
      try {
        const response = await axiosPrivate.get("/api/sellers/info");
        if (response.status === 200) setsellerInfo(response?.data?.seller);
        console.log(response.data.seller);
      } catch (error) {
        console.log(error);
      }
    };
    getSellerInfo();
  }, []);
  const [pathname, setPathname] = React.useState("/dashboard");

  // Simulate a router to update the pathname
  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: (
          <img
            style={{ width: "5rem", background: "black" }}
            src="/images/Logo.png"
            alt="Sindh j dastkari logo"
          />
        ),
        title: sellerInfo.storeName,
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBranding.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
