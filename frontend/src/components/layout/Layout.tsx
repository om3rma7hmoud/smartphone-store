import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useCompareStore } from "../../store/compareStore";
import { CompareBar } from "../ui/CompareBar";
import { ToastContainer } from "react-toastify";

function Layout() {
  const { productIds } = useCompareStore();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {productIds.length > 0 && <div className="h-20" aria-hidden="true" />}
      <CompareBar />
      <ToastContainer
        position="bottom-right"
        theme="colored"
        autoClose={2500}
      />
    </div>
  );
}

export default Layout;
