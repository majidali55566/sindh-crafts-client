import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import useAxiosPrivate from "../api/axiosPrivate";
import { useEffect } from "react";
import Footer from "../components/Footer";

const MainLayout = () => {
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getCart = async () => {
      const authToken = localStorage.getItem("authToken");

      if (authToken) {
        const response = await axiosPrivate.get("/api/cart");
        console.log(response.data);
      }
    };
    getCart();
  }, []);
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
