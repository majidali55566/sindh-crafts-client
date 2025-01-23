import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./Layouts/MainLayout";
import ProductPage from "./pages/ProductPage";
import RequireAuth from "./components/RequireAuth";
import AddToCartPage from "./pages/AddToCartPage";
import SellerPage from "./pages/SellerPage";
import CheckOutPage from "./pages/CheckOutPage";
import OrdersPage from "./components/OrdersPage";
import NotFoundPage from "./components/404Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route element={<RequireAuth allowedRoles={["buyer"]} />}>
            <Route path="/add-to-cart" element={<AddToCartPage />} />
            <Route path="/checkout" element={<CheckOutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
        </Route>
        <Route element={<RequireAuth allowedRoles={["seller"]} />}>
          <Route path="/seller-dashboard" element={<SellerPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />{" "}
        {/* Handle undefined paths */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
