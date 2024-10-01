import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./Layouts/MainLayout";
import ProductPage from "./pages/ProductPage";
import RequireAuth from "./components/RequireAuth";
import UserDashBoard from "./pages/UserDashBoard";
import AddToCartPage from "./pages/AddToCartPage";
import SellerPage from "./pages/SellerPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route element={<RequireAuth allowedRoles={["buyer"]} />}>
            <Route path="/add-to-cart" element={<AddToCartPage />} />
            <Route path="/buyer-dashboard" element={<UserDashBoard />} />
          </Route>
        </Route>
        <Route element={<RequireAuth allowedRoles={["seller"]} />}>
          <Route path="/seller-dashboard" element={<SellerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
