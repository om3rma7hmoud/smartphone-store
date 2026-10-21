import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Compare from "../pages/Compare";
import Register from "../pages/Register";
import Checkout from "../pages/Checkout";
import NotFound from "../pages/NotFound";
import Wishlist from "../pages/Wishlist";
import ProductPage from "../pages/Product";
import Orders from "../pages/profile/Orders";
import Profile from "../pages/profile/Profile";
import Security from "../pages/profile/Security";
import ResetPassword from "../pages/ResetPassword";
import Addresses from "../pages/profile/Addresses";
import CheckoutCancel from "../pages/CheckoutCancel";
import ForgotPassword from "../pages/ForgotPassword";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import EditProfile from "../pages/profile/EditProfile";
import ProductNotFound from "../pages/ProductNotFound";
import OrderDetails from "../pages/profile/OrderDetails";
import AccountLayout from "../pages/profile/AccountLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/product-not-found" element={<ProductNotFound />} />
          <Route path="/compare" element={<Compare />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/account" element={<AccountLayout />}>
              <Route index element={<Profile />} />
              <Route path="edit" element={<EditProfile />} />
              <Route path="security" element={<Security />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
            </Route>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
