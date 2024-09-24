import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer>
        <h2>this is footer</h2>
      </footer>
    </div>
  );
};

export default MainLayout;
